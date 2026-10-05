<?php
declare(strict_types=1);

const MIN_PASSWORD_LENGTH = 10;

function bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if ($header === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strcasecmp($k, 'Authorization') === 0) {
                $header = $v;
            }
        }
    }
    return preg_match('/^Bearer\s+([a-f0-9]{64})$/i', $header, $m) ? strtolower($m[1]) : null;
}

function public_admin(array $a): array
{
    return ['id' => (int) $a['id'], 'name' => $a['name'], 'email' => $a['email'], 'lastLoginAt' => $a['last_login_at']];
}

function current_admin(): ?array
{
    static $cached = false;
    if ($cached !== false) {
        return $cached;
    }
    $token = bearer_token();
    if (!$token) {
        return $cached = null;
    }
    $stmt = db()->prepare(
        'SELECT a.* FROM admin_tokens t JOIN admins a ON a.id = t.admin_id WHERE t.token_hash = ? AND t.expires_at > NOW()'
    );
    $stmt->execute([hash('sha256', $token)]);
    return $cached = ($stmt->fetch() ?: null);
}

function require_admin(): array
{
    $admin = current_admin();
    if (!$admin) {
        fail('Your session has expired. Please sign in again.', 401);
    }
    return $admin;
}

function issue_token(int $adminId, bool $remember): array
{
    $token = bin2hex(random_bytes(32));
    $hours = $remember ? config('remember_ttl_days') * 24 : config('token_ttl_hours');
    db()->prepare('INSERT INTO admin_tokens (token_hash, admin_id, expires_at) VALUES (?, ?, NOW() + INTERVAL ? HOUR)')
        ->execute([hash('sha256', $token), $adminId, $hours]);
    db()->exec('DELETE FROM admin_tokens WHERE expires_at < NOW()');
    return ['token' => $token, 'expiresInHours' => $hours];
}

function validate_password(string $password): void
{
    if (mb_strlen($password) < MIN_PASSWORD_LENGTH) {
        fail('Password must be at least ' . MIN_PASSWORD_LENGTH . ' characters.', 422);
    }
}

// ── Route handlers ───────────────────────────────────────────

function auth_status(): never
{
    $count = (int) db()->query('SELECT COUNT(*) FROM admins')->fetchColumn();
    json_out(['needsSetup' => $count === 0]);
}

/** Creates the very first admin account. Disabled once any admin exists. */
function auth_setup(): never
{
    rate_limit('setup', 10, 15);
    if ((int) db()->query('SELECT COUNT(*) FROM admins')->fetchColumn() > 0) {
        fail('An admin account already exists. Please sign in.', 403);
    }
    $in = body();
    $name = str_clean($in['name'] ?? '', 120);
    $email = strtolower(str_clean($in['email'] ?? '', 190));
    $password = (string) ($in['password'] ?? '');
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail('Please enter your name and a valid email.', 422);
    }
    validate_password($password);
    db()->prepare('INSERT INTO admins (name, email, password_hash, last_login_at) VALUES (?, ?, ?, NOW())')
        ->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);
    $id = (int) db()->lastInsertId();
    $admin = db()->query("SELECT * FROM admins WHERE id = $id")->fetch();
    json_out(issue_token($id, false) + ['admin' => public_admin($admin)], 201);
}

function auth_login(): never
{
    $in = body();
    $email = strtolower(str_clean($in['email'] ?? '', 190));
    $password = (string) ($in['password'] ?? '');
    $ip = client_ip();

    $stmt = db()->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND created_at > (NOW() - INTERVAL 15 MINUTE)');
    $stmt->execute([$ip]);
    if ((int) $stmt->fetchColumn() >= 8) {
        fail('Too many failed sign-in attempts. Please wait 15 minutes.', 429);
    }

    $stmt = db()->prepare('SELECT * FROM admins WHERE email = ?');
    $stmt->execute([$email]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        db()->prepare('INSERT INTO login_attempts (ip, email) VALUES (?, ?)')->execute([$ip, $email]);
        usleep(400000);
        fail('That email and password don’t match.', 401);
    }

    if (password_needs_rehash($admin['password_hash'], PASSWORD_DEFAULT)) {
        db()->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
            ->execute([password_hash($password, PASSWORD_DEFAULT), $admin['id']]);
    }
    db()->prepare('DELETE FROM login_attempts WHERE ip = ?')->execute([$ip]);
    db()->prepare('UPDATE admins SET last_login_at = NOW() WHERE id = ?')->execute([$admin['id']]);

    json_out(issue_token((int) $admin['id'], !empty($in['remember'])) + ['admin' => public_admin($admin)]);
}

function auth_me(): never
{
    json_out(['admin' => public_admin(require_admin())]);
}

function auth_logout(): never
{
    $token = bearer_token();
    if ($token) {
        db()->prepare('DELETE FROM admin_tokens WHERE token_hash = ?')->execute([hash('sha256', $token)]);
    }
    json_out(['ok' => true]);
}

function auth_update_account(): never
{
    $admin = require_admin();
    $in = body();
    $name = str_clean($in['name'] ?? $admin['name'], 120);
    $email = strtolower(str_clean($in['email'] ?? $admin['email'], 190));
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail('Please enter a name and a valid email.', 422);
    }
    $stmt = db()->prepare('SELECT COUNT(*) FROM admins WHERE email = ? AND id <> ?');
    $stmt->execute([$email, $admin['id']]);
    if ((int) $stmt->fetchColumn() > 0) {
        fail('Another admin already uses that email.', 422);
    }

    if (($in['newPassword'] ?? '') !== '') {
        if (!password_verify((string) ($in['currentPassword'] ?? ''), $admin['password_hash'])) {
            fail('Your current password is incorrect.', 422);
        }
        validate_password((string) $in['newPassword']);
        db()->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
            ->execute([password_hash((string) $in['newPassword'], PASSWORD_DEFAULT), $admin['id']]);
        // Sign out every other session after a password change.
        db()->prepare('DELETE FROM admin_tokens WHERE admin_id = ? AND token_hash <> ?')
            ->execute([$admin['id'], hash('sha256', (string) bearer_token())]);
    }

    db()->prepare('UPDATE admins SET name = ?, email = ? WHERE id = ?')->execute([$name, $email, $admin['id']]);
    $fresh = db()->query('SELECT * FROM admins WHERE id = ' . (int) $admin['id'])->fetch();
    json_out(['admin' => public_admin($fresh)]);
}

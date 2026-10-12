<?php
declare(strict_types=1);

define('BACKEND_ROOT', dirname(__DIR__));
$GLOBALS['config'] = require BACKEND_ROOT . '/config.php';

// Never leak PHP warnings or stack traces into API responses.
ini_set('display_errors', '0');
error_reporting(E_ALL);
set_error_handler(function (int $no, string $msg, string $file, int $line) {
    throw new ErrorException($msg, 0, $no, $file, $line);
});
set_exception_handler(function (Throwable $e) {
    error_log('[sasoba-api] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode(['error' => 'Something went wrong on the server. Please try again.']);
});

function config(string $key)
{
    return $GLOBALS['config'][$key] ?? null;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $c = config('db');
        $dsn = "mysql:host={$c['host']};port={$c['port']};dbname={$c['name']};charset={$c['charset']}";
        $pdo = new PDO($dsn, $c['user'], $c['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}

// ── HTTP helpers ─────────────────────────────────────────────

function json_out($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400, array $extra = []): void
{
    json_out(['error' => $message] + $extra, $status);
}

function body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail('Invalid JSON body.');
    }
    return $data;
}

function client_ip(): string
{
    return substr($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', 0, 45);
}

function cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && in_array($origin, config('allowed_origins'), true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 600');
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/** Simple sliding-window limiter backed by the rate_limits table. */
function rate_limit(string $action, int $max, int $windowMinutes): void
{
    $ip = client_ip();
    $stmt = db()->prepare('SELECT COUNT(*) FROM rate_limits WHERE ip = ? AND action = ? AND created_at > (NOW() - INTERVAL ? MINUTE)');
    $stmt->execute([$ip, $action, $windowMinutes]);
    if ((int) $stmt->fetchColumn() >= $max) {
        fail('Too many requests. Please wait a little and try again.', 429);
    }
    db()->prepare('INSERT INTO rate_limits (ip, action) VALUES (?, ?)')->execute([$ip, $action]);
    // Housekeeping
    if (random_int(1, 50) === 1) {
        db()->exec('DELETE FROM rate_limits WHERE created_at < (NOW() - INTERVAL 1 DAY)');
    }
}

function str_clean($v, int $max = 255): string
{
    $s = trim((string) ($v ?? ''));
    return mb_substr($s, 0, $max);
}

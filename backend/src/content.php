<?php
declare(strict_types=1);

/**
 * Every manageable content type. Field types:
 *   str (≤255)  text (long)  slug  int  num  bool  json (array/object)
 * API keys are camelCase; DB columns are the snake_case equivalent.
 * Every table also has: id, sort_order, is_published, created_at, updated_at.
 */
const COLLECTIONS = [
    'testimonials' => [
        'fields' => ['name' => 'str', 'country' => 'str', 'flag' => 'str', 'trip' => 'str', 'quote' => 'text', 'image' => 'str', 'video' => 'str', 'rating' => 'num'],
        'required' => ['name', 'quote'],
        'search' => ['name', 'country', 'trip', 'quote'],
    ],
    'moments' => [
        'fields' => ['image' => 'str', 'handle' => 'str', 'likes' => 'int', 'link' => 'str', 'caption' => 'str'],
        'required' => ['image'],
        'search' => ['handle', 'caption'],
    ],
    'destinations' => [
        'fields' => [
            'slug' => 'slug', 'name' => 'str', 'region' => 'str', 'categories' => 'json', 'unesco' => 'bool', 'tagline' => 'str',
            'intro' => 'text', 'highlights' => 'json', 'experiences' => 'json', 'species' => 'json', 'bestMonths' => 'json',
            'idealStay' => 'str', 'fromColombo' => 'str', 'note' => 'str', 'image' => 'str', 'credit' => 'json',
        ],
        'required' => ['slug', 'name', 'region'],
        'search' => ['name', 'region', 'tagline'],
    ],
    'journeys' => [
        'fields' => [
            'slug' => 'slug', 'title' => 'str', 'route' => 'json', 'destinations' => 'json', 'days' => 'int', 'styles' => 'json',
            'places' => 'json', 'priceFrom' => 'num', 'rating' => 'num', 'reviews' => 'int', 'badge' => 'str', 'image' => 'str',
            'highlights' => 'json', 'itinerary' => 'json',
        ],
        'required' => ['slug', 'title', 'days'],
        'search' => ['title', 'badge'],
    ],
    'festivals' => [
        'fields' => ['month' => 'str', 'name' => 'str', 'place' => 'str', 'text' => 'text'],
        'required' => ['name', 'month'],
        'search' => ['name', 'place', 'month'],
    ],
    'culture_experiences' => [
        'fields' => ['icon' => 'str', 'title' => 'str', 'text' => 'text'],
        'required' => ['title'],
        'search' => ['title', 'text'],
    ],
    'stays' => [
        'fields' => ['title' => 'str', 'location' => 'str', 'tier' => 'str', 'priceFrom' => 'num', 'image' => 'str', 'features' => 'json', 'text' => 'text'],
        'required' => ['title', 'tier'],
        'search' => ['title', 'location', 'tier'],
    ],
];

/** Single-document settings, each validated as an object/array. */
const SETTINGS = ['contact', 'about', 'etiquette'];

const ENQUIRY_STATUSES = ['new', 'in_progress', 'replied', 'archived'];

function snake(string $key): string
{
    return strtolower(preg_replace('/[A-Z]/', '_$0', $key));
}

function collection_def(string $name): array
{
    if (!isset(COLLECTIONS[$name])) {
        fail('Unknown content type.', 404);
    }
    return COLLECTIONS[$name];
}

function row_to_api(array $def, array $row): array
{
    $out = ['id' => (int) $row['id']];
    foreach ($def['fields'] as $key => $type) {
        $v = $row[snake($key)] ?? null;
        // switch instead of match: the live host runs PHP 7.4
        switch ($type) {
            case 'int':
                $v = $v === null ? null : (int) $v;
                break;
            case 'num':
                $v = $v === null ? null : (float) $v;
                break;
            case 'bool':
                $v = (bool) $v;
                break;
            case 'json':
                $v = $v === null || $v === '' ? null : json_decode($v, true);
                break;
        }
        $out[$key] = $v;
    }
    $out['sortOrder'] = (int) $row['sort_order'];
    $out['published'] = (bool) $row['is_published'];
    $out['updatedAt'] = $row['updated_at'];
    return $out;
}

/** Validates the provided keys only, returning [column => value]. */
function api_to_row(array $def, array $in, bool $isCreate): array
{
    $row = [];
    foreach ($def['fields'] as $key => $type) {
        if (!array_key_exists($key, $in)) {
            continue;
        }
        $v = $in[$key];
        $col = snake($key);
        switch ($type) {
            case 'str':
                $row[$col] = $v === null ? null : str_clean($v, 255);
                break;
            case 'text':
                $row[$col] = $v === null ? null : str_clean($v, 20000);
                break;
            case 'slug':
                $s = strtolower(trim((string) $v));
                if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $s) || strlen($s) > 120) {
                    fail('The URL slug may only contain lowercase letters, numbers and dashes (e.g. "sigiriya" or "royal-heritage").', 422);
                }
                $row[$col] = $s;
                break;
            case 'int':
                $row[$col] = ($v === null || $v === '') ? null : (int) $v;
                break;
            case 'num':
                $row[$col] = ($v === null || $v === '') ? null : round((float) $v, 2);
                break;
            case 'bool':
                $row[$col] = $v ? 1 : 0;
                break;
            case 'json':
                if ($v !== null && !is_array($v)) {
                    fail("\"$key\" must be a list.", 422);
                }
                $row[$col] = $v === null ? null : json_encode($v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                break;
        }
    }
    if (array_key_exists('published', $in)) {
        $row['is_published'] = $in['published'] ? 1 : 0;
    }
    foreach ($def['required'] as $req) {
        $col = snake($req);
        $missing = $isCreate ? (!isset($row[$col]) || $row[$col] === '') : (array_key_exists($col, $row) && ($row[$col] === null || $row[$col] === ''));
        if ($missing) {
            fail('Please fill in “' . ucfirst(trim(preg_replace('/([A-Z])/', ' $1', $req))) . '”.', 422);
        }
    }
    return $row;
}

function find_row(string $table, int $id): array
{
    $stmt = db()->prepare("SELECT * FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        fail('That item no longer exists.', 404);
    }
    return $row;
}

function ensure_unique_slug(string $table, array $row, ?int $exceptId): void
{
    if (!isset($row['slug'])) {
        return;
    }
    $stmt = db()->prepare("SELECT COUNT(*) FROM `$table` WHERE slug = ? AND id <> ?");
    $stmt->execute([$row['slug'], $exceptId ?? 0]);
    if ((int) $stmt->fetchColumn() > 0) {
        fail('Another item already uses the slug "' . $row['slug'] . '".', 422);
    }
}

// ── Admin collection handlers ────────────────────────────────

function collection_list(string $name): void
{
    require_admin();
    $def = collection_def($name);
    $sql = "SELECT * FROM `$name`";
    $params = [];
    $q = trim((string) ($_GET['q'] ?? ''));
    if ($q !== '') {
        $sql .= ' WHERE ' . implode(' OR ', array_map(fn ($f) => '`' . snake($f) . '` LIKE ?', $def['search']));
        $params = array_fill(0, count($def['search']), '%' . $q . '%');
    }
    $stmt = db()->prepare($sql . ' ORDER BY sort_order, id');
    $stmt->execute($params);
    json_out(['items' => array_map(fn ($r) => row_to_api($def, $r), $stmt->fetchAll())]);
}

function collection_get(string $name, int $id): void
{
    require_admin();
    json_out(['item' => row_to_api(collection_def($name), find_row($name, $id))]);
}

function collection_create(string $name): void
{
    require_admin();
    $def = collection_def($name);
    $row = api_to_row($def, body(), true);
    ensure_unique_slug($name, $row, null);
    $row['sort_order'] = (int) db()->query("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM `$name`")->fetchColumn();
    $cols = array_keys($row);
    $sql = "INSERT INTO `$name` (`" . implode('`, `', $cols) . '`) VALUES (' . implode(', ', array_fill(0, count($cols), '?')) . ')';
    db()->prepare($sql)->execute(array_values($row));
    json_out(['item' => row_to_api($def, find_row($name, (int) db()->lastInsertId()))], 201);
}

function collection_update(string $name, int $id): void
{
    require_admin();
    $def = collection_def($name);
    find_row($name, $id);
    $row = api_to_row($def, body(), false);
    ensure_unique_slug($name, $row, $id);
    if ($row) {
        $sets = implode(', ', array_map(fn ($c) => "`$c` = ?", array_keys($row)));
        db()->prepare("UPDATE `$name` SET $sets WHERE id = ?")->execute([...array_values($row), $id]);
    }
    json_out(['item' => row_to_api($def, find_row($name, $id))]);
}

function collection_delete(string $name, int $id): void
{
    require_admin();
    collection_def($name);
    find_row($name, $id);
    db()->prepare("DELETE FROM `$name` WHERE id = ?")->execute([$id]);
    json_out(['ok' => true]);
}

function collection_reorder(string $name): void
{
    require_admin();
    collection_def($name);
    $ids = body()['ids'] ?? [];
    if (!is_array($ids)) {
        fail('Invalid order.', 422);
    }
    $stmt = db()->prepare("UPDATE `$name` SET sort_order = ? WHERE id = ?");
    db()->beginTransaction();
    foreach (array_values($ids) as $i => $id) {
        $stmt->execute([$i + 1, (int) $id]);
    }
    db()->commit();
    json_out(['ok' => true]);
}

// ── Settings ─────────────────────────────────────────────────

function read_setting(string $key)
{
    $stmt = db()->prepare('SELECT value FROM settings WHERE `key` = ?');
    $stmt->execute([$key]);
    $v = $stmt->fetchColumn();
    return $v === false ? null : json_decode($v, true);
}

function setting_get(string $key): void
{
    require_admin();
    if (!in_array($key, SETTINGS, true)) {
        fail('Unknown setting.', 404);
    }
    json_out(['value' => read_setting($key)]);
}

function setting_put(string $key): void
{
    require_admin();
    if (!in_array($key, SETTINGS, true)) {
        fail('Unknown setting.', 404);
    }
    $value = body()['value'] ?? null;
    if (!is_array($value)) {
        fail('Invalid value.', 422);
    }
    if ($key === 'contact') {
        if (!empty($value['email']) && !filter_var($value['email'], FILTER_VALIDATE_EMAIL)) {
            fail('Please enter a valid email address.', 422);
        }
        $value['whatsapp'] = preg_replace('/\D+/', '', (string) ($value['whatsapp'] ?? ''));
    }
    $json = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (strlen($json) > 200000) {
        fail('That content is too long.', 422);
    }
    db()->prepare('INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)')
        ->execute([$key, $json]);
    json_out(['value' => $value]);
}

// ── Enquiries ────────────────────────────────────────────────

function enquiry_to_api(array $r): array
{
    return [
        'id' => (int) $r['id'],
        'name' => $r['name'],
        'email' => $r['email'],
        'phone' => $r['phone'],
        'country' => $r['country'],
        'travelDate' => $r['travel_date'],
        'travellers' => $r['travellers'],
        'message' => $r['message'],
        'trip' => $r['trip'] ? json_decode($r['trip'], true) : null,
        'source' => $r['source'],
        'status' => $r['status'],
        'notes' => $r['notes'],
        'createdAt' => $r['created_at'],
        'updatedAt' => $r['updated_at'],
    ];
}

/** Public: "Plan your trip" form submissions. */
function enquiry_submit(): void
{
    $in = body();
    // Honeypot field — real visitors never see or fill it.
    if (!empty($in['website'])) {
        json_out(['ok' => true], 201);
    }
    rate_limit('enquiry', 6, 60);

    $name = str_clean($in['name'] ?? '', 120);
    $email = strtolower(str_clean($in['email'] ?? '', 190));
    if ($name === '') {
        fail('Please tell us your name.', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail('Please enter a valid email address so we can reply.', 422);
    }
    $trip = isset($in['trip']) && is_array($in['trip']) ? $in['trip'] : null;
    $tripJson = $trip ? json_encode($trip, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : null;
    if ($tripJson && strlen($tripJson) > 10000) {
        $tripJson = null;
    }

    db()->prepare(
        'INSERT INTO enquiries (name, email, phone, country, travel_date, travellers, message, trip, source, ip, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )->execute([
        $name,
        $email,
        str_clean($in['phone'] ?? '', 40),
        str_clean($in['country'] ?? '', 80),
        str_clean($in['travelDate'] ?? '', 80),
        str_clean($in['travellers'] ?? '', 80),
        str_clean($in['message'] ?? '', 5000),
        $tripJson,
        str_clean($in['source'] ?? 'website', 80),
        client_ip(),
        str_clean($_SERVER['HTTP_USER_AGENT'] ?? '', 255),
    ]);
    json_out(['ok' => true], 201);
}

function enquiry_list(): void
{
    require_admin();
    $where = [];
    $params = [];
    $status = $_GET['status'] ?? '';
    if (in_array($status, ENQUIRY_STATUSES, true)) {
        $where[] = 'status = ?';
        $params[] = $status;
    }
    $q = trim((string) ($_GET['q'] ?? ''));
    if ($q !== '') {
        $where[] = '(name LIKE ? OR email LIKE ? OR message LIKE ? OR country LIKE ?)';
        array_push($params, "%$q%", "%$q%", "%$q%", "%$q%");
    }
    $sql = 'SELECT * FROM enquiries' . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY created_at DESC, id DESC LIMIT 500';
    $stmt = db()->prepare($sql);
    $stmt->execute($params);

    $counts = array_fill_keys(ENQUIRY_STATUSES, 0);
    foreach (db()->query('SELECT status, COUNT(*) c FROM enquiries GROUP BY status') as $r) {
        $counts[$r['status']] = (int) $r['c'];
    }
    json_out(['items' => array_map('enquiry_to_api', $stmt->fetchAll()), 'counts' => $counts]);
}

function enquiry_update(int $id): void
{
    require_admin();
    find_row('enquiries', $id);
    $in = body();
    $sets = [];
    $params = [];
    if (isset($in['status'])) {
        if (!in_array($in['status'], ENQUIRY_STATUSES, true)) {
            fail('Unknown status.', 422);
        }
        $sets[] = 'status = ?';
        $params[] = $in['status'];
    }
    if (array_key_exists('notes', $in)) {
        $sets[] = 'notes = ?';
        $params[] = str_clean($in['notes'], 5000);
    }
    if ($sets) {
        db()->prepare('UPDATE enquiries SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute([...$params, $id]);
    }
    json_out(['item' => enquiry_to_api(find_row('enquiries', $id))]);
}

function enquiry_delete(int $id): void
{
    require_admin();
    find_row('enquiries', $id);
    db()->prepare('DELETE FROM enquiries WHERE id = ?')->execute([$id]);
    json_out(['ok' => true]);
}

// ── Uploads ──────────────────────────────────────────────────

function upload_image(): void
{
    require_admin();
    $file = $_FILES['file'] ?? null;
    if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
        fail('The upload failed. Please choose an image under ' . config('upload_max_mb') . ' MB.', 422);
    }
    if ($file['size'] > config('upload_max_mb') * 1024 * 1024) {
        fail('Images must be smaller than ' . config('upload_max_mb') . ' MB.', 422);
    }
    $types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    if (!isset($types[$mime])) {
        fail('Please upload a JPG, PNG, WEBP or GIF image.', 422);
    }
    $dir = BACKEND_ROOT . '/uploads/' . date('Y/m');
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }
    $name = bin2hex(random_bytes(8)) . '.' . $types[$mime];
    if (!move_uploaded_file($file['tmp_name'], "$dir/$name")) {
        fail('Could not save the image.', 500);
    }
    json_out(['url' => '/uploads/' . date('Y/m') . "/$name"], 201);
}

// ── Public content & dashboard ───────────────────────────────

function public_content(): void
{
    $out = [];
    foreach (COLLECTIONS as $name => $def) {
        $rows = db()->query("SELECT * FROM `$name` WHERE is_published = 1 ORDER BY sort_order, id")->fetchAll();
        $out[$name] = array_map(function ($r) use ($def, $name) {
            $item = row_to_api($def, $r);
            unset($item['sortOrder'], $item['published'], $item['updatedAt']);
            if ($name === 'journeys') {
                $item['id'] = $item['slug']; // public routes use /journeys/:slug
            }
            return $item;
        }, $rows);
    }
    foreach (SETTINGS as $key) {
        $out[$key] = read_setting($key);
    }
    header('Cache-Control: no-store');
    json_out($out);
}

function dashboard_stats(): void
{
    require_admin();
    $counts = [];
    foreach (array_keys(COLLECTIONS) as $name) {
        $counts[$name] = (int) db()->query("SELECT COUNT(*) FROM `$name`")->fetchColumn();
    }
    $byStatus = array_fill_keys(ENQUIRY_STATUSES, 0);
    foreach (db()->query('SELECT status, COUNT(*) c FROM enquiries GROUP BY status') as $r) {
        $byStatus[$r['status']] = (int) $r['c'];
    }
    $daily = [];
    foreach (db()->query("SELECT DATE(created_at) d, COUNT(*) c FROM enquiries WHERE created_at >= CURDATE() - INTERVAL 13 DAY GROUP BY DATE(created_at)") as $r) {
        $daily[$r['d']] = (int) $r['c'];
    }
    $series = [];
    for ($i = 13; $i >= 0; $i--) {
        $d = date('Y-m-d', strtotime("-$i day"));
        $series[] = ['date' => $d, 'count' => $daily[$d] ?? 0];
    }
    $recent = db()->query('SELECT * FROM enquiries ORDER BY created_at DESC, id DESC LIMIT 6')->fetchAll();
    json_out([
        'counts' => $counts,
        'enquiries' => $byStatus,
        'enquiriesTotal' => array_sum($byStatus),
        'daily' => $series,
        'recent' => array_map('enquiry_to_api', $recent),
    ]);
}

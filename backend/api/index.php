<?php
declare(strict_types=1);

require __DIR__ . '/../src/bootstrap.php';
require __DIR__ . '/../src/auth.php';
require __DIR__ . '/../src/content.php';

cors();
header('X-Content-Type-Options: nosniff');

$method = $_SERVER['REQUEST_METHOD'];
$path = trim((string) ($_GET['route'] ?? ''), '/');
$parts = $path === '' ? [] : explode('/', $path);

/** Matches "a/b/{id}" style patterns; returns captured segments or null. */
function route(string $pattern, array $parts): ?array
{
    $p = explode('/', $pattern);
    if (count($p) !== count($parts)) {
        return null;
    }
    $args = [];
    foreach ($p as $i => $seg) {
        if ($seg === '{id}') {
            if (!ctype_digit($parts[$i])) {
                return null;
            }
            $args[] = (int) $parts[$i];
        } elseif ($seg === '{name}') {
            if (!preg_match('/^[a-z_]+$/', $parts[$i])) {
                return null;
            }
            $args[] = $parts[$i];
        } elseif ($seg !== $parts[$i]) {
            return null;
        }
    }
    return $args;
}

$routes = [
    ['GET', 'health', fn () => json_out(['ok' => true, 'db' => (bool) db()->query('SELECT 1')->fetchColumn()])],

    // Public
    ['GET', 'public/content', 'public_content'],
    ['POST', 'public/enquiries', 'enquiry_submit'],

    // Auth
    ['GET', 'auth/status', 'auth_status'],
    ['POST', 'auth/setup', 'auth_setup'],
    ['POST', 'auth/login', 'auth_login'],
    ['POST', 'auth/logout', 'auth_logout'],
    ['GET', 'auth/me', 'auth_me'],
    ['PUT', 'auth/account', 'auth_update_account'],

    // Admin
    ['GET', 'admin/stats', 'dashboard_stats'],
    ['POST', 'admin/upload', 'upload_image'],
    ['GET', 'admin/enquiries', 'enquiry_list'],
    ['PUT', 'admin/enquiries/{id}', 'enquiry_update'],
    ['DELETE', 'admin/enquiries/{id}', 'enquiry_delete'],
    ['GET', 'admin/settings/{name}', 'setting_get'],
    ['PUT', 'admin/settings/{name}', 'setting_put'],
    ['GET', 'admin/content/{name}', 'collection_list'],
    ['POST', 'admin/content/{name}', 'collection_create'],
    ['POST', 'admin/content/{name}/reorder', 'collection_reorder'],
    ['GET', 'admin/content/{name}/{id}', 'collection_get'],
    ['PUT', 'admin/content/{name}/{id}', 'collection_update'],
    ['DELETE', 'admin/content/{name}/{id}', 'collection_delete'],
];

$pathMatched = false;
foreach ($routes as [$m, $pattern, $handler]) {
    $args = route($pattern, $parts);
    if ($args === null) {
        continue;
    }
    $pathMatched = true;
    if ($m === $method) {
        $handler(...$args);
    }
}

fail($pathMatched ? 'Method not allowed.' : 'Not found.', $pathMatched ? 405 : 404);

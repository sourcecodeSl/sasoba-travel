<?php
/**
 * Sasoba Travels API configuration.
 * Put machine-specific overrides (e.g. a production DB password) in config.local.php,
 * which returns an array with the same shape and is not committed to git.
 */
$config = [
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'name' => 'sasoba',
        'user' => 'root',
        'pass' => '',
        'charset' => 'utf8mb4',
    ],
    // Admin session lifetime
    'token_ttl_hours' => 12,
    'remember_ttl_days' => 14,
    // Browsers allowed to call the API directly (the Vite dev/preview servers proxy /api, so this is a fallback)
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
        'http://127.0.0.1:4173',
    ],
    'upload_max_mb' => 8,
];

$local = __DIR__ . '/config.local.php';
if (is_file($local)) {
    $config = array_replace_recursive($config, require $local);
}

return $config;

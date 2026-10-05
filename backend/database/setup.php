<?php
/**
 * Creates all tables and, for any empty content table, loads the starter content
 * from seed.json (exported from the website's original data).
 *
 *   C:\xampp\php\php.exe backend\database\setup.php
 *
 * Safe to run again: existing tables and data are left untouched.
 */
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('Run this script from the command line.');
}

require __DIR__ . '/../src/bootstrap.php';
require __DIR__ . '/../src/content.php';

$sql = file_get_contents(__DIR__ . '/schema.sql');
foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
    if (preg_match('/^\s*(--.*\n\s*)*$/', $statement)) {
        continue;
    }
    db()->exec($statement);
}
echo "✓ Tables ready\n";

$seed = json_decode(file_get_contents(__DIR__ . '/seed.json'), true);

foreach (COLLECTIONS as $name => $def) {
    $count = (int) db()->query("SELECT COUNT(*) FROM `$name`")->fetchColumn();
    if ($count > 0 || empty($seed[$name])) {
        echo "• $name: kept existing ($count rows)\n";
        continue;
    }
    foreach ($seed[$name] as $i => $item) {
        $row = api_to_row($def, $item, true);
        $row['sort_order'] = $i + 1;
        $cols = array_keys($row);
        db()->prepare("INSERT INTO `$name` (`" . implode('`, `', $cols) . '`) VALUES (' . implode(', ', array_fill(0, count($cols), '?')) . ')')
            ->execute(array_values($row));
    }
    echo '✓ ' . $name . ': loaded ' . count($seed[$name]) . " rows\n";
}

foreach (SETTINGS as $key) {
    $exists = db()->prepare('SELECT COUNT(*) FROM settings WHERE `key` = ?');
    $exists->execute([$key]);
    if ((int) $exists->fetchColumn() === 0 && isset($seed[$key])) {
        db()->prepare('INSERT INTO settings (`key`, value) VALUES (?, ?)')
            ->execute([$key, json_encode($seed[$key], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
        echo "✓ setting \"$key\" loaded\n";
    }
}

echo "\nDone. Open the admin panel at /admin to create your administrator account.\n";

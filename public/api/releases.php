<?php
declare(strict_types=1);
require __DIR__ . '/releases-lib.php';

$feed = release_feed();
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
if ($feed === null) {
    http_response_code(502);
    header('Cache-Control: no-store');
    echo json_encode(['error' => 'Releases are unavailable right now.']);
    exit;
}
header('Cache-Control: public, max-age=300');
echo json_encode($feed, JSON_UNESCAPED_SLASHES);

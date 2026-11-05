<?php
// Local development only: `php -S` ignores .htaccess, so this mirrors its two rewrites.
// The deploy workflow does not upload this file.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/api/releases/?$#', $path)) { require __DIR__ . '/api/releases.php'; return true; }
if (preg_match('#^/download/([a-z0-9-]+)/?$#', $path, $m)) { $_GET['platform'] = $m[1]; require __DIR__ . '/api/download.php'; return true; }
if (preg_match('#^/api/(releases-lib|config\.local)\.php$|^/api/cache/#', $path)) { http_response_code(403); return true; }
$file = __DIR__ . $path;
if (is_dir($file)) $file = rtrim($file, '/') . '/index.html';
if (is_file($file)) return false;
http_response_code(404);
readfile(__DIR__ . '/404.html');
return true;

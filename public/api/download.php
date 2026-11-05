<?php
// /download/<platform> lands here (see .htaccess): a 302 to that installer in the latest release.
declare(strict_types=1);
require __DIR__ . '/releases-lib.php';

$platform = (string) ($_GET['platform'] ?? '');
$target = 'https://github.com/' . GITHUB_REPO . '/releases/latest';
$feed = release_feed();
if ($feed && $feed['latest']) {
    foreach ($feed['releases'] as $r) {
        if ($r['tag'] !== $feed['latest']) continue;
        foreach ($r['assets'] as $a) {
            if ($a['platform'] === $platform) { $target = $a['url']; break 2; }
        }
    }
}
header('Cache-Control: no-store');
header('Location: ' . $target, true, 302);

<?php
// Release feed shared by /api/releases and /download/<platform>.
// GitHub is asked at most once every FRESH_SECONDS; the cached copy is kept and served when GitHub
// fails or the rate limit is hit, so the page keeps its download buttons.

declare(strict_types=1);

const GITHUB_REPO = 'Lets-Decode-AI/Uttr';
const FRESH_SECONDS = 600;
const CACHE_FILE = __DIR__ . '/cache/releases.json';

/** Optional token raises GitHub's limit from 60 to 5,000 requests an hour. Kept out of git. */
function github_token(): ?string
{
    $file = __DIR__ . '/config.local.php';
    if (is_file($file)) {
        $config = require $file;
        if (!empty($config['github_token'])) {
            return (string) $config['github_token'];
        }
    }
    $env = getenv('GITHUB_TOKEN');
    return $env ? $env : null;
}

function platform_of(string $assetName): ?string
{
    $n = strtolower($assetName);
    if (str_ends_with($n, '.sig') || str_ends_with($n, '.tar.gz')) return null;
    if (str_ends_with($n, '.dmg')) return preg_match('/aarch64|arm64|universal/', $n) ? 'macos-arm64' : 'macos-x64';
    if (str_ends_with($n, '-setup.exe') || str_ends_with($n, '.msi')) return 'windows-x64';
    if (str_ends_with($n, '.appimage')) return 'linux-appimage';
    if (str_ends_with($n, '.deb')) return 'linux-deb';
    return null;
}

function fetch_from_github(): array
{
    $headers = [
        // The html variant returns release notes already rendered and sanitized by GitHub.
        'Accept: application/vnd.github.html+json',
        'User-Agent: uttr-site (uttr.letsdecodeai.com)',
        'X-GitHub-Api-Version: 2022-11-28',
    ];
    $token = github_token();
    if ($token) $headers[] = 'Authorization: Bearer ' . $token;

    $ch = curl_init('https://api.github.com/repos/' . GITHUB_REPO . '/releases?per_page=30');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
    ]);
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    if ($body === false || $status !== 200) {
        throw new RuntimeException("GitHub responded $status");
    }

    $raw = json_decode((string) $body, true, 512, JSON_THROW_ON_ERROR);
    $releases = [];
    foreach ($raw as $r) {
        if (!empty($r['draft']) || empty($r['published_at'])) continue;
        $assets = [];
        foreach ($r['assets'] ?? [] as $a) {
            $assets[] = [
                'name' => $a['name'],
                'size' => $a['size'],
                'platform' => platform_of($a['name']),
                'url' => $a['browser_download_url'],
            ];
        }
        $releases[] = [
            'tag' => $r['tag_name'],
            'name' => $r['name'] ?: $r['tag_name'],
            'publishedAt' => $r['published_at'],
            'prerelease' => (bool) $r['prerelease'],
            'url' => $r['html_url'],
            'notesHtml' => $r['body_html'] ?? '',
            'assets' => $assets,
        ];
    }
    usort($releases, fn ($a, $b) => strcmp($b['publishedAt'], $a['publishedAt']));

    // Prefer the newest stable release that ships installers; fall back to a pre-release if that is all there is.
    $latest = null;
    foreach ($releases as $r) {
        $hasInstallers = (bool) array_filter($r['assets'], fn ($a) => $a['platform'] !== null);
        if (!$hasInstallers) continue;
        if (!$r['prerelease']) { $latest = $r['tag']; break; }
        $latest ??= $r['tag'];
    }

    return ['repo' => GITHUB_REPO, 'fetchedAt' => gmdate('c'), 'latest' => $latest, 'releases' => $releases];
}

/** The feed, or null when GitHub is unreachable and nothing has been cached yet. */
function release_feed(): ?array
{
    $cached = is_file(CACHE_FILE) ? json_decode((string) file_get_contents(CACHE_FILE), true) : null;
    if ($cached && filemtime(CACHE_FILE) > time() - FRESH_SECONDS) {
        return $cached;
    }

    try {
        $feed = fetch_from_github();
        if (!is_dir(dirname(CACHE_FILE))) mkdir(dirname(CACHE_FILE), 0755, true);
        // Write then rename, so a concurrent request never reads half a file.
        $tmp = CACHE_FILE . '.' . bin2hex(random_bytes(4));
        file_put_contents($tmp, json_encode($feed, JSON_UNESCAPED_SLASHES));
        rename($tmp, CACHE_FILE);
        return $feed;
    } catch (Throwable $e) {
        error_log('uttr releases: ' . $e->getMessage());
        if ($cached && is_file(CACHE_FILE)) touch(CACHE_FILE, time() - FRESH_SECONDS + 60); // retry in a minute
        return $cached;
    }
}

# uttr.letsdecodeai.com

The website for [uttr](https://github.com/Lets-Decode-AI/Uttr), free and open-source push-to-talk dictation.
A Vite + React + [Motion](https://motion.dev) page, built to static files and served from the Lets Decode AI
Hostinger plan, with a small PHP endpoint for live GitHub release data.

- `src/`: the page. `npm run build` prerenders it to static HTML (`src/entry-server.tsx`, `scripts/prerender.mjs`) so search engines and AI crawlers read every word without running JavaScript; the browser then hydrates it. The hero demo (`components/DeskDemo.tsx`) and the spectrogram scene (`components/HowItWorks.tsx`) are drawn in code; no generated images.
- `public/api/`: the release endpoint. Release notes, versions, sizes and download links come from GitHub; nothing is hard-coded per version.
  - `GET /api/releases`: published releases of `Lets-Decode-AI/Uttr`, with notes rendered by GitHub and each installer tagged by platform. Cached on disk for 10 minutes; if GitHub fails, the last good copy keeps being served.
  - `GET /download/<platform>`: 302 to that installer in the latest release, so links never go stale. Platforms: `macos-arm64`, `macos-x64`, `windows-x64`, `linux-appimage`, `linux-deb`; anything else goes to the GitHub releases page.
- SEO and answer engines: the prerender also writes JSON-LD (`SoftwareApplication`, `FAQPage`, `Organization`, `WebSite`), `sitemap.xml`, `llms.txt` and `llms-full.txt` from a build-time snapshot of the latest release. `public/robots.txt` allows all crawlers. The FAQ lives in `src/faq.ts` and feeds the page, the structured data and llms.txt.
- `public/.htaccess`: HTTPS, one host (www and /index.html redirect), the two rewrites above, noindex on API routes, security headers and long caching for hashed assets.
- `privacy/`, `terms/`, `404.html`: static pages that share the stylesheet.
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/`: product facts and the design system, for future design work.

A new GitHub release shows up on the site within about 10 minutes, with no redeploy. The prerendered snapshot, structured data and llms.txt refresh on the daily scheduled deploy (or trigger it at once with a `repository_dispatch` of type `uttr-release`, or Run workflow).

## Develop

Needs Node 22+ and PHP 8.1+.

```bash
npm install
npm run api   # PHP release endpoint on 127.0.0.1:8788
npm run dev   # Vite on 127.0.0.1:5173, proxying /api and /download to it
```

`npm run preview` builds and serves `dist/` with PHP, the way Hostinger runs it (`public/router.php` stands in for `.htaccess`, which `php -S` ignores).

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: build, lint the PHP, rsync `dist/` to Hostinger over SSH, then smoke-test the live site.

One-time setup:

1. **Subdomain.** In hPanel, Domains › Subdomains, create `uttr.letsdecodeai.com`. Note its document root (for example `domains/letsdecodeai.com/public_html/uttr`). Turn on SSL for it.
2. **SSH.** In hPanel, Advanced › SSH Access, enable SSH and note the host, port (usually `65002`) and username. Create a key pair for deploys only (`ssh-keygen -t ed25519 -f uttr-deploy -N ""`) and add the public key there.
3. **Secrets.** In this repository, Settings › Secrets and variables › Actions, add `HOSTINGER_SSH_HOST`, `HOSTINGER_SSH_PORT`, `HOSTINGER_SSH_USER`, `HOSTINGER_SSH_KEY` (the private key) and `HOSTINGER_TARGET_DIR` (the document root from step 1). The workflow uses a `production` environment, so you can also require approval there.
4. **PHP.** Any PHP 8.1+ with the `curl` extension, which Hostinger enables by default.

Optional: without a token the server uses GitHub's unauthenticated limit (60 requests an hour), which the 10-minute cache keeps far below. To raise it, create `api/config.local.php` on the server (it is never committed or overwritten by deploys):

```php
<?php return ['github_token' => 'github_pat_...'];
```

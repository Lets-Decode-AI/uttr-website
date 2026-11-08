// Build step after `vite build` and `vite build --ssr`: turns the client-rendered page into real HTML so
// search engines, link previews and AI answer engines (most of which never run JavaScript) read the
// whole page. It also writes the structured data, sitemap and llms.txt from the same facts as the page.
//
// Release data is a snapshot taken now. The page swaps in the live feed from /api/releases on load, and
// the deploy workflow rebuilds daily, so the snapshot is never more than a day old.

import { readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SITE = "https://uttr.letsdecodeai.com";
const REPO = "Lets-Decode-AI/Uttr";
const REPO_URL = `https://github.com/${REPO}`;
const PARENT = "https://letsdecodeai.com";
const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const ssrDir = resolve(root, "dist-ssr");

/* ——— Release feed, the same shape public/api/releases-lib.php builds ——— */

function platformOf(name) {
  const n = name.toLowerCase();
  if (n.endsWith(".sig") || n.endsWith(".tar.gz")) return null;
  if (n.endsWith(".dmg")) return /aarch64|arm64|universal/.test(n) ? "macos-arm64" : "macos-x64";
  if (n.endsWith("-setup.exe") || n.endsWith(".msi")) return "windows-x64";
  if (n.endsWith(".appimage")) return "linux-appimage";
  if (n.endsWith(".deb")) return "linux-deb";
  return null;
}

async function fetchFeed() {
  const headers = {
    Accept: "application/vnd.github.html+json",
    "User-Agent": "uttr-site-build (uttr.letsdecodeai.com)",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=30`, { headers, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
    const raw = await res.json();
    const releases = raw
      .filter((r) => !r.draft && r.published_at)
      .map((r) => ({
        tag: r.tag_name,
        name: r.name || r.tag_name,
        publishedAt: r.published_at,
        prerelease: Boolean(r.prerelease),
        url: r.html_url,
        notesHtml: r.body_html ?? "",
        assets: (r.assets ?? []).map((a) => ({ name: a.name, size: a.size, platform: platformOf(a.name), url: a.browser_download_url })),
      }))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    let latest = null;
    for (const r of releases) {
      if (!r.assets.some((a) => a.platform)) continue;
      if (!r.prerelease) {
        latest = r.tag;
        break;
      }
      latest ??= r.tag;
    }
    return { repo: REPO, fetchedAt: new Date().toISOString(), latest, releases };
  } catch (e) {
    console.warn(`prerender: no release snapshot (${e.message}); the page will load releases live.`);
    return null;
  }
}

/* ——— Helpers ——— */

const json = (v) => JSON.stringify(v).replace(/</g, "\\u003c");
const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const strip = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/* ——— Structured data ——— */

const DESCRIPTION =
  "uttr is free, open-source push-to-talk dictation for macOS, Windows and Linux. Hold a key in any app, speak, and let go: punctuated text appears at your cursor. Speech recognition runs on your computer by default, so your audio never leaves it.";

const FEATURES = [
  "Push-to-talk and hands-free dictation into any app",
  "On-device speech recognition with NVIDIA Parakeet, Whisper, Moonshine or SenseVoice",
  "Works offline after a one-time model download",
  "Streaming transcription that finishes about 421 ms after key-up",
  "Optional AI cleanup of filler words, on-device with llama.cpp or with your own OpenAI, Anthropic or OpenRouter key",
  "Command Mode: select text and say how to rewrite it",
  "Snippets, per-app writing styles and a personal dictionary",
  "Searchable local dictation history and a Home dashboard with words, speed and streak",
  "Optional cloud speech with your own OpenAI, Groq or OpenAI-compatible key",
  "Signature-checked in-app updates",
  "No account, no subscription, no telemetry",
];

function structuredData(feed, faq) {
  const latest = feed?.releases.find((r) => r.tag === feed.latest);
  const first = feed?.releases.at(-1);
  const org = {
    "@type": "Organization",
    "@id": `${PARENT}/#organization`,
    name: "Lets Decode AI",
    url: PARENT,
    logo: `${SITE}/img/icon-512.png`,
    sameAs: ["https://github.com/Lets-Decode-AI"],
  };
  const app = {
    "@type": "SoftwareApplication",
    "@id": `${SITE}/#app`,
    name: "uttr",
    alternateName: ["Uttr", "uttr dictation"],
    description: DESCRIPTION,
    url: `${SITE}/`,
    image: `${SITE}/img/icon-512.png`,
    screenshot: [
      { "@type": "ImageObject", url: `${SITE}/img/home-light.png`, caption: "The uttr Home dashboard: words dictated, speed, streak and time saved", width: 1800, height: 1240 },
      { "@type": "ImageObject", url: `${SITE}/img/history-light.png`, caption: "The uttr History page with recent dictations", width: 1800, height: 1240 },
    ],
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "Speech-to-text dictation",
    operatingSystem: "macOS 10.15 or later, Windows (64-bit), Linux (X11, Wayland)",
    featureList: FEATURES,
    keywords: "dictation, speech to text, voice typing, push to talk, offline, on-device, private, open source, Whisper, Parakeet",
    inLanguage: "en",
    isAccessibleForFree: true,
    license: "https://opensource.org/licenses/MIT",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    author: { "@id": org["@id"] },
    publisher: { "@id": org["@id"] },
    downloadUrl: [`${SITE}/download/macos-arm64`, `${SITE}/download/macos-x64`, `${SITE}/download/windows-x64`, `${SITE}/download/linux-appimage`, `${SITE}/download/linux-deb`],
    installUrl: `${SITE}/#download`,
    sameAs: [REPO_URL],
  };
  if (latest) {
    app.softwareVersion = latest.tag.replace(/^v/, "");
    app.dateModified = latest.publishedAt;
    app.releaseNotes = latest.url;
  }
  if (first) app.datePublished = first.publishedAt;

  return {
    "@context": "https://schema.org",
    "@graph": [
      org,
      { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "uttr", description: DESCRIPTION, inLanguage: "en", publisher: { "@id": org["@id"] } },
      {
        "@type": "WebPage",
        "@id": `${SITE}/#webpage`,
        url: `${SITE}/`,
        name: "uttr · Free, private dictation for Mac, Windows and Linux",
        description: DESCRIPTION,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": app["@id"] },
        mainEntity: { "@id": app["@id"] },
        primaryImageOfPage: `${SITE}/img/social-preview.png`,
        inLanguage: "en",
        ...(latest && { dateModified: latest.publishedAt }),
      },
      app,
      {
        "@type": "SoftwareSourceCode",
        "@id": `${SITE}/#source`,
        name: "uttr source code",
        codeRepository: REPO_URL,
        programmingLanguage: ["Rust", "TypeScript"],
        runtimePlatform: "Tauri 2",
        license: "https://opensource.org/licenses/MIT",
        targetProduct: { "@id": app["@id"] },
        author: { "@id": org["@id"] },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/#faq`,
        url: `${SITE}/#faq`,
        isPartOf: { "@id": `${SITE}/#webpage` },
        mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  };
}

/* ——— llms.txt: a plain-text brief for AI answer engines (https://llmstxt.org) ——— */

function llmsTxt(feed, faq, full) {
  const latest = feed?.releases.find((r) => r.tag === feed.latest);
  const lines = [
    "# uttr",
    "",
    `> ${DESCRIPTION}`,
    "",
    "uttr is made by Lets Decode AI (https://letsdecodeai.com) and contributors and is MIT-licensed. It is a desktop tray app built with Tauri 2 and Rust, using sherpa-onnx for on-device speech recognition and llama.cpp for optional on-device AI cleanup. There is no account, no subscription and no telemetry.",
    "",
    "## Key facts",
    "",
    `- Latest version: ${latest ? `${latest.tag}, released ${latest.publishedAt.slice(0, 10)}` : `see ${REPO_URL}/releases/latest`}`,
    "- Price: free (MIT licence). Optional cloud providers use the user's own API key.",
    "- Platforms: macOS 10.15+ (Apple Silicon and Intel, .dmg), Windows 64-bit (.exe), Linux X11 and Wayland on GNOME 48 / KDE Plasma 6+ (.AppImage, .deb)",
    "- Default shortcut: hold fn (macOS), Ctrl+Win (Windows), Ctrl+Super (Linux X11). Double-press for hands-free, Esc to cancel.",
    "- Privacy: speech recognition runs on-device by default; audio is never saved to disk. Audio is uploaded only if the user switches to Cloud (your key). Cloud AI cleanup sends text only.",
    "- Network use: model downloads from Hugging Face that the user starts, and an update check against GitHub Releases at launch and every 6 hours that sends no user data.",
    "- Speech models: NVIDIA Parakeet TDT 0.6B v2 (English, default, ~660 MB), Parakeet TDT 0.6B v3 (25 European languages), Whisper large-v3-turbo (multilingual), SenseVoice small (Chinese, English, Japanese, Korean, Cantonese), Moonshine Base, Whisper small.en",
    "- Measured speed: a 62.5 s dictation finishes about 421 ms after key-up (Parakeet v2 int8, Apple Silicon); hardware varies.",
    "",
    "## Features",
    "",
    ...FEATURES.map((f) => `- ${f}`),
    "",
    "## Links",
    "",
    `- [Website](${SITE}/): overview, privacy model, features and downloads`,
    `- [Download for macOS (Apple Silicon)](${SITE}/download/macos-arm64)`,
    `- [Download for macOS (Intel)](${SITE}/download/macos-x64)`,
    `- [Download for Windows](${SITE}/download/windows-x64)`,
    `- [Download for Linux (AppImage)](${SITE}/download/linux-appimage)`,
    `- [Download for Linux (.deb)](${SITE}/download/linux-deb)`,
    `- [Source code on GitHub](${REPO_URL})`,
    `- [Release notes](${REPO_URL}/releases)`,
    `- [Privacy policy](${SITE}/privacy/)`,
    `- [Terms](${SITE}/terms/)`,
    "",
    "## Questions",
    "",
    ...faq.flatMap(({ q, a }) => [`### ${q}`, "", a, ""]),
  ];
  if (!full) {
    lines.push("## Optional", "", `- [Full brief with release notes](${SITE}/llms-full.txt)`, "");
    return lines.join("\n");
  }
  if (feed) {
    lines.push("## Release notes", "");
    for (const r of feed.releases) {
      const name = r.name.replace(/^FlowLocal/i, "uttr");
      lines.push(`### ${r.tag}: ${name} (${r.publishedAt.slice(0, 10)})`, "", strip(r.notesHtml) || "No notes.", "", r.url, "");
    }
  }
  return lines.join("\n");
}

/* ——— Build ——— */

const feed = await fetchFeed();
const { render, FAQ } = await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href);

const indexPath = resolve(dist, "index.html");
let html = await readFile(indexPath, "utf8");
const app = render(feed);
if (!html.includes('<div id="root"></div>')) throw new Error("prerender: #root not found in dist/index.html");
html = html.replace(
  '<div id="root"></div>',
  `<div id="root">${app}</div>${feed ? `\n    <script type="application/json" id="release-feed">${json(feed)}</script>` : ""}`,
);
if (!html.includes("<!--structured-data-->")) throw new Error("prerender: structured-data marker missing");
html = html.replace("<!--structured-data-->", `<script type="application/ld+json">${json(structuredData(feed, FAQ))}</script>`);
await writeFile(indexPath, html);

const today = new Date().toISOString().slice(0, 10);
const latest = feed?.releases.find((r) => r.tag === feed.latest);
const pages = [
  { loc: `${SITE}/`, lastmod: latest?.publishedAt.slice(0, 10) ?? today, priority: "1.0", image: [`${SITE}/img/social-preview.png`, `${SITE}/img/home-light.png`, `${SITE}/img/history-light.png`] },
  { loc: `${SITE}/privacy/`, lastmod: "2026-11-08", priority: "0.4" },
  { loc: `${SITE}/terms/`, lastmod: "2026-11-05", priority: "0.3" },
];
await writeFile(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (p) => `  <url>
    <loc>${xml(p.loc)}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <priority>${p.priority}</priority>${(p.image ?? []).map((i) => `\n    <image:image><image:loc>${xml(i)}</image:loc></image:image>`).join("")}
  </url>`,
  )
  .join("\n")}
</urlset>
`,
);
await writeFile(resolve(dist, "llms.txt"), llmsTxt(feed, FAQ, false));
await writeFile(resolve(dist, "llms-full.txt"), llmsTxt(feed, FAQ, true));
await rm(ssrDir, { recursive: true, force: true });

console.log(`prerender: index.html (${Math.round(html.length / 1024)} kB), sitemap.xml, llms.txt, llms-full.txt; latest ${feed?.latest ?? "unknown"}`);

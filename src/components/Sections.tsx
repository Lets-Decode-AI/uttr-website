import { motion } from "motion/react";
import { useState } from "react";
import { formatDate, formatSize, PARENT_URL, RELEASES_URL, REPO_URL, useLatestAssets, useReleaseFeed, useVisitor } from "../data";
import { FAQ } from "../faq";
import { PLATFORM_LABELS, type Platform, type Release } from "../releases";
import { ArrowDown, ArrowOut, Chevron, Cloud, Laptop } from "./Icons";

const ease = [0.16, 1, 0.3, 1] as const;

/* ——— The download button the hero and nav share ——— */

export function DownloadButton() {
  const visitor = useVisitor();
  const { version, assets } = useLatestAssets();
  const platform = visitor.platform;

  if (!platform) {
    return (
      <div className="hero-cta">
        <a className="btn" href="#download">
          See downloads <ArrowDown />
        </a>
        <p className="cta-meta">
          {visitor.os === "mobile" ? "uttr is a desktop app for macOS, Windows and Linux." : "For macOS, Windows and Linux."}
        </p>
      </div>
    );
  }

  const label = PLATFORM_LABELS[platform];
  const asset = assets.find((a) => a.platform === platform);
  const other: [Platform, string] | null =
    visitor.os === "mac"
      ? platform === "macos-arm64"
        ? ["macos-x64", "Intel Mac"]
        : ["macos-arm64", "Apple Silicon"]
      : visitor.os === "linux"
        ? ["linux-deb", ".deb"]
        : null;

  return (
    <div className="hero-cta">
      <a className="btn" href={`/download/${platform}`}>
        Download for {label.os} <span className="detail">{label.detail}</span> <ArrowDown />
      </a>
      <p className="cta-meta">
        <span className="data">
          {version ?? "Latest"}
          {asset && ` · ${formatSize(asset.size)}`}
        </span>
        {other && (
          <>
            {" · "}
            <a href={`/download/${other[0]}`}>{other[1]}</a>
          </>
        )}
        {" · "}
        <a href="#download">Other systems</a>
      </p>
    </div>
  );
}

/* ——— Privacy ——— */

const LOCAL = [
  ["Microphone", "Held in memory while you speak, never saved to disk."],
  ["Speech model", "Parakeet, Whisper, Moonshine or SenseVoice, on your processor."],
  ["AI cleanup", "Optional. On-device with llama.cpp by default."],
  ["History", "A SQLite file on your disk. Delete it whenever you like."],
  ["Keys and tokens", "Kept in your system keychain."],
  ["Your cursor", "Where the text lands, in whatever app is in front."],
];

export function Privacy() {
  return (
    <section className="section on-night" id="privacy" aria-labelledby="privacy-title">
      <div className="wrap">
        <div className="head-split">
          <h2 id="privacy-title" className="h2">
            What runs <span className="say">where.</span>
          </h2>
          <p className="lede">
            By default, speech recognition runs on your own processor with open models from NVIDIA, OpenAI and others. Turn
            off Wi-Fi and uttr keeps working.
          </p>
        </div>
        <div className="zones">
          <div className="zone zone-local">
            <h3 className="zone-name">
              <Laptop size={18} /> Your computer
            </h3>
            <ul className="parts">
              {LOCAL.map(([k, v]) => (
                <li key={k}>
                  <b>{k}</b>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="zone zone-net">
            <h3 className="zone-name">
              <Cloud size={18} /> The internet, for these only
            </h3>
            <ul className="net-list">
              <li>
                <b>Hugging Face</b>
                <span>Model downloads and searches that you start.</span>
              </li>
              <li>
                <b>GitHub Releases</b>
                <span>An update check at launch and every 6 hours. It downloads one public file and sends nothing about you.</span>
              </li>
              <li>
                <b>Your speech service</b>
                <span>Only if you switch to Cloud (your key). Then each dictation’s audio goes to OpenAI, Groq or your own server.</span>
              </li>
              <li>
                <b>Your AI provider</b>
                <span>Only if you add your own OpenAI, Anthropic or OpenRouter key for cleanup. Text only, never audio.</span>
              </li>
              <li>
                <b>Lets Decode AI</b>
                <span>Nothing. There is no account and no telemetry.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ——— Features ——— */

export function Features() {
  return (
    <section className="section" id="features" aria-labelledby="features-title">
      <div className="wrap">
        <h2 id="features-title" className="h2">
          Built for how you <span className="say">actually</span> write.
        </h2>
        {/* Flat sheets laid on the grid paper; each later sheet slides over the margin of the one above. */}
        <div className="sheets">
          <article className="sheet-f s-cmd">
            <h3 className="h3">Command Mode</h3>
            <p>Select text, hold the command keys and say what to do with it. The answer replaces your selection.</p>
            <div className="swap">
              <div className="sel">we cant do the friday launch, the build isnt ready</div>
              <p className="note">“make this friendlier”</p>
              <div>Quick heads-up: Friday is a little early for us. The build needs a few more days.</div>
            </div>
          </article>
          <article className="sheet-f s-clean">
            <h3 className="h3">AI cleanup</h3>
            <p>Optional. Drops the ums and keeps only your correction.</p>
            <div className="clean">
              <p>
                <s>um so</s> can we move it to <s>tuesday, no,</s> Wednesday?
              </p>
              <p className="after">Can we move it to Wednesday?</p>
              <p className="note">you changed your mind, so it kept Wednesday</p>
            </div>
          </article>
          <article className="sheet-f s-snip">
            <h3 className="h3">Snippets</h3>
            <p>Say a short phrase and uttr types the saved text.</p>
            <p className="snippet">
              <span className="note">“my email”</span> <span className="new">sam@northwind.studio</span>
            </p>
          </article>
          <article className="sheet-f s-style">
            <h3 className="h3">Styles per app</h3>
            <p>The tone follows the app you are dictating into.</p>
            <div className="chips">
              <span className="chip">Slack · very casual</span>
              <span className="chip">Mail · formal</span>
            </div>
          </article>
          <article className="sheet-f s-flow">
            <h3 className="h3">Flow Bar</h3>
            <p>A small pill over your windows. It never steals focus.</p>
            <div className="chips">
              <span className="chip dark">Listening</span>
              <span className="chip dark">Transcribing</span>
              <span className="chip dark done">Inserted</span>
            </div>
          </article>
          <div className="sheets-note" aria-hidden="true">
            <svg viewBox="0 0 300 112" preserveAspectRatio="none">
              <path d="M40 104 C 20 70, 60 40, 150 30 S 270 8, 292 2" />
            </svg>
            <span className="note">all of these work in whatever app is in front</span>
          </div>
          <div className="s-history-copy">
            <h3 className="h3">
              A quiet tray app, with everything on your <span className="say">disk.</span>
            </h3>
            <p className="muted">
              Search past dictations and see your words, speed and streak on Home. Models download resumably and are checked
              against SHA-256. New versions arrive in the app: one click, signature-checked, and your settings stay put.
            </p>
          </div>
          <img
            className="sheet-f s-history"
            src="/img/history-light.png"
            width="1800"
            height="1240"
            loading="lazy"
            alt="The uttr History page listing today's dictations from Slack, Mail, Notes and Visual Studio Code"
          />
        </div>
      </div>
    </section>
  );
}

/* ——— Models ——— */

const MODELS = [
  ["Parakeet TDT 0.6B v2", "English", "661 MB", "4 GB", true],
  ["Parakeet TDT 0.6B v3", "25 European languages", "670 MB", "4 GB", false],
  ["Whisper large-v3-turbo", "Multilingual", "1 GB", "6 GB", false],
  ["SenseVoice small", "Chinese, English, Japanese, Korean, Cantonese", "239 MB", "2 GB", false],
  ["Moonshine Base", "English", "286 MB", "2 GB", false],
  ["Whisper small.en", "English", "375 MB", "3 GB", false],
] as const;

export function Models() {
  return (
    <section className="section" aria-labelledby="models-title">
      <div className="wrap split">
        <div>
          <h2 id="models-title" className="h2 h2-sm">
            A voice model <span className="say">your</span> machine can carry.
          </h2>
          <p className="muted">
            uttr suggests one on first run from your RAM and system language. Models download inside the app, pinned to a
            revision and checked against SHA-256.
          </p>
        </div>
        <div className="table-box">
          <table className="table">
            <thead>
              <tr>
                <th>Model</th>
                <th className="hide-sm">Languages</th>
                <th className="num">Size</th>
                <th className="num">RAM</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map(([name, langs, size, ram, def]) => (
                <tr key={name}>
                  <td>
                    {name}
                    {def && <span className="badge ghost">default</span>}
                  </td>
                  <td className="muted hide-sm">{langs}</td>
                  <td className="num data">{size}</td>
                  <td className="num data">{ram}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ——— Releases ——— */

export function Releases() {
  const state = useReleaseFeed();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="section" id="releases" aria-labelledby="releases-title">
      <div className="wrap split">
        <div>
          <h2 id="releases-title" className="h2 h2-sm">
            Built in the <span className="say">open.</span>
          </h2>
          <p className="muted">Pulled live from GitHub Releases. Every change is a pull request you can read.</p>
          <p>
            <a className="link" href={RELEASES_URL}>
              All releases on GitHub <ArrowOut />
            </a>
          </p>
        </div>
        <div className="releases" aria-live="polite">
          {state.status === "loading" && [0, 1].map((i) => <div key={i} className="skeleton" aria-hidden="true" />)}
          {state.status === "error" && (
            <p className="muted" style={{ padding: "22px 0" }}>
              Release notes could not be loaded right now. Read them on <a href={RELEASES_URL}>GitHub</a>.
            </p>
          )}
          {state.status === "ready" &&
            state.feed.releases.map((r, i) => {
              // Until the visitor picks one, the newest release is open.
              const expanded = open === null ? i === 0 : open === r.tag;
              return (
                <ReleaseRow key={r.tag} release={r} latest={r.tag === state.feed.latest} expanded={expanded} onToggle={() => setOpen(expanded ? "" : r.tag)} />
              );
            })}
        </div>
      </div>
    </section>
  );
}

function ReleaseRow({ release, latest, expanded, onToggle }: { release: Release; latest: boolean; expanded: boolean; onToggle: () => void }) {
  const id = `notes-${release.tag.replace(/[^a-z0-9]/gi, "")}`;
  // uttr was called FlowLocal before v0.2.0; show the product's name and say what it shipped as.
  const oldName = /^FlowLocal\b/i.test(release.name);
  const name = oldName ? release.name.replace(/^FlowLocal/i, "uttr") : release.name;
  return (
    <div className={`release ${expanded ? "is-open" : ""}`}>
      <button type="button" className="release-head" onClick={onToggle} aria-expanded={expanded} aria-controls={id}>
        <span className="data">{release.tag}</span>
        <span className="release-name">
          {name}
          {oldName && <span className="data release-aka">released as FlowLocal</span>}
          {latest && <span className="badge">latest</span>}
          {release.prerelease && <span className="badge ghost">pre-release</span>}
        </span>
        <time className="data" dateTime={release.publishedAt}>
          {formatDate(release.publishedAt)}
        </time>
        <Chevron />
      </button>
      <motion.div
        id={id}
        className="release-body"
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.45, ease }}
        inert={!expanded}
      >
        {/* GitHub renders and sanitizes this HTML (the API's html media type). */}
        {/* Its headings drop to h4 so they sit under this section's h2 in the page outline. */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: release.notesHtml.replace(/<(\/?)h[1-3]\b/g, "<$1h4") || "<p>No notes for this release.</p>" }} />
        <a className="link" href={release.url}>
          {release.tag} on GitHub <ArrowOut />
        </a>
      </motion.div>
    </div>
  );
}

/* ——— Download ——— */

const ORDER: Platform[] = ["macos-arm64", "macos-x64", "windows-x64", "linux-appimage", "linux-deb"];

export function Download() {
  const state = useReleaseFeed();
  const visitor = useVisitor();
  const latest = state.status === "ready" ? state.feed.releases.find((r) => r.tag === state.feed.latest) : undefined;
  // The visitor's own system goes first.
  const rows = visitor.platform ? [visitor.platform, ...ORDER.filter((p) => p !== visitor.platform)] : ORDER;

  return (
    <section className="section on-night" id="download" aria-labelledby="download-title">
      <div className="wrap">
        <div className="dl-head">
          <h2 id="download-title" className="h1">
            Get uttr, <span className="say">free.</span>
          </h2>
          <p className="lede">
            Open source under the MIT licence.{" "}
            {latest ? (
              <>
                Latest is <span className="data">{latest.tag}</span>, released {formatDate(latest.publishedAt)}.
              </>
            ) : (
              "The latest release, straight from GitHub."
            )}{" "}
            Builds may be unsigned, so your system may ask before opening. After that, uttr updates itself.
          </p>
        </div>
        <div className="table-box">
          <table className="table dl-table">
            <thead>
              <tr>
                <th>System</th>
                <th className="file">File</th>
                <th className="num">Size</th>
                <th className="num">
                  <span className="sr-only">Download</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const label = PLATFORM_LABELS[p];
                const asset = latest?.assets.find((a) => a.platform === p);
                const href = `/download/${p}`;
                const mine = p === visitor.platform;
                return (
                  <tr key={p} className={mine ? "is-mine" : ""}>
                    <td>
                      <a href={href} tabIndex={-1} className="dl-os">
                        {label.os}
                        <small>{label.detail}</small>
                        {mine && <span className="badge">your system</span>}
                      </a>
                    </td>
                    <td className="file">
                      <a href={href} tabIndex={-1} className="data">
                        {asset?.name ?? label.file}
                      </a>
                    </td>
                    <td className="num">
                      <a href={href} tabIndex={-1} className="data">
                        {asset ? formatSize(asset.size) : "—"}
                      </a>
                    </td>
                    <td className="num">
                      <a href={href} className="dl-go" aria-label={`Download uttr for ${label.os}, ${label.detail}`}>
                        Download <ArrowDown />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="install">
          <p>
            <b>macOS.</b> Drag uttr to Applications and open it once, then choose Open Anyway in System Settings › Privacy &amp;
            Security. Grant Microphone and Accessibility when setup asks.
          </p>
          <p>
            <b>Windows.</b> If SmartScreen warns about a new app, choose More info, then Run anyway. Hold <code>Ctrl</code> +{" "}
            <code>Win</code> to talk.
          </p>
          <p>
            <b>Linux.</b> X11, and Wayland on GNOME 48 or KDE Plasma 6 and later. <code>chmod +x</code> the AppImage, or{" "}
            <code>sudo apt install ./uttr_*.deb</code>.
            Or <a href={`${REPO_URL}#build-from-source`}>build from source</a>.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ——— Questions ——— */

export function Questions() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="wrap split">
        <div>
          <h2 id="faq-title" className="h2 h2-sm">
            Questions, <span className="say">answered.</span>
          </h2>
          <p className="muted">
            Anything else is in the{" "}
            <a href={`${REPO_URL}#readme`}>README</a> or the <a href={`${REPO_URL}/issues`}>issue tracker</a>.
          </p>
        </div>
        <div className="faq">
          {FAQ.map(({ q, a }, i) => (
            <details key={q} className="faq-item" open={i === 0}>
              <summary>
                <h3>{q}</h3>
                <Chevron />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ——— Footer ——— */

export function Footer() {
  return (
    <footer className="footer on-night">
      <div className="wrap">
        <div className="footer-top">
          <a className="parent" href={PARENT_URL}>
            <small>A project by</small>
            <strong>
              Lets Decode <span className="say">AI</span>
            </strong>
            <span>
              letsdecodeai.com <ArrowOut />
            </span>
          </a>
          <nav className="footer-links" aria-label="Footer">
            <div>
              <h2>Product</h2>
              <a href="/#how">How it works</a>
              <a href="/#privacy">Privacy model</a>
              <a href="/#features">Features</a>
              <a href="/#faq">Questions</a>
              <a href="/#download">Download</a>
            </div>
            <div>
              <h2>Open source</h2>
              <a href={REPO_URL}>GitHub</a>
              <a href={RELEASES_URL}>Releases</a>
              <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}>Contributing</a>
              <a href={`${REPO_URL}/blob/main/LICENSE`}>MIT License</a>
            </div>
            <div>
              <h2>Legal</h2>
              <a href="/privacy/">Privacy policy</a>
              <a href="/terms/">Terms</a>
              <a href={`${REPO_URL}/security/policy`}>Security</a>
            </div>
          </nav>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Lets Decode AI and uttr contributors.</span>
          <span>Speech stays on your device.</span>
        </div>
      </div>
    </footer>
  );
}

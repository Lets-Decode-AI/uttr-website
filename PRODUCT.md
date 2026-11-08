# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + Motion (motion/react) for the page, built to static files. Hosted on the Lets Decode AI
Hostinger Business plan at uttr.letsdecodeai.com, with a small PHP endpoint for live GitHub release
data. Deployed from its own GitHub repository by GitHub Actions.

## Users

The product site for uttr, a desktop dictation app. Visitors arrive wanting to talk instead of type,
and to know whether uttr is safe and good enough to install. Four confirmed audiences:

- Developers and technical users, comfortable with GitHub releases and unsigned builds, who care that it is open source and local.
- Writers and knowledge workers who type all day in Slack, Mail, editors and docs.
- Privacy-bound professionals (legal, medical, journalism, enterprise) who cannot send audio to a cloud service.
- People who find typing hard (RSI, injury, accessibility needs).

## Product Purpose

uttr is free, open-source push-to-talk dictation for macOS, Windows and Linux. Hold a shortcut in any
app, speak, let go, and punctuated text appears at the cursor. Success for this site: a visitor
understands that within seconds, trusts the privacy claim, and downloads the right installer for
their system.

## Positioning

By default, speech recognition runs on the visitor's own computer (sherpa-onnx with models such as
NVIDIA Parakeet), so audio never leaves the machine; there is no account, no subscription and no
telemetry, and the whole thing is MIT-licensed on GitHub. Competitors are not named on the site.

## Operating Context

- A tray app with a global shortcut: `fn` on macOS, `Ctrl+Win` on Windows, `Ctrl+Super` on Linux X11. On Wayland (GNOME 48, KDE Plasma 6 and later) the desktop's GlobalShortcuts portal sets the keys. Double-press for hands-free, `Esc` to cancel (not on Wayland).
- The Flow Bar: a small pill over other windows showing listening, transcribing, done and errors.
- Text is inserted by pasting; the clipboard is restored afterwards.
- Models are downloaded inside the app from Hugging Face (default Parakeet TDT 0.6B v2, about 660 MB).
- Installers come from GitHub Releases: `.dmg` (Apple Silicon and Intel), NSIS `.exe`, `.AppImage`, `.deb`. Builds may be unsigned, so macOS and Windows warn on first open.

## Capabilities and Constraints

- On-device speech-to-text; streaming chunked transcription cut at natural pauses, so long dictations finish soon after key-up.
- Optional AI cleanup (off by default): on-device with llama.cpp, or the user's own OpenAI, Anthropic or OpenRouter key, or any OpenAI-compatible server. When a cloud provider is chosen, only text is sent, never audio.
- Optional cloud speech since v0.3.0 ("Cloud (your key)" on the Models page): OpenAI, Groq or any OpenAI-compatible transcription server. Then the audio of each dictation is uploaded in pieces to that service. Every "audio never leaves your computer" statement must say "by default" or name the on-device engine.
- Home dashboard (v0.3.0): words dictated, speed, streak and time saved.
- In-app updates (v0.4.0): release builds check GitHub Releases (`latest.json`) 20 s after launch and every 6 h, show "Update and restart", verify the signature and keep settings, history, snippets and models. This check is the only network traffic uttr starts on its own; it sends no user data.
- v0.4.0 refreshed the app's design system: Urbanist + Hanken Grotesk, forest #274B40, soft rounded sheets. The site uses the same faces and palette.
- Command Mode: select text, hold the command keys and say what to do with it.
- Snippets, per-app styles, personal dictionary, searchable local history (SQLite).

## Brand Commitments

- Name: `uttr`, always lowercase.
- Logo: the cursive loop with sound bars on a rounded square; forest green and cream in the shipped icon (`public/img/icon.png`).
- Parent: a Lets Decode AI project, with a backlink to letsdecodeai.com.
- Voice: plain, factual, no hype; the README's tone.

## Evidence on Hand

- Real app screenshots with sample data, retaken from the v0.4.0 UI with the app repo's `scripts/screenshots` harness: `public/img/history-light.png`, `public/img/home-light.png`.
- Measured performance from the project's integration test (Parakeet v2 int8, Apple Silicon): 4-6 s clips in about 360-530 ms; a 62.5 s streamed dictation finishes about 421 ms after key-up. Hardware varies.
- Live release data from GitHub (versions, dates, notes, installer sizes).
- No testimonials, user counts, customer logos, press or star counts to quote. Do not invent them.
- No generated imagery: the owner asked for none. Free, openly licensed photographs are allowed when a section needs one.

## Product Principles

1. Prove privacy by mechanism, not adjectives: say what runs where.
2. Show the thing working: the dictation itself is the demo.
3. One action matters: the right installer for this visitor's system.
4. Open source is a fact to show (licence, repo, release notes), not a slogan.

## Accessibility & Inclusion

Part of the audience dictates because typing is hard for them. Everything must work with a keyboard
and screen reader, respect reduced motion, and keep readable sizes and contrast.

// Questions people (and search and answer engines) ask about uttr. Rendered on the page, as FAQPage
// structured data and in /llms.txt, so the three never disagree. Plain facts only; no invented numbers.

export interface Faq {
  q: string;
  a: string;
}

export const FAQ: Faq[] = [
  {
    q: "What is uttr?",
    a: "uttr is a free, open-source push-to-talk dictation app for macOS, Windows and Linux. Hold a shortcut in any app, speak, and let go: punctuated text appears at your cursor. By default the speech recognition runs on your own computer with open models such as NVIDIA Parakeet, so your audio never leaves it.",
  },
  {
    q: "Is uttr really free?",
    a: "Yes. uttr is MIT-licensed on GitHub, with no account, no subscription and no paid tier. If you choose to connect a cloud AI or speech provider, you use your own API key and that provider bills you directly.",
  },
  {
    q: "Does uttr work offline?",
    a: "Yes. After you download a speech model once inside the app (the default, Parakeet TDT 0.6B v2, is about 660 MB), dictation and the optional on-device AI cleanup work with no internet connection.",
  },
  {
    q: "Does my voice leave my computer?",
    a: "Not by default. Audio is held in memory while you speak, is never saved to disk, and is transcribed by a model on your processor. Audio is only uploaded if you switch speech recognition to Cloud (your key), which sends it to the service you picked: OpenAI, Groq or your own server. Cloud AI cleanup sends text only, never audio. uttr has no telemetry and sends nothing to Lets Decode AI.",
  },
  {
    q: "Which operating systems does uttr support?",
    a: "macOS 10.15 (Catalina) or later on Apple Silicon and Intel, 64-bit Windows, and Linux on X11 or Wayland (GNOME 48 or KDE Plasma 6 and later), as a .dmg, an .exe installer, an AppImage or a .deb package.",
  },
  {
    q: "What is the dictation shortcut?",
    a: "Hold fn on macOS, Ctrl + Win on Windows or Ctrl + Super on Linux X11, and you can change it in Settings. On Wayland the desktop's shortcut portal sets the keys. Double-press the shortcut for hands-free dictation, and press Esc to cancel.",
  },
  {
    q: "How fast is uttr?",
    a: "In the project's integration test on Apple Silicon with Parakeet v2, 4 to 6 second clips transcribe in about 360 to 530 ms, and a 62.5 second dictation finishes about 421 ms after you let go of the key, because uttr transcribes in chunks while you are still talking. Speed depends on your hardware and model.",
  },
  {
    q: "Which languages can I dictate in?",
    a: "It depends on the model you download: Parakeet TDT 0.6B v2 for English, Parakeet TDT 0.6B v3 for 25 European languages, Whisper large-v3-turbo for many languages, and SenseVoice for Chinese, English, Japanese, Korean and Cantonese. uttr suggests one on first run from your RAM and system language.",
  },
  {
    q: "Can uttr clean up filler words and rewrite text?",
    a: "Yes, both optional and off by default. AI cleanup removes ums and false starts and fixes punctuation. Command Mode lets you select text, hold the command keys and say what to do with it. Both run on your computer with llama.cpp, or with your own OpenAI, Anthropic or OpenRouter key, or any OpenAI-compatible server.",
  },
  {
    q: "How does uttr update?",
    a: "Since v0.4.0, uttr checks GitHub Releases for a new version at launch and every 6 hours and shows an Update and restart button. Updates are signature-checked and keep your settings, history, snippets and models. The check downloads a public file and sends no data about you.",
  },
  {
    q: "Why does my computer warn me when I first open uttr?",
    a: "The installers may not be code-signed by Apple or Microsoft yet. On macOS, open uttr once, then choose Open Anyway in System Settings › Privacy & Security. On Windows, choose More info, then Run anyway in the SmartScreen prompt. The source and the build workflow are public on GitHub.",
  },
];

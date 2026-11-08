import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

// A made-up 17 s dictation, as uttr's chunk planner sees it: a cut at the first pause of 300 ms or
// more once a chunk is at least 4 s long.
const DURATION = 17.2;
const SPEECH: [number, number][] = [
  [0.3, 3.1], [3.45, 5.2], [5.65, 8.1], [8.4, 10.4], [10.85, 13.2], [13.5, 15.3], [15.7, 17.0],
];
const CHUNKS = [
  { end: 5.4, text: "I think the new onboarding mostly works," },
  { end: 10.6, text: "but the second step asks for too much," },
  { end: 15.5, text: "so let’s cut the email field" },
  { end: DURATION, text: "and ship it on Friday." },
];
const STEPS = [
  { title: "Hold your shortcut", body: "In any app, in any text field. Double-press for hands-free; Esc cancels." },
  { title: "Speak naturally", body: "Audio is cut at your pauses and each piece is transcribed in the background while you talk." },
  { title: "Let go", body: "Only the last short piece is left. Text is pasted at your cursor and your clipboard is put back." },
];

function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Paint a spectrogram of the made-up dictation: formant bands that move, silence in the pauses. */
function paint(canvas: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  const cols = Math.round(width / 2);
  const rows = 72;
  const cw = width / cols;
  const rh = height / rows;
  for (let c = 0; c < cols; c++) {
    const t = (c / cols) * DURATION;
    const seg = SPEECH.find(([a, b]) => t >= a && t <= b);
    for (let r = 0; r < rows; r++) {
      const f = r / rows;
      let v = 0.04 * seeded(c * 97 + r);
      if (seg) {
        const [a, b] = seg;
        const k = SPEECH.indexOf(seg);
        const env = Math.sin(((t - a) / (b - a)) * Math.PI) ** 0.5;
        // Formants drift slowly and differently in each phrase, the way vowels glide.
        const drift = (rate: number, n: number) => Math.sin(t * rate + k * 1.7 + n) * 0.6 + Math.sin(t * rate * 2.3 + k) * 0.4;
        const formants: [number, number, number][] = [
          [0.09 + 0.025 * drift(1.9, 0), 0.05, 1],
          [0.27 + 0.07 * drift(1.3, 2), 0.05, 0.85],
          [0.5 + 0.05 * drift(1.1, 4), 0.045, 0.55],
          [0.72 + 0.03 * drift(0.9, 1), 0.07, 0.3],
        ];
        for (const [fc, bw, amp] of formants) v += amp * Math.exp(-(((f - fc) / bw) ** 2));
        // Voicing shows as fine vertical striations.
        v *= env * (0.72 + 0.28 * Math.sin(c * 1.35)) * (0.6 + 0.4 * seeded(c * 31 + r * 7));
        // A short burst of hiss at some word onsets ("s", "f", "sh").
        const onset = (t - a) / (b - a);
        if (k % 2 === 0 && onset < 0.07 && f > 0.45) v += 0.5 * seeded(c * 13 + r);
      }
      if (v < 0.08) continue;
      ctx.fillStyle = f < 0.45 ? "#112a21" : "#274b40";
      ctx.globalAlpha = Math.min(1, v);
      ctx.fillRect(c * cw, height - (r + 1) * rh, cw + 0.4, rh + 0.4);
    }
  }
}

export function HowItWorks() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 32, restDelta: 0.0005 });
  // The first and last bits of scroll are spent on "hold" and "let go".
  const audio = useTransform(progress, [0.1, 0.85], [0, 1], { clamp: true });
  const left = useTransform(audio, (v) => `${v * 100}%`);
  const clip = useTransform(audio, (v) => `inset(0 ${100 - v * 100}% 0 0)`);
  const [seconds, setSeconds] = useState(0);
  const [step, setStep] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    setStep(v < 0.1 ? 0 : v < 0.85 ? 1 : 2);
    setSeconds(Math.min(1, Math.max(0, (v - 0.1) / 0.75)) * DURATION);
  });

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    paint(el);
    const ro = new ResizeObserver(() => paint(el));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Phones and short windows get the finished diagram, with no scroll scene.
  const [static_, setStatic] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px), (max-height: 660px), (prefers-reduced-motion: reduce)");
    const set = () => setStatic(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  const s = static_ ? DURATION : seconds;
  const released = static_ || step === 2;

  let start = 0;
  return (
    <section className="section how" id="how" ref={section} aria-labelledby="how-title">
      <div className="how-sticky">
        <div className="wrap">
          <div className="head-split">
            <h2 id="how-title" className="h2">
              Transcribed <span className="say">while</span> you talk, not after.
            </h2>
            <p className="lede">
              While you speak, uttr cuts the audio at natural pauses and transcribes each piece in the background. When you
              let go, only the last short piece is left.
            </p>
          </div>

          <figure className="spectro" aria-label="A 17 second dictation drawn as a spectrogram, split into four chunks at pauses">
            <div className="spectro-notes" aria-hidden="true">
              <svg viewBox="0 0 1000 60" preserveAspectRatio="none">
                <path d="M300 14 C 312 30, 314 44, 314 60" />
                <path d="M968 14 C 980 30, 986 44, 990 60" />
              </svg>
              <span className="note" style={{ left: "24%" }}>
                a 450 ms pause, so the first piece is cut here
              </span>
              <span className="note" style={{ right: "3%" }}>
                key up: text in 421 ms
              </span>
            </div>
            <div className="spectro-band">
              <motion.canvas ref={canvas} style={{ clipPath: static_ ? "none" : clip }} />
              {CHUNKS.slice(0, -1).map((c) => (
                <i key={c.end} className={`spectro-cut ${s >= c.end ? "is-on" : ""}`} style={{ left: `${(c.end / DURATION) * 100}%` }} />
              ))}
              {!static_ && <motion.i className="playhead" style={{ left }} />}
            </div>
            <div className="spectro-time data" aria-hidden="true">
              {[0, 4.3, 8.6, 12.9, 17.2].map((t) => (
                <span key={t}>{t.toFixed(1)} s</span>
              ))}
            </div>
            <div className="chunks">
              {CHUNKS.map((c, i) => {
                const begin = start;
                start = c.end;
                const last = i === CHUNKS.length - 1;
                const done = last ? released : s >= c.end;
                return (
                  <p key={c.end} className={`chunk ${done ? "is-done" : ""} ${last ? "is-last" : ""}`} style={{ flexBasis: `${((c.end - begin) / DURATION) * 100}%` }}>
                    <span className="data">{last ? "last · +421 ms" : `piece ${i + 1} · ${(c.end - begin).toFixed(1)} s`}</span>
                    {c.text}
                  </p>
                );
              })}
            </div>
          </figure>

          <ol className="steps">
            {STEPS.map((st, i) => (
              <li key={st.title} className={static_ || i <= step ? "is-on" : ""}>
                <span className="data">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3">{st.title}</h3>
                <p>{st.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

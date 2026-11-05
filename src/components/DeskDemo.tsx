import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check } from "./Icons";

/** One spoken word. `final` is what uttr inserts; null means cleanup drops it. */
type Token = { raw: string; final: string | null };
const w = (raw: string, final: string | null = raw): Token => ({ raw, final });

interface Scene {
  app: string;
  where: string;
  old: string;
  box: { left: string; top: string; width: string };
  tokens: Token[];
}

// Sample dictations, one per app on the desk. Filler and the self-correction are spoken, then cleaned away.
const SCENES: Scene[] = [
  {
    app: "Slack",
    where: "#design-review",
    old: "Priya: are we still on for today?",
    box: { left: "45%", top: "7%", width: "51%" },
    tokens: [
      w("um", null), w("can", "Can"), w("we"), w("move"), w("the"), w("review"), w("to"),
      w("tuesday", null), w("no", null), w("wednesday", "Wednesday"), w("at"), w("three", "3?"),
    ],
  },
  {
    app: "Mail",
    where: "Re: Contract",
    old: "Hi Dana,",
    box: { left: "4%", top: "30%", width: "40%" },
    tokens: [
      w("thanks", "Thanks"), w("for"), w("the"), w("quick"), w("turnaround", "turnaround."), w("uh", null),
      w("i", "I"), w("have"), w("two"), w("small"), w("changes", "changes.")
    ],
  },
  {
    app: "Notes",
    where: "Friday",
    old: "Launch checklist",
    box: { left: "50%", top: "55%", width: "44%" },
    tokens: [w("send", "Send"), w("the"), w("deck"), w("to"), w("my", null), w("email", "sam@northwind.studio")],
  },
];

type Phase = "ready" | "listening" | "transcribing" | "done";
const WORD_MS = 210;
const BARS = 54;

export function DeskDemo({ shortcut }: { shortcut: string[] }) {
  const reduced = useReducedMotion();
  const desk = useRef<HTMLDivElement>(null);
  const inView = useInView(desk, { amount: 0.35 });

  const [scene, setScene] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [shown, setShown] = useState(0);
  const [held, setHeld] = useState(false);
  const [finished, setFinished] = useState<Record<number, boolean>>({});
  const pauseUntil = useRef(0);

  const tokens = SCENES[scene].tokens;

  // Words arrive one by one while listening, as if streamed from the recognizer.
  useEffect(() => {
    if (phase !== "listening" || shown >= tokens.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), WORD_MS + Math.random() * 110);
    return () => clearTimeout(t);
  }, [phase, shown, tokens.length]);

  // Autoplay lets go once every word is out, unless a person is holding the key.
  useEffect(() => {
    if (phase === "listening" && !held && shown >= tokens.length) {
      const t = setTimeout(() => setPhase("transcribing"), 500);
      return () => clearTimeout(t);
    }
  }, [phase, held, shown, tokens.length]);

  useEffect(() => {
    if (phase === "transcribing") {
      const t = setTimeout(() => setPhase("done"), reduced ? 150 : 850);
      return () => clearTimeout(t);
    }
    if (phase === "done") {
      setFinished((f) => ({ ...f, [scene]: true }));
      const t = setTimeout(() => {
        setPhase("ready");
        setShown(0);
        setScene((s) => (s + 1) % SCENES.length);
      }, Math.max(2600, pauseUntil.current - Date.now()));
      return () => clearTimeout(t);
    }
    if (phase === "ready" && inView) {
      const t = setTimeout(() => setPhase("listening"), reduced ? 2000 : 700);
      return () => clearTimeout(t);
    }
  }, [phase, inView, reduced, scene]);

  const press = useCallback(() => {
    setHeld(true);
    setShown(0);
    setFinished((f) => ({ ...f, [scene]: false }));
    setPhase("listening");
  }, [scene]);

  const release = useCallback(() => {
    if (!held) return;
    setHeld(false);
    pauseUntil.current = Date.now() + 6000;
    setPhase((p) => (p === "listening" ? "transcribing" : p));
  }, [held]);

  return (
    <div>
      <div className="laptop-screen">
        <div className="desk" ref={desk} aria-hidden="true">
          {SCENES.map((s, i) => (
            <AppSheet
              key={s.app}
              index={i}
              scene={s}
              active={i === scene}
              phase={i === scene ? phase : finished[i] ? "done" : "ready"}
              shown={i === scene ? shown : finished[i] ? s.tokens.length : 0}
              caretFor={i === scene}
            />
          ))}
          {!reduced && <Ribbon desk={desk} listening={phase === "listening"} scene={scene} shown={shown} />}
          <FlowBar phase={phase} />
        </div>
      </div>
      <div className="laptop-base" />
      <div className="try">
        <p className="note">{held ? "listening… let go to insert" : "hold the key and it types"}</p>
        <button
          type="button"
          className={`key ${held ? "is-down" : ""}`}
          aria-label="Hold to run the dictation demo"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            press();
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "Enter") && !e.repeat) {
              e.preventDefault();
              press();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") release();
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {shortcut.map((k) => (
            <kbd key={k}>{k}</kbd>
          ))}
        </button>
      </div>
    </div>
  );
}

function AppSheet({ index, scene, active, phase, shown, caretFor }: { index: number; scene: Scene; active: boolean; phase: Phase; shown: number; caretFor: boolean }) {
  const reduced = useReducedMotion();
  const visible = scene.tokens.slice(0, shown);
  const done = phase === "done";
  const words = done ? visible.filter((t) => t.final !== null) : visible;

  return (
    <div className={`app app-${index} ${active ? "is-active" : ""}`} style={scene.box}>
      <div className="app-title">
        <b>{scene.app}</b> {scene.where}
      </div>
      <div className="app-old">{scene.old}</div>
      <div>
        <AnimatePresence initial={false} mode="popLayout">
          {words.map((t) => {
            const i = scene.tokens.indexOf(t);
            const cls = done ? "is-new" : phase === "transcribing" && t.final === null ? "is-struck" : "is-raw";
            return (
              <motion.span
                key={i}
                layout={!reduced}
                className={`word ${cls}`}
                initial={{ opacity: 0, filter: "blur(5px)", y: 4 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.6 }}
              >
                {done ? t.final : t.raw}
              </motion.span>
            );
          })}
        </AnimatePresence>
        {caretFor && <span className={`caret ${phase === "listening" ? "is-live" : ""}`} data-caret="" />}
      </div>
    </div>
  );
}

function FlowBar({ phase }: { phase: Phase }) {
  const label = { ready: "Ready", listening: "Listening", transcribing: "Transcribing", done: "Inserted" }[phase];
  return (
    <div className={`flowbar is-${phase}`} data-flowbar="">
      {phase === "listening" ? (
        <span className="flowbar-signal">
          {[0.5, 1, 0.7, 0.9, 0.6].map((h, i) => (
            <i key={i} style={{ height: 14 * h, animationDelay: `${i * -0.17}s` }} />
          ))}
        </span>
      ) : phase === "done" ? (
        <Check size={14} />
      ) : (
        <span className="flowbar-dot" />
      )}
      {label}
    </div>
  );
}

/**
 * The voice, drawn: bars stream out of the Flow Bar along a curve and fade into the caret.
 * Each bar shows the loudness the "microphone" had a moment ago, so the wave travels, and it
 * travels at the same speed whatever the frame rate.
 */
const TRAVEL_S = 0.9;

/** Synthetic speech loudness at time `s` (seconds): syllable bursts under a slower phrase envelope. */
function loudness(s: number) {
  const n = Math.sin(Math.floor(s * 40) * 12.9898) * 43758.5453;
  const jitter = n - Math.floor(n);
  return (0.35 + 0.65 * Math.abs(Math.sin(s * 9.3)) * (0.6 + 0.4 * Math.sin(s * 2.1))) * (0.72 + jitter * 0.28);
}

function Ribbon({ desk, listening, scene, shown }: { desk: React.RefObject<HTMLDivElement | null>; listening: boolean; scene: number; shown: number }) {
  const svg = useRef<SVGSVGElement>(null);
  const rects = useRef<(SVGRectElement | null)[]>([]);
  const geo = useRef({ w: 1, h: 1, x0: 0, y0: 0, cx: 0, cy: 0, x1: 0, y1: 0 });
  // When the current or last stretch of "speech" started and ended, in performance.now() seconds.
  const span = useRef<{ start: number; end: number | null }>({ start: -1, end: -1 });

  // Re-measure where the wave starts (the Flow Bar) and lands (the caret).
  useLayoutEffect(() => {
    const el = desk.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const bar = el.querySelector("[data-flowbar]")?.getBoundingClientRect();
      const caret = el.querySelector("[data-caret]")?.getBoundingClientRect();
      if (!bar || !caret) return;
      const x0 = bar.left + bar.width / 2 - box.left;
      const y0 = bar.top - box.top - 6;
      const x1 = caret.left - box.left + 1;
      const y1 = caret.top + caret.height / 2 - box.top;
      // Bow the curve sideways so the wave visibly travels across the desk.
      const cx = Math.min(x0, x1) - box.width * 0.18;
      const cy = (y0 + y1) / 2;
      geo.current = { w: box.width, h: box.height, x0, y0, cx, cy, x1, y1 };
      svg.current?.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [desk, scene, shown]);

  useEffect(() => {
    const now = performance.now() / 1000;
    if (listening) span.current = { start: now, end: null };
    else if (span.current.end === null) span.current.end = now;

    let raf = 0;
    const tick = (ms: number) => {
      const t1 = ms / 1000;
      const { start, end } = span.current;
      const g = geo.current;
      for (let i = 0; i < BARS; i++) {
        const r = rects.current[i];
        if (!r) continue;
        const t = i / (BARS - 1);
        const x = (1 - t) ** 2 * g.x0 + 2 * (1 - t) * t * g.cx + t ** 2 * g.x1;
        const y = (1 - t) ** 2 * g.y0 + 2 * (1 - t) * t * g.cy + t ** 2 * g.y1;
        const dx = 2 * (1 - t) * (g.cx - g.x0) + 2 * t * (g.x1 - g.cx);
        const dy = 2 * (1 - t) * (g.cy - g.y0) + 2 * t * (g.y1 - g.cy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        // This bar shows what the microphone heard t * TRAVEL_S seconds ago.
        const heard = t1 - t * TRAVEL_S;
        const on = heard >= start && (end === null || heard <= end);
        const size = on ? loudness(heard) * (1 - t * 0.7) * g.h * 0.22 : 0;
        r.setAttribute("x", (x - 1.8).toFixed(1));
        r.setAttribute("y", (y - size / 2).toFixed(1));
        r.setAttribute("height", size.toFixed(1));
        r.setAttribute("transform", `rotate(${angle.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`);
        r.setAttribute("opacity", (0.95 - t * 0.75).toFixed(2));
      }
      // Keep drawing while listening, and until the last sound has reached the caret.
      if (end === null || t1 - TRAVEL_S <= end) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [listening]);

  return (
    <svg ref={svg} className="ribbon">
      {Array.from({ length: BARS }, (_, i) => (
        <rect key={i} ref={(el) => {
            rects.current[i] = el;
          }} width="3.6" height="0" rx="1.8" />
      ))}
    </svg>
  );
}

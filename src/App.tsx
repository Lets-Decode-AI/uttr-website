import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { DeskDemo } from "./components/DeskDemo";
import { HowItWorks } from "./components/HowItWorks";
import { Check, GitHub } from "./components/Icons";
import { Download, DownloadButton, Features, Footer, Models, Privacy, Releases } from "./components/Sections";
import { REPO_URL, useVisitor } from "./data";

export function App() {
  // The browser tries to jump to `/#download` before React has rendered the section, so do it once mounted.
  useEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant" }));
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Privacy />
        <Features />
        <Models />
        <Releases />
        <Download />
      </main>
      <Footer />
    </>
  );
}

function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [night, setNight] = useState(false);
  const update = (y: number) => {
    setScrolled(y > 16);
    // Over a forest band the bar turns forest too, instead of a grey slab on dark ground.
    // Measured on the next frame, once the browser has laid out the new scroll position.
    requestAnimationFrame(() => {
      const under = document.elementFromPoint(window.innerWidth / 2, 84);
      setNight(Boolean(under?.closest(".on-night")));
    });
  };
  useMotionValueEvent(scrollY, "change", update);
  // A page restored mid-scroll or opened at a hash fires no scroll event, so read the position once.
  useEffect(() => update(window.scrollY), []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${night ? "is-night" : ""}`}>
      <div className="wrap nav-inner">
        <a className="brand" href="/" aria-label="uttr home">
          <img src="/img/icon.png" width="30" height="30" alt="" />
          <span>uttr</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#how">How it works</a>
          <a href="#privacy">Privacy</a>
          <a href="#features">Features</a>
          <a href="#releases">Releases</a>
          <a href={REPO_URL} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <GitHub size={15} /> GitHub
          </a>
        </nav>
        <a className="btn btn-sm" href="#download">
          Download
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const visitor = useVisitor();
  return (
    <section className="wrap hero" aria-labelledby="hero-title">
      <div>
        <h1 id="hero-title" className="h1">
          Say it once. It lands <span className="say">wherever</span> you type.
        </h1>
        <p className="lede">
          Hold a key in any app, speak, let go. uttr turns your voice into punctuated text at your cursor in about 421 ms.
          By default, speech recognition runs on your computer, so the audio never leaves it.
        </p>
        <DownloadButton />
        <ul className="facts">
          {["On-device speech by default", "No account or subscription", "Open source, MIT"].map((f) => (
            <li key={f}>
              <Check size={15} /> {f}
            </li>
          ))}
        </ul>
      </div>
      <DeskDemo shortcut={visitor.shortcut} />
    </section>
  );
}

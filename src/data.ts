import { useEffect, useState } from "react";
import type { ReleaseAsset, ReleaseFeed } from "./releases";
import { detectVisitor, detectOs, shortcutFor, type Visitor } from "./platform";

export const REPO_URL = "https://github.com/Lets-Decode-AI/Uttr";
export const RELEASES_URL = `${REPO_URL}/releases`;
export const PARENT_URL = "https://letsdecodeai.com";

type FeedState = { status: "loading" } | { status: "ready"; feed: ReleaseFeed } | { status: "error" };

let feedPromise: Promise<ReleaseFeed> | null = null;

/* The prerendered page carries a snapshot of the release feed taken at build time, so crawlers and
   first paint see the real versions and notes. The page renders from it, then swaps in the live feed. */
let snapshot: ReleaseFeed | null = null;

export function primeFeed(feed: ReleaseFeed | null) {
  snapshot = feed;
}

if (typeof document !== "undefined") {
  const el = document.getElementById("release-feed");
  if (el?.textContent) {
    try {
      snapshot = JSON.parse(el.textContent) as ReleaseFeed;
    } catch {
      snapshot = null;
    }
  }
}

function loadFeed(): Promise<ReleaseFeed> {
  feedPromise ??= fetch("/api/releases").then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json() as Promise<ReleaseFeed>;
  });
  return feedPromise;
}

export function useReleaseFeed(): FeedState {
  const [state, setState] = useState<FeedState>(() => (snapshot ? { status: "ready", feed: snapshot } : { status: "loading" }));
  useEffect(() => {
    let alive = true;
    loadFeed().then(
      (feed) => alive && setState({ status: "ready", feed }),
      // Keep showing the build-time snapshot if the live feed fails.
      () => alive && setState((s) => (s.status === "ready" ? s : { status: "error" })),
    );
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

export function useLatestAssets(): { version: string | null; assets: ReleaseAsset[]; status: FeedState["status"] } {
  const state = useReleaseFeed();
  if (state.status !== "ready") return { version: null, assets: [], status: state.status };
  const latest = state.feed.releases.find((r) => r.tag === state.feed.latest);
  return { version: latest?.tag ?? null, assets: latest?.assets.filter((a) => a.platform) ?? [], status: "ready" };
}

export function useVisitor(): Visitor {
  // Starts unknown on the server and on the first client render (so hydration matches), then detects.
  const [visitor, setVisitor] = useState<Visitor>({ os: "unknown", platform: null, archGuessed: true, shortcut: shortcutFor("unknown") });
  useEffect(() => {
    const os = detectOs();
    setVisitor((v) => (v.os === "unknown" ? { ...v, os, shortcut: shortcutFor(os) } : v));
    detectVisitor().then(setVisitor);
  }, []);
  return visitor;
}

export function formatSize(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(bytes >= 100_000_000 ? 0 : 1)} MB`;
}

export function formatDate(iso: string): string {
  // UTC, so the prerendered date and the visitor's render agree.
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

import { useEffect, useState } from "react";
import type { ReleaseAsset, ReleaseFeed } from "./releases";
import { detectVisitor, detectOs, shortcutFor, type Visitor } from "./platform";

export const REPO_URL = "https://github.com/Lets-Decode-AI/Uttr";
export const RELEASES_URL = `${REPO_URL}/releases`;
export const PARENT_URL = "https://letsdecodeai.com";

type FeedState = { status: "loading" } | { status: "ready"; feed: ReleaseFeed } | { status: "error" };

let feedPromise: Promise<ReleaseFeed> | null = null;

function loadFeed(): Promise<ReleaseFeed> {
  feedPromise ??= fetch("/api/releases").then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json() as Promise<ReleaseFeed>;
  });
  return feedPromise;
}

export function useReleaseFeed(): FeedState {
  const [state, setState] = useState<FeedState>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    loadFeed().then(
      (feed) => alive && setState({ status: "ready", feed }),
      () => alive && setState({ status: "error" }),
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
  const [visitor, setVisitor] = useState<Visitor>(() => {
    const os = typeof navigator === "undefined" ? "unknown" : detectOs();
    return { os, platform: null, archGuessed: true, shortcut: shortcutFor(os) };
  });
  useEffect(() => {
    detectVisitor().then(setVisitor);
  }, []);
  return visitor;
}

export function formatSize(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(bytes >= 100_000_000 ? 0 : 1)} MB`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

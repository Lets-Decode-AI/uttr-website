import type { Platform } from "./releases";

export type OsFamily = "mac" | "windows" | "linux" | "mobile" | "unknown";

export interface Visitor {
  os: OsFamily;
  /** Best guess for the installer to offer first. Null on phones and unknown systems. */
  platform: Platform | null;
  /** True when we could not tell Apple Silicon from Intel and guessed. */
  archGuessed: boolean;
  shortcut: string[];
}

type UAData = {
  platform?: string;
  mobile?: boolean;
  getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>;
};

export function detectOs(): OsFamily {
  const uaData = (navigator as Navigator & { userAgentData?: UAData }).userAgentData;
  const ua = navigator.userAgent;
  if (uaData?.mobile || /Android|iPhone|iPad|iPod/i.test(ua)) return "mobile";
  // iPadOS reports itself as a Mac; touch points give it away.
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return "mobile";
  const p = (uaData?.platform || navigator.platform || ua).toLowerCase();
  if (p.includes("mac")) return "mac";
  if (p.includes("win")) return "windows";
  if (p.includes("linux") || p.includes("x11") || p.includes("cros")) return "linux";
  return "unknown";
}

export function shortcutFor(os: OsFamily): string[] {
  if (os === "windows") return ["Ctrl", "Win"];
  if (os === "linux") return ["Ctrl", "Super"];
  return ["fn"];
}

export async function detectVisitor(): Promise<Visitor> {
  const os = detectOs();
  const base = { os, archGuessed: false, shortcut: shortcutFor(os) };
  if (os === "windows") return { ...base, platform: "windows-x64" };
  if (os === "linux") return { ...base, platform: "linux-appimage" };
  if (os !== "mac") return { ...base, platform: null };

  // Chromium browsers can say which CPU the Mac has. Safari and Firefox cannot, so most Macs sold
  // since 2020 (Apple Silicon) is the default, with Intel one click away.
  const uaData = (navigator as Navigator & { userAgentData?: UAData }).userAgentData;
  try {
    const hints = await uaData?.getHighEntropyValues?.(["architecture"]);
    if (hints?.architecture === "x86") return { ...base, platform: "macos-x64" };
    if (hints?.architecture === "arm") return { ...base, platform: "macos-arm64" };
  } catch {
    // fall through to the guess
  }
  return { ...base, platform: "macos-arm64", archGuessed: true };
}

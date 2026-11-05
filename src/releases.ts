// Shared between the Worker (which builds this shape from the GitHub API) and the page (which reads it).

export type Platform = "macos-arm64" | "macos-x64" | "windows-x64" | "linux-appimage" | "linux-deb";

export interface ReleaseAsset {
  name: string;
  size: number;
  platform: Platform | null;
  url: string;
}

export interface Release {
  tag: string;
  name: string;
  publishedAt: string;
  prerelease: boolean;
  url: string;
  notesHtml: string;
  assets: ReleaseAsset[];
}

export interface ReleaseFeed {
  repo: string;
  fetchedAt: string;
  latest: string | null;
  releases: Release[];
}

export const PLATFORM_LABELS: Record<Platform, { os: string; detail: string; file: string }> = {
  "macos-arm64": { os: "macOS", detail: "Apple Silicon", file: ".dmg" },
  "macos-x64": { os: "macOS", detail: "Intel", file: ".dmg" },
  "windows-x64": { os: "Windows", detail: "64-bit", file: ".exe" },
  "linux-appimage": { os: "Linux", detail: "AppImage", file: ".AppImage" },
  "linux-deb": { os: "Linux", detail: "Debian, Ubuntu", file: ".deb" },
};

export function platformOf(assetName: string): Platform | null {
  const n = assetName.toLowerCase();
  if (n.endsWith(".sig") || n.endsWith(".tar.gz")) return null;
  if (n.endsWith(".dmg")) return /aarch64|arm64|universal/.test(n) ? "macos-arm64" : "macos-x64";
  if (n.endsWith("-setup.exe") || n.endsWith(".msi")) return "windows-x64";
  if (n.endsWith(".appimage")) return "linux-appimage";
  if (n.endsWith(".deb")) return "linux-deb";
  return null;
}

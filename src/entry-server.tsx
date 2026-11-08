import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { primeFeed } from "./data";
import { FAQ } from "./faq";
import type { ReleaseFeed } from "./releases";

/** Used only at build time by scripts/prerender.mjs, never shipped to the browser. */
export function render(feed: ReleaseFeed | null): string {
  primeFeed(feed);
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export { FAQ };

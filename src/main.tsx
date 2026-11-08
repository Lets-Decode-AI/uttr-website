import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The build prerenders the page into #root (scripts/prerender.mjs); in dev it arrives empty.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

---
name: uttr
description: Speech you can see. Hold a key, speak, let go; the text lands at your cursor.
colors:
  paper: "#dfe4dc"
  paper-line: "rgba(42, 84, 70, 0.08)"
  sheet: "#f6f7f4"
  sheet-2: "#e9ede7"
  sheet-edge: "rgba(22, 37, 31, 0.12)"
  desk: "#c9d3cc"
  hinge: "#a9b4ad"
  ink: "#16251f"
  ink-2: "#33463e"
  muted: "#4d5e56"
  rule: "rgba(22, 37, 31, 0.14)"
  forest: "#2a5446"
  mint: "#a6d6bc"
  mint-wash: "rgba(166, 214, 188, 0.6)"
  strike: "#a04a33"
  night: "#16251f"
  night-2: "#24493d"
  on-night: "#eef1ec"
  on-night-2: "#b9c8bf"
  night-rule: "rgba(238, 241, 236, 0.16)"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(46px, 5.6vw, 82px)"
    fontWeight: 560
    lineHeight: 0.97
    letterSpacing: "-0.04em"
  display-download:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(56px, 7vw, 96px)"
    fontWeight: 560
    lineHeight: 0.97
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(40px, 4.6vw, 66px)"
    fontWeight: 560
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline-sm:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(34px, 3.6vw, 52px)"
    fontWeight: 560
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(24px, 2.2vw, 30px)"
    fontWeight: 560
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.45vw, 20px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
  stress:
    fontFamily: "Shantell Sans Variable, Comic Sans MS, cursive"
    fontSize: "1em"
    fontWeight: 500
    letterSpacing: "-0.015em"
  note:
    fontFamily: "Shantell Sans Variable, Comic Sans MS, cursive"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.3
  data:
    fontFamily: "Martian Mono Variable, ui-monospace, Menlo, monospace"
    fontSize: "0.75em"
    fontWeight: 400
    letterSpacing: "0"
    fontFeature: "tnum, zero"
rounded:
  mark: "3px"
  sheet: "4px"
  inset: "10px"
  key: "12px"
  summary: "16px"
  zone: "22px"
  pill: "99px"
spacing:
  grid: "32px"
  gutter: "clamp(16px, 4vw, 56px)"
  max: "1216px"
  column-gap: "20px"
  gap: "24px"
  sheet-pad: "28px"
  section: "clamp(88px, 11vw, 140px)"
  nav-height: "76px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.pill}"
    padding: "0 26px 0 28px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.on-night}"
  button-small:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "42px"
  button-light:
    backgroundColor: "{colors.on-night}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 26px 0 28px"
    height: "56px"
  button-light-hover:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
  feature-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "28px 28px 92px"
  app-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.inset}"
    padding: "12px 14px 14px"
  flow-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 12px"
    height: "34px"
  keycap:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.key}"
    height: "58px"
    width: "62px"
  chip:
    textColor: "{colors.forest}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  chip-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  badge:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "2px 9px"
  inserted-text:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.mark}"
  privacy-zone:
    textColor: "{colors.on-night}"
    rounded: "{rounded.zone}"
    padding: "28px"
---

# Design System: uttr

## Overview

**Creative North Star: "Speech You Can See"**

The page is a sheet of spectrograph grid paper on which a voice is drawn as it is heard. Waveform bars and spectrogram bands are plotted in forest ink, they travel across a drawn desk, and they settle as words at a blinking caret. Everything else is the stationery of that recording: flat app sheets laid on the paper, a pencil-thin hairline at every edge, a hand-written note in the margin with a leader line pointing at the thing it explains, and monospaced ticks for every measured value.

Density is calm and editorial: large, tightly tracked grotesque headings, one stressed word per heading set in a hand-drawn italic, wide section padding, and generous paper showing between objects. The system refuses the category default (a centred headline over an app screenshot and a row of identical feature cards); instead the product's own act, dictation, is the illustration, drawn in code. There is no generated imagery, no shadow, no gradient, no glass.

Two grounds carry the story. The light grid paper holds what uttr does and how. A second ground, forest ink, appears only where trust and action are asked for: the privacy map, the download table, and the footer that closes the download band.

**Key Characteristics:**
- Spectrograph grid paper (32px forest grid at 8% opacity) as the page ground.
- Forest ink reserved for the privacy, download and footer bands.
- Flat sheets with a 1px hairline edge that overlap by laying order, never by shadow.
- Three faces with strict jobs: grotesque for text, hand italic for one stressed word and margin notes, mono for data.
- Mint marks freshly inserted text; brick red strikes filler being removed.
- One authored hero moment and one scroll-linked scene; both rest under reduced motion.

## Colors

A cool, low-chroma forest palette on pale green-grey paper, with exactly two signal colors that each carry one meaning.

### Primary
- **Forest Ink** (ink): All text, the primary button, the Flow Bar, the laptop bezel, table header rules. Also the second ground (night) for the privacy, download and footer bands.
- **Deep Forest** (forest): The drawing pen. Waveform ribbon bars, leader lines, the caret, the active app ring, icons in fact lists, stressed words and notes on paper, button hover, focus outline, scrollbar thumb.

### Secondary
- **Fresh Mint** (mint): Text that has just been inserted, and nothing decorative. The inserted-word wash (mint-wash), the Flow Bar's signal bars and done state, the latest-version badge, the local privacy zone border, the download table header rule, stressed words and focus rings on the forest ground, text selection.

### Tertiary
- **Struck Brick** (strike): Filler being removed. Struck words in the hero, the strike-through in the cleanup sheet, and the dashed pause cuts in the spectrogram. Never a warning or error color, never a fill.

### Neutral
- **Grid Paper** (paper): Page ground and sticky-nav fill on light sections; carries the grid lines (paper-line).
- **Sheet White** (sheet): Feature sheets, app windows on the desk, keycap face, legal summary card.
- **Sheet Tint** (sheet-2): Inset wells inside a sheet (before/after boxes in the cleanup and rewrite examples).
- **Hairline** (sheet-edge): The 1px edge around every sheet.
- **Rule** (rule): Section dividers, table row lines, inactive step rules.
- **Ink Two / Muted** (ink-2, muted): Lede and secondary copy; table headers, app title bars, timestamps.
- **Desk / Hinge** (desk, hinge): The drawn laptop's desk surface and base only.
- **Night Two** (night-2): Hover row on the download table.
- **On Night / On Night Two / Night Rule** (on-night, on-night-2, night-rule): Primary and secondary text and row rules on the forest ground.

### Named Rules
**The Fresh Ink Rule.** Mint means "this text just arrived." Use it for inserted text and the states that announce it (done, latest, local), never as a decorative accent or background panel.

**The One Strike Rule.** Brick red means "this is being taken out." It appears only as a strike-through or a cut line, at 1.5px.

**The Two Grounds Rule.** The forest ground is spent only on trust and action: privacy, download, footer. Every other section sits on grid paper.

## Typography

**Display Font:** Bricolage Grotesque Variable (with ui-sans-serif, system-ui)
**Hand Font:** Shantell Sans Variable, italic (with Comic Sans MS, cursive)
**Label/Mono Font:** Martian Mono Variable (with ui-monospace, Menlo)

All three are self-hosted through Fontsource; no font is loaded from a third-party CDN.

**Character:** A sturdy, optically sized grotesque does all the talking; a warm hand-drawn italic interrupts once per heading the way a speaker leans on a word; a wide monospace logs the measurements like ticks on a chart axis.

### Hierarchy
- **Display** (560, clamp(46px, 5.6vw, 82px), 0.97, -0.04em): The hero h1 and the 404 heading. The download band scales it up (display-download).
- **Headline** (560, clamp(40px, 4.6vw, 66px), 1.0, -0.035em): Section h2s; headline-sm for denser sections.
- **Title** (560, clamp(24px, 2.2vw, 30px), 1.1, -0.02em): Feature sheet and step h3s.
- **Lede** (400, clamp(17px, 1.45vw, 20px), 1.5): Intro paragraphs, max 34em, ink-2.
- **Body** (400, 17px, 1.55): Running copy, with `text-wrap: pretty`; legal body capped at 42em.
- **Label** (600, 15px): Buttons, nav links, link actions.
- **Stress** (Shantell 500 italic, inherits size, -0.015em): Exactly one word per heading, in forest on paper and mint on night.
- **Note** (Shantell 400, 16px, 1.3, forest): Hand-written margin notes and leader-line captions.
- **Data** (Martian Mono 400, 0.75em, tabular and slashed zero): Versions, file sizes, times, file names, latencies, axis ticks, app title bars, keycap legend.

### Named Rules
**The One Stressed Word Rule.** Every heading may set exactly one word in the hand italic. Never two, never a whole phrase, never in body copy.

**The Data Wears Mono Rule.** Martian Mono is for measured or machine values only (v0.3.0, 421 ms, 1.6 GB, uttr.dmg). Prose, labels and headings never use it.

## Layout

A 1216px content column with a fluid gutter (clamp(16px, 4vw, 56px)), sitting on a 32px grid that runs edge to edge across the paper. Sections breathe with clamp(88px, 11vw, 140px) vertical padding and are separated on paper by a single rule line; forest bands need no rule.

The hero splits 11:13 (copy left, drawn laptop right) at a full viewport height minus the 76px nav, collapsing to one column under 980px. Section heads use a two-column split aligned to the baseline; tables and release notes sit in a 4:7 split. Features lay on a 12-column grid with 20px column gaps, sheets deliberately overlapping one another by negative margins into each other's padding, so no content is covered. Under 960px the sheets stack in a single column, still overlapping 44px and alternately offset 18px left and right, so they still read as a pile.

The "How it works" scene is a 240vh scroll track with a sticky viewport; under 860px wide or 660px tall it becomes a static section with every state resolved. The sticky nav fills with paper (or with forest over a forest band) once scrolled.

## Elevation & Depth

The system is flat. Depth is laying order: a sheet laid later lies over the ones before it (rising z-index), and every sheet is outlined by a 1px hairline (sheet-edge), drawn as a zero-blur ring. There are no drop shadows, no blur, and no gradient surfaces. The active app on the desk is marked by a 2px forest ring, not by lift. The keycap's 6px bottom border is the physical key's skirt; pressing compresses it to 2px and moves the cap down 4px.

### Named Rules
**The Laid Sheets Rule.** Things overlap the way paper does on a desk: by order, edge and hairline. If something needs to feel on top, lay it later; never give it a shadow.

## Shapes

Corners are graded by what the object is. Feature sheets are paper and take a barely-there 4px corner. Windows and inset wells on the desk take 10px, the keycap 12px, the legal summary card 16px, the privacy zones 22px, and the laptop bezel 20px over an 8px chin. Anything you press or that floats as a control (buttons, Flow Bar, chips, badges) is a full pill. Inserted-text marks are 3px.

Lines are drawn, not boxed: 1.5px ink rules frame tables, the spectrogram band and release lists; 1px rules separate rows. Leader lines are 1.4px forest strokes with round caps. Icons are one SVG stroke set on a 16px grid, 1.6px round strokes, colored by currentColor.

## Components

### Buttons
Solid, confident pills that step when touched.
- **Shape:** Full pill (99px), 56px tall; small variant 42px.
- **Primary:** Forest ink with on-night text, label weight 600 at 17px, a trailing download arrow and an optional lighter detail (OS name) at 70% opacity.
- **Hover / Focus:** Background steps to deep forest and the button rises 2px (0.25s, ease-out cubic-bezier(0.16, 1, 0.3, 1)); the arrow nudges down 2px; active presses 1px below rest. Focus is a 2px forest outline offset 3px.
- **Light (on night):** On-night fill with ink text; hover fills mint. The nav button flips to this over forest bands.

### Links
- **Action link:** Weight 600 with a drawn underline that rests at 35% width and draws to full width on hover (0.35s ease-out).
- **Inline links:** 1px underline offset 4px; forest in prose.

### Chips and Badges
- **Chip:** Outlined pill, 1px forest at 40%, forest text, 32px tall. The dark variant is a miniature Flow Bar (ink fill, on-night text; mint when done).
- **Badge:** Small mint pill marking the latest release; the ghost variant is an inset forest hairline.

### Cards / Containers
- **Corner Style:** 4px on feature sheets.
- **Background:** Sheet white, with sheet-tint wells inside.
- **Shadow Strategy:** None; see Elevation & Depth.
- **Border:** 1px hairline ring.
- **Internal Padding:** 28px, with extra bottom padding (92px) that later sheets overlap.

### Navigation
Brand mark and wordmark (650, 22px) left, 15px ink-2 links right that darken and underline on hover, small primary button at the end. Transparent at top, paper fill with a hairline once scrolled, forest fill over forest bands. Under 860px the links hide and only the button remains.

### Tables (models, releases, downloads)
1.5px ink header rule, 14px muted header labels, 1px row rules, data columns right-aligned in mono. On the download band the header rule is mint, rows hover to night-2, and the visitor's own OS row is washed with mint at 10%. Release rows expand with a rotating chevron and underline their name on hover.

### Desk Demo (signature)
A drawn laptop whose desk holds Slack, Mail and Notes sheets, with the Flow Bar pill at the bottom. The one authored hero moment: a time-based waveform ribbon travels from the Flow Bar to the active caret, words blur in (opacity and a 5px blur resolving, 4px rise), filler is struck in brick then collapses, and the inserted words carry the mint wash. Holding the on-page keycap records into the ribbon. Under reduced motion the ribbon is removed and the scene rests on finished text.

### Spectrogram Scene (signature)
The one scroll-linked scene: a canvas spectrogram fills under a 1.5px ink playhead as the visitor scrolls, dashed brick cuts mark the pauses where chunks are cut, chunks of text sharpen from 18% opacity and 3px blur as their pieces finish, and three steps draw their top rule to full width. Hand notes with leader lines annotate the pause and the 421 ms key-up. Under reduced motion or a small viewport it rests fully resolved.

### Privacy Zones
On the forest ground: a solid mint-bordered zone for what runs on the device and a dashed on-night zone for what touches the network, each listing parts in 19px titles over on-night-2 captions.

## Do's and Don'ts

### Do:
- **Do** set the page on grid paper (paper with a 32px paper-line grid) and save the forest ground for privacy, download and footer.
- **Do** outline every sheet with the 1px hairline and let overlap come from laying order and z-index.
- **Do** set exactly one word per heading in Shantell italic, forest on paper and mint on night.
- **Do** set every version, size, time and file name in Martian Mono at 0.75em with tabular figures.
- **Do** use mint only for freshly inserted text and its states, and brick only to strike filler or mark a cut.
- **Do** draw product illustration in SVG or canvas from the dictation itself; use the single 16px, 1.6px-stroke SVG icon set.
- **Do** give every authored motion a resting state under prefers-reduced-motion.

### Don't:
- **Don't** put eyebrows or kickers above headings.
- **Don't** use gradient text, gradient surfaces, glass or backdrop blur.
- **Don't** add drop shadows; the only rings are the zero-blur hairline and the active 2px forest ring, and the keycap's thick bottom border is its skirt.
- **Don't** use unicode glyphs as icons (arrows, checks); use the SVG stroke set.
- **Don't** add a second authored motion moment; hover steps on buttons and drawn underlines on links are the only other motion.
- **Don't** use Martian Mono for prose or Shantell for more than one word in a heading.

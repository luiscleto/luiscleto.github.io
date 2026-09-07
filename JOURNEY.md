# Journey proposal

Local review: `npm run dev -- --host 0.0.0.0 --port 4173`, then visit http://localhost:4173/journey/.
The homepage has a simple “Explore my CV” link. Nothing is published by these commands.

## Direction

Nine miniature landscapes connected by a route, using the main site's dark background. Normal scrolling moves a camera between the places. Every chapter entry has a selectable scene exhibit and a corresponding text link. The bottom route jumps to a chapter. Reading view removes the canvas; reduced motion switches scenes without camera travel. Three.js loads separately from the homepage and renders only when needed.

The scenes are compressed illustrations, not maps or depictions of employer offices:

- Porto: Ribeira terraces, Clérigos, a barrel boat on the Douro, and a double-deck iron arch bridge.
- Delft: canal-facing stepped gables, a church tower, trees and bicycles.
- Timor: coastal water, a headland statue, palm trees, inland hills and a small crocodile.
- London: Westminster, clock tower, London Eye and a red bus.
- Dublin: Georgian terraces, coloured doors, a pedestrian arch bridge and striped chimneys.
- Lausanne: terraced old town, cathedral, lake and mountains.
- Warsaw: Old Town facades, modern towers and the stepped Palace of Culture silhouette.

Geometry is authored locally. Reference photographs were consulted for landmark silhouettes; no external photos or generated assets are bundled.

## Content

`src/journey/chapters.json` is the editable content. Professional descriptions, qualifications, technology lists, volunteer descriptions, and role dates were copied from `/mnt/c/Users/luisc/dev/cv/data/cv.json`. Personal headings and notes use Luís's conversation wording, including informal capitalization. The main chapter copy follows the proposal approved by Luís, incorporating his additional context about each move. The Dublin L4 aside uses his latest note. Navigation and short interface labels are editorial. No invented project results or autobiographical anecdotes were added. The full CV file and private contact details were not copied into the site.

- FEUP, volunteering, guitar, and Camino are grouped with the initial Porto chapter. The Camino placement is provisional; no date is asserted.
- The Erasmus-to-Timor transition compresses the return to Porto after Delft. The Porto / Lisbon chapter uses the conversation's location description; the CV lists Feedzai in Porto.
- Lausanne and Warsaw retain the original Taurus employment dates because the data does not date the move. Shared Taurus details do not assign projects to a specific city.
- The earlier NALA role is now in Warsaw, per Luís's correction. Its title remains “Senior Software Engineer” as in the CV, and its full employment dates remain 2022-04 through 2023-06. The chapter describes where the role started, not a claim that the entire role was spent in Poland. NALA's lead role stays in the final Porto chapter.
- Warsaw is labelled simply “Warsaw”; remote work is not treated as a place name.
- The Sopot marriage note has no date.
- Final Porto entries include Mozn, NALA lead, FEUP teaching, ElaronWorks and GitHub. All five appear in the 3D view.
- ElaronWorks opens a detail panel containing its original CV descriptions, including ParliAI and NomiaWeave. The bottom of that panel links only to elaronworks.com.
- GitHub is a direct link for FOSS, with Shepherdr mentioned as supplied by Luís.

## Files and checks

- `src/journey/Journey.tsx`: page, navigation, reading mode and keyboard-accessible dialogs.
- `src/journey/World.tsx`: camera, selection, marker layout, rendering and fallback.
- `src/journey/landscapes.ts`: procedural location geometry.
- `src/journey/journey.css`: responsive dark theme.
- `scripts/static-routes.mjs`: creates `dist/journey/index.html` so GitHub Pages handles direct visits and refreshes.

Build: `npm run build`. Lint: `npm run lint`.
Browser scripts and screenshots live in `/tmp/cleto-journey-review/`, outside the site.

Undergraduate teaching is a separate entry in the initial Porto chapter, with no invented dates. Timor teaching details follow Luís's notes. Python is included in the homepage technologies.

Latest checks: build, lint, desktop/mobile layout, marker spacing, restored ElaronWorks panel and its single website link, keyboard dialogs, reduced motion, WebGL fallback and static route refresh all pass.

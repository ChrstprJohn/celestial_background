# Cosmic pets

Mode: Experience.

User-pinned direction: a dedicated /pets page containing many cosmic pets in collectible-style cards, each with a themed border, name, and description. Approved characters are Nebula, Orbit, and Comet; the initial collection adds Nova, Luna, and Eclipse. Inherit midnight navy, lavender, Instrument Serif headings, DM Sans text, and 14px service-card borders.

First viewport: shared header with only Discoveries; a Cosmic pets card in Discoveries opens the page. Match the other pages using the shared page width and gutters. Include a brief serif introduction, Pause eyes action, and a three-column collection. Two columns at 600–1023px and one below 600px. Art stays inside each card, with captions beneath. No adoption/account/game mechanics requested.

Signature interaction: bodies remain exactly still; separate pupils continuously track the cursor through 360 degrees, including eight compass directions and neutral. Each eye has an elliptical travel limit. Touch and focused-gallery arrow keys also direct gaze. Pause returns neutral, reduced motion initially pauses, and leaving the window or backgrounding resets eyes. No idle animation or persistent eye animation loop.

Assets: local transparent PNGs prepared with built-in ImageGen from approved samples and new matching cosmic concepts. Eye whites are blank in the raster; CSS draws pupils at measured coordinates. Adding pets uses src/lib/pets.js with a local asset and eye anchors. Generation prompts and provenance live in output/mascot-samples/production-generation.json.

Each card has a 42px outlined Download button at the bottom-right. It exports only the pet's default transparent PNG, with centered pupils, at the asset's original resolution.

Context launcher unavailable (engine cache permission). Existing project context and craft floor read directly. User specified the page structure and card presentation, so no concept selection round is needed.

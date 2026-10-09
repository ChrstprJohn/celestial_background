# Mobile layouts

The shared `mobile-workspace` layout in `src/mobile-workspaces.css` keeps visual previews above scrolling controls for Planet builder, Cosmic age, Moon match, Solar System, and Gravity playground. It applies below 768px, or on landscape screens up to 1023px wide and 500px high. Desktop retains the existing two-column layouts.

- Planet stages use viewport height and cap at 220px. Planet names, planetary age, Moon fit, and jump comparison remain in the pinned preview.
- Downloads, expandable PNGs, detailed facts, and explanations remain in the scrolling area.
- Planet zoom/reset buttons are 44px square. Sliders accept horizontal dragging and allow vertical page scrolling with `touch-action: pan-y`.
- Calendars open in page flow, preserving access to all six weeks, month/year selectors, and Done below the preview.
- Moon match no longer scrolls away from the current control when combining phases. Both preview states reserve the same visual space.
- The phone header is 68px tall, and Birthday, Moon phase, and Shuffle use smaller headings.
- The phone location prompt is approximately 203px tall when collapsed. Its disclosure retains the full BigDataCloud and visitor-analytics explanation. Expanded content scrolls within 55dvh/400px; dismiss, reopen, and existing location-sharing behavior are retained.

## Verification

Browser checks used headless Microsoft Edge (Chromium) with emulated viewports and synthesized touch input on Windows. Tested 320×568, 390×844, 844×390, and 1440×900 on all ten enabled pages: Home, Birthday, Moon phase, Cosmic shuffle, Moon match, Cosmic age, Planet builder, Cosmic pets, Solar System, and Gravity playground. All 40 route/viewport combinations had no horizontal overflow or JavaScript page errors. Four additional first-visit location checks passed.

Interaction checks covered pinned previews while scrolling, year selection and calendar Done, switching the cosmic-age planet and downloading a 1080×1350 card, merging Moon phases and downloading their card, switching Solar System to Neptune and opening its story, changing gravity/mass/jump height, and gravity launch/pause/resume/reset. Synthesized touch verified horizontal range dragging and vertical scrolling across the same ranges without changing their values. A 40-character planet name stays within the compact preview.

Source lint, production build, and all 43 existing unit tests pass. The build retains its existing large Three.js chunk warning.

Actual iPhone/Android hardware, Safari, browser keyboard overlays, and native download-to-disk behavior were not tested. NASA network content availability is separate from these layout checks; calendar and export interactions tested here run locally.

Temporary screenshots and browser-check scripts are under ignored `test-results/`.

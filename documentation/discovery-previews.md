# Discovery previews

Three enabled additions extend Explore from five to eight cards: Your cosmic age, Build your planet, and Gravity playground. Constellation studio, Space detective, Your star map, Space station live, Tonight’s sky, and Cosmic neighbors are removed from Explore and their direct routes fall back to the homepage. Their modules remain available to re-enable. Each enabled page inherits the existing midnight/lavender palette, Instrument Serif/DM Sans typography, shared shooting stars, cursor, header, and footer. Cosmic age retains the themed date picker.

## Enabled additions

| Card | Route | Interaction and data |
| --- | --- | --- |
| Your cosmic age | `/cosmic-age` | Select a birthday and one of eight planets. Calculates age and the next orbital birthday using NASA mean orbital periods. January 1, 2000 is a labeled starting example. The eight-planet comparison table is removed; a 1080×1350 collectible PNG shares the selected textured planet, age, birth date, observation date, next birthday, and countdown. Its estimate description remains on-page and in file metadata. |
| Build your planet | `/build-your-planet` | Generate and name a fictional textured world; ocean/rocky/gas terrain, Lagoon/Violet/Ember/Dune palette, rings, clouds, randomize, and reset. Reuses 3D rotate/zoom/keyboard controls and exports a 1080×1350 collectible card. |
| Gravity playground | `/gravity-playground` | Choose mass, Earth jump height, and Earth/Moon/Mars/Mercury/Venus/Pluto. Compare equal launch speed and locally computed height, airtime, force, and Earth-scale equivalent; launch, pause/resume, and reset. Reduced motion shows peaks, and hidden tabs pause animation. |

## Retained disabled modules

These capabilities become accessible only if their registry flags are re-enabled.

| Card | Disabled route | Retained capability |
| --- | --- | --- |
| Constellation studio | `/constellation-studio` | Connect twelve imaginary stars, name the drawing, undo, clear, or generate new stars. The little-kite example explains the interaction. Export a PNG with an inline preview. |
| Space detective | `/space-detective` | Five shuffled astronomy questions with hints, feedback, sources, a score, and replay. Uses an existing astronomy photograph and illustrative planet/Moon models. |
| Your star map | `/star-map` | Choose a city or coordinates, UTC date/time, and title. Computes an overhead sky chart and exports a PNG. |
| Space station live | `/space-station` | Refreshes Where the ISS at? approximately every fifteen seconds. Follow the marker on a 3D Earth, pause/resume updates, refresh, or rotate the globe. |
| Tonight’s sky | `/tonight` | Choose a place/time and inspect Moon/planet altitude, direction, and next rise/set within 48 hours. The time slider moves through the selected UTC day. |
| Cosmic neighbors | `/cosmic-neighbors` | Loads NASA NeoWs close approaches for a selected day, sorted by distance. Shows diameter ranges, speed, distance, and a bus-length comparison. The rock shape is an explicitly labeled illustration. |

## Keep or hide a preview

Set a feature’s `enabled` value to `false` in `src/lib/discoveries.js`. Its Explore card disappears and its route falls back to the homepage. The page modules remain available to re-enable. Pages are lazy loaded; changing a flag does not require deleting the shared astronomy utilities.

Explore retains four columns from 1200px and two at smaller widths, including phones. Enabled tool pages place controls left and results right on desktop, stacking controls above results on phones. The retained disabled Space detective page presents the mystery image before the answer controls on phones.

## Sources and service requirements

Builder and Gravity playground require no API key or external service. World terrain is generated locally with continuous spherical fields, a deterministic seed, and bundled palettes; cloudy/ringed appearances use the already bundled Solar System Scope textures. Each world is explicitly fictional. Names and settings remain in page state, without saving to an account. Gravity constants (m/s²) come from the [NASA Planetary Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/): Earth 9.8, Moon 1.6, Mars/Mercury 3.7, Venus 8.9, Pluto 0.7. The comparison ignores drag and uses constant gravity with equal takeoff speed. Changing mass affects force but not the jump height. Pluto is labeled a dwarf planet; gas giants are omitted.

Builder starts with Asteria, Oceans, Lagoon, rings, clouds, and seed 7. Names accept up to 40 characters; Surprise me randomizes appearance and the seed, while Start over restores the default world and name. The shared viewer supports drag/touch rotation, scroll/pinch zoom, visible zoom/reset buttons, arrow-key rotation, +/− zoom, and R reset, with loading, retry, and WebGL-unavailable feedback. Gravity starts with Moon, 70kg mass, and a 40cm Earth jump. Mass accepts 1–300kg; Earth jump height ranges from 10–100cm in 5cm steps. Invalid mass exposes an error and disables launch. Changing the world or jump height resets the animation; hiding the tab pauses it. Reduced motion uses Show jump heights instead of animation.

Cosmic age runs locally without an API key, using NASA mean orbital periods and a midnight UTC birthday. The countdown is approximate and planet sizes are illustrative. Its sources and estimate explanation remain on-page; the comparison grid stays removed.

Collectible exports have a lavender double border and star-corner ornaments. Cosmic age's separate Celestial branding, estimate, and texture-credit footer lines are absent from the artwork. Texture source/license and estimate descriptions are stored in PNG tEXt metadata, with valid chunk checksums, and source links remain on the page. Builder uses the same border and file metadata pattern, with its name, terrain/ring/cloud caption, and fictional-world description visible in the artwork.

Cosmic age and Builder render 1080×1350 PNGs in the incumbent fonts and palette from a fresh capture of the displayed model, including its current rings/clouds. Transparent margins are removed using actual alpha bounds; the complete model fits without stretching or clipping. Cosmic-age capture works even after the model scrolls outside the viewport. Exports wait until the selected model is ready; changing Cosmic age's birthday/planet or Builder's name/appearance clears the previous link and preview. The Download action attempts a file save and reveals a Download PNG link plus inline Preview PNG disclosure, with failure feedback and object-URL cleanup. Valid inline PNG rendering and metadata are verified; the in-app browser's automated download event remains unavailable, so saving to disk still needs a normal-browser check.

### Retained disabled data and exports

The following source requirements describe preserved modules, not enabled routes or active network activity.

Cosmic age, the studio, and the quiz need no new API key. Star map and Tonight’s sky calculate locally with the already installed Astronomy Engine. Their bundled catalog contains 5,044 stars and 89 constellation line features from d3-celestial; origin URLs, SHA-256 hashes, and the BSD license are in `public/data/`. Star coordinates are approximate J2000 catalog positions; proper motion, atmospheric/weather conditions, building obstructions, and light pollution are not modeled. Charts show stars during daylight for orientation and label that condition. North is up and east is left, as in an overhead sky chart.

Sky controls start at Singapore and 12:00 UTC on the current UTC date. Both tools offer 33 city presets grouped by Philippines, Asia & Pacific, Europe, Americas, and Africa, plus custom coordinates. Philippine choices are Manila, Quezon City, Cebu City, Davao, Baguio, Iloilo, Bacolod, Cagayan de Oro, Puerto Princesa, and Zamboanga. Locations represent city centers. The 26 added presets were verified through [Open-Meteo geocoding](https://open-meteo.com/en/docs/geocoding-api), using [GeoNames](https://www.geonames.org/) data (CC BY 4.0), and bundled with coordinates, timezone, source URL, and GeoNames ID in `src/lib/location-presets.js`. `scripts/build-location-presets.ps1` regenerates them; no runtime geocoding request or additional API key is needed. Dates range from 1900 through 2100; custom coordinates require latitude from −90 to 90 and longitude from −180 to 180. Inputs are UTC; preset-city captions and rise/set times use that city's timezone, while custom-coordinate results use UTC. Tonight’s sky's slider advances in fifteen-minute steps.

The ISS feed is `https://api.wheretheiss.at/v1/satellites/25544`, without authentication. The next poll is scheduled fifteen seconds after a request completes. Polling pauses when the document is hidden or the user pauses updates. Failures retain the last position with an error and timestamp. The trail records positions received during the current viewing session; it is not a forecast orbit. Earth’s texture is fixed, with no claim of live day/night lighting. Turning off Follow station enables drag and left/right arrow rotation.

Cosmic neighbors uses `https://api.nasa.gov/neo/rest/v1/feed` and `VITE_NASA_API_KEY`, falling back to `DEMO_KEY`. The demo key is useful for previews and has shared service limits. Failed requests have retry feedback and retain the last successful result, labeled with its date. Successful dates are cached in memory for the current page session. The visual is labeled “Illustrative asteroid”; it is not a photograph, measured shape, or size model. The size comparison uses the midpoint of NASA's estimated diameter range and a 12-metre bus. Near-Earth status does not imply an imminent impact. NASA JPL links provide the original object records.

Studio and sky-chart captions render as readable HTML outside the SVG in the incumbent fonts. The map adjusts SVG text to maintain 12px rendered celestial-body labels and 14px cardinal labels at each display width. Exported art retains the full caption inside the SVG.

The retained disabled Star map exports 1400×1600 PNGs and Studio exports 1200×1360 PNGs by rasterizing their SVGs at twice their logical dimensions. Both retain HTML captions on-page and full SVG captions in exported artwork. Their earlier inline preview checks are historical; neither export is currently accessible through an enabled discovery route.

Locations, birthdays, drawings, quiz scores, and chart titles stay in page state and are not sent to these data providers or persisted by these features. The existing application’s configured analytics behavior is unchanged.

## Validation

Current playground pass, October 3, 2026: all 35 tests, source ESLint (`npx eslint src`), and the production build pass. Browser checks cover the eight-card Explore inventory, removed routes falling back to the homepage, Builder terrain/palette/rings/clouds/name/randomize/reset and collectible export, Gravity inputs/launch/pause/resume/reset, and the clean Cosmic-age collectible. Responsive review covers 1440px, 390px, and the 567px in-app viewport. PNG previews decode at 1080×1350 with the selected model, complete border, no separate branding/credit/estimate footer, and retained metadata. In-app automated file-download events remain unavailable; the valid previews do not establish that a file was saved to disk.

Current screenshots are local ignored artifacts: `.impeccable/review/builder-{desktop,mobile,user-567}.jpg`, `gravity-{desktop,mobile,user-567}.jpg`, `age-collectible-{desktop,mobile,card}.jpg`, and `playgrounds-explore-{desktop,mobile}.jpg`.

### Historical validation

These earlier passes document prior feature states and do not describe the current enabled inventory.

Historical planet export refinement: all 32 tests, source ESLint, and the production build passed. Browser previews showed Jupiter, Saturn with complete rings, and Earth with its cloud layer in 1080×1350 PNGs. Desktop and phone captures matched the selected age and planet; phone export worked with the model outside the viewport. No horizontal overflow or new console errors were recorded. Alpha-bound tests covered faint ring edges and completely blank captures. Screenshot: `.impeccable/review/cosmic-age-with-planet.jpg`.

Historical refinement on October 3, 2026: all 31 tests, source ESLint, and the production build passed. That inventory had eight Explore cards (four desktop columns, two phone columns), four disabled routes falling back to the homepage, and no horizontal overflow in the three then-enabled extra tools at 1440px, 390px, and the 567px in-app viewport. Manila updated Star map’s caption/chart with GMT+8; Cebu City updated Tonight’s sky and local rise/set results. The cosmic-age comparison grid was absent. Its Mars PNG decoded at 1080×1350 and visually matched the selected age and next birthday; changing the world cleared the previous PNG link. The browser’s file-download event timed out after 12 seconds despite a valid inline image and download link. No new console errors were recorded.

Historical initial seven-preview pass: `npm test`, `npx eslint src`, and `npm run build` passed. Browser checks exercised planet selection, drawing/undo/example, both PNG previews, map city and invalid coordinates, a complete quiz and replay, live ISS pause/follow controls, and live asteroid selection. All seven then-enabled pages and Explore were checked at 1440px, 390px, and the 567px in-app viewport without horizontal overflow. Phone card grids remained two columns.

Production hosting must serve `index.html` for all routes above, including direct visits and refreshes. Existing large-bundle build advisories and lint errors in vendored `brag-output/composition/assets/gsap.min.js` are outside this feature change.

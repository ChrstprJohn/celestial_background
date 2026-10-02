# Celestial: tech stack

Celestial offers four discoveries from a responsive landing page: Birthday sky retrieves NASA's Astronomy Picture of the Day for a date, Moon on your day calculates a lunar phase visualization locally, Cosmic shuffle explores random usable NASA archive photographs, and Solar System showcases eight interactive 3D planets.

| Technology | Responsibility |
| --- | --- |
| Vite | Development server and production bundling |
| React (JavaScript) | Landing page, discovery routes, form state, loading/error states, and results; lazy-loaded Moon, Shuffle, and Solar System pages |
| Tailwind CSS | Vite plugin, utility classes, and shared theme tokens |
| Axios | NASA requests, timeout handling, and request cancellation |
| GSAP | Coordinated hero reveal and result entrance; respects reduced motion |
| Vite `.env` support | API endpoint and optional developer key configuration |
| Lucide React | Consistent SVG icons |
| Fontsource | Locally bundled DM Sans and Instrument Serif fonts |
| Astronomy Engine 2.1.19 | Local lunar phase angle and illuminated fraction at noon UTC |
| Canvas 2D + bundled lunar surface map | Textured Moon projection and sunlight shading; map from three.js r150 examples |
| Three.js + OrbitControls | Lazy-loaded WebGL planet showcase with local textures, rotation/zoom, and Saturn rings/shadows |
| ESLint + Node test runner | Code checks and integration-related utility tests |

## API

Use NASA Science's current APOD WordPress route:

```text
GET https://science.nasa.gov/wp-json/wp/v2/apod-basic/YYMMDD
Example: /240101 → January 1, 2024
```

The route was checked against live NASA responses on October 2, 2026. It returns a record with `date`, `title`, `explanation`, `media_type`, `hdurl`, `permalink`, and credits. The root collection with `?date=` did not filter to the requested date during verification. Always use the date route and verify the returned date. NASA's older `api.nasa.gov/planetary/apod` returned a generic NASA logo in that check; it is deliberately not used as a fallback.

- `hdurl` is used for images because `url` can point to an article.
- Rich HTML explanations and credits are converted to text, never injected as HTML.
- Supported YouTube and Vimeo URLs are embedded; other videos link to NASA.
- Some migrated archival records may contain missing or placeholder media. The original NASA article remains available from each result.
- The archive begins June 16, 1995. Earlier birthdays require selecting a later year.
- Today's maximum date follows NASA's Eastern timezone.
- Birthday initializes its date from `nasaToday()` and automatically requests that date's APOD with visible loading/status feedback. The initial result does not move focus or scroll; successful manual submissions focus the result and scroll to it on mobile, respecting reduced motion.
- Results are cached in memory for the current page session; birthdays are not persisted by the app. A lookup sends the selected date to NASA.

Reference: [NASA Open APIs](https://api.nasa.gov/) and [NASA APOD](https://science.nasa.gov/apod/).

The shared `--page-width` is 1440px and `--page-gutter` is clamp(24px, 5vw, 76px), with a 24px gutter below 768px. Header, Discoveries, all discovery workspaces, and footer use these tokens to align their outer content edges. Birthday, Moon, and Shuffle desktop workspaces retain .9fr 1.1fr columns with a 40–100px fluid gap and align-items: start, keeping discovery titles anchored at the upper left independently of result height; results align right and cap at 640px. Mobile stacks controls above results. The Discoveries grid uses four columns from 1200px, two from 600–1199px, and one below 600px.

## Moon calculation and rendering

`/moon` starts with the visitor's local current date. The native date field and validation helper accept January 1, 1900 through December 31, 2100, including leap-day validation. Astronomy Engine's `MoonPhase` determines the phase name and waxing/waning state; `Illumination(Body.Moon, time).phase_fraction` supplies the illuminated percentage. Both use 12:00 UTC on the selected date.

Canvas 2D projects the locally bundled `/textures/moon-surface.jpg` onto a sphere and redraws sunlight when the date changes. The result is a simplified north-up phase visualization, not a date-specific photograph or an observer/location-specific view. The texture is loaded locally, cached in memory, and can be retried after failure; projection geometry is reused. The decorative homepage crescent uses the same renderer. The Moon page is route-lazy-loaded so its Astronomy Engine calculations load when `/moon` opens.

No API key or external request is needed for Moon calculations or rendering, and selected dates are not persisted. Date errors use accessible field descriptions and alerts. The result has a descriptive canvas label and a polite live caption; submission focuses the result and scrolls to it on mobile, respecting reduced motion. Source links identify [Astronomy Engine](https://github.com/cosinekitty/astronomy) and the [three.js r150 surface map](https://github.com/mrdoob/three.js/blob/r150/examples/textures/planets/moon_1024.jpg). Retrieval, upstream source, and license link are recorded in `public/textures/moon-surface.source.json`.

## Cosmic shuffle

The lazy-loaded `/shuffle` page uses the shared Birthday/Moon workspace: left heading and Surprise me controls, right image/caption/attribution, stacked on mobile. Its initial record in `src/lib/featured.js` is the verified January 1, 2024 NGC 1232 APOD photograph, so a discovery appears before any shuffle request.

`nextDiscovery` samples dates from the APOD archive start (June 16, 1995) through `nasaToday()` in NASA's Eastern timezone. It reuses `fetchApod` and the API configuration above. HTTP 404 and invalid/missing date records share the `APOD_NOT_FOUND` code, allowing Shuffle to skip them without altering Birthday's error message. It also skips videos, missing image URLs, known NASA-logo/news-thumbnail placeholders, images already seen, and previews that fail or time out.

Each click tries at most eight candidates. The candidate image preloads with a 12-second timeout before replacing the visible result. Network, authorization, and rate-limit errors stop immediately; the current photo remains visible with a recoverable error beside the action. Requests are cancellable, including on unmount. A failed visible preview provides an original-image link.

Attempted dates and successful image identities are held in memory for the page session. Image identity is URL origin plus pathname, ignoring query parameters, so resized URLs for the same image do not create repeats. No favorites or history are persisted. Loading has a status announcement and disabled action; successful date/title changes use a polite live caption. Source and credit stay outside the unframed, uncropped image.

## Solar System showcase

The shared `.site-shell` uses `overflow-x: clip` to prevent oversized canvases from creating horizontal scrolling.

`/solar-system` lazily loads `SolarSystemPage.jsx` and `PlanetScene.jsx`. Eight entries in `src/lib/planets.js` provide names, short descriptions, stories, equatorial diameter, sidereal rotation, and orbital periods. NASA NSSDCA supplies diameter and rotation data; NASA Science planet facts supply rounded orbit lengths. Rotation is labeled separately from a sunrise-to-sunrise day.

Three.js uses textured sphere meshes with fixed directional and ambient lighting, plus Saturn’s double-sided textured ring geometry and Earth’s static cloud layer. OrbitControls supports pointer and touch orbit/zoom; buttons and canvas keyboard controls offer equivalent access. Rendering is requested only for loading, camera changes, resize, and visibility changes. On cleanup, controls, observers, frames, geometries, textures, materials, shadow maps, and the WebGL context are disposed.

Planet selection uses `?planet=` and browser history; unknown selections fall back to Saturn. The showcase inherits the shared header/footer, 1440px page width, gutters, and discovery columns. Wrapping planet pills sit with the introduction, facts, About, and sources on the left; the model fills the remaining right column. Desktop columns are clamp(280px, 36%, 460px) and the remaining width, separated by a 32–72px fluid gap. Desktop stage height is viewport-sensitive clamp(440px, calc(100svh - 220px), 700px). Facts use two compact columns on desktop and mobile, with 12px labels and 25px values on desktop and mobile. Below 768px, title, subtitle, description, wrapping planet pills, model, then facts form the page order; stage height is clamp(280px, 85vw, 390px). A native About disclosure follows the facts on desktop and mobile; sources accompany the facts, with no separate full-width story section or duplicate previous/next navigation. The transparent canvas matches the stage dimensions and stays centered, without view offsets or translation.

The fitted default camera distance is also the maximum distance. The minimum distance is calculated as `sqrt(globeRadius² + (defaultDistance² - globeRadius²) / 1.2²)`, limiting the full subject to 1.2 times its default projected size. The radius is 2.32 for Saturn's outer rings, 1.008 for Earth's cloud layer, and 1 for other planets. OrbitControls, buttons, and keyboard zoom share these bounds. Reset restores the default fitted view. Zoom buttons disable at the camera bounds. Buttons and keyboard zoom step through 1×, 1.1×, and 1.2×. Zoom-in disables after two actions; zoom-out steps back and reset restores 1×; scroll and pinch remain continuous within the same bounds. The default camera fits the complete subject using the smaller horizontal/vertical viewing angle and a 1.25 distance multiplier, leaving room for every rotation and the 20% maximum zoom. Zoom and rotation never move controls, facts, or page layout. Loading/retry and unsupported-WebGL messages retain accessible stories and facts. The homepage’s decorative Saturn is intersection-lazy-loaded and noninteractive.

Planet maps are bundled under `public/textures/planets/`, by Solar System Scope under CC BY 4.0; `public/textures/planets.source.json` records original and mirror URLs plus SHA-256 hashes. Runtime rendering has no remote texture requests. Lighting, size fitting, and cloud patterns are illustrative; rings other than Saturn’s are omitted.

## Environment configuration

`.env` is local and ignored by Git. `.env.example` is the committed configuration template.

```dotenv
VITE_NASA_API_URL=https://science.nasa.gov/wp-json/wp/v2/apod-basic
VITE_NASA_API_KEY=DEMO_KEY
```

The new date route currently accepts requests without a key. The optional key remains configurable for NASA gateways that require one. Vite exposes every `VITE_` variable in browser code: these are public configuration, not a secret store. Restart the dev server after changing `.env`.

## Production direction

The current app is a static frontend with no database or accounts. Before using a private API key, introduce a serverless endpoint with a server-only environment variable, response caching, and request limits. No backend or deployment service is configured in this setup.

Production hosting must serve `index.html` for `/birthday`, `/moon`, `/shuffle`, and `/solar-system` so direct links and refreshes reach the application.

## Commands

Requires a supported Node LTS version, minimum Node 22.12.

```sh
npm install
npm run dev
npm run lint
npm test
npm run build
npm run preview
```

Run servers in the foreground and stop them with Ctrl+C when finished.

## Project structure

```text
documentation/tech-stack.md  Stack, API contract, configuration, and next steps
src/App.jsx                 Landing page and discovery flow
src/MoonPage.jsx            Lazy-loaded date controls and lunar result
src/MoonVisual.jsx          Shared Moon canvas, loading feedback, and retry
src/ShufflePage.jsx         Lazy-loaded image shuffle, loading, and recovery
src/SolarSystemPage.jsx     Planet controls, selection history, facts, and stories
src/PlanetScene.jsx         Interactive WebGL meshes and camera, loading, and cleanup
src/solar-system.css        Planet showcase extension of shared discovery styles
src/lib/planets.js          Planet content, source links, and texture paths
src/index.css               Visual tokens and responsive styles
src/lib/apod.js             Axios client, normalization, cache, and errors
src/lib/apod-data.js        Response validation and safe media URLs
src/lib/dates.js            Archive bounds, NASA timezone, and date routes
src/lib/apod.test.js        Critical date and media tests
src/lib/moon.js             Moon date bounds, validation, phase, and illumination
src/lib/moon-render.js      Texture loading, sphere projection, and phase shading
src/lib/moon.test.js        Date, known-phase, and rendering tests
src/lib/featured.js         Verified initial Shuffle record and discovery imagery
src/lib/shuffle.js          Random dates, repeat prevention, filtering, and preload
src/lib/shuffle.test.js     Archive bounds, filtering, retry limits, and cancellation
public/textures/moon-surface.jpg         Locally bundled lunar map
public/textures/moon-surface.source.json Texture provenance and upstream license link
public/favicon.svg          Celestial orbit mark
.env.example                Public configuration template
```

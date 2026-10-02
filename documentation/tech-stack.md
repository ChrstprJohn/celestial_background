# Celestial: tech stack

Celestial offers two discoveries from a responsive landing page: Birthday sky retrieves NASA's Astronomy Picture of the Day for a date, and Moon on your day calculates a lunar phase visualization locally.

| Technology | Responsibility |
| --- | --- |
| Vite | Development server and production bundling |
| React (JavaScript) | Landing page, discovery routes, form state, loading/error states, and results; lazy-loaded Moon page |
| Tailwind CSS | Vite plugin, utility classes, and shared theme tokens |
| Axios | NASA requests, timeout handling, and request cancellation |
| GSAP | Coordinated hero reveal and result entrance; respects reduced motion |
| Vite `.env` support | API endpoint and optional developer key configuration |
| Lucide React | Consistent SVG icons |
| Fontsource | Locally bundled DM Sans and Instrument Serif fonts |
| Astronomy Engine 2.1.19 | Local lunar phase angle and illuminated fraction at noon UTC |
| Canvas 2D + bundled lunar surface map | Textured Moon projection and sunlight shading; map from three.js r150 examples |
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
- Results are cached in memory for the current page session; birthdays are not persisted by the app. A lookup sends the selected date to NASA.

Reference: [NASA Open APIs](https://api.nasa.gov/) and [NASA APOD](https://science.nasa.gov/apod/).

## Moon calculation and rendering

`/moon` starts with the visitor's local current date. The native date field and validation helper accept January 1, 1900 through December 31, 2100, including leap-day validation. Astronomy Engine's `MoonPhase` determines the phase name and waxing/waning state; `Illumination(Body.Moon, time).phase_fraction` supplies the illuminated percentage. Both use 12:00 UTC on the selected date.

Canvas 2D projects the locally bundled `/textures/moon-surface.jpg` onto a sphere and redraws sunlight when the date changes. The result is a simplified north-up phase visualization, not a date-specific photograph or an observer/location-specific view. The texture is loaded locally, cached in memory, and can be retried after failure; projection geometry is reused. The decorative homepage crescent uses the same renderer. The Moon page is route-lazy-loaded so its Astronomy Engine calculations load when `/moon` opens.

No API key or external request is needed for Moon calculations or rendering, and selected dates are not persisted. Date errors use accessible field descriptions and alerts. The result has a descriptive canvas label and a polite live caption; submission focuses the result and scrolls to it on mobile, respecting reduced motion. Source links identify [Astronomy Engine](https://github.com/cosinekitty/astronomy) and the [three.js r150 surface map](https://github.com/mrdoob/three.js/blob/r150/examples/textures/planets/moon_1024.jpg). Retrieval, upstream source, and license link are recorded in `public/textures/moon-surface.source.json`.

## Environment configuration

`.env` is local and ignored by Git. `.env.example` is the committed configuration template.

```dotenv
VITE_NASA_API_URL=https://science.nasa.gov/wp-json/wp/v2/apod-basic
VITE_NASA_API_KEY=DEMO_KEY
```

The new date route currently accepts requests without a key. The optional key remains configurable for NASA gateways that require one. Vite exposes every `VITE_` variable in browser code: these are public configuration, not a secret store. Restart the dev server after changing `.env`.

## Production direction

The current app is a static frontend with no database or accounts. Before using a private API key, introduce a serverless endpoint with a server-only environment variable, response caching, and request limits. No backend or deployment service is configured in this setup.

Production hosting must serve `index.html` for `/birthday` and `/moon` so direct links and refreshes reach the application.

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
src/index.css               Visual tokens and responsive styles
src/lib/apod.js             Axios client, normalization, cache, and errors
src/lib/apod-data.js        Response validation and safe media URLs
src/lib/dates.js            Archive bounds, NASA timezone, and date routes
src/lib/apod.test.js        Critical date and media tests
src/lib/moon.js             Moon date bounds, validation, phase, and illumination
src/lib/moon-render.js      Texture loading, sphere projection, and phase shading
src/lib/moon.test.js        Date, known-phase, and rendering tests
public/textures/moon-surface.jpg         Locally bundled lunar map
public/textures/moon-surface.source.json Texture provenance and upstream license link
public/favicon.svg          Celestial orbit mark
.env.example                Public configuration template
```

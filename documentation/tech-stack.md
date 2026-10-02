# Celestial: tech stack

Celestial lets visitors choose a birthday and discover the Astronomy Picture of the Day NASA featured on that exact date. The first release is a responsive landing page with a working date lookup.

| Technology | Responsibility |
| --- | --- |
| Vite | Development server and production bundling |
| React (JavaScript) | Landing page, form state, loading/error states, and APOD results |
| Tailwind CSS | Vite plugin, utility classes, and shared theme tokens |
| Axios | NASA requests, timeout handling, and request cancellation |
| GSAP | Coordinated hero reveal and result entrance; respects reduced motion |
| Vite `.env` support | API endpoint and optional developer key configuration |
| Lucide React | Consistent SVG icons |
| Fontsource | Locally bundled DM Sans and Instrument Serif fonts |
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

## Environment configuration

`.env` is local and ignored by Git. `.env.example` is the committed configuration template.

```dotenv
VITE_NASA_API_URL=https://science.nasa.gov/wp-json/wp/v2/apod-basic
VITE_NASA_API_KEY=DEMO_KEY
```

The new date route currently accepts requests without a key. The optional key remains configurable for NASA gateways that require one. Vite exposes every `VITE_` variable in browser code: these are public configuration, not a secret store. Restart the dev server after changing `.env`.

## Production direction

The current app is a static frontend with no database or accounts. Before using a private API key, introduce a serverless endpoint with a server-only environment variable, response caching, and request limits. No backend or deployment service is configured in this setup.

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
src/index.css               Visual tokens and responsive styles
src/lib/apod.js             Axios client, normalization, cache, and errors
src/lib/apod-data.js        Response validation and safe media URLs
src/lib/dates.js            Archive bounds, NASA timezone, and date routes
src/lib/apod.test.js        Critical date and media tests
public/favicon.svg          Celestial orbit mark
.env.example                Public configuration template
```

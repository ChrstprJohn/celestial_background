# Celestial

Discover NASA's Astronomy Picture of the Day from your birthday, the Moon's phase on a day that matters, a surprise from NASA's image archive, or the eight planets in 3D.

Built with Vite, React, Tailwind CSS, Axios, GSAP, Astronomy Engine, and Three.js. The galaxy-themed homepage contains a hero, an Explore CTA that scrolls to Discoveries, and a footer. Birthday sky opens `/birthday`, with a date form on the left and the original NASA image on the right (stacked on mobile). Moon on your day opens `/moon`, with date controls and a textured phase visualization. Cosmic shuffle opens `/shuffle`, with a Surprise me action on the left and an archive photograph on the right. Add future service cards to the `services` list in `src/App.jsx` and provide their dedicated pages.

Solar System opens `/solar-system` with an interactive 3D planet showcase. Desktop introduction, wrapping planet pills, facts, About, and sources sit left; the larger model fills the remaining right column. On mobile, title, subtitle, and description lead into wrapping planet pills, the model, then facts. Choose any of the eight planets, drag to rotate, scroll or pinch to zoom, and use the zoom/reset controls. When the viewer is focused, arrow keys rotate, +/− zoom, and R resets. Zoom ranges from the default fitted view to 1.2 times the full subject's default projected size, including Saturn's rings; all inputs use the same bounds. Buttons and keyboard zoom step through 1×, 1.1×, and 1.2×. Zoom-in disables after two actions; zoom-out steps back and reset restores 1×; scroll and pinch remain continuous within the same bounds. The transparent canvas matches the model stage and stays centered. Camera fitting includes every rotation and the gentle 20% maximum zoom, preserving the full subject. Controls and facts stay fixed during zoom and rotation. Each world has NASA facts and a native About disclosure for its short story, placed after the facts on desktop and mobile. Facts use two compact columns on desktop and mobile, with 12px labels and 25px values on desktop and mobile; sources accompany the facts. Saturn includes rings and shadows; Earth has a fixed cloud layer. Deep links such as `/solar-system?planet=mars` and browser back/forward preserve selections. Models use illustrative lighting and are fitted individually, not to a shared scale. Loading errors offer retry; facts remain readable without WebGL.

Header, Discoveries, all four discovery workspaces, and footer share a maximum 1440px width and clamp(24px, 5vw, 76px) horizontal gutters, with 24px gutters below 768px. Desktop columns align at the top so titles stay anchored at the upper left regardless of result height. Birthday, Moon, and Shuffle results align with the outer right content edge and cap at 640px; Solar System uses the remaining right-column width. Controls sit left. Mobile stacks controls above results. The Solar System model stage uses viewport-sensitive clamp(440px, calc(100svh - 220px), 700px) height on desktop and a 280–390px fit on mobile.

The 3D page and Three.js renderer load lazily; the homepage’s decorative Saturn loads when its card approaches the viewport. Planet texture files are bundled locally, with no runtime external requests or API key. Textures by [Solar System Scope](https://www.solarsystemscope.com/textures/) are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), and provenance plus SHA-256 hashes are recorded in `public/textures/planets.source.json`.

Production hosting should serve `index.html` for application routes such as `/birthday`, `/moon`, `/shuffle`, and `/solar-system` so direct links and refreshes work. Vite handles this locally.

Birthday starts with today's date in NASA's Eastern timezone and automatically loads its published APOD, showing loading feedback while it arrives. Initial loading preserves focus and scroll; successful manual birthday lookups focus the result and scroll to it on mobile. Discoveries display four cards per row from 1200px, two at 600–1199px, and one below 600px.

Birthday image results can be downloaded at the source resolution and format. The app fetches the original image bytes and saves them without cropping, decoration, added text, or re-encoding. Video entries display their original media instead. If an image host prevents download, the page provides a retry button and a link to open and save the original.

Moon starts with today's local date and accepts dates from January 1, 1900 through December 31, 2100. Astronomy Engine 2.1.19 calculates the phase and illumination at 12:00 UTC. Canvas 2D lights a locally bundled surface map from the three.js r150 examples. The result is a simplified north-up visualization, not a photograph from that date. The Moon page is lazy-loaded; its calculation and rendering require no API key or external request, and chosen dates are not persisted. Date validation, result announcements, and surface-load retry support keyboard and screen-reader use.

Cosmic shuffle starts with the verified January 1, 2024 NGC 1232 photograph. Surprise me selects random dates from NASA's archive (June 16, 1995 through today in NASA's Eastern timezone), tries at most eight candidates, and skips videos, known placeholders, missing entries, failed previews, and repeat photos. Date and image-URL identity sets prevent repeats for the current page session. The next image preloads before replacing the current one; request errors keep the current discovery visible so you can retry. The page is lazy-loaded and uses the existing APOD client. It preserves the shared left-controls/right-result layout, stacking on mobile, and does not persist favorites or history.


## Cosmic pets

Cosmic pets opens `/pets` from its card in Discoveries. Six generated space companions live in themed cards with names and descriptions. Their bodies remain fixed while pupils smoothly track the cursor through all directions. Touch the page or focus the gallery and use the arrow keys; Escape/Home resets gaze. Pause eyes returns them to neutral, and reduced motion initially pauses tracking. The page and its local character assets load separately from the astronomy tools. Add future pets in `src/lib/pets.js` using a transparent character image with blank eye whites plus measured eye anchors. Hosting must serve `index.html` for `/pets`, including direct links and refreshes.

## Start locally

Use Node 22.12+ (a supported LTS release is recommended).

```sh
npm install
```

Copy `.env.example` to `.env` if a local `.env` does not exist, then:

```sh
npm run dev
```

Open the localhost URL shown by Vite. Stop the foreground server with Ctrl+C.

PostHog analytics is enabled when `VITE_POSTHOG_TOKEN` is set in `.env.local` or your hosting build environment. Set `VITE_POSTHOG_HOST` to your project's ingestion host (US: `https://us.i.posthog.com`). Use a public project token, never a personal or secret API key. Pageviews include SPA navigation, and all events include `site_name: celestial`. Filter the Celestial dashboard by that event property when sharing a PostHog project with other websites. Session recording is disabled. Local visits also send analytics when the token is configured; remove the token to disable tracking. Set both variables on your host and rebuild to enable analytics on the deployed website.

```sh
npm run lint
npm test
npm run build
```

See [documentation/tech-stack.md](documentation/tech-stack.md) for API details and environment configuration. Frontend `VITE_` variables are public; use a backend proxy before introducing private credentials.

Birthday and Shuffle imagery and content are sourced from NASA APOD. The featured NGC 1232 image is credited to FORS / VLT / ESO. Moon calculations use [Astronomy Engine](https://github.com/cosinekitty/astronomy); its surface map comes from the [three.js r150 examples](https://github.com/mrdoob/three.js/blob/r150/examples/textures/planets/moon_1024.jpg), with provenance recorded in [public/textures/moon-surface.source.json](public/textures/moon-surface.source.json). This is an independent project, unaffiliated with NASA. Individual image rights and credits apply.

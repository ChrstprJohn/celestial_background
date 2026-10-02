# Celestial

Discover NASA's Astronomy Picture of the Day from your birthday, or the Moon's phase on a day that matters.

Built with Vite, React, Tailwind CSS, Axios, GSAP, and Astronomy Engine. The galaxy-themed homepage contains a hero, an Explore CTA that scrolls to Discoveries, and a footer. Birthday sky opens `/birthday`, with a date form on the left and the original NASA image on the right (stacked on mobile). Moon on your day opens `/moon`, with date controls and a textured phase visualization. Add future service cards to the `services` list in `src/App.jsx` and provide their dedicated pages.

Production hosting should serve `index.html` for application routes such as `/birthday` and `/moon` so direct links and refreshes work. Vite handles this locally.

Image results can be downloaded at the source resolution and format. The app fetches the original image bytes and saves them without cropping, decoration, added text, or re-encoding. Video entries display their original media instead. If an image host prevents download, the page provides a retry button and a link to open and save the original.

Moon starts with today's local date and accepts dates from January 1, 1900 through December 31, 2100. Astronomy Engine 2.1.19 calculates the phase and illumination at 12:00 UTC. Canvas 2D lights a locally bundled surface map from the three.js r150 examples. The result is a simplified north-up visualization, not a photograph from that date. The Moon page is lazy-loaded; its calculation and rendering require no API key or external request, and chosen dates are not persisted. Date validation, result announcements, and surface-load retry support keyboard and screen-reader use.


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

```sh
npm run lint
npm test
npm run build
```

See [documentation/tech-stack.md](documentation/tech-stack.md) for API details and environment configuration. Frontend `VITE_` variables are public; use a backend proxy before introducing private credentials.

Birthday imagery and content are sourced from NASA APOD. The featured NGC 1232 image is credited to FORS / VLT / ESO. Moon calculations use [Astronomy Engine](https://github.com/cosinekitty/astronomy); its surface map comes from the [three.js r150 examples](https://github.com/mrdoob/three.js/blob/r150/examples/textures/planets/moon_1024.jpg), with provenance recorded in [public/textures/moon-surface.source.json](public/textures/moon-surface.source.json). This is an independent project, unaffiliated with NASA. Individual image rights and credits apply.

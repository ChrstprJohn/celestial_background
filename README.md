# Celestial

Discover NASA's Astronomy Picture of the Day from your birthday.

Built with Vite, React, Tailwind CSS, Axios, and GSAP. The galaxy-themed homepage contains a hero, an Explore CTA that scrolls to a service section, and a footer. The birthday card opens `/birthday`, with a date form on the left and the original NASA image on the right (stacked on mobile). Add future service cards to the `services` list in `src/App.jsx` and provide their dedicated pages.

Production hosting should serve `index.html` for application routes such as `/birthday` so direct links and refreshes work. Vite handles this locally.

Image results can be downloaded at the source resolution and format. The app fetches the original image bytes and saves them without cropping, decoration, added text, or re-encoding. Video entries display their original media instead. If an image host prevents download, the page provides a retry button and a link to open and save the original.


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

Imagery and astronomy content are sourced from NASA APOD. The featured NGC 1232 image is credited to FORS / VLT / ESO. This is an independent project, unaffiliated with NASA. Individual image rights and credits apply.

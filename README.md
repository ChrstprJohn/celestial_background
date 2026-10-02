# Celestial

Discover NASA's Astronomy Picture of the Day from your birthday.

Built with Vite, React, Tailwind CSS, Axios, and GSAP. Includes a responsive landing page, accessible date form, real NASA integration, image/video results, and loading/error states.

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

# Celestial video mockup

22-second, 1920 × 1080, 30 fps showcase of the existing Celestial website on laptop, tablet, and phone. Created locally with the requested [Brag skill](https://github.com/latent-spaces/brag) and Hyperframes 0.8.112.

## Delivery

- `brag.mp4`: full-quality H.264 MP4 with original ambient music and three quiet UI sound effects.
- `celestial-showcase-muted.mp4`: same picture, no audio stream, for muted website playback.
- `brag.jpg`: selected complete-device ensemble poster, also baked into frame zero of both videos.
- `preview.html`: open locally to play the film with sound or choose the muted export.
- `embed.html`: copyable video element for later page insertion.
- `composition/index.html`: editable, deterministic Hyperframes composition; all required visual and audio assets are local.
- `brag-plan.md` and `composition-brief.md`: storyboard and creative direction.
- `share-copy.txt`: short post caption.

To embed later, put `celestial-showcase-muted.mp4` and `brag.jpg` into the site's `public/videos/` directory, rename `brag.jpg` to `celestial-poster.jpg`, and use the markup in `embed.html`. For React use `autoPlay` and `playsInline`. Keep the controls so viewers can pause the video. For reduced-motion visitors, disable autoplay. The website source has not been edited by this video task.

## Content and credits

Website screenshots show the existing implementation. Date-picker scenes were refreshed to reflect automatic lookup updates that appeared during production. Moon and planet transitions simulate interaction using authentic before/after captures. Device frames are illustrative dark hardware, without third-party device logos.

NGC 1232 imagery: FORS, 8.2-meter VLT Antu, ESO, via [NASA APOD January 1, 2024](https://science.nasa.gov/image-article/apod-2024-january-1-ngc-1232-a-grand-design-spiral-galaxy/). Individual astronomy image credits remain visible in captured UI. Celestial is an independent project.

Planet textures: [Solar System Scope](https://www.solarsystemscope.com/textures/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), shown through the site's illustrative lit 3D models. Moon surface: site's bundled three.js r150 Moon texture. Generated cosmic companions are existing project assets.

Original music: `make-music.py` produces the 22-second ambient score from synthesized tones, without samples. SFX: `impactSoft_medium_001.ogg` and `click2.ogg` from [Kenney](https://kenney.nl/), CC0, distributed with Brag. Typography: locally bundled Instrument Serif and DM Sans. Animation: existing GSAP package copied into the composition.

## Recreate

Keep the isolated `tooling/` folder locally for the renderer and portable encoders; it is excluded from Git. `render.ps1` checks the composition and exports it through the same pinned Hyperframes version. It runs in the foreground. Site captures can be refreshed with `capture-site.cjs` against the existing local Vite preview at port 5173; the full capture script closes its own browser cleanly. The capture scripts use this machine's bundled Playwright and Chromium paths.

The application preview was already running when this task began. No application dev server, build, or watcher was started by this task.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

User-selected Vite, React, Tailwind CSS, Axios, GSAP, and `.env` configuration. JavaScript. Astronomy Engine provides local lunar calculations; Canvas 2D renders the Moon from a locally bundled surface map. Three.js renders interactive planet meshes in WebGL.

## Product Purpose

Give visitors a place to choose astronomy discoveries: a birthday lookup that retrieves NASA's Astronomy Picture of the Day, a Moon phase visualization for a personal date, a one-button shuffle through NASA's image archive, and an interactive showcase of the eight planets.

## Capabilities and Constraints

The dedicated `/pets` page is a collectible-style gallery of six generated cosmic companions: Nebula, Orbit, Comet, Nova, Luna, and Eclipse. Each themed card contains a character, name, and description. Bodies stay still while separate pupils track the cursor in every direction; touch and focused-gallery arrow keys also work. Pause eyes returns neutral, and reduced motion starts paused. A Cosmic pets card in Discoveries opens the page; the header retains only Discoveries. This is a local gallery, with no adoption, account, or persistent collecting mechanics.

The homepage contains a hero with an Explore CTA, a separate Discoveries section, and a footer. Explore scrolls down to services with a gentle starfield pan. Four cards open Birthday sky at `/birthday`, Moon on your day at `/moon`, Cosmic shuffle at `/shuffle`, and Solar System at `/solar-system`; the service list can grow as more tools are added. Header, Discoveries, all discovery workspaces, and footer share a maximum 1440px width and clamp(24px, 5vw, 76px) horizontal gutters, reduced to 24px below 768px. Desktop columns align at the top, keeping titles anchored at the upper left independently of result height. Controls sit left and results align with the outer right content edge, capped at 640px for Birthday, Moon, and Shuffle; Solar System fills the remaining right column; mobile stacks controls above results.

The dedicated `/birthday` page presents a date form on the left and the original NASA image on the right. Mobile stacks the form above the preview. Visitors can download the original image bytes at the source resolution and format, without borders, compositing, cropping, or added text. NASA title, date, credit, and source are shown beside the download. Video dates retain their video and link to NASA. APOD archive begins June 16, 1995. API configuration lives in local `.env`, with a committed example. No accounts, database, or hosting target have been requested.

Birthday starts with today's date in NASA's Eastern timezone and automatically loads that date's published APOD, with visible loading feedback. Initial loading leaves focus and scroll in place; a successful manual birthday lookup moves focus to the result and scrolls to it on mobile. Discoveries use four cards per row from 1200px, two from 600–1199px, and a single column below 600px.

The lazy-loaded `/moon` page starts with the visitor's local current date and accepts January 1, 1900 through December 31, 2100. It shows the calculated phase name and illuminated percentage for 12:00 UTC on the selected date. Date controls sit left of an unframed textured Moon; mobile stacks them above it. This is a simplified north-up visualization, not a date-specific photograph or a location-specific view. Astronomy Engine 2.1.19 calculates locally and the surface map is bundled locally from the three.js r150 examples. Moon calculations and rendering require no API key or external request, and selected dates are not persisted. Accessible date validation, result announcements/focus, surface loading feedback, and a texture retry are provided. Calculation and texture source links accompany the result.

The lazy-loaded `/shuffle` page opens with the verified January 1, 2024 NGC 1232 APOD photograph. Its heading and Surprise me action sit left of the original image and caption, matching Birthday and Moon; mobile stacks controls above the image. Each click samples NASA archive dates from June 16, 1995 through today in NASA's Eastern timezone, skipping videos, known placeholders, missing entries, failed previews, and photos already seen in that page session. At most eight candidates are tried per click, and the next image preloads before replacing the visible discovery. Loading and request errors preserve the current result and offer another try; title, date, NASA source, and credit remain outside the image. Repeat prevention uses session-only date and image-URL identity sets; favorites and history are not persisted.

The lazy-loaded `/solar-system` showcase opens on Saturn or a valid `?planet=` selection. It preserves the shared header, footer, page alignment, and left-controls/right-result arrangement of the other discoveries. Eight wrapping planet pills sit beneath the introduction on the left. Desktop facts, About, and sources also occupy the left column, leaving the wider right column entirely for the model. Mobile shows title, subtitle, description, wrapping planet pills, model, then facts. A native About disclosure holds the short story after the facts on desktop and mobile; sources accompany the facts. Facts use two compact columns on desktop and mobile, with 12px labels and 25px values on desktop and mobile. Each planet has a textured 3D mesh, introduction, NASA facts, and a short story. Saturn has dimensional rings and shadows; Earth has a fixed cloud layer. Mouse/touch rotation, scroll/pinch zoom, visible zoom/reset buttons, and keyboard controls are supported. Zoom-out returns to the default fitted view; zoom-in reaches 1.2 times the full subject's default projected size, including Saturn's rings. Every zoom input uses the same bounds. Buttons and keyboard zoom step through 1×, 1.1×, and 1.2×. Zoom-in disables after two actions; zoom-out steps back and reset restores 1×; scroll and pinch remain continuous within the same bounds. The transparent canvas matches the model stage and stays centered, with full-subject camera fitting preserving ring edges at every rotation and at maximum zoom. Controls and facts remain fixed during zoom and rotation. Selection updates the URL and browser history. Fixed lighting and individual fit are illustrative, not shared scale, live weather, or an orbital simulation. Maps are local Solar System Scope CC BY 4.0 assets, with provenance and download hashes in `public/textures/planets.source.json`. Rendering happens on demand, pauses when hidden, and disposes GPU resources. Loading, texture retry, and WebGL-unavailable feedback preserve readable facts. The homepage shows a decorative Saturn only when its card approaches the viewport.

## Brand Commitments

The user requested a galaxy-and-stars theme: dark midnight surfaces, a starfield, real astronomy photography, and lavender and silver accents around the astronomy imagery. Keep copy brief and remove filler sections. Preserve the established Instrument Serif and DM Sans typography. Motion respects reduced-motion preferences.

## Open Decisions

Deployment provider, future features, and production backend remain undecided. The display name Celestial is a working name derived from the repository name.

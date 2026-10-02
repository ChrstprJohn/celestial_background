# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

User-selected Vite, React, Tailwind CSS, Axios, GSAP, and `.env` configuration. JavaScript.

## Product Purpose

Give visitors a place to choose astronomy services, starting with a birthday lookup that retrieves NASA's Astronomy Picture of the Day for that date.

## Capabilities and Constraints

The homepage contains a hero with an Explore CTA, a separate service-card section, and a footer. Explore scrolls down to services with a gentle starfield pan. Only the birthday service is currently available; the service list can grow as more tools are added.

The dedicated `/birthday` page presents a date form on the left and the original NASA image on the right. Mobile stacks the form above the preview. Visitors can download the original image bytes at the source resolution and format, without borders, compositing, cropping, or added text. NASA title, date, credit, and source are shown beside the download. Video dates retain their video and link to NASA. APOD archive begins June 16, 1995. API configuration lives in local `.env`, with a committed example. No accounts, database, or hosting target have been requested.

## Brand Commitments

The user requested a galaxy-and-stars theme: dark midnight surfaces, a starfield, real astronomy photography, and lavender and silver accents around the astronomy imagery. Keep copy brief and remove filler sections. Preserve the established Instrument Serif and DM Sans typography. Motion respects reduced-motion preferences.

## Open Decisions

Deployment provider, future features, and production backend remain undecided. The display name Celestial is a working name derived from the repository name.

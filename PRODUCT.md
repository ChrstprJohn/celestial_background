# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

User-selected Vite, React, Tailwind CSS, Axios, GSAP, and `.env` configuration. JavaScript. Astronomy Engine provides local lunar calculations; Canvas 2D renders the Moon from a locally bundled surface map.

## Product Purpose

Give visitors a place to choose astronomy discoveries: a birthday lookup that retrieves NASA's Astronomy Picture of the Day, and a Moon phase visualization for a personal date.

## Capabilities and Constraints

The homepage contains a hero with an Explore CTA, a separate Discoveries section, and a footer. Explore scrolls down to services with a gentle starfield pan. Two cards open Birthday sky at `/birthday` and Moon on your day at `/moon`; the service list can grow as more tools are added.

The dedicated `/birthday` page presents a date form on the left and the original NASA image on the right. Mobile stacks the form above the preview. Visitors can download the original image bytes at the source resolution and format, without borders, compositing, cropping, or added text. NASA title, date, credit, and source are shown beside the download. Video dates retain their video and link to NASA. APOD archive begins June 16, 1995. API configuration lives in local `.env`, with a committed example. No accounts, database, or hosting target have been requested.

The lazy-loaded `/moon` page starts with the visitor's local current date and accepts January 1, 1900 through December 31, 2100. It shows the calculated phase name and illuminated percentage for 12:00 UTC on the selected date. Date controls sit left of an unframed textured Moon; mobile stacks them above it. This is a simplified north-up visualization, not a date-specific photograph or a location-specific view. Astronomy Engine 2.1.19 calculates locally and the surface map is bundled locally from the three.js r150 examples. Moon calculations and rendering require no API key or external request, and selected dates are not persisted. Accessible date validation, result announcements/focus, surface loading feedback, and a texture retry are provided. Calculation and texture source links accompany the result.

## Brand Commitments

The user requested a galaxy-and-stars theme: dark midnight surfaces, a starfield, real astronomy photography, and lavender and silver accents around the astronomy imagery. Keep copy brief and remove filler sections. Preserve the established Instrument Serif and DM Sans typography. Motion respects reduced-motion preferences.

## Open Decisions

Deployment provider, future features, and production backend remain undecided. The display name Celestial is a working name derived from the repository name.

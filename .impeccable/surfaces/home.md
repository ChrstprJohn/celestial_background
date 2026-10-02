# Home and discovery flows

Mode: Persuade on /, Operate on /birthday and /moon, Experience on /shuffle.

Homepage: galaxy/stars hero, one Explore CTA, separate Discoveries section with Birthday sky, Moon on your day, and Cosmic shuffle cards, then footer. No about section or lengthy prose. The cards open /birthday, /moon, and /shuffle. Keep the service list extensible. The Moon card uses a decorative locally rendered crescent; Shuffle uses a NASA archive photograph.

Birthday page: native date form on the left, original NASA image on the right; stack on mobile. Download saves the original image bytes at their source resolution and format. There are no collectible cards, decorative borders, image compositing, cropping, or added text. Show the title, date, NASA credit and source outside the image.

Birthday arrival: initialize to today's NASA Eastern date and automatically load its published APOD with visible loading feedback. Initial loading preserves focus and scroll. Successful manual lookups focus the result and scroll to it on mobile, respecting reduced motion. Discoveries use two cards per row at 600–1199px and a single column below 600px; the wider desktop layout is preserved.

Moon page: today appears immediately, with native date controls on the left and an unframed textured Moon on the right; stack on mobile. Dates span 1900–2100. Show the date, phase name, illuminated percentage, noon UTC reference, simplified north-up description, and source links below the Moon. This is a local phase visualization, not a date-specific photograph. Calculations and surface rendering need no API key or external request; selected dates are not persisted. See [moon.md](moon.md) for the approved surface direction.

Shuffle page: the verified January 1, 2024 NGC 1232 photo appears immediately. Heading and Surprise me action sit left of the unframed image, matching Birthday and Moon; mobile stacks controls above the result. Show title, date, NASA source, and credit outside the image. Random dates span NASA's June 16, 1995 archive start through today in NASA's Eastern timezone. At most eight candidates are tried, skipping videos, known placeholders, missing entries, failed previews, and repeated image identities. The next image preloads before replacement; errors preserve the current discovery. Dates/images are tracked only for the page session; no favorites or history are persisted. See [shuffle.md](shuffle.md) for the approved surface direction.

Visual world: dark midnight ground, real galaxy photography and a subtle canvas starfield, lavender accents, Instrument Serif headings and DM Sans interface text. Brief copy.

Interaction: Explore smoothly scrolls to services while the starfield subtly pans and recedes. Reduced motion removes scrolling animation, drift and twinkle. Canvas pauses while hidden and caps device pixel ratio at 2.

States: initial loading preview, current-day APOD result, date validation, NASA lookup loading/errors, loaded image, download loading/error/retry, failed image preview with original-image link, video entry with NASA source. Manual lookup results move focus to the image and scroll to it on mobile; the initial result leaves focus and scroll in place.

Moon states: lazy route loading, current-date result, date validation, polite result announcement and focus, texture preparation, texture failure with retry, and updated phase shading. Mobile scrolls to the result; reduced motion removes animated scrolling.

Shuffle states: lazy route loading, initial photograph, disabled loading action and status, preloaded next result with polite caption announcement, bounded candidate exhaustion, request/rate-limit recovery preserving the photo, and failed-preview original-image link.

Assets: existing NASA NGC1232 / ESO / VLT photograph. All generated collectible-frame assets and compositing code have been removed from the project per the user's latest instruction.

Moon asset: local `public/textures/moon-surface.jpg` from the three.js r150 examples, with provenance in `public/textures/moon-surface.source.json`. Astronomy Engine 2.1.19 supplies the local phase and illumination calculation.

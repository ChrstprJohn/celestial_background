# Home and discovery flows

Mode: Persuade on /, Operate on /birthday and /moon.

Homepage: galaxy/stars hero, one Explore CTA, separate Discoveries section with Birthday sky and Moon on your day cards, then footer. No about section or lengthy prose. The cards open /birthday and /moon. Keep the service list extensible. The Moon card uses a decorative locally rendered crescent.

Birthday page: native date form on the left, original NASA image on the right; stack on mobile. Download saves the original image bytes at their source resolution and format. There are no collectible cards, decorative borders, image compositing, cropping, or added text. Show the title, date, NASA credit and source outside the image.

Moon page: today appears immediately, with native date controls on the left and an unframed textured Moon on the right; stack on mobile. Dates span 1900–2100. Show the date, phase name, illuminated percentage, noon UTC reference, simplified north-up description, and source links below the Moon. This is a local phase visualization, not a date-specific photograph. Calculations and surface rendering need no API key or external request; selected dates are not persisted. See [moon.md](moon.md) for the approved surface direction.

Visual world: dark midnight ground, real galaxy photography and a subtle canvas starfield, lavender accents, Instrument Serif headings and DM Sans interface text. Brief copy.

Interaction: Explore smoothly scrolls to services while the starfield subtly pans and recedes. Reduced motion removes scrolling animation, drift and twinkle. Canvas pauses while hidden and caps device pixel ratio at 2.

States: empty image preview, date validation, NASA lookup loading/errors, loaded image, download loading/error/retry, failed image preview with original-image link, video entry with NASA source. Results update in place on desktop; mobile moves focus/scroll to the image.

Moon states: lazy route loading, current-date result, date validation, polite result announcement and focus, texture preparation, texture failure with retry, and updated phase shading. Mobile scrolls to the result; reduced motion removes animated scrolling.

Assets: existing NASA NGC1232 / ESO / VLT photograph. All generated collectible-frame assets and compositing code have been removed from the project per the user's latest instruction.

Moon asset: local `public/textures/moon-surface.jpg` from the three.js r150 examples, with provenance in `public/textures/moon-surface.source.json`. Astronomy Engine 2.1.19 supplies the local phase and illumination calculation.

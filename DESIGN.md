---
name: Celestial
description: Discover a personal day in NASA's sky.
colors:
  night: "#070b17"
  surface: "#101528"
  starlight: "#c9c1f0"
  starlight-hover: "#e0daff"
  foreground: "#f3f0e9"
  muted: "#b5bbd0"
  caption: "#a4abc2"
  rule: "#282e44"
  field-border: "#3f4664"
  download-border: "#4c5270"
  download-text: "#ded8fa"
  download-hover: "#1a2036"
  download-active: "#252b45"
  hover-border: "#9a91cf"
  action-text: "#101225"
  error: "#ffb4aa"
  selection: "#51436e"
typography:
  display: {fontFamily: "'Instrument Serif', serif", fontSize: "clamp(68px, 7.5vw, 96px)", fontWeight: 400, lineHeight: 1.04, letterSpacing: "-.025em"}
  birthday-display: {fontFamily: "'Instrument Serif', serif", fontSize: "clamp(56px, 5vw, 68px)", fontWeight: 400, lineHeight: 1.08}
  image-title: {fontFamily: "'Instrument Serif', serif", fontSize: "26px", fontWeight: 400, lineHeight: 1.2}
  body: {fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 400, lineHeight: 1.8}
  button: {fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600}
  download: {fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500}
rounded:
  control: "6px"
  service: "14px"
spacing:
  mobile-gutter: "24px"
  desktop-workspace-gutter: "clamp(24px, 5vw, 76px)"
  caption-top: "22px"
  attribution-top: "18px"
components:
  button-primary: {backgroundColor: "{colors.starlight}", textColor: "{colors.action-text}", rounded: "{rounded.control}", typography: "{typography.button}", padding: "0 26px", height: "52px"}
  image-download: {backgroundColor: "{colors.surface}", textColor: "{colors.download-text}", rounded: "{rounded.control}", typography: "{typography.download}", padding: "0 15px", height: "44px"}
---

# Design System: Celestial

## Overview

A quiet galaxy setting surrounds authentic astronomy photography. Preserve the midnight ground, lavender accents, Instrument Serif headings, and DM Sans controls. The photograph leads the birthday result.

## Colors

Night is the page ground. Surface backs date fields and Download. Starlight highlights actions, italic heading emphasis, links, and focus. Muted blue text carries descriptions and captions; warm foreground carries headings. Errors use peach.

## Typography

Birthday headings cap at 68px on desktop and use clamp(52px, 14vw, 64px) on mobile. Result titles are 26px with natural wrapping. Dates and source information are small sans-serif text outside the photograph.

## Layout

The shared site shell clips horizontal overflow so oversized render canvases never create sideways scrolling.

Header, Discoveries, discovery workspaces, and footer share a maximum 1440px page width and clamp(24px, 5vw, 76px) horizontal gutters. Their outer content edges align; below 768px, the shared gutter is 24px. All four discovery workspaces align their columns at the top, keeping titles anchored at the upper left regardless of result height. Discoveries use four equal cards per row from 1200px and two columns below 1200px, including phones. Below 600px, use a 12px gap, square artwork stages, fluid 12–18px padding, 22–28px headings, and 12px description text. Full-card links retain their complete copy; actions align at the bottom of each row. Artwork tracks constrain Moon, Saturn, and pet previews to the card width.

Home consists of hero with Explore, discoveries with Birthday sky, Moon on your day, Cosmic shuffle, and Solar System services, and footer. Explore scrolls to discoveries; the services open /birthday, /moon, /shuffle, and /solar-system.

Birthday uses the shared page width and gutters with .9fr 1.1fr columns and 40–100px fluid gap. Controls sit left and image/download right, with the result aligned to the outer right content edge and capped at 640px. Below 768px, columns stack with 24px gutters and a centered result capped at 480px. Image display height caps at 460px; object-fit: contain preserves the full composition. Caption and compact Download share a wrapping row. Source and credit share a separate row beneath a thin rule.

Moon uses the same desktop workspace and columns, with date controls left and an unframed square Moon stage right. The result aligns to the outer right content edge, caps at 640px, and centers its date, serif phase title, illumination, reference caption, and source links beneath the sphere. Below 768px, controls stack above the centered result with 24px gutters and a 36px gap; the Moon stage caps at 360px.

Shuffle matches the Birthday/Moon two-column workspace: heading and action left, unframed image and attribution right, using the shared page width and gutters with .9fr 1.1fr columns and 40–100px fluid gap. The result aligns to the outer right content edge and caps at 640px wide. Image height caps at 460px; object-fit: contain preserves its composition. Below 768px, controls stack above the centered result with 24px gutters and a 40px gap. Date and 26px serif title sit below the image, followed by the shared source/credit rule.

Solar System shares the top-aligned page edges, with a narrower left column for introduction, wrapping planet pills, facts, About, and sources. The unframed model fills the remaining right column. Desktop columns are clamp(280px, 36%, 460px) and the remaining width with a 32–72px fluid gap; the desktop model stage uses viewport-sensitive clamp(440px, calc(100svh - 220px), 700px) height. The transparent canvas matches the model stage and stays centered; full-subject fitting preserves ring edges at every rotation and at the gentle 20% maximum zoom, without moving page layout. Facts use two compact columns on desktop and mobile, with 12px labels and 25px values on desktop and mobile. Below 768px, show title, subtitle, description, wrapping planet pills, model, then facts; the model stage uses clamp(280px, 85vw, 390px) height. A native About disclosure follows the facts on desktop and mobile. Source links accompany the facts. Preserve the shared header/footer and avoid sidebar dividers, duplicate planet navigation, or a separate full-width story section.

## Elevation & Depth

Flat surfaces and thin rules organize the interface. Decorative stars and authentic galaxy photography provide depth. No interface shadows, framed results, or glass panels. Physical lighting and Saturn's ring shadows belong to the 3D subject.

## Shapes

Controls use 6px corners; the homepage service uses 14px corners. Result images have no decorative border, mask, or crop. Icons use Lucide linework.

## Components

Birthday and Moon share DatePicker: a midnight surface, thin field border, lavender selected day, month/year selectors, archive-aware disabled days, and a Today action. The date trigger retains its visible label and help/error associations. Arrow keys move by day/week, Home/End move within the week, Page Up/Down move by month (Shift by year), and Escape returns focus to the trigger. Selection, outside clicks, and focus leaving the control close the calendar. Mobile keeps the seven-column calendar inside the shared page gutters.

The common page shell owns the starfield, nine shooting stars, and the same star cursor on home and all five discovery pages. The hero retains its galaxy image. Decorative layers never intercept pointer events. Shooting stars pause in hidden tabs and are hidden under reduced motion; the custom cursor is limited to a fine mouse pointer with motion enabled and yields to native text/select controls.

Cosmic pets at `/pets` inherits the midnight/lavender palette and uses the user-requested collectible card presentation: a 14px rounded single border, dark artwork stage, and a name plus short description separated by a thin rule. The collection has three columns from 1024px and two columns below 1024px, including phones. Below 600px, use a 12px gap, fluid 12–18px caption padding, 24–30px headings, and 12px descriptions. Download actions align at the bottom and fill the caption width with at least 44px height. The character artwork never moves; eye pupils track within measured oval boundaries. Keep the Pause eyes action, focus outline, touch alternative, and reduced-motion neutral state. The page uses the shared --page-width and --page-gutter for aligned content edges. A Cosmic pets card in Discoveries opens the page; keep only Discoveries in the header.

Find my sky is a content-width lavender action, at least 164×48px. Download is a compact outlined action, at least 44px tall, with a 16px icon and 8px gap. Both expose loading and disabled states. The date input has a visible label, archive bounds, inline errors, and 16px mobile text. Focus uses a 2px starlight outline with 5px offset; the field wrapper uses 3px offset.

Downloads save original NASA file bytes, resolution, and format. No compositing or collectible generation. Failed previews/downloads offer the original-image link. Video dates retain media or a NASA source link.

Birthday initializes to today's NASA date and loads its APOD with visible preparing feedback. Initial results leave focus and scroll in place. Successful manual lookups focus the result and scroll to it on mobile, respecting reduced motion.

Moon reuses the visible date label, shared themed calendar, inline errors, and content-width lavender action. Its canvas renders a locally textured phase visualization with no decorative frame. Preparing/error feedback occupies the stage; an outlined Try again action recovers a failed texture load. Date, phase, and illumination remain outside the canvas, with a quiet noon UTC / simplified north-up caption and source links. Result updates announce politely and move focus to the result; mobile scrolling respects reduced motion. The homepage Moon card uses a decorative crescent without interactive canvas controls.

Shuffle reuses the content-width lavender action, with a Shuffle icon and disabled loading state. The current photograph stays visible while the next one preloads and when requests fail. The caption announces new results politely; request errors appear beside the action, and a failed visible preview offers an original-image link. Preserve the established two-column composition rather than a single-column gallery.

Solar System uses wrapping planet pills with at least 44px height on desktop and mobile. The selected planet is visibly marked and exposes its pressed state. A native About disclosure holds its short story. The interactive model supports pointer/touch rotation, scroll/pinch zoom, visible zoom/reset controls, and keyboard equivalents. Zoom ranges from the default fitted view to 1.2 times the full subject's default projected size, including Saturn's rings, with every input sharing those bounds. Buttons and keyboard zoom step through 1×, 1.1×, and 1.2×. Zoom-in disables after two actions; zoom-out steps back and reset restores 1×; scroll and pinch remain continuous within the same bounds. Controls and facts stay fixed during zoom and rotation. Facts and stories remain readable during loading or WebGL failure; texture failures offer retry. Render only on demand and preserve reduced-motion behavior.

The starfield pauses when hidden and becomes static under reduced motion. Entry motion uses expo.out, 18px displacement, 1s duration, and .09s stagger. Reduced motion also disables smooth scrolling.

## Do's and Don'ts

- Preserve original photos; place date, title, and credit outside them.
- Keep the birthday task compact and NASA source visible.
- Maintain keyboard focus, request feedback, recovery, and responsive wrapping.
- Align discovery content edges with the shared header and footer.
- Keep only available discoveries on home: Birthday sky, Moon on your day, Cosmic shuffle, and Solar System.
- Do not restore collectible cards, decorative borders, filler sections, or text overlays.

Planet and Cosmic shuffle introductions share the Pets page heading scale: --discovery-title-size is clamp(56px, 6vw, 80px), changing to clamp(52px, 12vw, 68px) below 768px, with 1.08 line height. Description text is 14px on desktop and 13px on mobile, with a 17px top interval. Back-link intervals are 36px desktop and 28px mobile. Shuffle wraps its heading naturally.

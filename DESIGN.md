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
  desktop-workspace-gutter: "40px"
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

Home consists of hero with Explore, discoveries with Birthday sky and Moon on your day services, and footer. Explore scrolls to discoveries; the services open /birthday and /moon.

Birthday uses a maximum 1140px workspace with .9fr 1.1fr columns and 40–100px fluid gap. Controls sit left and image/download right. Below 768px, columns stack with 24px gutters. Image width caps at 480px and display height at 460px; object-fit: contain preserves the full composition. Caption and compact Download share a wrapping row. Source and credit share a separate row beneath a thin rule.

Moon uses the same desktop workspace and columns, with date controls left and an unframed square Moon stage right. The result caps at 480px and centers its date, serif phase title, illumination, reference caption, and source links beneath the sphere. Below 768px, controls stack above the result with 24px gutters and a 36px gap; the Moon stage caps at 360px.

## Elevation & Depth

Flat surfaces and thin rules organize the interface. Decorative stars and authentic galaxy photography provide depth. No shadows, framed results, or glass panels.

## Shapes

Controls use 6px corners; the homepage service uses 14px corners. Result images have no decorative border, mask, or crop. Icons use Lucide linework.

## Components

Find my sky is a content-width lavender action, at least 164×48px. Download is a compact outlined action, at least 44px tall, with a 16px icon and 8px gap. Both expose loading and disabled states. The date input has a visible label, archive bounds, inline errors, and 16px mobile text. Focus uses a 2px starlight outline with 5px offset; the field wrapper uses 3px offset.

Downloads save original NASA file bytes, resolution, and format. No compositing or collectible generation. Failed previews/downloads offer the original-image link. Video dates retain media or a NASA source link.

Moon reuses the visible date label, native date field, inline errors, and content-width lavender action. Its canvas renders a locally textured phase visualization with no decorative frame. Preparing/error feedback occupies the stage; an outlined Try again action recovers a failed texture load. Date, phase, and illumination remain outside the canvas, with a quiet noon UTC / simplified north-up caption and source links. Result updates announce politely and move focus to the result; mobile scrolling respects reduced motion. The homepage Moon card uses a decorative crescent without interactive canvas controls.

The starfield pauses when hidden and becomes static under reduced motion. Entry motion uses expo.out, 18px displacement, 1s duration, and .09s stagger. Reduced motion also disables smooth scrolling.

## Do's and Don'ts

- Preserve original photos; place date, title, and credit outside them.
- Keep the birthday task compact and NASA source visible.
- Maintain keyboard focus, request feedback, recovery, and responsive wrapping.
- Keep only available discoveries on home: Birthday sky and Moon on your day.
- Do not restore collectible cards, decorative borders, filler sections, or text overlays.

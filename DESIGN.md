---
name: Celestial
description: An editorial window into NASA's sky on a personal date.
colors:
  forest: "#273f36"
  forest-hover: "#3f5948"
  cream: "#f6f5ef"
  ink: "#27372f"
  body-muted: "#596457"
  help-muted: "#677260"
  rule: "#d9ded4"
  field-border: "#bec8b9"
  focus: "#506b51"
  serif-accent: "#50654b"
  link-green: "#455b41"
  error: "#903d30"
  white: "#fff"
  media-night: "#12181c"
  fallback-ground: "#e8ecdf"
  selection: "#d5decf"
  selection-ink: "#192d22"
typography:
  display:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "clamp(62px, 6.5vw, 94px)"
    fontWeight: 400
    lineHeight: 0.99
    letterSpacing: "-.025em"
  headline:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "clamp(36px, 3.5vw, 49px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-.015em"
  title:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "38px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-.01em"
  body:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.85
  story:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "13px"
    fontWeight: 600
  button:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "13px"
    fontWeight: 500
  help:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.8
rounded:
  control: "6px"
  square: "0px"
spacing:
  control-gap: "8px"
  label-gap: "12px"
  caption-top: "16px"
  mobile-gutter: "24px"
  tablet-gutter: "36px"
  result-gap: "44px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 19px"
  button-primary-hover:
    backgroundColor: "{colors.forest-hover}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.link-green}"
    padding: "0"
  date-field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 14px"
  navigation:
    textColor: "{colors.ink}"
    typography: "{typography.button}"
  sky-print:
    backgroundColor: "{colors.media-night}"
    textColor: "{colors.cream}"
    rounded: "{rounded.square}"
    height: "clamp(460px, 42vw, 590px)"
  media-fallback:
    backgroundColor: "{colors.fallback-ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "35px"
---

# Design System: Celestial

## Overview

**Creative North Star: "The Editorial Sky"**

Celestial pairs the quiet clarity of an editorial page with the scale and color of authentic astronomy photography. Warm cream space, forest controls, a large serif voice, and restrained sans-serif details make a personal date feel inviting and easy to explore.

The interface stays calm around the photograph. Generous spacing and thin rules organize the page; real NASA imagery supplies its richest color and depth. Motion introduces the copy and image once and respects reduced-motion preferences.

**Key Characteristics:**
- Warm cream ground and forest actions.
- Instrument Serif display type with DM Sans interface text.
- Authentic astronomy photography with visible source and credit.
- Flat surfaces, thin dividers, and gently curved controls.
- Responsive editorial columns that stack on mobile.

## Colors

The palette surrounds vivid astronomy imagery with muted greens and warm paper. Frontmatter contains the normative values.

### Primary
- **Forest / Forest Hover:** Primary actions and their enabled hover state; Forest also colors source links.
- **Serif Accent:** Italic emphasis in display headings.
- **Link Green:** The quiet alternate action beneath the date form.
- **Focus:** Keyboard focus outlines and the active date-field wrapper.

### Neutral
- **Cream / Ink:** Page ground and primary text; Cream also colors photograph overlay copy.
- **Body Muted / Help Muted:** Prose, result dates, form guidance, and credit.
- **Rule / Field Border:** Section boundaries and the date field's resting outline.
- **White:** Primary button and skip-link text.
- **Media Night / Fallback Ground:** Dark photograph backing and pale unavailable-media surface.
- **Selection / Selection Ink:** Selected text background and foreground.

**Error** identifies form validation and request errors. Minor captions and footer text use nearby muted greens in source; preserve their current values when editing those elements without introducing additional semantic roles.

**The Photograph Color Rule.** Let authentic astronomy imagery provide the vivid color; keep interface surfaces within the cream and green palette.

## Typography

**Display Font:** Instrument Serif, with serif fallback; regular and italic faces are bundled.

**Body Font:** DM Sans, with sans-serif fallback; regular, medium, and semibold weights are bundled.

**Character:** The expressive serif gives headings warmth and scale. Small, clear sans-serif labels make the date lookup and source information practical.

### Hierarchy
- **Display:** The largest serif role introduces the landing page. Italic emphasis keeps the regular weight and uses Serif Accent.
- **Headline:** Serif section headings balance short lines; mobile section headings become 40px, with result headings at 36px.
- **Title:** NASA result titles use the serif title role; it becomes 34px on mobile.
- **Body:** Introductory copy has a 355px maximum width on desktop, growing to 370px on mobile. About copy uses 13px with 1.9 line height and a 420px maximum width.
- **Story:** Result explanations use generous line height and wrapping for long source text.
- **Label / Button:** Date labels use semibold; actions and navigation use medium. Date values and result dates use tabular numerals.
- **Help:** Archive guidance and credit use the compact, quiet sans-serif role.

Up to 1023px the main display becomes `clamp(60px, 7.5vw, 77px)`; up to 767px it becomes `clamp(64px, 12vw, 84px)`. Mobile introductory copy is 14px; date inputs become 16px and primary actions 14px. The wordmark is medium DM Sans, 27px with compact negative tracking, becoming 25px on mobile.

**The Two Voices Rule.** Use Instrument Serif for expressive headings and photograph statements; use DM Sans for controls, prose, dates, navigation, and credits.

## Layout

The centered shell has a 1536px maximum width including gutters. Desktop horizontal padding is `clamp(24px, 5.5vw, 88px)`; it becomes 36px up to 1023px and 24px up to 767px. The body supports widths from 320px.

Hero and about sections use equal columns with a gap of `clamp(40px, 7vw, 110px)`; the hero gap reaches 120px from 1600px. The hero has 60px top and 71px bottom padding. Its form is at most 460px wide. The photograph is a tall, square-cornered print with its caption below.

Up to 1023px, date controls stack while hero columns remain side by side. Up to 767px, hero, about, and result media/story become single columns. The hero uses a 39px gap and 46px/41px vertical padding; its form fills the width. The photograph changes to a `1 / 1.12` aspect ratio. Mobile navigation keeps the internal section link and hides the external archive link.

Results appear between the hero and about section. Their media/story grid uses `1.15fr 1fr` with a 44px gap, reduced to 28px at tablet width and 21px when stacked. Result images use containment; the featured print intentionally crops to fill its frame. Videos use a 16:9 iframe. Thin horizontal rules divide major sections.

The spacing tokens capture recurring control, caption, and gutter values. Section padding and fluid gaps remain contextual measurements.

## Elevation & Depth

There are no box shadows. Depth comes from astronomy photography, dark media grounds, tonal fallback surfaces, and a lower-image gradient that protects overlay text. Sections remain flat on cream; focus is an outline rather than a glow. Exact gradient and motion values are retained in the sidecar.

**The Flat Surface Rule.** Preserve the current flat surfaces and thin dividers when extending the interface.

## Shapes

Controls have gently curved corners using the control radius. Photograph frames, result media, fallback panels, and section boundaries stay square. The date wrapper has a thin border; buttons have a solid forest fill without a border. Thin, open-line SVG icons accompany actions and the wordmark without separate colored badges.

## Components

### Buttons

The primary action is compact and confident, using Forest, White text, the control radius, and the frontmatter padding. Its minimum height is 54px on desktop and 53px on mobile. During lookup, its text changes to “Finding your sky” beside an 18px rotating loader.

Enabled hover changes the fill to Forest Hover over 0.2s with `ease`. Disabled buttons have 0.65 opacity and a wait cursor. The alternate text button is transparent with Link Green text and an underline on enabled hover. Keyboard focus uses a shared 2px outline with 5px offset. No distinct pressed style is implemented.

### Inputs / Fields

The native date field sits in a bordered wrapper with a calendar icon, a visible label, and 8px separation from the action. Its wrapper has a 54px minimum height, increasing to 56px on mobile. Desktop date text is 13px with 13px vertical padding. The native picker uses a light color scheme.

Focus within the wrapper adds the Focus outline with 3px offset; the input suppresses its duplicate outline. Validation and request failures place Error text below the help copy, expose an alert, and mark the field invalid. No red border is implemented. Loading disables the input and actions and exposes the form's busy state.

### Navigation

The header pairs a lowercase wordmark and orbit icon with restrained links. Its height is 111px on desktop and 83px on mobile. Links underline on hover and use the shared focus outline. The external archive link hides on mobile. A keyboard-revealed skip link leads directly to the lookup form.

### Astronomy Print

The featured NGC 1232 photograph uses an authentic NASA asset, cover crop, lower gradient, and a two-line serif statement. A small tracked coordinate sits inside the image; the caption and source link sit outside. Preserve image alt text and attribution. Result images use containment to show NASA's image in full.

If the featured image fails, a dark fallback preserves its frame with an orbit icon and explanatory text. Result media fallbacks use Fallback Ground, a telescope icon, an explanation, and a working NASA link; they never substitute invented imagery.

### Result Presentation

A returned date introduces a serif section heading, followed by media, NASA title, explanation, optional credit, and source link. Results receive programmatic focus and scroll into view; the section suppresses its own outline while interactive links retain theirs. The NASA title appears once in the story.

### Motion

The first-load GSAP sequence reveals hero-copy children from 24px below with 0.1s stagger, `expo.out`, and 1.15s default duration. The frame reveals from a bottom-inset clip over 1.5s and its image settles from scale 1.08 over 1.6s, both starting at 0.12s. Result content reveals from 18px below over 0.7s.

Reduced-motion preferences skip GSAP reveals and smooth scrolling. CSS animations and transitions shorten to 0.01ms; the loader normally spins once per second. Content stays available without animation.

## Do's and Don'ts

### Do:
- **Do** use cream surfaces, forest actions, and restrained green text around astronomy imagery.
- **Do** pair Instrument Serif headings with DM Sans controls and prose.
- **Do** preserve visible keyboard focus, labelled date entry, inline errors, and reduced-motion behavior.
- **Do** show authentic NASA imagery, source links, and available credits.
- **Do** stack the editorial columns and date controls at the implemented responsive widths.

### Don't:
- **Don't** replace authentic astronomy photography with a simulated star scene or fabricated result.
- **Don't** add shadows or rounded media cards to the existing flat editorial surfaces.
- **Don't** hide the archive limit, failed-media explanation, or source attribution.
- **Don't** require animation to reveal or access content.
- **Don't** repeat the returned NASA title in an additional result label.

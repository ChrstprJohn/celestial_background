# Mobile performance and loading feedback

The landing page uses local WebP captures of its existing card artwork. Desktop pointer hover loads the corresponding live preview after 180 ms; leaving or scrolling disposes it. Touch devices and reduced-motion visitors keep the lightweight artwork. The phone showcase video has a poster and native playback controls and downloads when played; desktop autoplay starts only while the video is visible. The galaxy stays still on touch devices.

The shared starfield paints once and on meaningful viewport changes. It has no perpetual animation or scroll handler. Mobile cursor effects do not allocate a screen-sized canvas or clear it during touch scrolling. Internal card and Back links preserve the shared document, background, loaded modules, and in-memory NASA record cache. External links, downloads, modified clicks, same-page anchors, and browser Back remain native.

Interactive discovery pages retain their controls and exports. Mobile planet scenes use proportionally resized 1024×512 WebP surfaces, a 1.5 device-pixel-ratio cap, lighter sphere/ring meshes, and smaller shadow maps. Desktop uses the full-size WebP derivatives. Original texture assets and their provenance are retained. Planet-builder terrain generation runs in a module worker, with a synchronous fallback for browsers that cannot create workers. Moon phase uses a 480-pixel canvas on touch devices and 720 on desktop. Fonts load the Latin subsets used by the interface.

Birthday shows a loading state in the image region while requesting the NASA record, then retains image-specific loading feedback until the preview loads. Image errors clear the busy state and offer retry or the original image. Responsive NASA previews preserve the complete composition; original downloads retain the source URL and bytes. The birthday controls display immediately without a delayed entrance animation. NASA request time still depends on its service and the visitor's connection.

Calendars are bounded to 60% of the visual viewport, capped at 440px, with native vertical scrolling and a sticky Done/Today footer. On pages with a pinned heading or preview, their height further bounds the calendar so Done stays within the remaining screen space. Small and touch screens place them in the document flow. Swipes starting inside the calendar scroll its dates; swipes starting outside leave it open. Only an outside tap/click, keyboard focus leaving with Tab, Escape, the trigger, or Done dismisses it. Draft dates apply only on Done.

Build your planet and Solar System keep their actual page heading pinned above the mobile model. Portrait model stages are about 15% taller, with a separate row below the canvas for zoom and reset. The visible zoom buttons are 32px while their mobile touch targets remain 44px. Customize and Choose a planet shortcuts focus the corresponding controls and account for the current preview height, including long world names. Short landscape screens put introductory copy below the model and use a compact header so the preview and its controls remain reachable. Solar System offers planet selection and camera controls; terrain and color customization belong to the builder.

The shared mobile preview layout also pins the headings for Two birthdays, one Moon, Your cosmic age, and Gravity playground. Moon phase keeps its heading visible while its result scrolls. The long birthday-Moons heading uses a compact font size on narrow phones. Existing Moon, cosmic-age, and gravity preview sizes are preserved. Tablet workspaces follow their content height and avoid stretching the introduction row; portrait tablet Moon phase uses a centered 600px maximum-width column for its date input and larger Moon, while other tablet discoveries retain their columns.

## Measurements

Headless Microsoft Edge, production preview, fresh browser contexts, 390×844 at DPR 3 with 6× CPU throttling and 1440×900 with 4× CPU throttling. Each run waits 1.5 seconds after the hero mounts, then scrolls from top to bottom over 2.5 seconds using animation frames. These are local laboratory measurements, not physical-device Core Web Vitals or production network timings. Local resource bytes include resources fetched during that window; they exclude remote NASA assets and can vary with load timing.

| Metric | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | ---: | ---: | ---: | ---: |
| Maximum frame gap during scroll | 773 ms | 27 ms | 600 ms | 27 ms |
| Frame gaps over 50 ms | 3 | 0 | 6 | 0 |
| Main-thread scripting during scroll | 1,706 ms | 167 ms | 1,354 ms | 144 ms |
| Starfield redraws during scroll | 107 | 0 | 102 | 0 |
| Landing WebGL context requests | 1 | 0 | 6 | 0 |
| Local resources fetched | 2.00 MB | 0.51 MB | 5.26 MB | 0.43 MB |

Raw measurements and screenshots are in ignored `test-results/perf-before.json` and `test-results/perf-after.json`. The measurement script is `test-results/perf-audit.cjs`.

## Verification

- Production build, app ESLint (`npm run lint -- --ignore-pattern 'brag-output/**'`), and all 45 unit tests passed. Full-repository ESLint retains the existing unused-variable errors in the vendor GSAP showcase bundle.
- All ten enabled routes passed at 320×568, 390×844, 844×390, and 1440×900, with no horizontal overflow or page JavaScript errors. Four first-visit location-prompt checks passed.
- Controlled slow NASA record and image responses verified both loading stages, busy-state duration, image failure/retry, navigation without reloading, and browser Back. Real touch-event synthesis verified calendar scrolling and swipes along both outer edges without dismissal.
- Moon phase, Cosmic age, and Moon match calendars passed at all four viewports, including scrollable dates, visible Done, selecting a year, Escape returning focus, and desktop Tab dismissal. Planet selection, phase combining, gravity inputs, and Moon/cosmic-age PNG exports passed the shared route checks.
- Desktop hover previews and worker-generated planet customization/export are checked separately. PNG exports retain their 1080×1350 dimensions.
- Ten focused builder/Solar System checks passed across 320×568, 390×844, 844×390, 768×1024, and 1440×900. They exercised shortcuts and focus, pinned title/model alignment, touch scrolling, zoom bounds/reset, changing planets, long world names, and planet PNG export. The toolbar stays outside the canvas at every size. Evidence is in ignored `test-results/planet-controls-results.json` and `test-results/check-planet-controls.cjs`.
- 52 title/tablet checks passed at 320×568, 390×844, 844×390, 768×1024, 820×1180, 1032×1376, 1376×1032, and 1440×900. They checked pinned headings and preview alignment, touch scrolling, calendar Done visibility/date selection, combining Moons, gravity controls, eight tablet/desktop routes, and the Moon page's footer spacing. Evidence is in ignored `test-results/sticky-tablet-results.json` and `test-results/check-sticky-tablet.cjs`.

Physical iPhone/Android devices, Safari, and native download-to-disk behavior have not been tested.

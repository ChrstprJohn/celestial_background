# Loading optimization — October 8, 2026

Measured with Vite production builds and asset byte counts. These are payload reductions, not measured real-user load times or Core Web Vitals.

| Resource | Before | After |
| --- | ---: | ---: |
| Shared entry JavaScript | 327.48 KB | 234.85 KB |
| Shared entry JavaScript, gzip | 108.95 KB | 74.70 KB |
| All eleven active pet images | 8,424,962 bytes | 217,030 bytes (480px previews) |
| All eleven active pet images, larger previews | 8,424,962 bytes | 562,098 bytes (960px previews) |

Pet previews retain transparency and the original square composition. Responsive sizes and existing viewport-based loading select the appropriate preview. Full-resolution PNGs load only when visitors download; exported PNGs retain 1254×1254 dimensions and neutral pupils. The homepage pet card uses the same previews.

Homepage components and their data now load as a separate route chunk. Native CSS entrance animations replace the main site's two GSAP effects and honor reduced motion. Interactive Three.js scenes remain lazy loaded; their existing large chunk still produces Vite's size warning. Analytics behavior is unchanged.

Quasar was generated with the built-in image generation tool and saved in output/mascot-samples. It has not been added to PETS, public assets, or any app route. The final prompt is recorded in quasar-generation.json.

Validation: production build passes; all 43 tests pass; ESLint for src and vite.config.js passes. Full npm run lint reports 17 existing errors in the generated brag-output/composition/assets/gsap.min.js vendor file.

Local Chrome checks at 1440×1000 and 390×844 verify homepage rendering, all eleven pets loading, responsive WebP selection, no horizontal overflow, no page errors, eye-pause control, and actual PNG download events. The pet route requests no homepage or Three.js chunks and no original PNG before download. PNG download dimensions were independently inspected with Pillow. Evidence is stored alongside this report. External NASA imagery and real-user network timings are not covered by these local checks.

## Wisp integration

Wisp is now the twelfth gallery companion. Its production PNG has blank eyes for the shared moving-pupil overlays; the approved concept is preserved separately. WebP previews are 18,058 bytes at 480px and 43,000 bytes at 960px. Desktop and mobile browser checks passed for all twelve companions, Wisp gaze movement and pause, and Wisp PNG downloads at 1254 x 1254. Build, source lint, and all 43 tests pass.

# Export verification

- Hyperframes check: zero runtime, layout, motion, or contrast errors; 26/26 text contrast checks passed. Seven advisory warnings concern a single-file scene structure and repeated still-image sources.
- Laptop entrance inspected under seeking; scene snapshots inspected after refreshing the current Birthday and Moon implementations.
- Export: H.264, 1920 × 1080, 30 fps, 660 video frames, 22.000 seconds of picture. Music export includes stereo AAC at 48 kHz; AAC packet padding can add approximately 15 ms to container duration.
- Muted export: matching video, no audio stream, 22.000-second container.
- Both final files fully decoded with FFmpeg without errors.
- Poster selected from the settled three-device ensemble at 20.5 seconds and baked into frame zero; mean absolute encoded-frame difference from the JPG is 0.961/255.
- Final encoded contact sheet inspected at 0, 1.5, 5.5, 9.4, 10.6, 14.4, 15.6, and 21.9 seconds. Moon selection, Saturn/Earth replacement, and final hold all appear correctly.
- Render ran locally in the foreground using one Chromium worker. No video Node workers or samson-nextjs workers remained after export. Existing app and Codex processes were preserved.

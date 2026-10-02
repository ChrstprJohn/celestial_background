$ErrorActionPreference = 'Stop'
$videoRoot = $PSScriptRoot
$ffmpegDir = Join-Path $videoRoot 'tooling/render-tools/node_modules/ffmpeg-static'
$ffprobeDir = Join-Path $videoRoot 'tooling/render-tools/node_modules/ffprobe-static/bin/win32/x64'
$env:PATH = "$ffmpegDir;$ffprobeDir;" + $env:PATH
$env:HYPERFRAMES_BROWSER_PATH = 'C:\Users\picar\AppData\Local\ms-playwright\chromium_headless_shell-1228\chrome-headless-shell-win64\chrome-headless-shell.exe'
$videoComposition = Join-Path $videoRoot 'composition'
$videoCache = Join-Path $videoRoot 'tooling/npm-cache'
& npx.cmd --offline --cache $videoCache hyperframes check $videoComposition
if ($LASTEXITCODE -ne 0) { throw 'Composition check failed.' }
& npx.cmd --offline --cache $videoCache hyperframes render $videoComposition --workers 1 --fps 30 --quality delivery --output (Join-Path $videoRoot 'brag.raw.mp4')
if ($LASTEXITCODE -ne 0) { throw 'Render failed.' }
& (Join-Path $ffmpegDir 'ffmpeg.exe') -y -ss 20.5 -i (Join-Path $videoRoot 'brag.raw.mp4') -frames:v 1 -q:v 2 (Join-Path $videoRoot 'brag.jpg')
if ($LASTEXITCODE -ne 0) { throw 'Poster extraction failed.' }
& (Join-Path $ffmpegDir 'ffmpeg.exe') -y -i (Join-Path $videoRoot 'brag.raw.mp4') -i (Join-Path $videoRoot 'brag.jpg') -filter_complex "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]" -map '[v]' -map '0:a?' -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -af 'loudnorm=I=-23:TP=-2:LRA=7' -c:a aac -b:a 192k -ar 48000 -t 22 -movflags +faststart (Join-Path $videoRoot 'brag.mp4')
if ($LASTEXITCODE -ne 0) { throw 'Poster frame baking failed.' }
& (Join-Path $ffmpegDir 'ffmpeg.exe') -y -i (Join-Path $videoRoot 'brag.mp4') -an -c:v copy -movflags +faststart (Join-Path $videoRoot 'celestial-showcase-muted.mp4')
if ($LASTEXITCODE -ne 0) { throw 'Muted export failed.' }

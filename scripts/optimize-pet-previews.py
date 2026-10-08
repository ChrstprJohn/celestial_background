"""Regenerate responsive previews without modifying full-resolution pet PNGs.

Requires Pillow. Run from the repository root.
"""
import json
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
# These are the companions currently enabled in src/lib/pets.js.
pets = ('nebula', 'orbit', 'comet', 'nova', 'luna', 'eclipse', 'aurora',
        'pebble', 'sol', 'terra', 'spiral', 'wisp')
records = []
for pet in pets:
    source = root / 'public' / 'pets' / f'{pet}.png'
    with Image.open(source) as image:
        image = image.convert('RGBA')
        record = {'pet': pet, 'original': source.stat().st_size}
        for size in (480, 960):
            output = source.with_name(f'{pet}-{size}.webp')
            image.resize((size, size), Image.Resampling.LANCZOS).save(
                output, 'WEBP', quality=85, method=6)
            record[f'preview{size}'] = output.stat().st_size
        records.append(record)
report = root / 'output' / 'performance' / 'pet-assets.json'
report.parent.mkdir(parents=True, exist_ok=True)
report.write_text(json.dumps(records, indent=2), encoding='utf-8')

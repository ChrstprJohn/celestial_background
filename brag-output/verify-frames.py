from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import numpy as np
root = Path(__file__).parent
times = ['0', '1.5', '5.5', '9.4', '10.6', '14.4', '15.6', '21.9']
sheet=Image.new('RGB',(1280,4*392),'#070b17')
draw=ImageDraw.Draw(sheet)
for i,t in enumerate(times):
    frame=Image.open(root/f'qa/final-{t}.png').convert('RGB')
    thumb=ImageOps.contain(frame,(640,360))
    x=(i%2)*640;y=(i//2)*392
    sheet.paste(thumb,(x,y+30));draw.text((x+12,y+8),f'{t} seconds',fill='#c9c1f0')
sheet.save(root/'qa/final-contact-sheet.jpg',quality=94)
first=np.array(Image.open(root/'qa/final-0.png').convert('RGB'),dtype=float)
poster=np.array(Image.open(root/'brag.jpg').convert('RGB'),dtype=float)
print('Poster vs encoded frame-zero mean pixel difference:',round(np.mean(np.abs(first-poster)),3))
print('Final contact sheet:',root/'qa/final-contact-sheet.jpg')

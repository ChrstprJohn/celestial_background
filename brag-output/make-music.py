"""Original ambient soundtrack. No samples or external music used."""
import wave
from pathlib import Path
import numpy as np

rate = 48000
duration = 22
t = np.arange(rate * duration) / rate
left = np.zeros_like(t)
right = np.zeros_like(t)

# D major suspended/add-nine voicings; smooth overlapping envelopes.
for start, notes in [(0, [146.832, 220, 293.665, 329.628]),
                     (5.3, [146.832, 246.942, 369.994, 440]),
                     (10.6, [164.814, 220, 329.628, 493.883]),
                     (16, [146.832, 220, 293.665, 440])]:
    u = t - start
    env = np.where(u >= 0, (1 - np.exp(-np.maximum(u, 0) / 1.6)) * np.exp(-np.maximum(u, 0) / 8.8), 0)
    for i, f in enumerate(notes):
        vibrato = .06 * np.sin(2 * np.pi * .13 * t + i)
        tone = np.sin(2*np.pi*f*t + vibrato) + .22*np.sin(2*np.pi*f*2*t + i*.3)
        left += .019 * env * tone
        right += .019 * env * (np.sin(2*np.pi*f*1.0008*t + vibrato + .14) + .22*np.sin(2*np.pi*f*2.0004*t + i*.3))

for i, (start, f) in enumerate([(0.6,587.33),(2.2,880),(4.4,659.26),(7.9,739.99),(9.7,880),(12.7,587.33),(14.9,659.26),(17.7,880),(19.5,1174.66)]):
    u = t-start
    env = np.where(u>=0, (1-np.exp(-np.maximum(u,0)/.015))*np.exp(-np.maximum(u,0)/1.65),0)
    bell = np.sin(2*np.pi*f*u)+.23*np.sin(2*np.pi*f*2.003*u)
    left += .028*env*bell*(.8 if i%2 else 1)
    right += .028*env*bell*(1 if i%2 else .8)

stereo = np.stack([left,right],axis=1)
fade = np.minimum(t/.7,1)*np.minimum((duration-t)/1.5,1)
stereo *= np.maximum(fade,0)[:,None]
pcm = (np.clip(stereo,-1,1)*32767).astype('<i2')
output=Path(__file__).parent/'composition/assets/music/celestial-ambient.wav'
with wave.open(str(output),'wb') as file:
    file.setnchannels(2); file.setsampwidth(2); file.setframerate(rate); file.writeframes(pcm.tobytes())
print(output, '22s stereo original ambient score')

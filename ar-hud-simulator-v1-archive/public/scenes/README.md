# AR HUD Simulator — Scene Assets

Place your media files in the folders below.
The simulator automatically falls back to Three.js 3D mode if a file is missing.

---

## Videos  (`/public/scenes/videos/`)

| Filename           | Scenario | Recommended Source                              |
|--------------------|----------|-------------------------------------------------|
| `highway-day.mp4`  | Highway  | Pexels — search "highway driving pov 4k"        |
| `city-day.mp4`     | City     | Pexels — search "city driving pov"              |
| `night-drive.mp4`  | Night    | Pexels — search "night driving pov"             |

**Requirements:** H.264/MP4, 1920×1080 minimum, 10–30 seconds loopable, no audio needed.

---

## Images  (`/public/scenes/images/`)

| Filename           | Scenario | Notes                                  |
|--------------------|----------|----------------------------------------|
| `highway-day.jpg`  | Highway  | 1920×1080+, wide road perspective shot |
| `city-day.jpg`     | City     | 1920×1080+, urban street perspective  |
| `night-drive.jpg`  | Night    | 1920×1080+, low-light road scene       |

Used by Parallax mode. Any high-res road POV photo works well.

---

## Fallback Behaviour

- **Video mode:** file missing → automatic switch to Three.js 3D background
- **Parallax mode:** file missing → dark gradient overlay (no crash)
- **3D mode:** fully procedural, no external assets required

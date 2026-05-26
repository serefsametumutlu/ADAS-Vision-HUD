# AR HUD Simulator

> Interactive Augmented Reality Head-Up Display simulator for automotive ADAS applications. Built with React, Vite, Tailwind, and Three.js. Features real-time YOLO-style object detection overlay.

## Features

- **3 Background Modes**: Video loop, Three.js 3D scene, Parallax static
- **3 Scenarios**: Highway, City, Night
- **Real-time AR Overlay**: Navigation carpet, vehicle detection, lane guides, roadside chevrons
- **YOLO Object Detection**: 5-object live detection with confidence bars and bounding boxes
- **Live Telemetry**: Speed, RPM, fuel, GPS, autonomy level, ADAS status
- **Warning System**: Collision, lane departure, speeding, pedestrian alerts
- **Calibration Tool**: Runtime perspective adjustment for any video
- **Developer Panel**: Full manual control over every parameter
- **Cinematic Mode**: Hide all UI for clean screenshots
- **Kiosk Mode**: Fullscreen Chrome launcher

## Quick Start

```bash
cd ar-hud-simulator
npm install
npm start            # dev server with banner
npm run kiosk        # fullscreen kiosk mode (Chrome)
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Pause/Resume |
| `D` | Toggle Dev Panel |
| `K` | Toggle Calibration |
| `M` | Cinematic Mode |
| `F` | Fullscreen |
| `H` or `?` | Help Overlay |
| `1` / `2` / `3` | Highway / City / Night scenarios |
| `V` / `T` / `P` | Video / Three.js / Parallax modes |
| `C` | Trigger Collision |
| `L` | Trigger Lane Departure |
| `S` | Trigger Speeding |
| `R` | Trigger Pedestrian |
| `Esc` | Clear All Warnings |

## Media Assets

Place your video/image files in:

```
public/scenes/
├── videos/   highway-day.mp4 · city-day.mp4 · night-drive.mp4
└── images/   highway-day.jpg · city-day.jpg · night-drive.jpg
```

Without video files, the app falls back to the 3D Three.js scene automatically.

## Calibration

Press `K` to open Calibration mode and align AR overlays to your video:

1. Set **Horizon Y** to match the road vanishing point
2. Adjust **Road Width** and **Carpet Depth** to fit the road
3. Move **Vehicle X/Y** to align the detection frame with the lead car
4. Click **Reset to Defaults** to revert

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS v3
- Zustand (state management)
- Framer Motion (animations)
- Three.js + React Three Fiber (3D scene)
- Lucide React (icons)

## Project Structure

```
ar-hud-simulator/
├── public/
│   ├── scenes/
│   │   ├── videos/
│   │   └── images/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── hud/
│   │   │   ├── ar/           NavigationCarpet, LaneGuides, RoadsideChevrons, YoloOverlay
│   │   │   ├── CalibrationOverlay.jsx
│   │   │   ├── CenterHudPod.jsx
│   │   │   ├── ObjectDetectionList.jsx
│   │   │   └── TopStatusBar.jsx
│   │   ├── scene/            VideoScene, ThreeScene, ParallaxScene
│   │   └── controls/         ControlPanel, HudSlider, HudToggle
│   ├── hooks/
│   ├── store/                simulationStore (Zustand)
│   └── App.jsx
└── scripts/
    ├── banner.js
    └── launch-kiosk.js
```

## Checklist

- [x] `npm install` runs without errors
- [x] `npm start` opens localhost:5173
- [x] Boot sequence plays
- [x] AR overlay renders on scene (calibrate with K)
- [x] All 3 scenario transitions work
- [x] All 3 background mode transitions work
- [x] Keyboard shortcuts functional
- [x] Warning triggers work visually
- [x] YOLO detection boxes visible in video/parallax modes
- [x] `npm run build` completes without errors
- [x] `npm run kiosk` launches Chrome fullscreen

## License

MIT — Portfolio project demonstrating AR HUD design and ADAS visualization principles.

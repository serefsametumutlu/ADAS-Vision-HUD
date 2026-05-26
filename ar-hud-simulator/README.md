<div align="center">

# AR HUD Simulator v2.0

**Interactive 3D Augmented Reality HUD with real-time AI object detection**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black?logo=threedotjs)](https://threejs.org)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-COCO--SSD-FF6F00?logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> A fully browser-based ADAS visualization simulator — no backend, no native code, pure web technology.

<!-- ============================================================
     VIDEO DEMO
     1. Repo sayfasında yeni bir Issue aç
     2. Video dosyasını comment kutusuna sürükle-bırak
     3. GitHub'ın ürettiği URL'yi buraya yapıştır (mp4 linkini)
     4. Aşağıdaki satırı güncelle:
     https://github.com/user-attachments/assets/BURAYA-YAPISTIR
     ============================================================ -->

https://github.com/user-attachments/assets/DEMO_VIDEO_BURAYA

</div>

---

## What is this?

AR HUD Simulator is a **browser-native Level 2 ADAS cockpit** that combines:

- A **procedurally generated 3D world** (Three.js) you drive through in first person
- **Real-time ML object detection** (TensorFlow.js + COCO-SSD) running directly in the browser at ~5 FPS
- An **intelligent ADAS Brain** that reacts to detections — slowing for pedestrians, stopping at stop signs, tracking speed limits
- A **full cockpit HUD** — speed, fuel, battery, navigation, seat occupancy, mini-map, contextual warnings

No video files. No pre-recorded clips. Everything is generated and detected live.

---

## Features

| Feature | Description |
|---------|-------------|
| 3D World | Procedural road, vehicles, pedestrians, traffic signs & lights — no static assets |
| COCO-SSD Detection | Person, car, stop sign, traffic light — bounding boxes with confidence + distance estimate |
| ADAS Brain | Autonomous speed control, stop sign compliance, pedestrian avoidance, speed limit tracking |
| Cockpit HUD | Speed pod, telemetry panel, ADAS status panel, navigation bar, mini-map |
| Seat Monitor | 4-seat occupancy + seatbelt status with visual warnings |
| Warning System | Contextual alerts: "YAYA TESPİT EDİLDİ · YAVAŞLIYOR", "STOP TABELASI · DURUYOR" |
| Boot Sequence | Cinematic typewriter startup animation |
| Dev Control Panel | Full manual control — speed, gear, lane, ADAS toggles, manual warning triggers |
| Cinematic Mode | Hides all UI panels — only the world, detection boxes, and core HUD remain |
| FPS Monitor | Real-time render FPS counter (green/amber/red) |
| Error Boundary | Sci-fi glitch screen on unexpected runtime error |
| Keyboard Shortcuts | Full keyboard control for everything |

---

## Quick Start

```bash
git clone https://github.com/serefsametumutlu/ADAS-Vision-HUD.git
cd ADAS-Vision-HUD/ar-hud-simulator
npm install
npm run dev
```

Open **http://localhost:5173**

- Boot animation plays for ~3.5s
- TensorFlow.js + COCO-SSD model loads (~5–10s, progress shown top-right)
- Drive through the 3D scene and watch ADAS respond in real-time

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Pause / Resume simulation |
| `D` | Toggle Dev Control Panel |
| `M` | Toggle Cinematic Mode |
| `F` | Toggle Fullscreen |
| `H` or `?` | Help overlay (all shortcuts) |
| `O` | Toggle object detection on/off |
| `W` / `S` | Increase / decrease target speed (±10 km/h) |
| `←` / `→` | Change lane left / right |
| `C` | Trigger collision warning manually |
| `L` | Trigger lane departure warning manually |
| `1` `2` `3` `4` | Toggle seatbelt for each seat |
| `Esc` | Close overlay / clear all warnings |

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER TAB                             │
│                                                                 │
│  ┌──────────────────────────────┐                               │
│  │   Three.js 3D Scene          │  @react-three/fiber           │
│  │   - Procedural road loop     │  60 FPS WebGL render          │
│  │   - NPC vehicles             │                               │
│  │   - Pedestrians (animated)   │                               │
│  │   - Traffic signs & lights   │                               │
│  └──────────┬───────────────────┘                               │
│             │ canvas ref                                         │
│             ▼                                                    │
│  ┌──────────────────────────────┐                               │
│  │   TensorFlow.js COCO-SSD     │  WebGL backend                │
│  │   Scans canvas @ 5 FPS       │  ~200ms per inference         │
│  │   Returns: class, bbox,      │                               │
│  │           confidence score   │                               │
│  └──────────┬───────────────────┘                               │
│             │ detections[]                                       │
│             ▼                                                    │
│  ┌──────────────────────────────┐                               │
│  │   ADAS Brain (Zustand)       │  Rule-based decision engine   │
│  │   stop_sign  → speed = 0     │                               │
│  │   person     → speed = 15    │                               │
│  │   car nearby → brake         │                               │
│  │   speed sign → update limit  │                               │
│  └──────────┬───────────────────┘                               │
│             │ store state                                        │
│             ▼                                                    │
│  ┌──────────────────────────────┐                               │
│  │   HUD Overlay (React)        │  Glassmorphism + Tailwind     │
│  │   Detection boxes + labels   │                               │
│  │   Speed, nav, seats, map     │                               │
│  │   Warning banners            │                               │
│  └──────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architecture

```
ar-hud-simulator/src/
├── App.jsx                          # Root: boot gate + cinematic mode control
├── store/
│   └── simulationStore.js           # Zustand global state (physics, ADAS, UI)
├── components/
│   ├── BootSequence.jsx             # Typewriter startup animation
│   ├── HelpOverlay.jsx              # Keyboard shortcut modal
│   ├── PerfMonitor.jsx              # Real-time FPS counter
│   ├── ErrorBoundary.jsx            # Glitch-themed error screen
│   ├── controls/
│   │   └── ControlPanel.jsx         # Dev panel (slide-in, D key)
│   ├── hud/
│   │   ├── TopStatusBar.jsx         # GPS, clock, lane status
│   │   ├── CenterSpeedPod.jsx       # Main speed display
│   │   ├── LeftPanel_Telemetry.jsx  # Fuel, battery, acceleration
│   │   ├── RightPanel_ADAS.jsx      # ADAS status + autonomy level
│   │   ├── SeatPanel.jsx            # 4-seat occupancy + belt icons
│   │   ├── MiniMap.jsx              # Top-down position map
│   │   ├── WarningSystem.jsx        # Contextual warning banners
│   │   ├── DetectionOverlay.jsx     # Bounding boxes on windshield
│   │   └── DetectionStatusIndicator.jsx
│   └── world/
│       ├── World.jsx                # R3F Canvas + scene root
│       ├── Road.jsx                 # Looping road geometry
│       ├── Environment3D.jsx        # Sky, lighting, fog
│       ├── SceneObjects.jsx         # NPC spawning + management
│       ├── SimulationLoop.jsx       # Physics tick (useFrame)
│       ├── EgoCamera.jsx            # First-person camera
│       └── objects/
│           ├── Vehicle.jsx
│           ├── Pedestrian.jsx
│           ├── TrafficLight.jsx
│           └── TrafficSign.jsx
├── detection/
│   ├── useObjectDetector.js         # TensorFlow.js + COCO-SSD hook
│   ├── useADASBrain.js              # Detection → ADAS response logic
│   └── useSpeedLimitDetector.js     # Speed sign parsing
├── hooks/
│   └── useKeyboardShortcuts.js      # All keyboard controls
└── utils/
    └── safetyMonitor.js             # Seatbelt warning logic
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + Vite 8 |
| 3D Engine | Three.js r160 via @react-three/fiber + @react-three/drei |
| ML / Detection | TensorFlow.js 4.x + COCO-SSD |
| State | Zustand |
| Styling | Tailwind CSS v3 (glassmorphism dark theme) |
| Animation | Framer Motion |
| Font | Orbitron (tech/HUD aesthetic) |

---

## Performance

- **3D render**: 60 FPS target (WebGL)
- **Object detection**: ~5 FPS (200ms intervals, WebGL backend)
- **COCO-SSD model size**: ~10 MB (downloaded once, cached)
- **Build size**: ~2.4 MB JS (646 KB gzip)
- **Zero backend**: Runs entirely in the browser

---

## Dev Control Panel

Press `D` to open the slide-in control panel:

- **VEHICLE** — target speed slider, gear selector (P/R/N/D/S), lane (Left / Center / Right)
- **ADAS** — toggle Cruise Control, Auto Brake, Lane Keep Assist, Blind Spot Monitor; set Autonomy Level (0–5)
- **SEATS** — toggle occupied/empty + belt on/off per seat
- **WARNINGS** — one-click trigger for: Stop Sign, Pedestrian, Collision, Speeding, Lane Departure
- **SIMULATION** — Pause/Resume, Cinematic Mode

---

## License

MIT — Built as a portfolio project demonstrating browser-native ADAS visualization and on-device ML inference.

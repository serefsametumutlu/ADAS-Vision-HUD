import { create } from 'zustand';

export const useSimulationStore = create((set, get) => ({
  // === EGO ARAÇ ===
  speed: 0,
  targetSpeed: 60,
  acceleration: 0,
  steeringAngle: 0,
  position: { x: 0, z: 0 },
  heading: 0,

  // === ARAÇ DURUMU ===
  fuel: 78,
  range: 412,
  gear: 'D',

  // === KOLTUK / YOLCU ===
  seats: {
    driver:     { occupied: true,  beltOn: true,  name: 'Driver'    },
    passenger:  { occupied: true,  beltOn: false, name: 'Passenger' },
    rearLeft:   { occupied: false, beltOn: false, name: '-'         },
    rearRight:  { occupied: true,  beltOn: true,  name: 'Rear R'    },
  },

  // === NAVİGASYON ===
  nextManeuver: 'straight',
  distanceToManeuver: 750,
  destination: 'Konya Center',
  eta: '14:32',
  totalDistance: 18.4,
  remainingDistance: 12.7,

  // === HIZ LİMİTİ ===
  speedLimit: 50,

  // === DETECTION DURUMU ===
  detections: [],
  laneDetected: true,

  // === ADAS ===
  adas: {
    cruiseEnabled: true,
    autoBrakeEnabled: true,
    laneKeepEnabled: true,
    autonomyLevel: 2,
  },

  // === UYARILAR ===
  warnings: [],

  // === SİMÜLASYON ===
  isPaused: false,
  isCinematic: false,
  devPanelOpen: false,
  detectionEnabled: true,
  bootComplete: false,


  // === ACTIONS ===
  setSpeed: (v) => set({ speed: Math.max(0, Math.min(240, v)) }),
  setTargetSpeed: (v) => set({ targetSpeed: v }),
  setPosition: (p) => set({ position: p }),
  setHeading: (h) => set({ heading: h }),
  setDetections: (d) => set({ detections: d }),
  setSpeedLimit: (v) => set({ speedLimit: v }),

  setSeatStatus: (seatKey, status) => set(s => ({
    seats: { ...s.seats, [seatKey]: { ...s.seats[seatKey], ...status } }
  })),

  togglePause: () => set(s => ({ isPaused: !s.isPaused })),
  toggleCinematic: () => set(s => ({ isCinematic: !s.isCinematic })),
  toggleDevPanel: () => set(s => ({ devPanelOpen: !s.devPanelOpen })),
  toggleDetection: () => set(s => ({ detectionEnabled: !s.detectionEnabled })),
  setBootComplete: (b) => set({ bootComplete: b }),

  addWarning: (warning) => {
    const id = Date.now() + Math.random();
    set(s => ({ warnings: [...s.warnings, { ...warning, id, timestamp: Date.now() }] }));
    setTimeout(() => {
      set(s => ({ warnings: s.warnings.filter(w => w.id !== id) }));
    }, warning.duration || 5000);
  },
  clearWarnings: () => set({ warnings: [] }),

  tick: (delta) => {
    const s = get();
    if (s.isPaused) return;

    // Batch all physics updates into a single set() call → one re-render instead of 4
    const update = {};

    if (s.adas.cruiseEnabled) {
      const diff  = s.targetSpeed - s.speed;
      const accel = Math.max(-15, Math.min(8, diff * 0.6));
      update.speed        = Math.max(0, s.speed + accel * delta);
      update.acceleration = accel;
    }

    const spd = update.speed ?? s.speed;
    const speedMs = spd / 3.6;
    update.position = {
      x: s.position.x + Math.sin(s.heading) * speedMs * delta,
      z: s.position.z - Math.cos(s.heading) * speedMs * delta,
    };

    if (spd > 5 && Math.random() < 0.001) {
      update.fuel = Math.max(0, s.fuel - 0.1);
    }

    set(update);
  },
}));

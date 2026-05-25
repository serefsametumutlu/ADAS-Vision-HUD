import { create } from 'zustand';

export const useSimulationStore = create((set, get) => ({
  // === VEHICLE STATE ===
  speed: 0,
  targetSpeed: 90,
  rpm: 0,
  gear: 'D',
  fuel: 78,
  battery: 92,
  range: 412,

  // === NAVIGATION ===
  nextManeuver: 'straight',
  distanceToManeuver: 750,
  destination: 'City Center',
  eta: '14:32',
  totalDistance: 18.4,
  remainingDistance: 12.7,
  currentRoad: 'D-330 Highway',

  // === LANE & ROAD ===
  currentLane: 2,
  totalLanes: 3,
  laneDeparture: false,

  // === VEHICLE AHEAD ===
  vehicleAhead: {
    detected: true,
    distance: 20.7,
    relativeSpeed: -5,
    type: 'car',
  },

  // === SPEED LIMIT ===
  speedLimit: 100,
  speedLimitDistance: 500,

  // === WARNINGS ===
  warnings: [],

  // === DETECTED OBJECTS ===
  detectedObjects: [
    { id: 1, type: 'vehicle',     label: 'Sedan',       distance: 850, confidence: 0.94 },
    { id: 2, type: 'vehicle',     label: 'SUV',         distance: 700, confidence: 0.91 },
    { id: 3, type: 'sign',        label: 'Speed Limit', distance: 540, confidence: 0.88 },
    { id: 4, type: 'pedestrian',  label: 'Person',      distance: 240, confidence: 0.82 },
    { id: 5, type: 'vehicle',     label: 'Car Ahead',   distance: 20.7, confidence: 0.97 },
  ],

  // === ADAS STATUS ===
  adas: {
    laneKeep: true,
    adaptiveCruise: true,
    autoEmergencyBrake: true,
    blindSpotMonitor: true,
    autonomyLevel: 2,
  },

  // === SIMULATION CONTROL ===
  scenario: 'highway',
  backgroundMode: 'video',
  isPaused: false,
  autoMode: true,
  devPanelOpen: false,
  toolbarCompact: false,
  cinematicMode: false,

  // === TELEMETRY LOGS ===
  telemetryLogs: [],

  // === TIME ===
  time: new Date(),

  // === ACTIONS ===
  setSpeed:          (speed)          => set({ speed: Math.max(0, Math.min(240, speed)) }),
  setTargetSpeed:    (targetSpeed)    => set({ targetSpeed }),
  setScenario:       (scenario)       => set({ scenario }),
  setBackgroundMode: (backgroundMode) => set({ backgroundMode }),
  setGear:           (gear)           => set({ gear }),
  setLane:           (lane)           => set({ currentLane: lane }),
  toggleAuto:           ()  => set(s => ({ autoMode:       !s.autoMode       })),
  togglePause:          ()  => set(s => ({ isPaused:        !s.isPaused        })),
  toggleDevPanel:       ()  => set(s => ({ devPanelOpen:    !s.devPanelOpen    })),
  toggleToolbarCompact: ()  => set(s => ({ toolbarCompact:  !s.toolbarCompact  })),
  toggleCinematicMode:  ()  => set(s => ({ cinematicMode:   !s.cinematicMode   })),

  addLog: (log) => set(s => ({
    telemetryLogs: [
      ...s.telemetryLogs.slice(-5),
      { ...log, id: Date.now() + Math.random() },
    ],
  })),

  // === WARNING SYSTEM ===
  triggerWarning: (warning) => {
    const id = Date.now() + Math.random();
    set(s => ({ warnings: [...s.warnings, { ...warning, id, timestamp: Date.now() }] }));
    setTimeout(() => {
      set(s => ({ warnings: s.warnings.filter(w => w.id !== id) }));
    }, warning.duration ?? 5000);
  },
  clearWarning:     (id) => set(s => ({ warnings: s.warnings.filter(w => w.id !== id) })),
  clearAllWarnings: ()   => set({ warnings: [] }),

  // === SCENARIO TRIGGERS ===
  triggerCollisionWarning: () => get().triggerWarning({
    type: 'collision', severity: 'danger',
    message: 'VEHICLE AHEAD — BRAKE NOW!', duration: 4000,
  }),

  triggerLaneDeparture: () => {
    set({ laneDeparture: true });
    get().triggerWarning({
      type: 'lane', severity: 'warning',
      message: 'LANE DEPARTURE DETECTED', duration: 3500,
    });
    setTimeout(() => set({ laneDeparture: false }), 3500);
  },

  triggerSpeedingWarning: () => get().triggerWarning({
    type: 'speeding', severity: 'warning',
    message: `SPEED LIMIT EXCEEDED (${get().speedLimit} km/h)`, duration: 4000,
  }),

  triggerPedestrian: () => get().triggerWarning({
    type: 'pedestrian', severity: 'danger',
    message: 'PEDESTRIAN DETECTED — CAUTION', duration: 3000,
  }),

  // === SIMULATION TICK ===
  tick: () => {
    const s = get();
    if (s.isPaused) return;

    if (s.autoMode) {
      const diff = s.targetSpeed - s.speed;
      const newSpeed = s.speed + diff * 0.02 + (Math.random() - 0.5) * 0.8;
      set({ speed: Math.max(0, Math.min(240, newSpeed)) });

      const newDist = Math.max(8, s.vehicleAhead.distance + (Math.random() - 0.5) * 1.2);
      set({ vehicleAhead: { ...s.vehicleAhead, distance: parseFloat(newDist.toFixed(1)) } });

      const mDelta = s.speed / 36; // m/tick at 50 ms intervals
      const newMDist = s.distanceToManeuver - mDelta;
      set({ distanceToManeuver: newMDist < 40 ? 750 : parseFloat(newMDist.toFixed(0)) });

      const newSlDist = Math.max(0, s.speedLimitDistance - mDelta);
      set({ speedLimitDistance: newSlDist <= 0 ? 600 : parseFloat(newSlDist.toFixed(0)) });
    }

    const curSpeed = get().speed;
    set({ rpm: Math.round(800 + (curSpeed / 240) * 6200) });
    set({ time: new Date() });

    if (get().speed > get().speedLimit + 8 && Math.random() < 0.001) {
      get().triggerSpeedingWarning();
    }
  },
}));

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

  // === CALIBRATION ===
  calibration: {
    horizonY: 45,
    vanishingX: 50,
    roadWidth: 28,
    carpetDepth: 65,
    perspective: 800,
    showCalibration: false,
    vehiclePosX: 50,
    vehiclePosY: 50,
    vehicleBaseSize: 12,
  },

  setCalibration: (key, value) => set(state => ({
    calibration: { ...state.calibration, [key]: value }
  })),
  toggleCalibration: () => set(state => ({
    calibration: { ...state.calibration, showCalibration: !state.calibration.showCalibration }
  })),

  // === SIMULATION CONTROL ===
  scenario: 'highway',
  backgroundMode: '3d',
  isPaused: false,
  autoMode: true,
  devPanelOpen: false,
  toolbarCompact: false,
  cinematicMode: false,
  helpOverlayOpen: false,
  theme: 'cyan',
  showPerfMonitor: false,

  // === TELEMETRY LOGS ===
  telemetryLogs: [],

  // === TIME ===
  time: new Date(),

  // === ACTIONS ===
  setSpeed:               (speed)          => set({ speed: Math.max(0, Math.min(240, speed)) }),
  setTargetSpeed:         (targetSpeed)    => set({ targetSpeed }),
  setScenario:            (scenario)       => set({ scenario }),
  setBackgroundMode:      (backgroundMode) => set({ backgroundMode }),
  setGear:                (gear)           => set({ gear }),
  setLane:                (lane)           => set({ currentLane: lane }),
  setFuel:                (fuel)           => set({ fuel }),
  setBattery:             (battery)        => set({ battery }),
  setNextManeuver:        (v)              => set({ nextManeuver: v }),
  setDistanceToManeuver:  (v)              => set({ distanceToManeuver: v }),
  setDestination:         (v)              => set({ destination: v }),
  setCurrentRoad:         (v)              => set({ currentRoad: v }),
  setSpeedLimit:          (v)              => set({ speedLimit: v }),
  setSpeedLimitDistance:  (v)              => set({ speedLimitDistance: v }),
  setVehicleAhead:        (key, value)     => set(s => ({ vehicleAhead: { ...s.vehicleAhead, [key]: value } })),
  setADAS:                (key, value)     => set(s => ({ adas: { ...s.adas, [key]: value } })),
  toggleAuto:             ()  => set(s => ({ autoMode:       !s.autoMode       })),
  togglePause:            ()  => set(s => ({ isPaused:        !s.isPaused        })),
  toggleDevPanel:         ()  => set(s => ({ devPanelOpen:    !s.devPanelOpen    })),
  toggleToolbarCompact:   ()  => set(s => ({ toolbarCompact:  !s.toolbarCompact  })),
  toggleCinematicMode:    ()  => set(s => ({ cinematicMode:   !s.cinematicMode   })),
  toggleHelpOverlay:      ()  => set(s => ({ helpOverlayOpen:  !s.helpOverlayOpen  })),
  setTheme:               (theme)  => set({ theme }),
  togglePerfMonitor:      ()  => set(s => ({ showPerfMonitor: !s.showPerfMonitor  })),

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
      const newSpeed = s.speed + diff * 0.06 + (Math.random() - 0.5) * 0.6;
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

    // Auto speeding warning
    if (get().speed > get().speedLimit + 5 && Math.random() < 0.002) {
      get().triggerSpeedingWarning();
    }

    // Auto collision warning when vehicle is dangerously close
    const st = get();
    if (st.vehicleAhead.detected && st.vehicleAhead.distance < 14
        && !st.warnings.some(w => w.type === 'collision')
        && Math.random() < 0.04) {
      setTimeout(() => get().triggerCollisionWarning(), 0);
    }

    // Auto lane departure (random, more likely in city)
    const ldChance = st.scenario === 'city' ? 0.0009 : 0.0004;
    if (!st.laneDeparture && Math.random() < ldChance) {
      setTimeout(() => get().triggerLaneDeparture(), 0);
    }

    // Auto pedestrian alert in city
    if (st.scenario === 'city' && Math.random() < 0.0004
        && !st.warnings.some(w => w.type === 'pedestrian')) {
      setTimeout(() => get().triggerPedestrian(), 0);
    }
  },
}));

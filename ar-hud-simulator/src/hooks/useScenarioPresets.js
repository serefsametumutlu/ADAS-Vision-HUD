import { useSimulationStore } from '../store/simulationStore';

const PRESETS = {
  highway: {
    targetSpeed: 110,
    speedLimit: 120,
    currentRoad: 'O-21 Highway',
    totalLanes: 3,
    currentLane: 2,
    scenario: 'highway',
    nextManeuver: 'straight',
    distanceToManeuver: 850,
  },
  city: {
    targetSpeed: 50,
    speedLimit: 50,
    currentRoad: 'Mevlana Avenue',
    totalLanes: 2,
    currentLane: 1,
    scenario: 'city',
    nextManeuver: 'left',
    distanceToManeuver: 320,
  },
  night: {
    targetSpeed: 70,
    speedLimit: 90,
    currentRoad: 'D-330 Highway',
    totalLanes: 2,
    currentLane: 1,
    scenario: 'night',
    nextManeuver: 'right',
    distanceToManeuver: 560,
  },
};

export function applyScenarioPreset(scenario) {
  useSimulationStore.setState(PRESETS[scenario] ?? PRESETS.highway);
}

export function useScenarioPresets() {
  return { applyScenarioPreset, presets: PRESETS };
}

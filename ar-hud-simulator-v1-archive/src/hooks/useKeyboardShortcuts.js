import { useEffect } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { applyScenarioPreset } from './useScenarioPresets';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handle = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const store = useSimulationStore.getState();
      const key = e.key.toLowerCase();

      switch (key) {
        case ' ':
          e.preventDefault();
          store.togglePause();
          break;
        case 'd':
          store.toggleDevPanel();
          break;
        case 'k':
          store.toggleCalibration();
          break;
        case 'm':
          store.toggleCinematicMode();
          break;
        case 'escape':
          if (store.cinematicMode) store.toggleCinematicMode();
          if (store.helpOverlayOpen) store.toggleHelpOverlay();
          store.clearAllWarnings();
          break;
        case '1':
          applyScenarioPreset('highway');
          break;
        case '2':
          applyScenarioPreset('city');
          break;
        case '3':
          applyScenarioPreset('night');
          break;
        case 'v':
          store.setBackgroundMode('video');
          break;
        case 't':
          store.setBackgroundMode('3d');
          break;
        case 'p':
          store.setBackgroundMode('parallax');
          break;
        case 'c':
          store.triggerCollisionWarning();
          break;
        case 'l':
          store.triggerLaneDeparture();
          break;
        case 's':
          store.triggerSpeedingWarning();
          break;
        case 'r':
          store.triggerPedestrian();
          break;
        case 'f':
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen().catch(() => {});
          break;
        case 'h':
        case '?':
          store.toggleHelpOverlay();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);
}

import { useEffect } from 'react';
import { useSimulationStore } from '../store/simulationStore';

export function useKeyboardShortcuts() {
  const store = useSimulationStore;

  useEffect(() => {
    const handler = (e) => {
      // Ignore when typing in an input/select
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      const s = store.getState();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          s.togglePause();
          break;

        case 'KeyD':
          // Only toggle dev panel; lane change uses arrow keys
          s.toggleDevPanel();
          break;

        case 'KeyM':
          s.toggleCinematic();
          break;

        case 'KeyF':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
          } else {
            document.exitFullscreen?.();
          }
          break;

        case 'KeyH':
        case 'Slash': // '?' is Shift+Slash; plain '/' is Slash
          if (e.key === 'h' || e.key === 'H' || e.key === '?') {
            s.setHelpOpen(!s.helpOpen);
          }
          break;

        case 'KeyO':
          s.toggleDetection();
          break;

        case 'KeyW':
          s.setTargetSpeed(Math.min(200, s.targetSpeed + 10));
          break;

        case 'KeyS':
          s.setTargetSpeed(Math.max(0, s.targetSpeed - 10));
          break;

        case 'ArrowLeft':
          s.setLane(Math.max(0, s.lane - 1));
          break;

        case 'ArrowRight':
          s.setLane(Math.min(2, s.lane + 1));
          break;

        case 'KeyC':
          s.addWarning({ type: 'collision', message: 'ÇARPIŞMA UYARISI · FREN YAPILIYOR', severity: 'critical', duration: 4000 });
          break;

        case 'KeyL':
          s.addWarning({ type: 'lane', message: 'ŞERİT İHLALİ · DÜZELTİLİYOR', severity: 'warning', duration: 3000 });
          break;

        case 'Digit1':
          s.setSeatStatus('driver', { beltOn: !store.getState().seats.driver.beltOn });
          break;
        case 'Digit2':
          s.setSeatStatus('passenger', { beltOn: !store.getState().seats.passenger.beltOn });
          break;
        case 'Digit3':
          s.setSeatStatus('rearLeft', { beltOn: !store.getState().seats.rearLeft.beltOn });
          break;
        case 'Digit4':
          s.setSeatStatus('rearRight', { beltOn: !store.getState().seats.rearRight.beltOn });
          break;

        case 'Escape':
          if (s.helpOpen) { s.setHelpOpen(false); return; }
          if (s.devPanelOpen) { s.toggleDevPanel(); return; }
          s.clearWarnings();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [store]);
}

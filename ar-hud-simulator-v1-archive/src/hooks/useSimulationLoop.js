import { useEffect } from 'react';
import { useSimulationStore } from '../store/simulationStore';

const TICK_INTERVAL = 50; // ms — 20 state updates/sec

export function useSimulationLoop() {
  const tick = useSimulationStore(s => s.tick);

  useEffect(() => {
    let raf;
    let lastTime = 0;

    const loop = (time) => {
      if (time - lastTime >= TICK_INTERVAL) {
        tick();
        lastTime = time;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tick]);
}

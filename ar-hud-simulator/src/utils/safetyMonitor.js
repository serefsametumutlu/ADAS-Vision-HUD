import { useEffect } from 'react';
import { useSimulationStore } from '../store/simulationStore';

export function useSafetyMonitor() {
  useEffect(() => {
    const id = setInterval(() => {
      const { seats, speed, addWarning } = useSimulationStore.getState();
      if (speed < 20) return;

      const unbelted = Object.entries(seats).filter(([, s]) => s.occupied && !s.beltOn);
      if (unbelted.length === 0) return;

      const hasRear = unbelted.some(([k]) => k.startsWith('rear'));
      addWarning({
        severity: 'warning',
        icon:     'default',
        message:  hasRear ? 'REAR PASSENGER · SEATBELT REMINDER' : `SEATBELT · ${unbelted.length} UNBELTED`,
        detail:   `Unbelted: ${unbelted.map(([k]) => k.toUpperCase()).join(', ')}`,
        duration: 4500,
      });
    }, 25_000);

    return () => clearInterval(id);
  }, []);
}

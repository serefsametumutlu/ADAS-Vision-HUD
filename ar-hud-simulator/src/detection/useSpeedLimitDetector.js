import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../store/simulationStore';

// Must match scenario.js sign positions (z values)
const SPEED_SIGNS = [
  { z: -45,  limit: 50  },
  { z: -255, limit: 80  },
  { z: -405, limit: 100 },
];

export function useSpeedLimitDetector() {
  const triggered = useRef(new Set());

  useEffect(() => {
    let prevZ = null;

    const unsub = useSimulationStore.subscribe(state => {
      const { position, setSpeedLimit, setTargetSpeed, addWarning } = state;
      if (position.z === prevZ) return;
      prevZ = position.z;

      SPEED_SIGNS.forEach(sign => {
        // Ego moves in -z direction. sign.z is negative.
        // aheadDist = how far ahead the sign is (positive = sign is in front)
        // Ego at z=0, sign at z=-45 → aheadDist = 0 - (-45) = 45 (sign 45m ahead)
        const aheadDist = position.z - sign.z;
        const inRange   = aheadDist > -5 && aheadDist < 100;

        if (inRange && !triggered.current.has(sign.z)) {
          triggered.current.add(sign.z);
          setSpeedLimit(sign.limit);
          setTargetSpeed(sign.limit);
          addWarning({
            severity: 'info',
            icon: 'speed-limit',
            message: `SPEED LIMIT: ${sign.limit} KM/H`,
            detail: 'Speed limit sign detected',
            duration: 3500,
          });
        }
      });
    });

    return unsub;
  }, []);
}

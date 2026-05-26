import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../store/simulationStore';

export function useADASBrain() {
  const triggered = useRef(new Set());

  useEffect(() => {
    let prevDetections = null;

    const unsub = useSimulationStore.subscribe(state => {
      const { detections, speed, setTargetSpeed, addWarning } = state;
      if (detections === prevDetections) return;
      prevDetections = detections;

      detections.forEach(d => {
        const bucket = Math.floor(d.distance / 5) * 5;

        // ── STOP SIGN ──────────────────────────────────────────────────
        if (d.label === 'stop sign' && d.distance < 40) {
          const key = `stop-${bucket}`;
          if (!triggered.current.has(key)) {
            triggered.current.add(key);
            setTargetSpeed(0);
            addWarning({
              severity: 'warning', icon: 'stop',
              message:  'STOP SIGN · STOPPING',
              detail:   `Stop sign ${d.distance.toFixed(0)}m ahead`,
              duration: 4500,
            });
            setTimeout(() => setTargetSpeed(50), 5000);
          }
        }

        // ── PEDESTRIAN ─────────────────────────────────────────────────
        if (d.label === 'person' && d.distance < 30) {
          const key = `ped-${bucket}`;
          if (!triggered.current.has(key)) {
            triggered.current.add(key);
            const pedCount = detections.filter(x => x.label === 'person').length;
            const isSchool = pedCount >= 2;
            setTargetSpeed(isSchool ? 10 : 15);
            addWarning({
              severity: 'danger', icon: 'person',
              message:  isSchool
                ? 'HIGH PEDESTRIAN DENSITY · CAUTION'
                : 'PEDESTRIAN DETECTED · SLOWING',
              detail: `${d.distance.toFixed(0)}m ahead · ${pedCount > 1 ? pedCount + ' pedestrians' : '1 pedestrian'}`,
              duration: 4000,
            });
            setTimeout(() => setTargetSpeed(50), 6000);
          }
        }

        // ── TRAFFIC LIGHT ──────────────────────────────────────────────
        if (d.label === 'traffic light' && d.distance < 50) {
          const key = `light-${bucket}`;
          if (!triggered.current.has(key)) {
            triggered.current.add(key);
            if (Math.random() < 0.5) {
              setTargetSpeed(0);
              addWarning({
                severity: 'warning', icon: 'traffic-light',
                message:  'RED LIGHT · STOPPING',
                detail:   `Traffic light ${d.distance.toFixed(0)}m ahead`,
                duration: 4500,
              });
              setTimeout(() => setTargetSpeed(50), 6000);
            }
          }
        }

        // ── CLOSE VEHICLE ──────────────────────────────────────────────
        if ((d.label === 'car' || d.label === 'truck') && d.distance < 12) {
          const key = `close-${bucket}`;
          if (!triggered.current.has(key)) {
            triggered.current.add(key);
            setTargetSpeed(Math.max(20, speed * 0.7));
            addWarning({
              severity: 'danger', icon: 'collision',
              message:  d.distance < 6
                ? 'EMERGENCY BRAKE ACTIVATED'
                : 'CLOSE VEHICLE · SAFE DISTANCE',
              detail: `${d.label} ${d.distance.toFixed(0)}m ahead`,
              duration: 3500,
            });
          }
        }
      });
    });

    const clearId = setInterval(() => triggered.current.clear(), 15000);
    return () => { unsub(); clearInterval(clearId); };
  }, []);
}

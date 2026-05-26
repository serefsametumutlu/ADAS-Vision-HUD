import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../store/simulationStore';
import PulseDot from '../ui/PulseDot';

const LOG_TEMPLATES = [
  (s) => `LANE_DETECT: ${s.totalLanes} lanes confirmed`,
  (s) => `VEHICLE_AHEAD: ${s.vehicleAhead.distance.toFixed(1)}m @ ${Math.round(s.speed)}km/h`,
  ()  => `GPS_LOCK: ${10 + Math.floor(Math.random() * 3)} satellites acquired`,
  (s) => `SPEED_DELTA: ${s.speed > 0 ? '+' : ''}${(Math.random() * 4 - 2).toFixed(1)} km/h`,
  ()  => `OBJECT_FOUND: ${['Sedan','SUV','Truck','Motorcycle'][Math.floor(Math.random() * 4)]} ${Math.floor(300 + Math.random() * 600)}m`,
  ()  => `ADAS_CHECK: all systems nominal`,
  ()  => `MAP_UPDATE: route recalculated`,
  (s) => `SPEED_LIMIT: entering ${s.speedLimit} km/h zone`,
  ()  => `RADAR_LOCK: target acquired`,
  ()  => `BLIND_SPOT: clear`,
];

function nowStr() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function TelemetryConsole() {
  const logs     = useSimulationStore(s => s.telemetryLogs);
  const addLog   = useSimulationStore(s => s.addLog);
  const warnings = useSimulationStore(s => s.warnings);
  const loggedIds = useRef(new Set());
  const listRef   = useRef(null);

  // Auto-generate random telemetry lines
  useEffect(() => {
    const id = setInterval(() => {
      const state    = useSimulationStore.getState();
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      addLog({ time: nowStr(), message: template(state), type: 'info' });
    }, 1500);
    return () => clearInterval(id);
  }, [addLog]);

  // Mirror warnings to the log
  useEffect(() => {
    warnings.forEach(w => {
      if (!loggedIds.current.has(w.id)) {
        loggedIds.current.add(w.id);
        addLog({ time: nowStr(), message: `⚠ ALERT: ${w.message}`, type: 'warning' });
      }
    });
  }, [warnings, addLog]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [logs]);

  return (
    <div
      className="fixed z-30 border border-hud-cyan/25 backdrop-hud"
      style={{ bottom: '5.5rem', right: '2rem', width: 284, boxShadow: '0 0 15px rgba(0,240,200,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-hud-cyan/15">
        <span className="font-mono text-xs text-hud-cyan/60 tracking-widest uppercase">
          › Telemetry Log
        </span>
        <PulseDot color="cyan" size="sm" />
      </div>

      {/* Log list */}
      <div
        ref={listRef}
        className="overflow-hidden"
        style={{ height: 132 }}
      >
        <AnimatePresence initial={false}>
          {logs.map(log => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex gap-2 px-3 py-0.5"
            >
              <span className="font-mono text-xs shrink-0"
                    style={{ color: 'rgba(0,240,200,0.35)' }}>
                {log.time}
              </span>
              <span
                className="font-mono text-xs truncate"
                style={{
                  color: log.type === 'warning'
                    ? 'rgba(255,184,0,0.85)'
                    : 'rgba(255,255,255,0.55)',
                }}
              >
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

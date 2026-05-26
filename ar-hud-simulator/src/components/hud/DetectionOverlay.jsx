import { useSimulationStore } from '../../store/simulationStore';
import { motion, AnimatePresence } from 'framer-motion';

const COLOR_MAP = {
  person:          '#FF3B3B',
  car:             '#00F0C8',
  truck:           '#00F0C8',
  bus:             '#00F0C8',
  motorcycle:      '#FFB800',
  bicycle:         '#FFB800',
  'stop sign':     '#FF3B3B',
  'traffic light': '#FFB800',
};

export default function DetectionOverlay() {
  const detections = useSimulationStore(s => s.detections);

  return (
    <div className="fixed inset-0 z-[8] pointer-events-none">
      <AnimatePresence>
        {detections.map(d => {
          const color = COLOR_MAP[d.label] || '#00F0C8';
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.12 }}
              className="absolute"
              style={{
                left:   `${d.bbox.x}%`,
                top:    `${d.bbox.y}%`,
                width:  `${d.bbox.w}%`,
                height: `${d.bbox.h}%`,
              }}
            >
              {/* Ana çerçeve */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: `2px solid ${color}`,
                  boxShadow: `0 0 14px ${color}60, inset 0 0 12px ${color}18`,
                }}
              />

              {/* Köşe işaretleri */}
              {[
                'top-0 left-0 border-t-2 border-l-2',
                'top-0 right-0 border-t-2 border-r-2',
                'bottom-0 left-0 border-b-2 border-l-2',
                'bottom-0 right-0 border-b-2 border-r-2',
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute w-3 h-3 ${cls}`}
                  style={{ borderColor: color }}
                />
              ))}

              {/* Üst label */}
              <div
                className="absolute -top-5 left-0 px-1.5 py-0.5 text-[10px] font-mono tracking-widest uppercase whitespace-nowrap"
                style={{
                  background: 'rgba(0,20,30,0.88)',
                  color,
                  border: `1px solid ${color}70`,
                  textShadow: `0 0 5px ${color}`,
                }}
              >
                {d.label} · {Math.round(d.confidence * 100)}%
              </div>

              {/* Alt mesafe */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-tech tabular-nums whitespace-nowrap"
                style={{
                  background: 'rgba(0,20,30,0.82)',
                  color: '#ffffff',
                  border: `1px solid ${color}`,
                  textShadow: `0 0 5px ${color}`,
                }}
              >
                {d.distance.toFixed(1)} m
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

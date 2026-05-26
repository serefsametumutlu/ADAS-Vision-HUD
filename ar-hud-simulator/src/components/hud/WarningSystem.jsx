import { useSimulationStore } from '../../store/simulationStore';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle, Octagon, User,
  TrafficCone, Car, Gauge,
} from 'lucide-react';

const ICONS = {
  stop:            Octagon,
  person:          User,
  'traffic-light': TrafficCone,
  collision:       Car,
  'speed-limit':   Gauge,
  default:         AlertTriangle,
};

const SEVERITY_STYLES = {
  info: {
    color: '#00F0C8',
    bg:    'rgba(0, 50, 60, 0.85)',
    border:'#00F0C8',
    glow:  'rgba(0, 240, 200, 0.5)',
  },
  warning: {
    color: '#FFB800',
    bg:    'rgba(60, 40, 0, 0.85)',
    border:'#FFB800',
    glow:  'rgba(255, 184, 0, 0.5)',
  },
  danger: {
    color: '#FF3B3B',
    bg:    'rgba(60, 10, 10, 0.85)',
    border:'#FF3B3B',
    glow:  'rgba(255, 59, 59, 0.6)',
  },
};

export default function WarningSystem() {
  const warnings = useSimulationStore(s => s.warnings);
  const visible  = warnings.slice(-2);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[30] pointer-events-none w-[560px] max-w-[90vw]">
      <AnimatePresence>
        {visible.map(warning => {
          const Icon  = ICONS[warning.icon] || ICONS.default;
          const style = SEVERITY_STYLES[warning.severity] || SEVERITY_STYLES.info;
          const durationSec = (warning.duration || 5000) / 1000;

          return (
            <motion.div
              key={warning.id}
              initial={{ opacity: 0, y: -28, scale: 0.91 }}
              animate={{ opacity: 1, y: 0,   scale: 1 }}
              exit={{   opacity: 0, y: -16,  scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-2 rounded overflow-hidden backdrop-blur-md"
              style={{
                background:  style.bg,
                border:      `1px solid ${style.border}`,
                boxShadow:   `0 0 28px ${style.glow}, inset 0 0 12px ${style.glow}33`,
              }}
            >
              <div className="flex items-center gap-4 px-5 py-3">
                {/* Icon */}
                <motion.div
                  animate={warning.severity === 'danger' ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  <Icon
                    size={34}
                    style={{
                      color:  style.color,
                      filter: `drop-shadow(0 0 8px ${style.glow})`,
                    }}
                  />
                </motion.div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div
                    className="font-display text-base font-bold tracking-wide truncate"
                    style={{ color: style.color, textShadow: `0 0 6px ${style.glow}` }}
                  >
                    {warning.message}
                  </div>
                  {warning.detail && (
                    <div className="text-[11px] font-mono text-white/65 tracking-wider mt-0.5 truncate">
                      {warning.detail}
                    </div>
                  )}
                </div>

                {/* Pulse dot */}
                <motion.div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: style.color, boxShadow: `0 0 10px ${style.color}` }}
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 0.75, repeat: Infinity }}
                />
              </div>

              {/* Progress bar (countdown) */}
              <motion.div
                className="h-[3px]"
                style={{ background: style.color, transformOrigin: 'left' }}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: durationSec, ease: 'linear' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

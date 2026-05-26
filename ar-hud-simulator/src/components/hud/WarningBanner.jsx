import { useSimulationStore } from '../../store/simulationStore';
import { motion, AnimatePresence } from 'framer-motion';

const STYLES = {
  danger:  { bg: 'rgba(255,59,59,0.15)',  border: '#FF3B3B' },
  warning: { bg: 'rgba(255,184,0,0.13)',  border: '#FFB800' },
  info:    { bg: 'rgba(0,240,200,0.10)',  border: '#00F0C8' },
};

const ICON_TEXT = {
  stop:            '⬛ STOP',
  person:          '🚶 YAYA',
  'traffic-light': '🔴 IŞIK',
  collision:       '⚠ ÇARPIŞMA',
  'speed-limit':   '🔵 HIZ',
};

export default function WarningBanner() {
  const warnings = useSimulationStore(s => s.warnings);
  // Show at most the 2 most recent warnings to avoid blocking the view
  const visible = warnings.slice(-2);

  return (
    <div className="fixed top-14 right-[175px] z-[30] flex flex-col gap-1.5 items-end pointer-events-none">
      <AnimatePresence>
        {visible.map(w => {
          const st = STYLES[w.severity] || STYLES.info;
          return (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, x: 20, scale: 0.94 }}
              animate={{ opacity: 1, x: 0,  scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5 px-3 py-2 rounded font-tech backdrop-blur-sm"
              style={{
                background: st.bg,
                border: `1px solid ${st.border}55`,
                boxShadow: `0 0 12px ${st.border}33`,
                maxWidth: 280,
              }}
            >
              <span className="font-mono text-[9px] font-bold tracking-widest shrink-0 opacity-70" style={{ color: st.border }}>
                {ICON_TEXT[w.icon] || '[ ! ]'}
              </span>
              <div>
                <div className="text-[11px] font-bold tracking-wide leading-tight" style={{ color: st.border }}>
                  {w.message}
                </div>
                {w.detail && (
                  <div className="text-[9px] font-mono mt-0.5 text-white/45">{w.detail}</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

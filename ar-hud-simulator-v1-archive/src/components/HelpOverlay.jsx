import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../store/simulationStore';

const SHORTCUTS = {
  SCENE: [
    { key: '1', desc: 'Highway mode' },
    { key: '2', desc: 'City mode' },
    { key: '3', desc: 'Night mode' },
    { key: 'V', desc: 'Video background' },
    { key: 'T', desc: '3D background' },
    { key: 'P', desc: 'Parallax background' },
    { key: 'D', desc: 'Toggle control panel' },
    { key: 'K', desc: 'Calibration overlay' },
  ],
  WARNINGS: [
    { key: 'C', desc: 'Collision warning' },
    { key: 'L', desc: 'Lane departure' },
    { key: 'S', desc: 'Speeding alert' },
    { key: 'R', desc: 'Pedestrian detected' },
    { key: 'ESC', desc: 'Clear all warnings' },
  ],
  SYSTEM: [
    { key: 'SPACE', desc: 'Pause / Resume' },
    { key: 'M', desc: 'Cinematic mode' },
    { key: 'F', desc: 'Fullscreen' },
    { key: 'H / ?', desc: 'Toggle this help' },
    { key: 'ESC', desc: 'Exit cinematic / help' },
  ],
};

function KeyBadge({ k }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 border border-hud-cyan/30 bg-hud-cyan/5
                     font-mono text-[9px] text-hud-cyan tracking-widest rounded-sm min-w-[32px] justify-center">
      {k}
    </span>
  );
}

export default function HelpOverlay() {
  const { helpOverlayOpen, toggleHelpOverlay } = useSimulationStore();

  return (
    <AnimatePresence>
      {helpOverlayOpen && (
        <motion.div
          key="help"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center"
          onClick={toggleHelpOverlay}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 border border-hud-cyan/20 bg-black/80 backdrop-blur-xl p-6 max-w-2xl w-full mx-4
                       shadow-[0_0_40px_rgba(0,255,255,0.08)]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-mono text-hud-cyan tracking-[0.3em] uppercase text-sm">KEYBOARD SHORTCUTS</h2>
                <p className="font-mono text-white/25 text-[9px] tracking-widest mt-0.5">Press H or ? to close</p>
              </div>
              <button
                onClick={toggleHelpOverlay}
                className="font-mono text-[10px] text-white/30 hover:text-white/70 border border-white/10
                           hover:border-white/30 px-2 py-1 transition-all tracking-widest"
              >
                ESC
              </button>
            </div>

            {/* Shortcut grid */}
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(SHORTCUTS).map(([cat, items]) => (
                <div key={cat}>
                  <div className="font-mono text-[9px] tracking-[0.3em] text-hud-cyan/50 uppercase mb-3 pb-1 border-b border-hud-cyan/10">
                    {cat}
                  </div>
                  <div className="flex flex-col gap-2">
                    {items.map(({ key, desc }) => (
                      <div key={key} className="flex items-center gap-2">
                        <KeyBadge k={key} />
                        <span className="font-mono text-[9px] text-white/40 tracking-wide">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-white/5 text-center">
              <span className="font-mono text-[8px] text-white/20 tracking-[0.2em] uppercase">
                AR HUD Simulator — Control Reference
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

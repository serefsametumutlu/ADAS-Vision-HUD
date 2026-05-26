import { useSimulationStore } from '../store/simulationStore';

const SHORTCUTS = [
  { key: 'Space',   desc: 'Pause / Resume' },
  { key: 'D',       desc: 'Dev Control Panel' },
  { key: 'M',       desc: 'Cinematic Mode' },
  { key: 'F',       desc: 'Fullscreen' },
  { key: 'H / ?',   desc: 'Help Overlay' },
  { key: 'O',       desc: 'Toggle Object Detection' },
  { key: 'W / S',   desc: 'Speed Up / Down (+10 km/h)' },
  { key: '← / →',  desc: 'Lane Change Left / Right' },
  { key: 'C',       desc: 'Trigger Collision Warning' },
  { key: 'L',       desc: 'Trigger Lane Departure Warning' },
  { key: '1–4',     desc: 'Toggle Seatbelt (Seat 1–4)' },
  { key: 'Esc',     desc: 'Close Overlay / Clear Warnings' },
];

export default function HelpOverlay() {
  const helpOpen = useSimulationStore(s => s.helpOpen);
  const setHelpOpen = useSimulationStore(s => s.setHelpOpen);

  if (!helpOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={() => setHelpOpen(false)}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-xl overflow-hidden"
        style={{
          background: 'rgba(0,10,20,0.95)',
          border: '1px solid rgba(0,240,200,0.25)',
          boxShadow: '0 0 40px rgba(0,240,200,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(0,240,200,0.15)' }}
        >
          <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-hud-cyan">
            KEYBOARD SHORTCUTS
          </span>
          <button
            onClick={() => setHelpOpen(false)}
            className="text-white/40 hover:text-white/80 text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Shortcut list */}
        <div className="px-5 py-4 space-y-1">
          {SHORTCUTS.map(({ key, desc }) => (
            <div key={key} className="flex items-center gap-3">
              <kbd
                className="min-w-[72px] text-center text-[10px] font-mono px-2 py-0.5 rounded shrink-0"
                style={{
                  background: 'rgba(0,240,200,0.08)',
                  border: '1px solid rgba(0,240,200,0.25)',
                  color: '#00F0C8',
                }}
              >
                {key}
              </kbd>
              <span className="text-[11px] font-mono text-white/60">{desc}</span>
            </div>
          ))}
        </div>

        <div className="px-5 pb-3 text-[9px] font-mono text-white/25 text-center tracking-widest">
          PRESS ESC OR CLICK OUTSIDE TO CLOSE
        </div>
      </div>
    </div>
  );
}

import { useSimulationStore } from '../../store/simulationStore';
import { motion } from 'framer-motion';

// Standard automotive seatbelt warning icon (ISO-style)
function BeltIcon({ belted, size = 18 }) {
  const c = belted ? '#22C55E' : '#FF3B3B';
  return (
    <svg width={size} height={Math.round(size * 1.35)} viewBox="0 0 24 32" fill={c}>
      {/* Head */}
      <circle cx="12" cy="4" r="3.8" />
      {/* Torso */}
      <path d="M 5 9.5 Q 4 13.5 5 18.5 L 19 18.5 Q 20 13.5 19 9.5 Q 15.5 8 12 8 Q 8.5 8 5 9.5 Z" />
      {/* Legs */}
      <path d="M 5 18.5 L 3.5 29 L 10 29 L 12 22 L 14 29 L 20.5 29 L 19 18.5 Z" />
      {/* Diagonal shoulder belt — dark overlay stripe */}
      <line x1="17.5" y1="11" x2="7.5" y2="19.5"
        stroke="rgba(0,0,0,0.42)" strokeWidth="3.2" strokeLinecap="round" />
      {/* Lap belt */}
      <path d="M 5 19 Q 12 17.2 19 19"
        fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

const SEATS = [
  { key: 'driver',    label: 'DRV' },
  { key: 'passenger', label: 'PSG' },
  { key: 'rearLeft',  label: 'R-L' },
  { key: 'rearRight', label: 'R-R' },
];

export default function SeatPanel() {
  const seats        = useSimulationStore(s => s.seats);
  const occupiedCount = Object.values(seats).filter(s => s.occupied).length;
  const unbeltedCount = Object.values(seats).filter(s => s.occupied && !s.beltOn).length;

  return (
    <div className="fixed bottom-[175px] right-3 z-[12] pointer-events-none">
      <div className="backdrop-hud border border-hud-cyan/25 rounded-lg p-2 w-[138px]">

        {/* Header */}
        <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-hud-cyan/15">
          <div className="text-[8px] font-mono tracking-widest text-hud-cyan/60 uppercase">
            Occupants&nbsp;<span className="text-white/70">{occupiedCount}/4</span>
          </div>
          {unbeltedCount > 0 && (
            <span className="text-[8px] font-mono text-hud-danger"
              style={{ animation: 'pulseGlow 0.75s infinite' }}>
              ⚠ BELT
            </span>
          )}
        </div>

        {/* 2×2 seat grid */}
        <div className="grid grid-cols-2 gap-1 bg-black/15 rounded p-1">
          {SEATS.map(({ key, label }) => {
            const seat       = seats[key];
            const isOccupied = seat.occupied;
            const beltOn     = seat.beltOn;

            return (
              <motion.div
                key={key}
                className="relative flex flex-col items-center justify-center rounded py-1 gap-0.5"
                style={{
                  background: isOccupied
                    ? (beltOn ? 'rgba(34,197,94,0.10)' : 'rgba(255,59,59,0.14)')
                    : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${
                    isOccupied
                      ? (beltOn ? 'rgba(34,197,94,0.50)' : 'rgba(255,59,59,0.55)')
                      : 'rgba(255,255,255,0.07)'
                  }`,
                }}
                animate={isOccupied && !beltOn
                  ? { boxShadow: ['0 0 2px #FF3B3B', '0 0 8px #FF3B3B', '0 0 2px #FF3B3B'] }
                  : {}}
                transition={{ duration: 0.85, repeat: Infinity }}
              >
                {isOccupied
                  ? <BeltIcon belted={beltOn} size={18} />
                  : <div className="w-2 h-2 rounded-full bg-white/12" />
                }
                <span className="text-[7px] font-mono text-white/28 leading-none">{label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

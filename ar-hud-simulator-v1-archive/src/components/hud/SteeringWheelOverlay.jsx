import { useSimulationStore } from '../../store/simulationStore';

export default function SteeringWheelOverlay() {
  const battery = useSimulationStore(s => s.battery);
  const range   = useSimulationStore(s => s.range);
  const gear    = useSimulationStore(s => s.gear);
  const adas    = useSimulationStore(s => s.adas);
  const road    = useSimulationStore(s => s.currentRoad);
  const remaining = useSimulationStore(s => s.remainingDistance);
  const eta     = useSimulationStore(s => s.eta);

  const battLow  = battery < 20;
  const battColor = battLow ? '#FF3B3B' : '#00F0C8';

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[8] pointer-events-none overflow-hidden"
      style={{ height: 260 }}
    >
      {/* ── Interior background ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(4,5,8,1) 0%, rgba(6,8,12,0.98) 38%, rgba(7,10,16,0.88) 60%, rgba(5,8,14,0.45) 82%, transparent 100%)',
        }}
      />

      {/* ── Dashboard surface (leather-like top edge) ── */}
      <div
        className="absolute inset-x-0"
        style={{
          top: '20%',
          height: 2,
          background:
            'linear-gradient(to right, transparent 4%, rgba(35,40,48,0.9) 18%, rgba(50,56,66,0.95) 50%, rgba(35,40,48,0.9) 82%, transparent 96%)',
          boxShadow: '0 1px 0 rgba(0,240,200,0.08), 0 0 12px rgba(0,0,0,0.7)',
        }}
      />

      {/* Dashboard material panel */}
      <div
        className="absolute inset-x-0"
        style={{
          top: '22%',
          height: '40%',
          background:
            'linear-gradient(to bottom, rgba(16,20,28,0.97) 0%, rgba(10,14,20,0.99) 100%)',
          borderTop: '1px solid rgba(60,68,80,0.4)',
        }}
      />

      {/* ── CENTER: Infotainment screen ── */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: '23%', width: 148, height: 96 }}
      >
        <div
          className="w-full h-full rounded-lg overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(135deg, rgba(0,10,20,0.97) 0%, rgba(0,18,32,0.99) 100%)',
            border: '1px solid rgba(0,240,200,0.22)',
            boxShadow: '0 0 22px rgba(0,240,200,0.08), 0 0 40px rgba(0,0,0,0.6), inset 0 0 16px rgba(0,0,0,0.5)',
          }}
        >
          {/* Screen header */}
          <div
            className="px-2 py-1 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(0,240,200,0.12)' }}
          >
            <span className="font-mono text-[7px] tracking-[0.25em] uppercase" style={{ color: 'rgba(0,240,200,0.5)' }}>
              Navigation
            </span>
            <span className="font-mono text-[7px] tabular-nums" style={{ color: 'rgba(0,240,200,0.4)' }}>
              {eta}
            </span>
          </div>

          {/* Road name */}
          <div className="flex-1 flex flex-col items-center justify-center px-2 gap-0.5">
            <span
              className="font-mono text-[11px] font-bold tracking-wider text-center"
              style={{ color: '#00F0C8', textShadow: '0 0 8px rgba(0,240,200,0.5)' }}
            >
              {road}
            </span>
            <span className="font-mono text-[8px] text-white/40 tracking-wider">
              {remaining.toFixed(1)} km remaining
            </span>

            {/* ADAS status row */}
            <div className="flex gap-1.5 mt-1">
              {[
                { key: 'laneKeep',          label: 'LKA' },
                { key: 'adaptiveCruise',    label: 'ACC' },
                { key: 'autoEmergencyBrake',label: 'AEB' },
              ].map(({ key, label }) => (
                <span
                  key={key}
                  className="font-mono text-[6.5px] tracking-wider px-1 py-0.5 rounded"
                  style={{
                    background: adas[key] ? 'rgba(0,240,200,0.16)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${adas[key] ? 'rgba(0,240,200,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    color: adas[key] ? 'rgba(0,240,200,0.85)' : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── LEFT: Battery + Range ── */}
      <div className="absolute" style={{ left: '8%', bottom: 94, width: 115 }}>
        {/* Battery bar */}
        <div className="mb-2.5">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-[8px] tracking-widest uppercase text-white/40">Battery</span>
            <span
              className="font-mono text-[9px] font-bold tabular-nums"
              style={{ color: battColor, textShadow: battLow ? '0 0 4px #FF3B3B' : 'none' }}
            >
              {battery}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              style={{
                width: `${battery}%`, height: '100%',
                background: battLow
                  ? '#FF3B3B'
                  : 'linear-gradient(to right, rgba(0,168,138,0.9), #00F0C8)',
                boxShadow: `0 0 6px ${battColor}88`,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        {/* Range */}
        <div className="mb-3">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[8px] tracking-widest uppercase text-white/40">Range</span>
            <span className="font-mono text-[9px] font-bold tabular-nums" style={{ color: 'rgba(0,240,200,0.8)' }}>
              {range} km
            </span>
          </div>
        </div>

        {/* Autonomy level */}
        <div>
          <span className="font-mono text-[8px] tracking-widest uppercase text-white/35">Autonomy</span>
          <div className="flex gap-1.5 mt-1">
            {[1, 2, 3, 4].map(lvl => (
              <div
                key={lvl}
                className="w-5 h-1.5 rounded-sm"
                style={{
                  background: lvl <= adas.autonomyLevel
                    ? 'rgba(0,240,200,0.7)'
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: lvl <= adas.autonomyLevel ? '0 0 4px #00F0C8' : 'none',
                }}
              />
            ))}
            <span className="font-mono text-[7.5px] ml-0.5" style={{ color: 'rgba(0,240,200,0.7)' }}>
              L{adas.autonomyLevel}
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Drive mode + RPM hint ── */}
      <div className="absolute text-right" style={{ right: '8%', bottom: 94, width: 100 }}>
        <div className="mb-2.5">
          <div className="font-mono text-[8px] tracking-widest uppercase text-white/40 mb-0.5">Mode</div>
          <div
            className="font-mono text-4xl font-black leading-none"
            style={{
              color: 'rgba(0,240,200,0.92)',
              textShadow: '0 0 12px rgba(0,240,200,0.55)',
            }}
          >
            {gear}
          </div>
        </div>

        {/* Blind spot */}
        <div>
          <div className="font-mono text-[8px] tracking-widest uppercase text-white/40 mb-0.5">BSM</div>
          <div
            className="font-mono text-[10px] tracking-wider"
            style={{ color: adas.blindSpotMonitor ? 'rgba(0,240,200,0.75)' : 'rgba(255,59,59,0.7)' }}
          >
            {adas.blindSpotMonitor ? 'CLEAR' : 'ALERT'}
          </div>
        </div>
      </div>

      {/* ── STEERING WHEEL ── */}
      <div
        className="absolute left-1/2"
        style={{
          top: 128,
          transform: 'translateX(-50%)',
          width: 340,
          height: 340,
        }}
      >
        <svg viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer ambient glow */}
          <circle cx="170" cy="170" r="152" stroke="rgba(0,240,200,0.03)" strokeWidth="36" />

          {/* Main rim body */}
          <circle cx="170" cy="170" r="142" stroke="#0d141e" strokeWidth="32" />

          {/* Rim top highlight */}
          <path d="M 48 100 A 142 142 0 0 1 292 100" stroke="rgba(255,255,255,0.10)" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Rim bottom subtle */}
          <path d="M 70 265 A 142 142 0 0 0 270 265" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Rim precision border lines */}
          <circle cx="170" cy="170" r="158" stroke="rgba(0,240,200,0.06)" strokeWidth="1" />
          <circle cx="170" cy="170" r="126" stroke="rgba(0,240,200,0.05)" strokeWidth="1" />

          {/* Left grip section */}
          <path d="M 54 92 A 142 142 0 0 0 18 170" stroke="rgba(22,28,36,0.98)" strokeWidth="12" fill="none" />
          <path d="M 54 92 A 142 142 0 0 0 18 170" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 5" fill="none" />

          {/* Right grip section */}
          <path d="M 286 92 A 142 142 0 0 1 322 170" stroke="rgba(22,28,36,0.98)" strokeWidth="12" fill="none" />
          <path d="M 286 92 A 142 142 0 0 1 322 170" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 5" fill="none" />

          {/* ── Left spoke ── */}
          <line x1="170" y1="170" x2="34" y2="90"  stroke="#0a1018" strokeWidth="28" strokeLinecap="round" />
          <line x1="170" y1="170" x2="34" y2="90"  stroke="rgba(0,240,200,0.07)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="168" y1="170" x2="34" y2="90"  stroke="rgba(255,255,255,0.03)" strokeWidth="5" strokeLinecap="round" />

          {/* ── Right spoke ── */}
          <line x1="170" y1="170" x2="306" y2="90" stroke="#0a1018" strokeWidth="28" strokeLinecap="round" />
          <line x1="170" y1="170" x2="306" y2="90" stroke="rgba(0,240,200,0.07)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="172" y1="170" x2="306" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="5" strokeLinecap="round" />

          {/* ── Bottom spoke ── */}
          <line x1="170" y1="170" x2="170" y2="322" stroke="#0a1018" strokeWidth="28" strokeLinecap="round" />
          <line x1="170" y1="170" x2="170" y2="322" stroke="rgba(0,240,200,0.07)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Paddle shifter — left */}
          <rect x="46" y="195" width="28" height="14" rx="3" fill="#0c1218" stroke="rgba(0,240,200,0.18)" strokeWidth="0.8" />
          <text x="60" y="205" textAnchor="middle" fill="rgba(0,240,200,0.5)" fontSize="6" fontFamily="monospace">−</text>

          {/* Paddle shifter — right */}
          <rect x="266" y="195" width="28" height="14" rx="3" fill="#0c1218" stroke="rgba(0,240,200,0.18)" strokeWidth="0.8" />
          <text x="280" y="205" textAnchor="middle" fill="rgba(0,240,200,0.5)" fontSize="6" fontFamily="monospace">+</text>

          {/* ── Center hub ── */}
          <circle cx="170" cy="170" r="38" fill="#0a1018" />
          <circle cx="170" cy="170" r="38" stroke="rgba(0,240,200,0.32)" strokeWidth="2" />
          <circle cx="170" cy="170" r="26" fill="#0d1620" />
          <circle cx="170" cy="170" r="26" stroke="rgba(0,240,200,0.16)" strokeWidth="1" />

          {/* Hub hexagon logo */}
          <polygon
            points="170,155 183,162.5 183,177.5 170,185 157,177.5 157,162.5"
            fill="none" stroke="rgba(0,240,200,0.72)" strokeWidth="1.8"
          />
          <circle cx="170" cy="170" r="5.5" fill="rgba(0,240,200,0.78)" />

          {/* Horn button bar */}
          <rect x="140" y="36" width="60" height="18" rx="4" fill="#0a1018" stroke="rgba(0,240,200,0.18)" strokeWidth="0.8" />
          <rect x="148" y="41" width="13" height="8" rx="2" fill="rgba(0,240,200,0.14)" />
          <rect x="165" y="41" width="13" height="8" rx="2" fill="rgba(0,240,200,0.10)" />
          <rect x="182" y="41" width="10" height="8" rx="2" fill="rgba(0,240,200,0.06)" />
        </svg>
      </div>

      {/* ── Bottom nav console ── */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: 6, width: 96, height: 22 }}
      >
        <div
          className="w-full h-full rounded flex items-center justify-center"
          style={{
            background: 'rgba(0,12,22,0.88)',
            border: '1px solid rgba(0,240,200,0.16)',
          }}
        >
          <span className="font-mono text-[7px] tracking-[0.2em] text-white/35 uppercase">
            NAV · ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}

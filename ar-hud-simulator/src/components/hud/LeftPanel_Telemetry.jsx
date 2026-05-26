import { useSimulationStore } from '../../store/simulationStore';

// Inline fuel-pump SVG (classic automotive dash icon)
function FuelPumpIcon({ color = '#22C55E', size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 16" fill={color}>
      {/* Pump body */}
      <rect x="1" y="4" width="8" height="11" rx="1" />
      {/* Handle / top arm going right */}
      <path d="M 9 5 L 9 2 L 13 2 L 13 7 L 11 7" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Nozzle tip */}
      <rect x="10" y="6" width="3" height="2" rx="0.5" />
      {/* Display window */}
      <rect x="2" y="6" width="5" height="3" rx="0.5" fill="rgba(0,0,0,0.30)" />
    </svg>
  );
}

function FuelBar({ value }) {
  const pct   = Math.min(1, value / 100);
  const color = pct > 0.4 ? '#22C55E' : pct > 0.2 ? '#FFB800' : '#FF3B3B';
  return (
    <div>
      <div className="flex justify-between items-center mb-0.5">
        <div className="flex items-center gap-1">
          <FuelPumpIcon color={color} size={11} />
          <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color }}>Fuel</span>
        </div>
        <span className="text-[10px] font-tech tabular-nums" style={{ color }}>{Math.round(value)}%</span>
      </div>
      <div className="h-[5px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct * 100}%`, background: color, boxShadow: `0 0 5px ${color}80` }}
        />
      </div>
    </div>
  );
}

export default function LeftPanel_Telemetry() {
  const speed = useSimulationStore(s => s.speed);
  const fuel  = useSimulationStore(s => s.fuel);
  const range = useSimulationStore(s => s.range);
  const gear  = useSimulationStore(s => s.gear);

  const maxSpeed = 240;
  const R = 44, cx = 56, cy = 56;

  const pct    = Math.min(1, speed / maxSpeed);
  const arcRad = Math.PI - pct * Math.PI;
  const ex     = cx + Math.cos(arcRad) * R;
  const ey     = cy - Math.sin(arcRad) * R;
  const large  = pct > 0.5 ? 1 : 0;
  const nx     = cx + Math.cos(arcRad) * (R - 7);
  const ny     = cy - Math.sin(arcRad) * (R - 7);
  const arcColor = pct > 0.75 ? '#FF3B3B' : pct > 0.5 ? '#FFB800' : '#00F0C8';

  return (
    <div className="fixed left-3 top-14 z-[11] pointer-events-none w-[148px]">
      <div className="backdrop-hud border border-hud-cyan/30 rounded-lg p-3">

        {/* Half-circle speed gauge */}
        <div className="flex justify-center mb-2">
          <svg width="112" height="76" viewBox="0 0 112 76">
            {/* Background arc */}
            <path d="M 12 56 A 44 44 0 0 1 100 56"
              fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" strokeLinecap="round" />
            {/* Fill arc */}
            {pct > 0.005 && (
              <path d={`M 12 56 A 44 44 0 ${large} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`}
                fill="none" stroke={arcColor} strokeWidth="6" strokeLinecap="round" />
            )}
            {/* Needle */}
            <line x1={cx} y1={cy} x2={nx.toFixed(1)} y2={ny.toFixed(1)}
              stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx={cx} cy={cy} r="4" fill={arcColor} />
            {/* Scale labels */}
            <text x="10" y="64" fill="rgba(255,255,255,0.22)" fontSize="7" fontFamily="monospace">0</text>
            <text x="88" y="64" fill="rgba(255,255,255,0.22)" fontSize="7" fontFamily="monospace">240</text>
            {/* Speed value — centred inside arc, large and clear */}
            <text x={cx} y={cy + 8} textAnchor="middle"
              fill="white" fontSize="20" fontFamily="Rajdhani" fontWeight="900">
              {Math.round(speed)}
            </text>
            <text x={cx} y={cy + 20} textAnchor="middle"
              fill="rgba(255,255,255,0.38)" fontSize="7" fontFamily="monospace" letterSpacing="2">
              KM/H
            </text>
          </svg>
        </div>

        {/* Range + Gear */}
        <div className="flex justify-between items-end mb-2.5 px-0.5">
          <div>
            <div className="text-[8px] font-mono text-white/32 tracking-widest uppercase">Range</div>
            <div className="text-sm font-tech text-white tabular-nums">
              {range}<span className="text-[9px] text-white/32 ml-0.5">km</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[8px] font-mono text-white/32 tracking-widest uppercase">Gear</div>
            <div className="text-2xl font-display font-bold text-hud-cyan"
              style={{ textShadow: '0 0 10px #00F0C8', lineHeight: 1 }}>{gear}</div>
          </div>
        </div>

        {/* Fuel bar */}
        <FuelBar value={fuel} />
      </div>
    </div>
  );
}

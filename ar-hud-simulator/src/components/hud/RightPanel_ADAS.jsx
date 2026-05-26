import { useSimulationStore } from '../../store/simulationStore';
import { useEffect, useState } from 'react';

function StatusRow({ label, active }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
      <span className="text-[10px] font-mono tracking-wider text-white/55 uppercase">{label}</span>
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: active ? '#22C55E' : 'rgba(255,255,255,0.2)',
            boxShadow: active ? '0 0 6px #22C55E' : 'none',
            animation: active ? 'pulseGlow 2s ease-in-out infinite' : 'none',
          }}
        />
        <span className="text-[9px] font-mono" style={{ color: active ? '#22C55E' : 'rgba(255,255,255,0.25)' }}>
          {active ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );
}

export default function RightPanel_ADAS() {
  const adas        = useSimulationStore(s => s.adas);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = clock.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <div className="fixed right-3 top-14 z-[11] pointer-events-none w-[155px]">
      <div className="backdrop-hud border border-hud-cyan/30 rounded-lg p-3">

        <div className="text-[10px] font-mono tracking-widest text-hud-cyan/75 uppercase mb-2 pb-1.5 border-b border-hud-cyan/20">
          ADAS STATUS
        </div>

        <StatusRow label="Lane Keep"     active={adas.laneKeepEnabled} />
        <StatusRow label="Adapt. Cruise" active={adas.cruiseEnabled} />
        <StatusRow label="Auto Brake"    active={adas.autoBrakeEnabled} />
        <StatusRow label="Blind Spot"    active={false} />

        <div className="mt-3 flex justify-center">
          <div
            className="px-3 py-0.5 rounded text-[10px] font-mono tracking-widest font-bold"
            style={{
              border: '1px solid rgba(0,240,200,0.45)',
              color: '#00F0C8',
              background: 'rgba(0,240,200,0.07)',
              textShadow: '0 0 6px #00F0C8',
            }}
          >
            AUTONOMY L{adas.autonomyLevel}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-white/10 text-center">
          <div className="text-base font-tech font-bold text-white tabular-nums tracking-widest">
            {timeStr}
          </div>
        </div>
      </div>
    </div>
  );
}

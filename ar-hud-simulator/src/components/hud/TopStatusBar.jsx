import { useSimulationStore } from '../../store/simulationStore';
import { useState, useEffect } from 'react';

export default function TopStatusBar() {
  const laneDetected  = useSimulationStore(s => s.laneDetected);
  const destination   = useSimulationStore(s => s.destination);
  const eta           = useSimulationStore(s => s.eta);

  // Local clock — never touches the global store
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dateStr = now.toLocaleDateString('tr-TR', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('tr-TR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[11] pointer-events-none flex items-center justify-between px-5 py-2"
      style={{ background: 'linear-gradient(to bottom, rgba(0,10,18,0.75) 0%, transparent 100%)' }}
    >
      {/* Left: GPS + dest */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-hud-cyan animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-hud-cyan uppercase">GPS LOCK</span>
        </div>
        <span className="text-[10px] font-mono text-white/50 tracking-wider">→ {destination}</span>
        <span className="text-[10px] font-mono text-hud-warning tracking-wider">ETA {eta}</span>
      </div>

      {/* Center: date / time */}
      <div className="text-center">
        <div className="text-[10px] font-mono tracking-widest text-white/40">{dateStr}</div>
        <div className="text-sm font-tech font-bold text-hud-cyan tracking-widest" style={{ textShadow: '0 0 8px #00F0C8' }}>
          {timeStr}
        </div>
      </div>

      {/* Right: LANE + NET */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: laneDetected ? '#22C55E' : '#FF3B3B',
              boxShadow: `0 0 5px ${laneDetected ? '#22C55E' : '#FF3B3B'}`,
              animation: laneDetected ? 'none' : 'pulseGlow 1s infinite',
            }}
          />
          <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">
            LANE {laneDetected ? 'OK' : 'LOST'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-hud-blue" style={{ boxShadow: '0 0 5px #00E5FF', animation: 'pulseGlow 2s infinite' }} />
          <span className="text-[10px] font-mono tracking-widest text-hud-blue uppercase">5G</span>
        </div>
      </div>
    </div>
  );
}

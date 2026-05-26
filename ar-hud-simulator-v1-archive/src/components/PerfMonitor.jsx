import { useState, useEffect, useRef } from 'react';
import { useSimulationStore } from '../store/simulationStore';

export default function PerfMonitor() {
  const showPerfMonitor = useSimulationStore(s => s.showPerfMonitor);
  const [fps, setFps]   = useState(60);
  const frameRef        = useRef(0);
  const lastRef         = useRef(performance.now());

  useEffect(() => {
    if (!showPerfMonitor) return;
    let rafId;
    const loop = () => {
      frameRef.current++;
      const now = performance.now();
      if (now - lastRef.current >= 1000) {
        setFps(frameRef.current);
        frameRef.current = 0;
        lastRef.current  = now;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [showPerfMonitor]);

  if (!showPerfMonitor) return null;

  const color = fps >= 55 ? 'text-hud-success' : fps >= 30 ? 'text-hud-warning' : 'text-hud-danger';

  return (
    <div className="fixed bottom-14 left-2 z-[70] pointer-events-none">
      <div className="font-mono text-[9px] tracking-widest bg-black/70 border border-hud-cyan/10 px-2 py-1 flex items-center gap-2">
        <span className="text-white/25 uppercase">FPS</span>
        <span className={`${color} tabular-nums w-6 text-right`}>{fps}</span>
        {/* Mini bar */}
        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              fps >= 55 ? 'bg-hud-success' : fps >= 30 ? 'bg-hud-warning' : 'bg-hud-danger'
            }`}
            style={{ width: `${Math.min(100, (fps / 60) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

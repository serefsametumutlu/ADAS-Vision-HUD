import { useEffect, useRef, useState } from 'react';

export default function PerfMonitor() {
  const [renderFps, setRenderFps] = useState(0);
  const frameRef = useRef(0);
  const lastRef = useRef(performance.now());

  useEffect(() => {
    let raf;
    const loop = () => {
      frameRef.current++;
      const now = performance.now();
      if (now - lastRef.current >= 500) {
        setRenderFps(Math.round((frameRef.current * 1000) / (now - lastRef.current)));
        frameRef.current = 0;
        lastRef.current = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const color = renderFps >= 50 ? '#22C55E' : renderFps >= 30 ? '#F59E0B' : '#FF3B3B';

  return (
    <div
      className="fixed top-12 left-3 z-[20] pointer-events-none"
      style={{ fontFamily: 'monospace' }}
    >
      <div
        className="text-[9px] tracking-widest px-1.5 py-0.5 rounded"
        style={{
          color,
          background: 'rgba(0,0,0,0.5)',
          border: `1px solid ${color}30`,
          textShadow: `0 0 6px ${color}`,
        }}
      >
        {renderFps} FPS
      </div>
    </div>
  );
}

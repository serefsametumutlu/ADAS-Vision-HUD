import { useState, useEffect, useRef } from 'react';

export function useMouseParallax(strength = 8) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const target  = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf     = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      target.current = {
        x: ((e.clientX - cx) / cx) * strength,
        y: ((e.clientY - cy) / cy) * strength,
      };
    };

    const tick = () => {
      const lerp = (a, b) => a + (b - a) * 0.06;
      const nx = lerp(current.current.x, target.current.x);
      const ny = lerp(current.current.y, target.current.y);
      if (Math.abs(nx - current.current.x) > 0.01 || Math.abs(ny - current.current.y) > 0.01) {
        current.current = { x: nx, y: ny };
        setOffset({ x: nx, y: ny });
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [strength]);

  return offset;
}

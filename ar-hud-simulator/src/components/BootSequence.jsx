import { useEffect, useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';

const LINES = [
  { text: '> AR HUD SYSTEM v2.0 — INITIALIZING', delay: 0 },
  { text: '> Loading 3D environment...          [OK]', delay: 400 },
  { text: '> Loading TensorFlow.js...           [OK]', delay: 800 },
  { text: '> Loading COCO-SSD neural network... [OK]', delay: 1300 },
  { text: '> Calibrating sensors...             [OK]', delay: 1700 },
  { text: '> GPS lock acquired: KONYA · 37.8746°N, 32.4932°E', delay: 2100 },
  { text: '> ADAS systems online (Level 2)      [OK]', delay: 2500 },
  { text: '> HUD ONLINE', delay: 2900 },
];

const TOTAL = 3600; // ms before fade-out starts

export default function BootSequence() {
  const setBootComplete = useSimulationStore(s => s.setBootComplete);
  const [visible, setVisible] = useState([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timers = LINES.map(({ text, delay }) =>
      setTimeout(() => setVisible(v => [...v, text]), delay)
    );

    const fadeTimer = setTimeout(() => setFading(true), TOTAL);
    const doneTimer = setTimeout(() => setBootComplete(true), TOTAL + 600);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [setBootComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{
        transition: 'opacity 0.6s ease',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      <div className="w-full max-w-xl px-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="text-2xl font-tech font-bold tracking-[0.3em] text-hud-cyan"
            style={{ textShadow: '0 0 20px #00F0C8, 0 0 40px #00F0C880' }}
          >
            AR HUD
          </div>
          <div className="text-[10px] font-mono tracking-[0.5em] text-white/40 mt-1">
            ADVANCED DRIVER ASSISTANCE SYSTEM
          </div>
        </div>

        {/* Terminal lines */}
        <div className="font-mono text-sm space-y-1">
          {visible.map((line, i) => (
            <div
              key={i}
              className="text-hud-cyan/90"
              style={{
                textShadow: '0 0 6px #00F0C850',
                animation: 'fadeInLine 0.2s ease forwards',
              }}
            >
              {line}
            </div>
          ))}
          {/* blinking cursor */}
          {visible.length < LINES.length && (
            <span
              className="inline-block w-2 h-4 bg-hud-cyan align-middle"
              style={{ animation: 'blink 0.8s step-start infinite' }}
            />
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-px bg-white/10 overflow-hidden rounded">
          <div
            className="h-full bg-hud-cyan"
            style={{
              transition: `width ${TOTAL}ms linear`,
              width: '100%',
              boxShadow: '0 0 8px #00F0C8',
              animation: 'growBar 3s linear forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes growBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

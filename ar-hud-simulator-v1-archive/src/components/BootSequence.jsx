import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
  { text: 'INITIALIZING AR HUD SYSTEM v1.0.0', isTitle: true },
  { text: 'Loading sensors',          dots: '......................', status: 'OK' },
  { text: 'Calibrating optics',       dots: '.....................',  status: 'OK' },
  { text: 'Connecting to ADAS',       dots: '.....................',  status: 'OK' },
  { text: 'Establishing GPS lock',    dots: '...................',    status: 'OK' },
  { text: 'Loading scene assets',     dots: '....................',   status: 'OK' },
  { text: 'Konya, Türkiye · 37.8746°N 32.4932°E', isLocation: true },
];

// Phase durations (ms)
const LINE_DELAY   = 190;
const RADAR_DUR    = 480;
const ONLINE_DUR   = 550;
const FADEOUT_DUR  = 450;

export default function BootSequence({ onComplete }) {
  const [phase, setPhase]           = useState('lines'); // lines | radar | online | done
  const [visibleCount, setVisible]  = useState(0);
  const [fading, setFading]         = useState(false);

  const finish = useCallback(() => {
    setFading(true);
    setTimeout(onComplete, FADEOUT_DUR);
  }, [onComplete]);

  useEffect(() => {
    let t;
    if (phase === 'lines') {
      if (visibleCount < LINES.length) {
        t = setTimeout(() => setVisible(v => v + 1), visibleCount === 0 ? 250 : LINE_DELAY);
      } else {
        t = setTimeout(() => setPhase('radar'), 120);
      }
    } else if (phase === 'radar') {
      t = setTimeout(() => setPhase('online'), RADAR_DUR);
    } else if (phase === 'online') {
      t = setTimeout(finish, ONLINE_DUR);
    }
    return () => clearTimeout(t);
  }, [phase, visibleCount, finish]);

  return (
    <motion.div
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: FADEOUT_DUR / 1000 }}
      className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center select-none"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,240,200,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,200,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner accents */}
      {[['top-4 left-4',  'border-t border-l'], ['top-4 right-4',    'border-t border-r'],
        ['bottom-4 left-4','border-b border-l'], ['bottom-4 right-4', 'border-b border-r']].map(([pos, cls]) => (
        <div key={pos} className={`absolute ${pos} w-8 h-8 border-hud-cyan/30 ${cls}`} />
      ))}

      {/* Terminal lines */}
      <div className="font-mono text-[11px] leading-6 mb-10 w-full max-w-md px-6">
        {LINES.slice(0, visibleCount).map((line, i) => (
          <div key={i} className="animate-boot-line flex items-center">
            {line.isTitle ? (
              <span className="text-hud-cyan text-glow-cyan tracking-[0.2em] text-xs mb-2 block">
                {'>'} {line.text}
              </span>
            ) : line.isLocation ? (
              <span className="text-hud-cyan/40 tracking-widest">{'>'} {line.text}</span>
            ) : (
              <span className="text-white/50">
                {'>'} {line.text}
                <span className="text-white/15">{line.dots}</span>
                {' '}
                <span className="text-hud-cyan font-bold">[{line.status}]</span>
              </span>
            )}
          </div>
        ))}
        {phase === 'lines' && visibleCount < LINES.length && (
          <span className="text-hud-cyan animate-pulse inline-block w-2 h-3 bg-hud-cyan/80 ml-1 align-middle" />
        )}
      </div>

      {/* Radar + HUD ONLINE */}
      <AnimatePresence>
        {phase !== 'lines' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Radar rings */}
            <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
              {[160, 112, 64].map((size, i) => (
                <motion.div
                  key={size}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.5 - i * 0.12 }}
                  transition={{ delay: i * 0.08, duration: 0.35, ease: 'easeOut' }}
                  className="absolute rounded-full border border-hud-cyan/50"
                  style={{ width: size, height: size }}
                />
              ))}
              {/* Sweep line */}
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 70%, rgb(0 240 200 / 0.3) 100%)',
                }}
              />
              {/* Center dot */}
              <div className="w-2 h-2 rounded-full bg-hud-cyan shadow-[0_0_10px_rgb(0_240_200/0.9)] z-10" />
            </div>

            {/* HUD ONLINE */}
            <AnimatePresence>
              {phase === 'online' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-display text-2xl tracking-[0.6em] text-hud-cyan text-glow-cyan uppercase text-center"
                >
                  HUD ONLINE
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom version */}
      <div className="absolute bottom-6 font-mono text-[8px] text-white/15 tracking-[0.3em] uppercase">
        AR HUD Simulator · Build 2026.05
      </div>
    </motion.div>
  );
}

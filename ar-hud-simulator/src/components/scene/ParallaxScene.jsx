import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion';
import { useSimulationStore } from '../../store/simulationStore';

function imgSrc(scenario) {
  const map = { highway: 'highway-day', city: 'city-day', night: 'night-drive' };
  return `/scenes/images/${map[scenario] ?? map.highway}.jpg`;
}

const OVERLAYS = {
  highway: 'from-sky-900/30 via-transparent to-gray-900/50',
  city:    'from-slate-800/40 via-transparent to-gray-900/60',
  night:   'from-slate-950/70 via-slate-900/30 to-gray-950/80',
};

export default function ParallaxScene() {
  const scenario = useSimulationStore(s => s.scenario);

  // Continuous scroll offset driven by speed
  const scrollY = useMotionValue(0);

  // Convert offset to a looping background-position-y percentage
  const bgPosY = useTransform(scrollY, v => `${((v % 100) + 100) % 100}%`);

  // Gentle horizontal sway
  const swayX = useMotionValue(0);
  const bgPosX = useTransform(swayX, v => `${50 + v}%`);

  useAnimationFrame((time, delta) => {
    const spd = useSimulationStore.getState().speed;
    // Scroll road backward proportional to speed
    scrollY.set(scrollY.get() + (spd / 3600) * (delta / 10));
    // Sway ±1% at low frequency
    swayX.set(Math.sin(time / 4000) * 1.2);
  });

  const src = imgSrc(scenario);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gray-950">
      {/* Parallax image layer */}
      <motion.div
        className="absolute w-[110%] h-[115%] -left-[5%] -top-[7%] bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${src})`,
          backgroundPositionX: bgPosX,
          backgroundPositionY: bgPosY,
        }}
      />

      {/* Scenario-tinted gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${OVERLAYS[scenario] ?? OVERLAYS.highway}`} />

      {/* Speed lines — subtle radial burst at high speed */}
      <SpeedLines />
    </div>
  );
}

function SpeedLines() {
  const canvasRef = useRef(null);

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const spd = useSimulationStore.getState().speed;
    const ctx  = canvas.getContext('2d');
    const { width: w, height: h } = canvas;

    ctx.clearRect(0, 0, w, h);
    if (spd < 80) return;

    const alpha = Math.min(1, (spd - 80) / 160) * 0.18;
    const cx = w / 2;
    const cy = h / 2;
    const lines = 24;

    ctx.strokeStyle = `rgba(0,240,200,${alpha})`;
    ctx.lineWidth = 0.5;

    for (let i = 0; i < lines; i++) {
      const angle = (i / lines) * Math.PI * 2;
      const r0 = 0.15 * Math.min(w, h);
      const r1 = (0.5 + Math.random() * 0.3) * Math.min(w, h);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r0, cy + Math.sin(angle) * r0);
      ctx.lineTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
      ctx.stroke();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

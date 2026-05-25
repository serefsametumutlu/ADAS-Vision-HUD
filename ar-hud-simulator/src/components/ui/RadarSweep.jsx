import { motion } from 'framer-motion';

const BLIPS = [
  { x: 0.28, y: -0.52, color: '#00F0C8', r: 2.2 },
  { x: -0.41, y: 0.20, color: '#00F0C8', r: 1.6 },
  { x: 0.60, y: 0.38, color: '#FFB800', r: 2 },
  { x: -0.15, y: -0.72, color: '#FF3B3B', r: 1.8 },
  { x: 0.72, y: -0.25, color: '#00F0C8', r: 1.4 },
];

export default function RadarSweep({ size = 120 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  // Cone: sweep line points UP, cone spreads 35° clockwise
  const coneAngle = 35 * (Math.PI / 180);
  const coneEndX = cx + r * Math.sin(coneAngle);
  const coneEndY = cy - r * Math.cos(coneAngle);

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="sweepCone" cx="0%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#00F0C8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00F0C8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="blipFade" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#00F0C8" stopOpacity="1" />
          <stop offset="100%" stopColor="#00F0C8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Concentric rings */}
      {[0.33, 0.67, 1].map((ratio, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r * ratio}
          fill="none"
          stroke="rgba(0,240,200,0.18)"
          strokeWidth={1}
        />
      ))}

      {/* Cross hairs */}
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="rgba(0,240,200,0.1)" strokeWidth={0.5} />
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="rgba(0,240,200,0.1)" strokeWidth={0.5} />

      {/* Rotating sweep group */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
        style={{ originX: cx, originY: cy }}
      >
        {/* Sweep cone */}
        <path
          d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${coneEndX} ${coneEndY} Z`}
          fill="url(#sweepCone)"
          opacity={0.4}
        />
        {/* Sweep line */}
        <line
          x1={cx} y1={cy} x2={cx} y2={cy - r}
          stroke="#00F0C8" strokeWidth={1.5} opacity={0.9}
          style={{ filter: 'drop-shadow(0 0 3px #00F0C8)' }}
        />
      </motion.g>

      {/* Static blips */}
      {BLIPS.map((b, i) => (
        <circle
          key={i}
          cx={cx + r * b.x}
          cy={cy + r * b.y}
          r={b.r}
          fill={b.color}
          opacity={0.8}
          style={{ filter: `drop-shadow(0 0 3px ${b.color})` }}
        />
      ))}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={2.5} fill="#00F0C8" style={{ filter: 'drop-shadow(0 0 4px #00F0C8)' }} />
    </svg>
  );
}

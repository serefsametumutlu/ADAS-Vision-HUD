import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const COLOR_MAP = {
  cyan: { stroke: '#00F0C8', glow: 'rgba(0,240,200,0.6)' },
  warning: { stroke: '#FFB800', glow: 'rgba(255,184,0,0.6)' },
  danger: { stroke: '#FF3B3B', glow: 'rgba(255,59,59,0.6)' },
};

export default function CircularGauge({ value = 0, max = 240, label = '', unit = '', size = 140, color = 'cyan' }) {
  const strokeWidth = 8;
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const arcFraction = 240 / 360;
  const arcLength = circumference * arcFraction;
  const gapLength = circumference - arcLength;
  const clampedValue = Math.min(Math.max(value, 0), max);
  const progress = (clampedValue / max) * arcLength;

  const { stroke, glow } = COLOR_MAP[color] ?? COLOR_MAP.cyan;
  const dashArray = `${arcLength} ${gapLength}`;
  const progressDash = `${progress} ${circumference - progress}`;

  // Rotate so arc starts at ~210° (7 o'clock): 150° from SVG's 3 o'clock = rotate(150)
  const transform = `rotate(150 ${cx} ${cy})`;

  // Tick marks: 7 ticks spread over 240° arc
  const ticks = Array.from({ length: 7 }, (_, i) => {
    const angleDeg = 150 + (240 / 6) * i;
    const angleRad = (angleDeg * Math.PI) / 180;
    const inner = r - 6;
    const outer = r + 2;
    return {
      x1: cx + inner * Math.cos(angleRad),
      y1: cy + inner * Math.sin(angleRad),
      x2: cx + outer * Math.cos(angleRad),
      y2: cy + outer * Math.sin(angleRad),
    };
  });

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        <defs>
          <filter id={`glow-gauge-${color}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={stroke}
          strokeOpacity={0.12}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          transform={transform}
        />

        {/* Progress arc */}
        <motion.circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          transform={transform}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: progressDash }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
        />

        {/* Tick marks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={stroke} strokeOpacity={0.4} strokeWidth={1.5}
          />
        ))}

        {/* Center: value + unit */}
        <foreignObject x={cx - 50} y={cy - 28} width={100} height={56}>
          <div className="flex flex-col items-center justify-center h-full">
            <span className="font-display tabular-nums leading-none" style={{ color: stroke, fontSize: 32, textShadow: `0 0 10px ${glow}` }}>
              <AnimatedNumber value={clampedValue} duration={0.7} />
            </span>
            {unit && (
              <span className="font-mono uppercase tracking-widest text-xs mt-0.5" style={{ color: stroke, opacity: 0.6 }}>
                {unit}
              </span>
            )}
          </div>
        </foreignObject>
      </svg>

      {label && (
        <span className="font-mono text-xs tracking-widest uppercase mt-1" style={{ color: stroke, opacity: 0.5 }}>
          {label}
        </span>
      )}
    </div>
  );
}

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

export default function AnimatedNumber({ value, duration = 0.6, decimals = 0, suffix = '', className = '' }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, latest =>
    decimals === 0 ? Math.round(latest).toString() : latest.toFixed(decimals)
  );

  useEffect(() => {
    const controls = animate(mv, value, { duration, ease: 'easeOut' });
    return controls.stop;
  }, [value, duration]);

  return (
    <span className={`tabular-nums ${className}`}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

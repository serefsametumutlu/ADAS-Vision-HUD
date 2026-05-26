const GLOW_CLASS = {
  cyan: 'text-hud-cyan text-glow-cyan',
  warning: 'text-hud-warning text-glow-warning',
  danger: 'text-hud-danger text-glow-danger',
  white: 'text-white',
};

const SIZE_CLASS = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '4xl': 'text-4xl',
};

const DISPLAY_SIZES = new Set(['xl', '2xl', '4xl']);

export default function GlowText({ children, variant = 'cyan', size = 'md', className = '' }) {
  const glow = GLOW_CLASS[variant] ?? GLOW_CLASS.cyan;
  const sz = SIZE_CLASS[size] ?? SIZE_CLASS.md;
  const font = DISPLAY_SIZES.has(size) ? 'font-display' : 'font-tech';

  return (
    <span className={`${glow} ${sz} ${font} tabular-nums tracking-wide ${className}`}>
      {children}
    </span>
  );
}

const VARIANTS = {
  cyan: {
    bg: 'bg-hud-cyan',
    shadow: '0 0 8px rgba(0,240,200,0.9), 0 0 16px rgba(0,240,200,0.5)',
  },
  warning: {
    bg: 'bg-hud-warning',
    shadow: '0 0 8px rgba(255,184,0,0.9), 0 0 16px rgba(255,184,0,0.5)',
  },
  danger: {
    bg: 'bg-hud-danger',
    shadow: '0 0 8px rgba(255,59,59,0.9), 0 0 16px rgba(255,59,59,0.5)',
  },
  success: {
    bg: 'bg-hud-success',
    shadow: '0 0 8px rgba(34,197,94,0.9), 0 0 16px rgba(34,197,94,0.5)',
  },
};

const SIZES = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };

export default function PulseDot({ color = 'cyan', size = 'md' }) {
  const { bg, shadow } = VARIANTS[color] ?? VARIANTS.cyan;
  return (
    <span
      className={`inline-block rounded-full animate-pulse-glow flex-shrink-0 ${bg} ${SIZES[size] ?? SIZES.md}`}
      style={{ boxShadow: shadow }}
    />
  );
}

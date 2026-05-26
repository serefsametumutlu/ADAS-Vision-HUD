import CornerBrackets from './CornerBrackets';
import ScanLine from './ScanLine';

const VARIANTS = {
  default: {
    border: 'border-hud-cyan/40',
    shadow: '0 0 15px rgba(0,240,200,0.2), inset 0 0 15px rgba(0,240,200,0.05)',
    cornerColor: 'cyan',
  },
  warning: {
    border: 'border-hud-warning/50',
    shadow: '0 0 15px rgba(255,184,0,0.25), inset 0 0 15px rgba(255,184,0,0.05)',
    cornerColor: 'warning',
  },
  danger: {
    border: 'border-hud-danger/50',
    shadow: '0 0 20px rgba(255,59,59,0.3), inset 0 0 15px rgba(255,59,59,0.07)',
    cornerColor: 'danger',
  },
};

export default function HudPanel({
  children,
  className = '',
  variant = 'default',
  corners = true,
  glow = true,
  scanLine = false,
}) {
  const v = VARIANTS[variant] ?? VARIANTS.default;

  return (
    <div
      className={`
        relative border ${v.border}
        backdrop-hud
        transition-all duration-300 ease-out
        hover:brightness-110
        ${className}
      `}
      style={{ boxShadow: glow ? v.shadow : undefined }}
    >
      {corners && <CornerBrackets color={v.cornerColor} />}
      {scanLine && <ScanLine />}
      {children}
    </div>
  );
}

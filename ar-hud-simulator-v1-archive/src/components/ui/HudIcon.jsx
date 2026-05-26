import { COLORS } from '../../utils/constants';

export default function HudIcon({ icon: Icon, size = 20, glow = true, color = 'cyan' }) {
  const hex = COLORS[color] ?? COLORS.cyan;
  const filter = glow
    ? `drop-shadow(0 0 4px ${hex}99) drop-shadow(0 0 10px ${hex}55)`
    : undefined;

  return <Icon size={size} color={hex} style={{ filter }} />;
}

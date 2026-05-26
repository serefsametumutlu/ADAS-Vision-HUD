const COLOR_MAP = {
  cyan: 'border-hud-cyan',
  warning: 'border-hud-warning',
  danger: 'border-hud-danger',
  white: 'border-white',
};

export default function CornerBrackets({ color = 'cyan', size = 4 }) {
  const border = COLOR_MAP[color] ?? COLOR_MAP.cyan;
  const dim = `${size * 4}px`;
  const base = `absolute border-2 ${border} opacity-70`;

  return (
    <>
      <div className={`${base} border-r-0 border-b-0 top-0 left-0`} style={{ width: dim, height: dim }} />
      <div className={`${base} border-l-0 border-b-0 top-0 right-0`} style={{ width: dim, height: dim }} />
      <div className={`${base} border-r-0 border-t-0 bottom-0 left-0`} style={{ width: dim, height: dim }} />
      <div className={`${base} border-l-0 border-t-0 bottom-0 right-0`} style={{ width: dim, height: dim }} />
    </>
  );
}

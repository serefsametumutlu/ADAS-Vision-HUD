export default function HudSlider({ label, value, min, max, step = 1, unit = '', onChange }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase">{label}</span>
        <span className="font-mono text-[10px] text-hud-cyan tabular-nums">{value}{unit}</span>
      </div>
      <div className="relative h-5 flex items-center">
        {/* Track bg */}
        <div className="absolute inset-x-0 h-px bg-white/10 rounded-full" />
        {/* Track fill */}
        <div
          className="absolute left-0 h-px bg-hud-cyan/70 rounded-full shadow-[0_0_4px_rgba(0,255,255,0.4)]"
          style={{ width: `${pct}%` }}
        />
        {/* Native input (invisible, handles interaction) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />
        {/* Visual thumb */}
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-hud-cyan border border-cyan-300/40
                     shadow-[0_0_8px_rgba(0,255,255,0.7)] pointer-events-none transition-transform"
          style={{ left: `calc(${pct}% - 5px)` }}
        />
      </div>
    </div>
  );
}

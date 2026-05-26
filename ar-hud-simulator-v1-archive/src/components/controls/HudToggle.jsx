export default function HudToggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase leading-none">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative flex-shrink-0 w-9 h-5 rounded-full border transition-all duration-300
                    ${value
                      ? 'bg-hud-cyan/15 border-hud-cyan/70 shadow-[0_0_8px_rgba(0,255,255,0.25)]'
                      : 'bg-white/5 border-white/15'
                    }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300
                      ${value
                        ? 'left-[18px] bg-hud-cyan shadow-[0_0_6px_rgba(0,255,255,0.8)]'
                        : 'left-0.5 bg-white/20'
                      }`}
        />
      </button>
    </div>
  );
}

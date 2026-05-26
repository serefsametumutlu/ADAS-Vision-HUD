import { useSimulationStore } from '../../../store/simulationStore';

export default function NavigationCarpet() {
  const { horizonY, vanishingX, roadWidth } = useSimulationStore(s => s.calibration);
  const maneuver = useSimulationStore(s => s.nextManeuver);
  const speed    = useSimulationStore(s => s.speed);

  const bottom        = 88;
  const skewX         = maneuver === 'left' ? -9 : maneuver === 'right' ? 9 : 0;
  const arrowDuration = Math.max(0.4, Math.min(3.5, 2.8 - speed / 70));

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2"
        style={{
          top:           `${horizonY}%`,
          width:         `${roadWidth * 3}%`,
          height:        `${bottom - horizonY}%`,
          transform:     `translateX(-50%) translateX(${vanishingX - 50}%) rotateX(72deg) skewX(${skewX}deg)`,
          transformOrigin: '50% 0%',
          transformStyle: 'preserve-3d',
          overflow: 'hidden',
        }}
      >
        {/* Base gradient fill */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top,
              rgba(0,240,200,0.32) 0%,
              rgba(0,240,200,0.18) 45%,
              rgba(0,229,255,0.07) 78%,
              transparent 100%)`,
            mixBlendMode: 'screen',
          }}
        />

        {/* Animated chevron/arrow flow */}
        <div
          className="absolute inset-x-0"
          style={{
            top: '-35%',
            height: '170%',
            animation: `nav-chevron-flow ${arrowDuration}s linear infinite`,
          }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 100 170"
            preserveAspectRatio="none"
          >
            {/* Repeat chevrons every 28 units in viewBox */}
            {[0, 28, 56, 84, 112, 140, 168].map((y) => (
              <g key={y}>
                {/* Filled V-arrow */}
                <polygon
                  points={`14,${y + 26} 50,${y + 3} 86,${y + 26} 74,${y + 26} 50,${y + 12} 26,${y + 26}`}
                  fill="rgba(0,240,200,0.16)"
                  stroke="rgba(0,240,200,0.72)"
                  strokeWidth="0.9"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Left edge glow */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: 2,
            background: 'linear-gradient(to top, rgba(0,240,200,0.95) 0%, transparent 100%)',
            boxShadow: '0 0 10px #00F0C8, 2px 0 8px rgba(0,240,200,0.3)',
          }}
        />
        {/* Right edge glow */}
        <div
          className="absolute right-0 top-0 bottom-0"
          style={{
            width: 2,
            background: 'linear-gradient(to top, rgba(0,240,200,0.95) 0%, transparent 100%)',
            boxShadow: '0 0 10px #00F0C8, -2px 0 8px rgba(0,240,200,0.3)',
          }}
        />
      </div>

      <style>{`
        @keyframes nav-chevron-flow {
          from { transform: translateY(0); }
          to   { transform: translateY(16.47%); }
        }
      `}</style>
    </div>
  );
}

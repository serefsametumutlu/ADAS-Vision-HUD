import { useSimulationStore } from '../../store/simulationStore';

const MAP_R  = 88;
const CX     = 100;
const CY     = 100;

const LABEL_COLOR = {
  car:            '#00F0C8',
  truck:          '#00F0C8',
  person:         '#FF3B3B',
  'traffic light':'#FFB800',
  'speed limit':  '#FFB800',
  'stop sign':    '#FF3B3B',
};

export default function MiniMap() {
  const detections = useSimulationStore(s => s.detections);

  const dots = detections.map(d => {
    const bboxCx = d.bbox.x + d.bbox.w / 2;
    const nx     = ((bboxCx / 50) - 1) * 0.75;
    const ny     = -(Math.min(d.distance, 80) / 80) * 0.88;
    return {
      x:     CX + nx * MAP_R,
      y:     CY + ny * MAP_R,
      color: LABEL_COLOR[d.label] ?? '#00F0C8',
      id:    d.id,
    };
  });

  return (
    <div className="fixed bottom-[220px] left-3 z-[12] pointer-events-none">
      <div className="backdrop-hud border border-hud-cyan/30 rounded-lg p-2">
        <div className="text-[9px] font-mono tracking-widest text-hud-cyan/55 uppercase mb-1 px-1">
          Top View · ADAS
        </div>
        <svg width="200" height="200" viewBox="0 0 200 200">
          <defs>
            <clipPath id="mmClip">
              <circle cx="100" cy="100" r={MAP_R} />
            </clipPath>
          </defs>

          {/* BG */}
          <circle cx="100" cy="100" r={MAP_R}
            fill="rgba(0,14,22,0.7)" stroke="rgba(0,240,200,0.25)" strokeWidth="1.5" />

          {/* Range rings */}
          {[30, 55, MAP_R].map(r => (
            <circle key={r} cx="100" cy="100" r={r}
              fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}

          {/* Axis lines */}
          <line x1="100" y1={100 - MAP_R} x2="100" y2={100 + MAP_R}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1={100 - MAP_R} y1="100" x2={100 + MAP_R} y2="100"
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {/* Detection dots */}
          <g clipPath="url(#mmClip)">
            {dots.map(d => (
              <g key={d.id}>
                <circle cx={d.x} cy={d.y} r="5.5" fill={d.color} opacity="0.85" />
                <circle cx={d.x} cy={d.y} r="9"
                  fill="none" stroke={d.color} strokeWidth="1" opacity="0.35" />
              </g>
            ))}
          </g>

          {/* Ego vehicle triangle (pointing up = forward) */}
          <polygon
            points={`${CX},${CY - 14} ${CX + 8},${CY + 6} ${CX - 8},${CY + 6}`}
            fill="#00E5FF"
            stroke="#ffffff"
            strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 5px #00E5FF)' }}
          />
        </svg>
      </div>
    </div>
  );
}

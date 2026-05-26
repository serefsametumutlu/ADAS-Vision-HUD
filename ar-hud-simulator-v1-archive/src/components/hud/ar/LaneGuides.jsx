import { useSimulationStore } from '../../../store/simulationStore';

export default function LaneGuides() {
  const { horizonY, vanishingX, roadWidth } = useSimulationStore(s => s.calibration);
  const laneDeparture = useSimulationStore(s => s.laneDeparture);
  const color = laneDeparture ? '#FF3B3B' : '#00F0C8';

  return (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <line
          x1={`${vanishingX - 1}%`}  y1={`${horizonY + 2}%`}
          x2={`${vanishingX - roadWidth / 2 - 2}%`}  y2="92%"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="8 14"
          opacity="0.28"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
        <line
          x1={`${vanishingX + 1}%`}  y1={`${horizonY + 2}%`}
          x2={`${vanishingX + roadWidth / 2 + 2}%`}  y2="92%"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="8 14"
          opacity="0.28"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
    </div>
  );
}

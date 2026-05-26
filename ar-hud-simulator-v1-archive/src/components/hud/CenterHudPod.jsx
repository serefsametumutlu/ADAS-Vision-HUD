import { useSimulationStore } from '../../store/simulationStore';
import { ArrowUp, CornerUpLeft, CornerUpRight, RotateCcw } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';

const maneuverIcons = {
  straight: ArrowUp,
  left: CornerUpLeft,
  right: CornerUpRight,
  uturn: RotateCcw,
};

export default function CenterHudPod() {
  const speed = useSimulationStore(s => s.speed);
  const speedLimit = useSimulationStore(s => s.speedLimit);
  const maneuver = useSimulationStore(s => s.nextManeuver);
  const distanceToManeuver = useSimulationStore(s => s.distanceToManeuver);

  const Icon = maneuverIcons[maneuver] || ArrowUp;
  const speeding = speed > speedLimit;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[12] pointer-events-none"
      style={{ bottom: '12%' }}
    >
      <div className="flex items-center gap-8 px-2">

        {/* Left: Nav icon + distance */}
        <div className="flex items-center gap-2">
          <Icon
            size={36}
            className="text-white"
            style={{ filter: 'drop-shadow(0 0 8px #00F0C8) drop-shadow(0 0 16px #00F0C8)' }}
          />
          <div className="flex flex-col leading-none">
            <span
              className="font-tech text-3xl font-semibold text-white tabular-nums"
              style={{ textShadow: '0 0 8px #00F0C8, 0 0 16px rgba(0,240,200,0.4)' }}
            >
              <AnimatedNumber value={Math.round(distanceToManeuver)} />
            </span>
            <span className="text-[11px] tracking-widest text-white/80 uppercase mt-0.5">m</span>
          </div>
        </div>

        {/* Center: Large speed */}
        <div className="flex flex-col items-center">
          <div className="flex items-end gap-2">
            <span
              className="font-display text-7xl font-bold tabular-nums leading-none"
              style={{
                color: speeding ? '#FF3B3B' : '#FFFFFF',
                textShadow: speeding
                  ? '0 0 16px #FF3B3B, 0 0 32px rgba(255,59,59,0.6)'
                  : '0 0 12px #00F0C8, 0 0 24px rgba(0,240,200,0.4)',
              }}
            >
              <AnimatedNumber value={Math.round(speed)} />
            </span>
          </div>
          <span
            className="text-xs tracking-widest text-white/80 uppercase mt-1"
            style={{ textShadow: '0 0 4px #00F0C8' }}
          >
            km / h
          </span>
        </div>

        {/* Right: Speed limit circle */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center"
            style={{
              border: '4px solid #FF3B3B',
              boxShadow: '0 0 16px rgba(255, 59, 59, 0.6)',
            }}
          >
            <span className="font-display text-xl font-bold text-black tabular-nums">{speedLimit}</span>
            {speeding && (
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping" />
            )}
          </div>
          <span className="text-[10px] font-mono text-white/70 tracking-wider">500 m</span>
        </div>

      </div>
    </div>
  );
}

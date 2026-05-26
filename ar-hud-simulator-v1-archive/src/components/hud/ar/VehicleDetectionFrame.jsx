import { useSimulationStore } from '../../../store/simulationStore';
import { motion } from 'framer-motion';

export default function VehicleDetectionFrame() {
  const vehicle         = useSimulationStore(s => s.vehicleAhead);
  const calibration     = useSimulationStore(s => s.calibration);
  const backgroundMode  = useSimulationStore(s => s.backgroundMode);

  // 3D mode: YOLO detection is rendered inside ThreeScene via drei Html
  if (backgroundMode === '3d' || !vehicle.detected) return null;

  const { horizonY, vanishingX, vehiclePosX, vehiclePosY, vehicleBaseSize } = calibration;

  // Auto-position: far vehicles appear near horizon, close ones lower in frame
  const t = Math.max(0, Math.min(1, (vehicle.distance - 8) / 80));
  const autoY = horizonY + 5 + (60 - horizonY - 5) * (1 - t);
  const autoX = vanishingX + 1; // slightly right for right-lane traffic

  // vehiclePosX/Y are offsets from auto position (50 = no offset)
  const posX = autoX + (vehiclePosX - 50) * 0.2;
  const posY = autoY + (vehiclePosY - 50) * 0.2;

  // Size scales with proximity
  const sizeScale = Math.max(0.5, Math.min(2.8, 22 / vehicle.distance));
  const widthPercent = vehicleBaseSize * sizeScale;

  const danger = vehicle.distance < 14 && vehicle.relativeSpeed < 0;
  const color = danger ? '#FF3B3B' : '#FFFFFF';
  const glowColor = danger ? '#FF3B3B' : '#00F0C8';

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${posX}%`,
        top: `${posY}%`,
        width: `${widthPercent}%`,
        aspectRatio: '1.5 / 1',
        transform: 'translate(-50%, -50%)',
      }}
      animate={danger ? {
        filter: ['drop-shadow(0 0 8px #FF3B3B)', 'drop-shadow(0 0 24px #FF3B3B)', 'drop-shadow(0 0 8px #FF3B3B)'],
      } : {
        filter: `drop-shadow(0 0 10px ${glowColor}88)`,
      }}
      transition={{ duration: 0.6, repeat: danger ? Infinity : 0 }}
    >
      {/* Main frame */}
      <div
        className="absolute inset-0 rounded-sm"
        style={{
          border: `2px solid ${color}`,
          boxShadow: `0 0 18px ${glowColor}66, inset 0 0 16px ${glowColor}22`,
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: color }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: color }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: color }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: color }} />

      {/* Top label */}
      <div
        className="absolute -top-5 left-0 text-[9px] font-mono tracking-widest uppercase whitespace-nowrap"
        style={{ color: glowColor, textShadow: `0 0 4px ${glowColor}` }}
      >
        {vehicle.type || 'vehicle'} · {String(Math.floor(vehicle.distance * 13) % 999).padStart(3, '0')}
      </div>

      {/* Distance badge */}
      <div
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded whitespace-nowrap"
        style={{
          background: 'rgba(0, 16, 24, 0.85)',
          border: `1px solid ${glowColor}99`,
          boxShadow: `0 0 10px ${glowColor}44`,
        }}
      >
        <span
          className="font-mono text-xs font-bold tabular-nums"
          style={{ color: '#FFFFFF', textShadow: `0 0 5px ${glowColor}` }}
        >
          {vehicle.distance.toFixed(1)} m
        </span>
      </div>
    </motion.div>
  );
}

import { useSimulationStore } from '../../../store/simulationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Persistent screen positions per object id (laneX: -1=far left, 0=center, +1=right)
const OBJ_CONFIG = {
  1: { laneX:  0.75, label: 'SEDAN'       },
  2: { laneX: -0.65, label: 'SUV'         },
  3: { laneX:  1.55, label: 'SIGN'        },
  4: { laneX:  1.20, label: 'PEDESTRIAN'  },
  5: { laneX:  0.05, label: 'CAR AHEAD'   },
};

const TYPE_COLOR = {
  vehicle:    '#00F0C8',
  pedestrian: '#FF3B3B',
  sign:       '#FFB800',
};

// Convert distance + config to screen %
function screenPos(obj, cal) {
  const { horizonY, vanishingX, roadWidth } = cal;
  const t     = Math.max(0, Math.min(1, obj.distance / 900));
  const posY  = horizonY + 2 + (56 - horizonY) * (1 - t);
  const laneX = OBJ_CONFIG[obj.id]?.laneX ?? 0;
  const spread = roadWidth * 0.55 * (1 - t * 0.7);
  const posX  = vanishingX + laneX * spread;
  // Size: far = tiny, near = large
  const baseW = 3 + (1 - t) * 22;
  return { posX, posY, baseW };
}

function DetectionBox({ obj, cal }) {
  const color   = TYPE_COLOR[obj.type] ?? '#00F0C8';
  const { posX, posY, baseW } = screenPos(obj, cal);
  const aspectH = obj.type === 'pedestrian' ? 2.2 : obj.type === 'sign' ? 1 : 0.62;
  const [scan, setScan] = useState(false);

  useEffect(() => {
    // Brief scan animation on mount
    setScan(true);
    const t = setTimeout(() => setScan(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.25 }}
      className="absolute"
      style={{
        left: `${posX}%`,
        top:  `${posY}%`,
        width: `${baseW}%`,
        aspectRatio: `1 / ${aspectH}`,
        transform: 'translate(-50%, -50%)',
        filter: `drop-shadow(0 0 6px ${color}88)`,
      }}
    >
      {/* Main border */}
      <div
        className="absolute inset-0 rounded-[2px]"
        style={{
          border: `1.5px solid ${color}`,
          boxShadow: `0 0 12px ${color}44, inset 0 0 10px ${color}11`,
        }}
      />

      {/* Scan line sweep */}
      {scan && (
        <motion.div
          className="absolute inset-x-0 h-[2px]"
          style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{ duration: 0.7, ease: 'linear' }}
        />
      )}

      {/* Corner brackets */}
      {[['top-0 left-0', 'border-t border-l'], ['top-0 right-0', 'border-t border-r'],
        ['bottom-0 left-0', 'border-b border-l'], ['bottom-0 right-0', 'border-b border-r']].map(([pos, borders], i) => (
        <div
          key={i}
          className={`absolute ${pos} w-[22%] h-[22%] ${borders}`}
          style={{ borderColor: color, borderWidth: '2px' }}
        />
      ))}

      {/* Label + confidence */}
      <div
        className="absolute -top-[18px] left-0 flex items-center gap-1 whitespace-nowrap"
        style={{ fontSize: '8px', fontFamily: 'monospace', color }}
      >
        <span style={{ textShadow: `0 0 4px ${color}` }}>
          {OBJ_CONFIG[obj.id]?.label ?? obj.type.toUpperCase()}
        </span>
        <span style={{ opacity: 0.65 }}>·</span>
        <span style={{ color: '#fff', opacity: 0.9 }}>
          {Math.round(obj.confidence * 100)}%
        </span>
      </div>

      {/* Distance badge (only for nearby objects) */}
      {obj.distance < 200 && (
        <div
          className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 px-1.5 whitespace-nowrap"
          style={{
            fontSize: '9px', fontFamily: 'monospace', fontWeight: 700,
            color: '#fff', textShadow: `0 0 5px ${color}`,
            background: 'rgba(0,8,16,0.85)',
            border: `1px solid ${color}66`,
          }}
        >
          {obj.distance < 1 ? `${(obj.distance * 100).toFixed(0)}cm` : `${obj.distance.toFixed(1)}m`}
        </div>
      )}

      {/* Confidence bar (at bottom inside box) */}
      <div
        className="absolute bottom-[3px] left-[4px] right-[4px] h-[2px] rounded-full"
        style={{ background: `${color}22` }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${obj.confidence * 100}%`,
            background: color,
            boxShadow: `0 0 4px ${color}`,
          }}
        />
      </div>
    </motion.div>
  );
}

// Animated "YOLO SCAN" indicator
function ScanIndicator() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFrame(f => (f + 1) % 4), 250);
    return () => clearInterval(t);
  }, []);
  const dots = '.'.repeat(frame + 1).padEnd(4, ' ');
  return (
    <div
      className="fixed top-12 right-4 z-[6] flex items-center gap-2 px-2 py-1"
      style={{
        fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.15em',
        color: '#00F0C8', opacity: 0.7,
        border: '1px solid rgba(0,240,200,0.2)',
        background: 'rgba(0,10,18,0.6)',
      }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: '#00F0C8', boxShadow: '0 0 4px #00F0C8', animation: 'pulse 1s infinite' }}
      />
      YOLO{dots}
    </div>
  );
}

export default function YoloOverlay() {
  const backgroundMode   = useSimulationStore(s => s.backgroundMode);
  const detectedObjects  = useSimulationStore(s => s.detectedObjects);
  const cal              = useSimulationStore(s => s.calibration);
  const vehicleAhead     = useSimulationStore(s => s.vehicleAhead);
  const isPaused         = useSimulationStore(s => s.isPaused);

  // Only in video/parallax modes — 3D mode uses ThreeScene YOLO wireframes
  if (backgroundMode === '3d') return null;

  // Merge vehicleAhead live distance into id=5
  const objects = detectedObjects.map(obj =>
    obj.id === 5 ? { ...obj, distance: vehicleAhead.distance, detected: vehicleAhead.detected } : obj
  ).filter(obj => obj.detected !== false);

  return (
    <>
      <ScanIndicator />
      <div className="fixed inset-0 z-[6] pointer-events-none">
        <AnimatePresence>
          {!isPaused && objects.map(obj => (
            <DetectionBox key={obj.id} obj={obj} cal={cal} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

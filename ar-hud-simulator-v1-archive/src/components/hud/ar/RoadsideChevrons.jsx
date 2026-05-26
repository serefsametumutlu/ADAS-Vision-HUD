import { useSimulationStore } from '../../../store/simulationStore';
import { motion } from 'framer-motion';

export default function RoadsideChevrons() {
  const scenario = useSimulationStore(s => s.scenario);
  const { horizonY } = useSimulationStore(s => s.calibration);

  if (scenario !== 'highway') return null;

  const chevrons = Array.from({ length: 8 });

  return (
    <div className="absolute inset-0">
      {chevrons.map((_, i) => {
        const t = i / (chevrons.length - 1);
        const x = 78 - t * 28;
        const y = 85 - t * (85 - horizonY - 5);
        const size = 70 - t * 55;
        const opacity = 1 - t * 0.7;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              opacity,
            }}
            animate={{ opacity: [opacity, opacity * 0.3, opacity] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          >
            <svg width={size} height={size * 0.7} viewBox="0 0 70 50">
              <path
                d="M 5 25 L 35 5 L 35 18 L 65 18 L 65 32 L 35 32 L 35 45 Z"
                fill="#00F0C8"
                style={{ filter: 'drop-shadow(0 0 6px #00F0C8)' }}
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}

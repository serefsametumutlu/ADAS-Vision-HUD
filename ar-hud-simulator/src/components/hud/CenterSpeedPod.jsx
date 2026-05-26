import { useSimulationStore } from '../../store/simulationStore';
import { motion } from 'framer-motion';

const MANEUVER_ICONS = {
  straight: '↑',
  left:     '←',
  right:    '→',
  'u-turn': '↩',
};

export default function CenterSpeedPod() {
  const speed               = useSimulationStore(s => s.speed);
  const speedLimit          = useSimulationStore(s => s.speedLimit);
  const nextManeuver        = useSimulationStore(s => s.nextManeuver);
  const distanceToManeuver  = useSimulationStore(s => s.distanceToManeuver);

  const speedInt = Math.round(speed);
  const isOver   = speedInt > speedLimit + 2;
  const borderColor = isOver ? 'rgba(255,59,59,0.7)' : 'rgba(0,240,200,0.35)';

  return (
    <div className="fixed bottom-[230px] left-1/2 -translate-x-1/2 z-[12] pointer-events-none">
      <motion.div
        className="flex items-center backdrop-hud rounded-xl px-4 py-3"
        style={{ border: `1px solid ${borderColor}` }}
        animate={isOver ? {
          boxShadow: [
            '0 0 20px rgba(255,59,59,0.25)',
            '0 0 40px rgba(255,59,59,0.55)',
            '0 0 20px rgba(255,59,59,0.25)',
          ],
        } : {
          boxShadow: '0 0 20px rgba(0,240,200,0.2)',
        }}
        transition={{ duration: 0.9, repeat: Infinity }}
      >
        {/* Left: navigation */}
        <div className="flex flex-col items-center justify-center w-[72px] border-r border-white/10 pr-4 mr-4">
          <div className="text-3xl text-hud-blue leading-none mb-0.5">
            {MANEUVER_ICONS[nextManeuver] ?? '↑'}
          </div>
          <div className="text-[10px] font-mono text-white/60 tabular-nums tracking-wider">
            {distanceToManeuver}m
          </div>
        </div>

        {/* Center: big speed */}
        <div className="flex flex-col items-center px-3">
          <motion.div
            className="font-display tabular-nums leading-none"
            style={{ fontSize: '3.8rem', fontWeight: 900 }}
            animate={isOver ? { color: ['#FF3B3B', '#ff7070', '#FF3B3B'] } : { color: '#ffffff' }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {speedInt}
          </motion.div>
          <div className="text-[9px] font-mono tracking-[0.3em] text-white/45 -mt-1">KM/H</div>
        </div>

        {/* Right: speed limit circle */}
        <div className="flex flex-col items-center justify-center w-[72px] border-l border-white/10 pl-4 ml-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              border: `4px solid ${isOver ? '#FF3B3B' : '#cc0000'}`,
              background: '#ffffff',
              boxShadow: isOver ? '0 0 12px #FF3B3B88' : 'none',
            }}
          >
            <span className="text-black font-bold" style={{ fontSize: '1.25rem', lineHeight: 1 }}>
              {speedLimit}
            </span>
          </div>
          <div className="text-[9px] font-mono text-white/35 mt-1 tracking-wider">LIMIT</div>
        </div>
      </motion.div>
    </div>
  );
}

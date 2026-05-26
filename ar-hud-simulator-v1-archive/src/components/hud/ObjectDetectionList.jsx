import { useSimulationStore } from '../../store/simulationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, User, AlertOctagon, Navigation } from 'lucide-react';
import { useEffect } from 'react';

const typeIcons = { vehicle: Car, pedestrian: User, sign: AlertOctagon };

function useAutoUpdateObjects() {
  const objects = useSimulationStore(s => s.detectedObjects);

  useEffect(() => {
    const id = setInterval(() => {
      const updated = useSimulationStore.getState().detectedObjects
        .map(o => ({ ...o, distance: Math.max(15, o.distance - 25 - Math.random() * 40) }))
        .filter(o => o.distance > 15);

      if (updated.length < 5) {
        const types = ['vehicle', 'vehicle', 'sign', 'pedestrian'];
        const labels = {
          vehicle: ['Sedan', 'SUV', 'Truck', 'Van', 'Hatchback'],
          sign: ['Stop Sign', 'Speed Limit', 'No Entry', 'Yield'],
          pedestrian: ['Person', 'Cyclist', 'Group'],
        };
        const type = types[Math.floor(Math.random() * types.length)];
        updated.push({
          id: Date.now(),
          type,
          label: labels[type][Math.floor(Math.random() * labels[type].length)],
          distance: 600 + Math.random() * 300,
          confidence: 0.80 + Math.random() * 0.18,
        });
      }

      useSimulationStore.setState({
        detectedObjects: updated.sort((a, b) => b.distance - a.distance).slice(0, 5),
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return objects;
}

export default function ObjectDetectionList() {
  const objects = useAutoUpdateObjects();

  return (
    <div className="fixed left-4 z-[12] pointer-events-none" style={{ top: '8%' }}>
      {/* Header */}
      <motion.div
        className="mb-2 px-3 py-2 rounded"
        style={{
          background: 'rgba(0, 50, 40, 0.5)',
          border: '1px solid rgba(0, 240, 200, 0.4)',
          boxShadow: '0 0 16px rgba(0, 240, 200, 0.15)',
          backdropFilter: 'blur(8px)',
        }}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-2">
          <Navigation size={12} style={{ color: '#00F0C8', filter: 'drop-shadow(0 0 3px #00F0C8)' }} />
          <div>
            <div className="font-mono text-[11px] font-semibold text-white tracking-widest">
              AR·VISION
            </div>
            <div className="text-[8px] font-mono tracking-wider" style={{ color: 'rgba(0,240,200,0.7)' }}>
              4h 38m · 261,371 km
            </div>
          </div>
        </div>
      </motion.div>

      {/* Object rows */}
      <div className="space-y-1">
        <AnimatePresence>
          {objects.slice(0, 5).map((obj, i) => {
            const Icon = typeIcons[obj.type] || Car;
            const alpha = 1 - i * 0.14;
            return (
              <motion.div
                key={obj.id}
                layout
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: alpha, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-2 px-2.5 py-1 rounded"
                style={{
                  background: 'rgba(0, 16, 24, 0.45)',
                  borderLeft: '2px solid rgba(0, 240, 200, 0.45)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Icon size={11} style={{ color: '#00F0C8', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <span
                    className="font-mono text-xs font-semibold tabular-nums text-white"
                    style={{ textShadow: '0 0 4px rgba(0,240,200,0.6)' }}
                  >
                    {Math.round(obj.distance)}M
                  </span>
                  <span className="text-[8px] font-mono text-white/50 ml-1.5 uppercase tracking-wider">
                    {obj.label}
                  </span>
                </div>
                {/* Confidence bar */}
                <div className="w-6 h-0.5 bg-white/15 rounded overflow-hidden shrink-0">
                  <div
                    style={{
                      width: `${obj.confidence * 100}%`,
                      height: '100%',
                      background: '#00F0C8',
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

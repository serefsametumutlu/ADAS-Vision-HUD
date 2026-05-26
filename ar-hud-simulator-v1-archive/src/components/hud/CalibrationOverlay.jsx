import { useSimulationStore } from '../../store/simulationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const sliders = [
  { key: 'horizonY',        label: 'Horizon Y',       min: 30,  max: 60,   step: 0.5 },
  { key: 'vanishingX',      label: 'Vanishing X',     min: 30,  max: 70,   step: 0.5 },
  { key: 'roadWidth',       label: 'Road Width',      min: 10,  max: 50,   step: 0.5 },
  { key: 'carpetDepth',     label: 'Carpet Depth',    min: 30,  max: 100,  step: 1   },
  { key: 'perspective',     label: 'Perspective',     min: 400, max: 1500, step: 25  },
  { key: 'vehiclePosX',    label: 'Vehicle X Offset', min: 20,  max: 80,   step: 0.5 },
  { key: 'vehiclePosY',    label: 'Vehicle Y Offset', min: 20,  max: 80,   step: 0.5 },
  { key: 'vehicleBaseSize', label: 'Vehicle Size',    min: 5,   max: 25,   step: 0.5 },
];

const defaults = {
  horizonY: 45, vanishingX: 50, roadWidth: 28, carpetDepth: 65,
  perspective: 800, vehiclePosX: 50, vehiclePosY: 50, vehicleBaseSize: 12,
};

export default function CalibrationOverlay() {
  const cal = useSimulationStore(s => s.calibration);
  const setCal = useSimulationStore(s => s.setCalibration);
  const toggle = useSimulationStore(s => s.toggleCalibration);

  return (
    <AnimatePresence>
      {cal.showCalibration && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed top-1/2 -translate-y-1/2 right-4 z-[50] w-[252px] p-3.5 rounded-lg backdrop-blur-md pointer-events-auto"
          style={{
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
            background: 'rgba(0, 16, 26, 0.92)',
            border: '1px solid rgba(0, 240, 200, 0.4)',
            boxShadow: '0 0 30px rgba(0, 240, 200, 0.2)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-mono text-xs font-bold tracking-widest uppercase" style={{ color: '#00F0C8' }}>
                AR Calibration
              </h3>
              <p className="text-[9px] font-mono text-white/40 tracking-wider mt-0.5">K · Toggle · Align to road</p>
            </div>
            <button onClick={toggle} className="text-white/50 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="mb-3 p-2 rounded bg-black/40 text-[9px] font-mono text-white/50 leading-relaxed">
            Set <span style={{ color: '#00F0C8' }}>Horizon Y</span> first — match the road vanishing point.
          </div>

          <div className="space-y-2">
            {sliders.map(s => (
              <div key={s.key}>
                <div className="flex justify-between text-[9px] font-mono mb-0.5">
                  <span className="text-white/60 tracking-wider">{s.label}</span>
                  <span className="tabular-nums" style={{ color: '#00F0C8' }}>{cal[s.key]}</span>
                </div>
                <input
                  type="range"
                  min={s.min} max={s.max} step={s.step}
                  value={cal[s.key]}
                  onChange={(e) => setCal(s.key, parseFloat(e.target.value))}
                  className="w-full h-0.5 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#00F0C8', background: 'rgba(255,255,255,0.1)' }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => Object.entries(defaults).forEach(([k, v]) => setCal(k, v))}
            className="mt-3 w-full px-2 py-1 text-[9px] font-mono tracking-widest uppercase rounded transition-colors"
            style={{ color: '#00F0C8', border: '1px solid rgba(0,240,200,0.3)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,240,200,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Reset Defaults
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

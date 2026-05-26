import { useSimulationStore } from '../../store/simulationStore';

export default function DetectionStatusIndicator() {
  const count = useSimulationStore(s => s.detections.length);

  return (
    <div className="fixed top-3 right-6 z-[20] flex items-center gap-2 px-3 py-1.5 rounded backdrop-hud border border-hud-cyan/40">
      <div
        className="w-2 h-2 rounded-full animate-pulse-glow"
        style={{ background: '#00F0C8', boxShadow: '0 0 8px #00F0C8' }}
      />
      <span className="text-[10px] font-mono tracking-widest text-hud-cyan">
        AR DETECT · {count} OBJ
      </span>
    </div>
  );
}

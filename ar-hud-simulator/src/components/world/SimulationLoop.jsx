import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '../../store/simulationStore';

export default function SimulationLoop() {
  const tick = useSimulationStore(s => s.tick);
  useFrame((_, delta) => {
    tick(delta);
  });
  return null;
}

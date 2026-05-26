import { useFrame, useThree } from '@react-three/fiber';
import { useSimulationStore } from '../../store/simulationStore';

export default function EgoCamera() {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    // Read store state directly — no React subscription, no re-renders
    const { position, heading, speed } = useSimulationStore.getState();

    camera.position.set(position.x, 1.4, position.z);

    const lookX = position.x + Math.sin(heading) * 10;
    const lookZ = position.z - Math.cos(heading) * 10;
    camera.lookAt(lookX, 1.0, lookZ);

    // Subtle road vibration
    const shake = Math.min(0.015, speed / 6000);
    camera.position.y += Math.sin(clock.elapsedTime * 9) * shake;
    camera.rotation.z  = Math.sin(clock.elapsedTime * 2.5) * shake * 0.4;
  });

  return null;
}

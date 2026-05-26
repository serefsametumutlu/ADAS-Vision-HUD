import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { sceneRegistry } from '../SceneRegistry';

export default function Pedestrian({ id, pos, position, walkSpeed = 0, label = 'person', bw = 0.6, bh = 1.8, bd = 0.4 }) {
  const groupRef = useRef();
  const legRef   = useRef();
  const actualPos = pos || position;

  useEffect(() => {
    if (id) {
      sceneRegistry.set(id, { ref: groupRef, label, bw, bh, bd });
      return () => sceneRegistry.delete(id);
    }
  }, [id, label, bw, bh, bd]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.x = actualPos[0] + Math.sin(state.clock.elapsedTime * 2) * 0.06;
    if (walkSpeed !== 0) groupRef.current.position.z += walkSpeed * delta;
    if (legRef.current) legRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 5) * 0.35;
  });

  const shirtColor  = ['#3a5fcf', '#cf3a3a', '#3acf5f', '#cfcf3a'][parseInt(id?.slice(-1) || 0) % 4];
  const skinColor   = '#f0c098';
  const pantsColor  = '#2a2a4a';

  return (
    <group ref={groupRef} position={actualPos}>
      {/* Head */}
      <mesh position={[0, 1.58, 0]} castShadow>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.38, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.04, 0]}>
        <boxGeometry args={[0.42, 0.6, 0.24]} />
        <meshStandardMaterial color={shirtColor} roughness={0.8} />
      </mesh>
      {/* Arm L */}
      <mesh position={[-0.28, 1.05, 0]}>
        <boxGeometry args={[0.12, 0.52, 0.14]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* Arm R */}
      <mesh position={[ 0.28, 1.05, 0]}>
        <boxGeometry args={[0.12, 0.52, 0.14]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* Leg L (animated) */}
      <mesh ref={legRef} position={[-0.11, 0.38, 0]}>
        <boxGeometry args={[0.16, 0.68, 0.18]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>
      {/* Leg R */}
      <mesh position={[ 0.11, 0.38, 0]}>
        <boxGeometry args={[0.16, 0.68, 0.18]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>
    </group>
  );
}

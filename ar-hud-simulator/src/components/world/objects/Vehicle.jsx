import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { sceneRegistry } from '../SceneRegistry';

function Wheel({ position }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Tire */}
      <mesh castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.28, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 12]} />
        <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function CarBody({ color }) {
  return (
    <>
      {/* Main body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.82, 0.72, 4.2]} />
        <meshStandardMaterial color={color} metalness={0.75} roughness={0.25} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.18, -0.15]} castShadow>
        <boxGeometry args={[1.72, 0.6, 2.5]} />
        <meshStandardMaterial color={color} metalness={0.75} roughness={0.25} />
      </mesh>
      {/* Windshield (front glass) */}
      <mesh position={[0, 1.22, -1.28]}>
        <boxGeometry args={[1.55, 0.55, 0.08]} />
        <meshStandardMaterial color="#1a2e40" transparent opacity={0.65} roughness={0.0} metalness={0.1} />
      </mesh>
      {/* Rear glass */}
      <mesh position={[0, 1.22, 0.98]}>
        <boxGeometry args={[1.55, 0.52, 0.08]} />
        <meshStandardMaterial color="#1a2e40" transparent opacity={0.65} roughness={0.0} metalness={0.1} />
      </mesh>
      {/* Front bumper */}
      <mesh position={[0, 0.3, -2.16]}>
        <boxGeometry args={[1.75, 0.35, 0.12]} />
        <meshStandardMaterial color="#222222" roughness={0.6} />
      </mesh>
      {/* Rear bumper */}
      <mesh position={[0, 0.3, 2.16]}>
        <boxGeometry args={[1.75, 0.35, 0.12]} />
        <meshStandardMaterial color="#222222" roughness={0.6} />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.58, 0.52, -2.12]}>
        <boxGeometry args={[0.32, 0.18, 0.04]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffaa" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[ 0.58, 0.52, -2.12]}>
        <boxGeometry args={[0.32, 0.18, 0.04]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffaa" emissiveIntensity={0.6} />
      </mesh>
      {/* Taillights */}
      <mesh position={[-0.58, 0.52, 2.12]}>
        <boxGeometry args={[0.28, 0.16, 0.04]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[ 0.58, 0.52, 2.12]}>
        <boxGeometry args={[0.28, 0.16, 0.04]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={0.8} />
      </mesh>
    </>
  );
}

function TruckBody({ color }) {
  return (
    <>
      {/* Cab */}
      <mesh position={[0, 1.8, -2.6]} castShadow>
        <boxGeometry args={[2.2, 2.6, 2.4]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Cab front glass */}
      <mesh position={[0, 2.2, -3.75]}>
        <boxGeometry args={[2.0, 1.0, 0.08]} />
        <meshStandardMaterial color="#1a2e40" transparent opacity={0.65} roughness={0.0} />
      </mesh>
      {/* Cargo */}
      <mesh position={[0, 2.2, 1.2]} castShadow>
        <boxGeometry args={[2.4, 3.2, 5.5]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.75, 1.6, -3.78]}>
        <boxGeometry args={[0.35, 0.22, 0.04]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffaa" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[ 0.75, 1.6, -3.78]}>
        <boxGeometry args={[0.35, 0.22, 0.04]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffaa" emissiveIntensity={0.7} />
      </mesh>
    </>
  );
}

export default function Vehicle({ id, pos, position, color = '#cc3333', speed = 0, type = 'car', label = 'car', bw = 1.8, bh = 1.6, bd = 4.2 }) {
  const groupRef = useRef();
  const actualPos = pos || position;

  useEffect(() => {
    if (id) {
      sceneRegistry.set(id, { ref: groupRef, label, bw, bh, bd });
      return () => sceneRegistry.delete(id);
    }
  }, [id, label, bw, bh, bd]);

  useFrame((_, delta) => {
    if (groupRef.current && speed !== 0) {
      groupRef.current.position.z -= speed * delta;
    }
  });

  const wheelPositions = type === 'truck'
    ? [[-1.1, 0, -2.4], [1.1, 0, -2.4], [-1.1, 0, 1.6], [1.1, 0, 1.6]]
    : [[-0.85, 0, -1.5], [0.85, 0, -1.5], [-0.85, 0, 1.5], [0.85, 0, 1.5]];

  return (
    <group ref={groupRef} position={actualPos}>
      {type === 'truck' ? <TruckBody color={color} /> : <CarBody color={color} />}
      {wheelPositions.map((p, i) => <Wheel key={i} position={p} />)}
    </group>
  );
}

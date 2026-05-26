import { useRef, useEffect, useState } from 'react';
import { sceneRegistry } from '../SceneRegistry';

const CYCLE  = ['green', 'yellow', 'red'];
const DELAYS = { green: 8000, yellow: 2200, red: 6000 };

export default function TrafficLight({ id, pos, position, label = 'traffic light', bw = 0.6, bh = 6.5, bd = 0.6 }) {
  const groupRef  = useRef();
  const [state, setState] = useState('green');
  const actualPos = pos || position;

  useEffect(() => {
    if (id) {
      sceneRegistry.set(id, { ref: groupRef, label, bw, bh, bd });
      return () => sceneRegistry.delete(id);
    }
  }, [id, label, bw, bh, bd]);

  useEffect(() => {
    let idx = 0;
    const schedule = () => {
      idx = (idx + 1) % CYCLE.length;
      setState(CYCLE[idx]);
      return setTimeout(schedule, DELAYS[CYCLE[idx]]);
    };
    const t = setTimeout(schedule, DELAYS['green']);
    return () => clearTimeout(t);
  }, []);

  const bulb = (yPos, color, activeState) => (
    <mesh position={[0, yPos, 0.23]}>
      <sphereGeometry args={[0.16, 16, 16]} />
      <meshStandardMaterial
        color={state === activeState ? color : '#111111'}
        emissive={state === activeState ? color : '#000000'}
        emissiveIntensity={state === activeState ? 1.4 : 0}
      />
    </mesh>
  );

  return (
    <group ref={groupRef} position={actualPos}>
      {/* Pole */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 5, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Housing */}
      <mesh position={[0, 5.3, 0]} castShadow>
        <boxGeometry args={[0.55, 1.55, 0.48]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      {bulb(5.75, '#ff2200', 'red')}
      {bulb(5.25, '#ffcc00', 'yellow')}
      {bulb(4.75, '#00ee00', 'green')}
    </group>
  );
}

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore';

export default function Road() {
  const roadRef = useRef();
  const position = useSimulationStore(s => s.position);

  const asphaltTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#3a3a3a');
    grad.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 8000; i++) {
      const v = Math.random() < 0.5 ? 255 : 0;
      ctx.fillStyle = `rgba(${v},${v},${v},${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(20, 0, 4, 512);
    ctx.fillRect(488, 0, 4, 512);

    ctx.fillStyle = '#FFD700';
    ctx.fillRect(250, 0, 3, 512);
    ctx.fillRect(257, 0, 3, 512);

    ctx.fillStyle = '#FFFFFF';
    for (let y = 0; y < 512; y += 64) {
      ctx.fillRect(134, y, 4, 32);
      ctx.fillRect(372, y, 4, 32);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 10);
    return tex;
  }, []);

  useFrame(() => {
    if (roadRef.current) {
      roadRef.current.position.z = position.z;
      roadRef.current.position.x = position.x;
      asphaltTexture.offset.y = position.z * 0.05;
    }
  });

  return (
    <>
      <mesh ref={roadRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 1000]} />
        <meshStandardMaterial map={asphaltTexture} roughness={0.9} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-25, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 1000]} />
        <meshStandardMaterial color="#5a8c4a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[25, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 1000]} />
        <meshStandardMaterial color="#5a8c4a" roughness={1} />
      </mesh>
    </>
  );
}

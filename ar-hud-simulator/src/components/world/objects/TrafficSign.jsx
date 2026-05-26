import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { sceneRegistry } from '../SceneRegistry';

function buildTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (type === 'stop') {
    ctx.fillStyle = '#cc0000';
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * i + Math.PI / 8;
      const x = 128 + Math.cos(a) * 100, y = 128 + Math.sin(a) * 100;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 58px Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('STOP', 128, 128);

  } else if (type.startsWith('speed-')) {
    const limit = type.split('-')[1] || '50';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(128, 128, 112, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 18; ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${limit.length > 2 ? '76px' : '88px'} Arial`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(limit, 128, 128);

  } else if (type === 'pedestrian') {
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.moveTo(128, 16); ctx.lineTo(240, 128); ctx.lineTo(128, 240); ctx.lineTo(16, 128);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(128, 88, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(116, 104, 24, 52);
    ctx.fillRect(108, 156, 13, 46);
    ctx.fillRect(135, 156, 13, 46);
  }

  return new THREE.CanvasTexture(canvas);
}

export default function TrafficSign({ id, pos, position, type = 'stop', label = 'stop sign', bw = 1.0, bh = 3.2, bd = 0.2 }) {
  const groupRef  = useRef();
  const texture   = useMemo(() => buildTexture(type), [type]);
  const actualPos = pos || position;

  useEffect(() => {
    if (id) {
      sceneRegistry.set(id, { ref: groupRef, label, bw, bh, bd });
      return () => sceneRegistry.delete(id);
    }
  }, [id, label, bw, bh, bd]);

  return (
    <group ref={groupRef} position={actualPos}>
      {/* Pole */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 2.4, 8]} />
        <meshStandardMaterial color="#777777" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Sign face */}
      <mesh position={[0, 2.7, 0]}>
        <planeGeometry args={[0.95, 0.95]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

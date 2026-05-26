import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore';

// ── Building window textures — generated once, deterministic ──────────────────
const BUILDING_TEXTURES = (() => {
  const wallColors = ['#7a6e62', '#5a6878', '#6a7060', '#787060', '#5e6870'];
  return wallColors.map((wall, ti) => {
    const W = 256, H = 512;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, W, H);
    const floors = 4 + ti;
    const cols   = 3 + (ti % 3);
    const colW   = Math.floor(W / cols);
    const rowH   = Math.floor(H / floors);
    for (let f = 0; f < floors; f++) {
      for (let col = 0; col < cols; col++) {
        const wx = col * colW + 6;
        const wy = f * rowH + 6;
        const ww = colW - 12;
        const wh = rowH - 12;
        const lit = ((ti * 7 + f * 5 + col * 3) % 10) < 7;
        ctx.fillStyle = lit ? '#ffe8a0' : '#1a2535';
        ctx.fillRect(wx, wy, ww, wh);
        if (lit) {
          ctx.fillStyle = 'rgba(255,240,200,0.25)';
          ctx.fillRect(wx, wy, ww * 0.4, wh * 0.4);
        }
      }
    }
    const tex = new THREE.CanvasTexture(c);
    return tex;
  });
})();

// ── Sidewalk material ─────────────────────────────────────────────────────────
const SIDEWALK_MAT = new THREE.MeshStandardMaterial({ color: '#c0b8b0', roughness: 0.9 });

// ── Static environment items ───────────────────────────────────────────────────
const ROAD_LENGTH = 2000;
const ITEM_COUNT  = 50;

function seededRand(seed) {
  let s = seed + 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

const ENV_ITEMS = (() => {
  const rand = seededRand(99);
  const list = [];
  for (let i = 0; i < ITEM_COUNT; i++) {
    const side    = rand() > 0.5 ? 1 : -1;
    const dist    = 14 + rand() * 32;
    const x       = side * dist;
    const z       = -ROAD_LENGTH / 2 + (i / ITEM_COUNT) * ROAD_LENGTH + (rand() - 0.5) * 8;
    const isTree  = rand() < 0.55;
    const h       = isTree ? 4 + rand() * 9 : 6 + rand() * 16;
    const w       = isTree ? 1.2 + rand() * 1.2 : 3 + rand() * 6;
    const texIdx  = Math.floor(rand() * BUILDING_TEXTURES.length);
    list.push({ x, z, h, w, isTree, texIdx });
  }
  return list;
})();

// ── Street lamp (placed every ~40m on both sides) ─────────────────────────────
const LAMP_POSITIONS = (() => {
  const out = [];
  for (let z = -ROAD_LENGTH / 2; z < ROAD_LENGTH / 2; z += 100) {
    out.push([ 12, 0, z], [-12, 0, z]);
  }
  return out;
})();

function StreetLamp({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.8, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 5.6, 7]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[1.1, 5.55, 0]} rotation={[0, 0, -0.28]}>
        <cylinderGeometry args={[0.045, 0.045, 1.5, 6]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[1.85, 5.42, 0]}>
        <boxGeometry args={[0.45, 0.18, 0.32]} />
        <meshStandardMaterial color="#333333" roughness={0.5} />
      </mesh>
      <mesh position={[1.85, 5.32, 0]}>
        <boxGeometry args={[0.38, 0.04, 0.26]} />
        <meshStandardMaterial color="#ffe8a0" emissive="#ffe8a0" emissiveIntensity={1.0} />
      </mesh>
{/* pointLight removed — emissive mesh gives visual without GPU cost */}
    </group>
  );
}

export default function Environment3D() {
  const groupRef = useRef();
  const posZ     = useRef(0);

  useEffect(() => useSimulationStore.subscribe(s => {
    posZ.current = s.position.z;
  }), []);

  useFrame(() => {
    if (!groupRef.current) return;
    const snap = Math.round(posZ.current / ROAD_LENGTH) * ROAD_LENGTH;
    groupRef.current.position.z = snap;
  });

  return (
    <group ref={groupRef}>
      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12.5, 0.01, 0]} material={SIDEWALK_MAT}>
        <planeGeometry args={[5, ROAD_LENGTH]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ 12.5, 0.01, 0]} material={SIDEWALK_MAT}>
        <planeGeometry args={[5, ROAD_LENGTH]} />
      </mesh>

      {/* Street lamps */}
      {LAMP_POSITIONS.map((p, i) => <StreetLamp key={i} position={p} />)}

      {/* Trees and buildings */}
      {ENV_ITEMS.map((item, i) =>
        item.isTree ? (
          <group key={i} position={[item.x, item.h / 2, item.z]}>
            <mesh position={[0, -item.h * 0.32, 0]}>
              <cylinderGeometry args={[0.28, 0.38, item.h * 0.38, 6]} />
              <meshStandardMaterial color="#5a3820" roughness={1} />
            </mesh>
            <mesh position={[0, item.h * 0.14, 0]}>
              <sphereGeometry args={[item.w, 7, 6]} />
              <meshStandardMaterial color={['#2d6b2d', '#3a7a30', '#256025'][i % 3]} roughness={0.9} />
            </mesh>
          </group>
        ) : (
          <mesh key={i} position={[item.x, item.h / 2, item.z]}>
            <boxGeometry args={[item.w, item.h, item.w * 0.9]} />
            <meshStandardMaterial
              map={BUILDING_TEXTURES[item.texIdx]}
              roughness={0.85}
              metalness={0.05}
            />
          </mesh>
        )
      )}
    </group>
  );
}

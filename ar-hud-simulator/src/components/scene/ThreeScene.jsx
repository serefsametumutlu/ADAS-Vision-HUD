import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import * as THREE from 'three';

// ── Road ─────────────────────────────────────────────────────────────
function Road() {
  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Asphalt base
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, size, size);

    // Grain noise
    for (let i = 0; i < 8000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }

    // Road edge lines (solid white)
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillRect(8, 0, 5, size);
    ctx.fillRect(size - 13, 0, 5, size);

    // Lane dividers (dashed yellow) at 1/3 and 2/3 width
    ctx.fillStyle = 'rgba(255,220,0,0.75)';
    const dash = 36;
    const gap  = 28;
    let y = 0;
    while (y < size) {
      ctx.fillRect(Math.round(size / 3) - 2, y, 4, dash);
      ctx.fillRect(Math.round((size * 2) / 3) - 2, y, 4, dash);
      y += dash + gap;
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 60);
    return tex;
  }, []);

  useFrame((_, delta) => {
    const spd = useSimulationStore.getState().speed;
    texture.offset.y -= (spd / 100) * delta * 2.5;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -80]}>
      <planeGeometry args={[14, 300]} />
      <meshStandardMaterial map={texture} roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

// ── Road shoulder / dirt ──────────────────────────────────────────────
function Shoulder() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-13, -0.01, -80]}>
        <planeGeometry args={[12, 300]} />
        <meshStandardMaterial color="#2d3523" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[13, -0.01, -80]}>
        <planeGeometry args={[12, 300]} />
        <meshStandardMaterial color="#2d3523" roughness={1} />
      </mesh>
    </>
  );
}

// ── Road side objects (poles / trees) ────────────────────────────────
function RoadSideObjects() {
  const objects = useMemo(() => {
    const items = [];
    for (let i = 0; i < 28; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      items.push({
        x: side * (8.5 + Math.random() * 3),
        z: -(i * 11) - 4,
        h: 1.8 + Math.random() * 3.5,
        w: 0.3 + Math.random() * 0.4,
        color: `hsl(${120 + Math.random() * 30}, ${30 + Math.random() * 25}%, ${12 + Math.random() * 15}%)`,
      });
    }
    return items;
  }, []);

  // Slow lateral drift using refs
  const groupRef = useRef();
  useFrame((_, delta) => {
    const spd = useSimulationStore.getState().speed;
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.position.z += (spd / 36) * delta;
      if (child.position.z > 3) child.position.z -= 310;
    });
  });

  return (
    <group ref={groupRef}>
      {objects.map((obj, i) => (
        <mesh key={i} position={[obj.x, obj.h / 2, obj.z]}>
          <boxGeometry args={[obj.w, obj.h, obj.w]} />
          <meshStandardMaterial color={obj.color} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// ── Sky gradient (shader) ─────────────────────────────────────────────
const SKY_COLORS = {
  highway: { top: '#4db8d4', bottom: '#c8dfe8' },
  city:    { top: '#8aafc0', bottom: '#d4cfc4' },
  night:   { top: '#050518', bottom: '#0d0d30' },
};

function Sky() {
  const scenario = useSimulationStore(s => s.scenario);
  const { top, bottom } = SKY_COLORS[scenario] ?? SKY_COLORS.highway;

  return (
    <mesh position={[0, 25, -150]}>
      <planeGeometry args={[600, 120]} />
      <shaderMaterial
        uniforms={{
          topColor:    { value: new THREE.Color(top) },
          bottomColor: { value: new THREE.Color(bottom) },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          varying vec2 vUv;
          void main() {
            gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0);
          }
        `}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Distant mountains silhouette ──────────────────────────────────────
function Mountains() {
  const points = useMemo(() => {
    const pts = [];
    let x = -120;
    while (x <= 120) {
      pts.push(new THREE.Vector2(x, Math.sin(x * 0.07) * 6 + Math.sin(x * 0.19) * 3 + 5));
      x += 2;
    }
    pts.push(new THREE.Vector2(120, 0));
    pts.push(new THREE.Vector2(-120, 0));
    return pts;
  }, []);

  const shape = useMemo(() => new THREE.Shape(points), [points]);

  return (
    <mesh position={[0, 0, -120]}>
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial color="#1a2535" transparent opacity={0.85} />
    </mesh>
  );
}

// ── Subtle camera shake ───────────────────────────────────────────────
function CameraShake() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const spd = useSimulationStore.getState().speed;
    const intensity = (spd / 240) * 0.025;
    camera.position.y = 1.5 + Math.sin(t * 1.8) * intensity;
    camera.rotation.z = Math.sin(t * 1.1) * intensity * 0.4;
  });
  return null;
}

// ── Main export ───────────────────────────────────────────────────────
const FOG_COLORS = {
  highway: '#a8c8d8',
  city:    '#b8c0c8',
  night:   '#050518',
};

const AMBIENT = { highway: 0.6, city: 0.5, night: 0.15 };
const DIRLIGHT = { highway: 1.2, city: 0.9, night: 0.25 };

export default function ThreeScene() {
  const scenario = useSimulationStore(s => s.scenario);
  const fogColor  = FOG_COLORS[scenario] ?? FOG_COLORS.highway;

  return (
    <div className="fixed inset-0 z-0">
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.5, 2]} fov={72} rotation={[-0.08, 0, 0]} />
        <fog attach="fog" args={[fogColor, 25, 120]} />
        <ambientLight intensity={AMBIENT[scenario] ?? 0.6} />
        <directionalLight
          position={[8, 20, -10]}
          intensity={DIRLIGHT[scenario] ?? 1.2}
          castShadow
        />
        {scenario === 'night' && (
          <>
            <pointLight position={[0, 2, -5]}  color="#ffeeaa" intensity={1.2} distance={25} />
            <pointLight position={[0, 2, -30]} color="#ffeeaa" intensity={1.0} distance={25} />
          </>
        )}
        <Sky />
        <Mountains />
        <Road />
        <Shoulder />
        <RoadSideObjects />
        <CameraShake />
      </Canvas>
    </div>
  );
}

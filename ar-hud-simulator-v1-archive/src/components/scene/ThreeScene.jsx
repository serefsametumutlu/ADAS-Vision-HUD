import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Html } from '@react-three/drei';
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

    ctx.fillStyle = '#1a1a20';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 10000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.022})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.fillRect(6, 0, 5, size);
    ctx.fillRect(size - 11, 0, 5, size);

    ctx.fillStyle = 'rgba(255,220,0,0.75)';
    const dash = 36, gap = 28;
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -80]} receiveShadow>
      <planeGeometry args={[18, 350]} />
      <meshStandardMaterial map={texture} roughness={0.88} metalness={0.05} />
    </mesh>
  );
}

// ── Shoulder ──────────────────────────────────────────────────────────
function Shoulder() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-13, -0.01, -80]}>
        <planeGeometry args={[12, 300]} />
        <meshStandardMaterial color="#252e1a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[13, -0.01, -80]}>
        <planeGeometry args={[12, 300]} />
        <meshStandardMaterial color="#252e1a" roughness={1} />
      </mesh>
    </>
  );
}

// ── YOLO wireframe bounding box ───────────────────────────────────────
function DetectionWireframe({ w = 2.2, h = 1.7, d = 5.0, color = '#00F0C8' }) {
  const edges = useMemo(() => {
    const box = new THREE.BoxGeometry(w, h, d);
    const e = new THREE.EdgesGeometry(box);
    box.dispose();
    return e;
  }, [w, h, d]);

  return (
    <lineSegments geometry={edges}>
      <lineBasicMaterial color={color} transparent opacity={0.92} />
    </lineSegments>
  );
}

// ── Lead Vehicle with YOLO detection ─────────────────────────────────
function LeadVehicle() {
  const groupRef = useRef();
  const vehicle  = useSimulationStore(s => s.vehicleAhead);

  useFrame(() => {
    if (!groupRef.current) return;
    const v = useSimulationStore.getState().vehicleAhead;
    groupRef.current.visible = v.detected;
    if (!v.detected) return;
    const targetZ = 2 - Math.max(5, v.distance);
    groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.07;
  });

  const danger   = vehicle.distance < 14 && vehicle.relativeSpeed < 0;
  const boxColor = danger ? '#FF3B3B' : '#00F0C8';
  const initZ    = 2 - Math.max(5, vehicle.distance);

  return (
    <group ref={groupRef} position={[0.65, 0, initZ]}>
      {/* Body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.85, 0.72, 4.4]} />
        <meshStandardMaterial color="#1a2030" roughness={0.4} metalness={0.75} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.12, 0.2]} castShadow>
        <boxGeometry args={[1.58, 0.52, 2.3]} />
        <meshStandardMaterial color="#0f1520" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.12, 1.3]} rotation={[-0.32, 0, 0]}>
        <boxGeometry args={[1.4, 0.5, 0.07]} />
        <meshStandardMaterial color="#0a1830" transparent opacity={0.6} roughness={0.05} metalness={0.95} />
      </mesh>
      {/* Hood */}
      <mesh position={[0, 0.65, 1.78]}>
        <boxGeometry args={[1.85, 0.12, 0.82]} />
        <meshStandardMaterial color="#151d2a" roughness={0.35} metalness={0.8} />
      </mesh>
      {/* Front bumper */}
      <mesh position={[0, 0.35, 2.22]}>
        <boxGeometry args={[1.85, 0.35, 0.1]} />
        <meshStandardMaterial color="#101520" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Rear bumper */}
      <mesh position={[0, 0.35, -2.22]}>
        <boxGeometry args={[1.85, 0.35, 0.1]} />
        <meshStandardMaterial color="#101520" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Wheels + rims */}
      {[[-0.88, 0.3, -1.35], [0.88, 0.3, -1.35], [-0.88, 0.3, 1.35], [0.88, 0.3, 1.35]].map((p, i) => (
        <group key={i} position={p}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 14]} />
            <meshStandardMaterial color="#111118" roughness={0.95} />
          </mesh>
          <mesh position={[p[0] > 0 ? 0.1 : -0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 8]} />
            <meshStandardMaterial color="#aaaacc" roughness={0.15} metalness={0.95} />
          </mesh>
        </group>
      ))}
      {/* Tail lights */}
      {[[-0.68, 0.55, -2.22], [0.68, 0.55, -2.22]].map((p, i) => (
        <mesh key={`tl${i}`} position={p}>
          <boxGeometry args={[0.38, 0.13, 0.04]} />
          <meshStandardMaterial emissive="#ff2200" emissiveIntensity={3} color="#ff0000" />
        </mesh>
      ))}
      {[[-0.68, 0.55, -2.3], [0.68, 0.55, -2.3]].map((p, i) => (
        <pointLight key={`tp${i}`} position={p} color="#ff3300" intensity={1.8} distance={5} />
      ))}

      {/* ── YOLO Detection overlay ── */}
      <group position={[0, 0.82, 0]}>
        <DetectionWireframe w={2.1} h={1.72} d={4.85} color={boxColor} />

        {/* Corner spheres */}
        {[
          [-1.05, 0.86, 2.43], [1.05, 0.86, 2.43],
          [-1.05, -0.86, 2.43], [1.05, -0.86, 2.43],
          [-1.05, 0.86, -2.43], [1.05, 0.86, -2.43],
        ].map((p, i) => (
          <mesh key={`cs${i}`} position={p}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshBasicMaterial color={boxColor} />
          </mesh>
        ))}

        {/* Top label */}
        <Html position={[0, 1.08, 2.5]} center style={{ pointerEvents: 'none', zIndex: 20 }}>
          <div style={{
            fontFamily: 'monospace', fontSize: '10px', fontWeight: 'bold',
            whiteSpace: 'nowrap', color: boxColor,
            textShadow: `0 0 8px ${boxColor}`,
            background: 'rgba(0,6,14,0.85)',
            border: `1px solid ${boxColor}55`,
            padding: '1px 8px', borderRadius: '2px',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {vehicle.type || 'vehicle'} · 97%
          </div>
        </Html>

        {/* Distance badge */}
        <Html position={[0, -1.1, 0]} center style={{ pointerEvents: 'none', zIndex: 20 }}>
          <div style={{
            fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold',
            color: '#fff', textShadow: `0 0 6px ${boxColor}`,
            background: 'rgba(0,6,14,0.88)',
            border: `1px solid ${boxColor}88`,
            padding: '2px 10px', borderRadius: '2px',
          }}>
            {vehicle.distance.toFixed(1)} m
          </div>
        </Html>
      </group>
    </group>
  );
}

// ── Realistic trees ───────────────────────────────────────────────────
function Trees() {
  const objects = useMemo(() => {
    const items = [];
    for (let i = 0; i < 38; i++) {
      const side    = i % 2 === 0 ? -1 : 1;
      const trunkH  = 1.5 + Math.random() * 1.2;
      const crownH  = 3.5 + Math.random() * 5.5;
      items.push({
        x: side * (10 + Math.random() * 4.5),
        z: -(i * 9.5) - 5,
        trunkH, crownH,
        crownR:     1.0 + Math.random() * 1.4,
        crownColor: `hsl(${115 + Math.random() * 25},${24 + Math.random() * 18}%,${13 + Math.random() * 12}%)`,
        trunkColor: `hsl(25,${28 + Math.random() * 10}%,${10 + Math.random() * 8}%)`,
      });
    }
    return items;
  }, []);

  const groupRef = useRef();
  useFrame((_, delta) => {
    const spd = useSimulationStore.getState().speed;
    if (!groupRef.current) return;
    groupRef.current.children.forEach(child => {
      child.position.z += (spd / 36) * delta;
      if (child.position.z > 5) child.position.z -= 9.5 * 38;
    });
  });

  return (
    <group ref={groupRef}>
      {objects.map((obj, i) => (
        <group key={i} position={[obj.x, 0, obj.z]}>
          <mesh position={[0, obj.trunkH / 2, 0]}>
            <cylinderGeometry args={[0.1, 0.16, obj.trunkH, 6]} />
            <meshStandardMaterial color={obj.trunkColor} roughness={1} />
          </mesh>
          <mesh position={[0, obj.trunkH + obj.crownH * 0.35, 0]}>
            <coneGeometry args={[obj.crownR, obj.crownH, 7]} />
            <meshStandardMaterial color={obj.crownColor} roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Buildings (city mode) ─────────────────────────────────────────────
function Buildings() {
  const scenario = useSimulationStore(s => s.scenario);

  const buildings = useMemo(() => {
    const items = [];
    for (let i = 0; i < 24; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const h    = 10 + Math.random() * 30;
      items.push({
        x: side * (15 + Math.random() * 7),
        z: -(i * 17) - 8,
        w: 5 + Math.random() * 7, h,
        d: 5 + Math.random() * 6,
        hue: 205 + Math.random() * 25,
        windows: Math.random() > 0.3,
      });
    }
    return items;
  }, []);

  const groupRef = useRef();
  useFrame((_, delta) => {
    const spd = useSimulationStore.getState().speed;
    if (!groupRef.current) return;
    groupRef.current.children.forEach(child => {
      child.position.z += (spd / 36) * delta;
      if (child.position.z > 12) child.position.z -= 17 * 24;
    });
  });

  if (scenario !== 'city') return null;

  return (
    <group ref={groupRef}>
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          <mesh castShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={`hsl(${b.hue},12%,16%)`} roughness={0.78} metalness={0.22} />
          </mesh>
          {b.windows && (
            <mesh position={[0, 0, b.d / 2 + 0.05]}>
              <boxGeometry args={[b.w * 0.82, b.h * 0.88, 0.04]} />
              <meshStandardMaterial
                color="#081428"
                emissive="#ffdd88"
                emissiveIntensity={scenario === 'night' ? 0.28 : 0.04}
                roughness={0.35} metalness={0.5}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// ── Highway crash barriers ────────────────────────────────────────────
function HighwayBarriers() {
  const scenario  = useSimulationStore(s => s.scenario);
  const barriers  = useMemo(() => {
    const items = [];
    for (let i = 0; i < 45; i++)
      items.push({ side: i % 2 === 0 ? -8.2 : 8.2, z: -(i * 7.5) - 3 });
    return items;
  }, []);

  const groupRef = useRef();
  useFrame((_, delta) => {
    const spd = useSimulationStore.getState().speed;
    if (!groupRef.current) return;
    groupRef.current.children.forEach(child => {
      child.position.z += (spd / 36) * delta;
      if (child.position.z > 4) child.position.z -= 7.5 * 45;
    });
  });

  if (scenario !== 'highway') return null;

  return (
    <group ref={groupRef}>
      {barriers.map((b, i) => (
        <mesh key={i} position={[b.side, 0.3, b.z]}>
          <boxGeometry args={[0.28, 0.62, 7.2]} />
          <meshStandardMaterial color="#3a3d46" roughness={0.82} metalness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

// ── Street lights ─────────────────────────────────────────────────────
function StreetLights() {
  const scenario = useSimulationStore(s => s.scenario);
  const lights   = useMemo(() => {
    const items = [];
    for (let i = 0; i < 28; i++) {
      const side = i % 2 === 0 ? -9.5 : 9.5;
      items.push({ x: side, z: -(i * 13) - 6 });
    }
    return items;
  }, []);

  const groupRef = useRef();
  useFrame((_, delta) => {
    const spd = useSimulationStore.getState().speed;
    if (!groupRef.current) return;
    groupRef.current.children.forEach(child => {
      child.position.z += (spd / 36) * delta;
      if (child.position.z > 8) child.position.z -= 13 * 28;
    });
  });

  return (
    <group ref={groupRef}>
      {lights.map((l, i) => (
        <group key={i} position={[l.x, 0, l.z]}>
          <mesh position={[0, 3.5, 0]}>
            <cylinderGeometry args={[0.05, 0.08, 7, 6]} />
            <meshStandardMaterial color="#23272e" roughness={0.65} metalness={0.6} />
          </mesh>
          <mesh position={[l.x > 0 ? -0.85 : 0.85, 6.85, 0]} rotation={[0, 0, l.x > 0 ? 0.25 : -0.25]}>
            <cylinderGeometry args={[0.038, 0.038, 1.7, 5]} />
            <meshStandardMaterial color="#23272e" roughness={0.65} metalness={0.6} />
          </mesh>
          <mesh position={[l.x > 0 ? -1.35 : 1.35, 7.05, 0]}>
            <boxGeometry args={[0.55, 0.2, 0.38]} />
            <meshStandardMaterial
              color="#110e04"
              emissive={scenario === 'night' ? '#ffe060' : '#1a1200'}
              emissiveIntensity={scenario === 'night' ? 2.2 : 0.12}
            />
          </mesh>
          {scenario === 'night' && (
            <pointLight position={[l.x > 0 ? -1.35 : 1.35, 6.7, 0]} color="#ffe090" intensity={1.4} distance={18} />
          )}
        </group>
      ))}
    </group>
  );
}

// ── Speed limit signs ─────────────────────────────────────────────────
function SpeedLimitSigns() {
  const speedLimit = useSimulationStore(s => s.speedLimit);
  const signRef    = useRef();

  useFrame((_, delta) => {
    const spd = useSimulationStore.getState().speed;
    if (!signRef.current) return;
    signRef.current.children.forEach(child => {
      child.position.z += (spd / 36) * delta;
      if (child.position.z > 10) child.position.z -= 200;
    });
  });

  return (
    <group ref={signRef}>
      {[-80, -130].map((z, i) => (
        <group key={i} position={[8.6, 2.5, z]}>
          <mesh position={[0, -1.55, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 3.1, 6]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.7} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.52, 0.52, 0.07, 32]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <ringGeometry args={[0.38, 0.52, 32]} />
            <meshBasicMaterial color="#cc0000" />
          </mesh>
          <Html position={[0, 0, 0.09]} center style={{ pointerEvents: 'none' }}>
            <div style={{ fontFamily: 'Arial Black, sans-serif', fontSize: '18px', fontWeight: '900', color: '#111', lineHeight: 1, userSelect: 'none' }}>
              {speedLimit}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

// ── Sky gradient ──────────────────────────────────────────────────────
const SKY_COLORS = {
  highway: { top: '#3da8c2', bottom: '#b8d4e0' },
  city:    { top: '#7a9fb2', bottom: '#c8c4ba' },
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
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `}
        fragmentShader={`
          uniform vec3 topColor; uniform vec3 bottomColor; varying vec2 vUv;
          void main() { gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0); }
        `}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Mountains silhouette ──────────────────────────────────────────────
function Mountains() {
  const points = useMemo(() => {
    const pts = [];
    let x = -130;
    while (x <= 130) {
      pts.push(new THREE.Vector2(x, Math.sin(x * 0.07) * 7 + Math.sin(x * 0.19) * 3.5 + 6));
      x += 2;
    }
    pts.push(new THREE.Vector2(130, 0));
    pts.push(new THREE.Vector2(-130, 0));
    return pts;
  }, []);
  const shape = useMemo(() => new THREE.Shape(points), [points]);

  return (
    <mesh position={[0, 0, -120]}>
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial color="#18222e" transparent opacity={0.92} />
    </mesh>
  );
}

// ── Camera shake ──────────────────────────────────────────────────────
function CameraShake() {
  useFrame(({ camera, clock }) => {
    const t   = clock.getElapsedTime();
    const spd = useSimulationStore.getState().speed;
    const intensity = (spd / 240) * 0.018;
    camera.position.y = 0.85 + Math.sin(t * 1.8) * intensity;
    camera.rotation.z = Math.sin(t * 1.1) * intensity * 0.35;
  });
  return null;
}

// ── Main export ───────────────────────────────────────────────────────
const FOG_COLORS = { highway: '#9abece', city: '#aab4bc', night: '#050518' };
const AMBIENT    = { highway: 0.65,  city: 0.5,  night: 0.12  };
const DIRLIGHT   = { highway: 1.3,   city: 0.95, night: 0.2   };

export default function ThreeScene() {
  const scenario = useSimulationStore(s => s.scenario);
  const fogColor = FOG_COLORS[scenario] ?? FOG_COLORS.highway;

  return (
    <div className="fixed inset-0 z-0">
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0.85, 2]} fov={72} rotation={[-0.22, 0, 0]} />
        <fog attach="fog" args={[fogColor, 35, 160]} />
        <ambientLight intensity={AMBIENT[scenario] ?? 0.65} />
        <directionalLight position={[8, 20, -10]} intensity={DIRLIGHT[scenario] ?? 1.3} castShadow />
        {scenario === 'night' && (
          <>
            <pointLight position={[0, 2, -5]}  color="#ffeeaa" intensity={1.4} distance={28} />
            <pointLight position={[0, 2, -30]} color="#ffeeaa" intensity={1.1} distance={28} />
          </>
        )}
        <Sky />
        <Mountains />
        <Road />
        <Shoulder />
        <LeadVehicle />
        <Trees />
        <Buildings />
        <HighwayBarriers />
        <StreetLights />
        <SpeedLimitSigns />
        <CameraShake />
      </Canvas>
    </div>
  );
}

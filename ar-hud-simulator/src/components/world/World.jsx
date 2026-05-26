import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import Road from './Road';
import Environment3D from './Environment3D';
import SceneObjects from './SceneObjects';
import EgoCamera from './EgoCamera';
import SimulationLoop from './SimulationLoop';
import SyntheticDetector from './SyntheticDetector';

export default function World() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        shadows="soft"
        dpr={1}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        camera={{ position: [0, 1.4, 0], fov: 75, near: 0.1, far: 500 }}
        id="three-canvas"
      >
        {/* Shader sky — zero network cost, no PMREM */}
        <Sky sunPosition={[100, 30, 100]} turbidity={6} rayleigh={0.8} mieCoefficient={0.005} />

        <directionalLight
          position={[60, 70, 40]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[512, 512]}
          shadow-camera-far={150}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
          color="#fff8e8"
        />
        <ambientLight intensity={0.5} color="#c8d8f0" />
        <hemisphereLight args={['#87ceeb', '#4a7c40', 0.4]} />

        <fog attach="fog" args={['#c8dff0', 100, 350]} />

        <EgoCamera />
        <Road />
        <Environment3D />
        <SceneObjects />
        <SyntheticDetector />
        <SimulationLoop />

        <EffectComposer multisampling={0}>
          <Vignette offset={0.35} darkness={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

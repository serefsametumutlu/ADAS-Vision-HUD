import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { sceneRegistry } from './SceneRegistry';
import { useSimulationStore } from '../../store/simulationStore';

const _pos   = new THREE.Vector3();
const _tl    = new THREE.Vector3();
const _br    = new THREE.Vector3();
const _toObj = new THREE.Vector3();
const _fwd   = new THREE.Vector3();

export default function SyntheticDetector() {
  const { camera }    = useThree();
  const setDetections = useSimulationStore(s => s.setDetections);
  const frameCount    = useRef(0);
  const prevResults   = useRef([]);

  useFrame(() => {
    // Run every 3rd frame (≈20fps) — imperceptible, halves CPU vs every frame
    if (++frameCount.current % 3 !== 0) return;

    const results = [];
    _fwd.set(0, 0, -1).applyQuaternion(camera.quaternion);

    for (const [id, entry] of sceneRegistry) {
      const { ref, label, bw, bh } = entry;
      if (!ref?.current) continue;

      ref.current.getWorldPosition(_pos);
      const dist = camera.position.distanceTo(_pos);
      if (dist < 2 || dist > 80) continue;

      _toObj.copy(_pos).sub(camera.position).normalize();
      if (_toObj.dot(_fwd) < 0.1) continue;

      _tl.set(_pos.x - bw * 0.5, _pos.y + bh, _pos.z);
      _br.set(_pos.x + bw * 0.5, _pos.y,       _pos.z);

      const ptl = _tl.clone().project(camera);
      const pbr = _br.clone().project(camera);
      if (ptl.z > 1 || pbr.z > 1) continue;

      const x1 = ((ptl.x + 1) / 2) * 100;
      const y1 = ((1 - ptl.y) / 2) * 100;
      const x2 = ((pbr.x + 1) / 2) * 100;
      const y2 = ((1 - pbr.y) / 2) * 100;

      const bboxX = Math.min(x1, x2);
      const bboxY = Math.min(y1, y2);
      const bboxW = Math.abs(x2 - x1);
      const bboxH = Math.abs(y2 - y1);

      if (bboxW < 0.4 || bboxH < 0.3) continue;
      if (bboxX + bboxW < -2 || bboxX > 102) continue;
      if (bboxY + bboxH < -2 || bboxY > 102) continue;

      results.push({
        label,
        confidence: Math.min(0.99, 0.58 + (1 - dist / 80) * 0.41),
        bbox: { x: Math.max(0, bboxX), y: Math.max(0, bboxY), w: bboxW, h: bboxH },
        distance: Math.round(dist * 10) / 10,
        id,
      });
    }

    // Shallow diff — only update store if something actually changed
    const prev = prevResults.current;
    const changed =
      results.length !== prev.length ||
      results.some((r, i) => {
        const p = prev[i];
        return !p || r.id !== p.id || Math.abs(r.distance - p.distance) > 0.8;
      });

    if (changed) {
      prevResults.current = results;
      setDetections(results);
    }
  });

  return null;
}

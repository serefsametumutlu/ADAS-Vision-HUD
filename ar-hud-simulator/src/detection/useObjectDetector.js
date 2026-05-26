import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { useSimulationStore } from '../store/simulationStore';

const DETECTION_INTERVAL = 200; // ms — 5 fps inference

function estimateDistance(bbox, label, canvasHeight) {
  const [, , , h] = bbox;
  const realHeights = {
    person: 1.7, car: 1.5, truck: 3.0, bus: 3.2,
    motorcycle: 1.3, bicycle: 1.1,
    'stop sign': 0.8, 'traffic light': 1.0,
  };
  const realH = realHeights[label] || 1.5;
  const focalPx = canvasHeight / (2 * Math.tan(0.5 * 75 * Math.PI / 180));
  return Math.max(2, Math.min(200, (realH * focalPx) / h));
}

function getThreeCanvas() {
  // R3F mounts canvas directly inside the wrapper div
  const wrapper = document.getElementById('three-canvas');
  if (!wrapper) return null;
  return wrapper.tagName === 'CANVAS' ? wrapper : wrapper.querySelector('canvas');
}

export function useObjectDetector() {
  const [model, setModel]             = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [fps, setFps]                 = useState(0);

  const animRef      = useRef();
  const lastTime     = useRef(0);
  const frameCount   = useRef(0);
  const fpsTimer     = useRef(Date.now());
  const runningRef   = useRef(false);

  const setDetections     = useSimulationStore(s => s.setDetections);
  const detectionEnabled  = useSimulationStore(s => s.detectionEnabled);

  // ── Model yükleme ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('[Detection] TF backend:', tf.getBackend());
        const m = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        if (!cancelled) {
          setModel(m);
          setModelLoading(false);
          console.log('[Detection] COCO-SSD ready');
        }
      } catch (err) {
        console.error('[Detection] model load failed:', err);
        if (!cancelled) setModelLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Inference döngüsü ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!model || !detectionEnabled) {
      if (!detectionEnabled) setDetections([]);
      return;
    }

    // Canvas hazır olana kadar biraz bekle
    let startHandle;
    const startLoop = () => {
      const canvas = getThreeCanvas();
      if (!canvas) {
        startHandle = setTimeout(startLoop, 500);
        return;
      }

      runningRef.current = true;

      const detect = async (now) => {
        if (!runningRef.current) return;

        if (now - lastTime.current >= DETECTION_INTERVAL) {
          try {
            const c = getThreeCanvas();
            if (c && c.width > 0 && c.height > 0) {
              const preds = await model.detect(c, 10, 0.35);
              const cw = c.width, ch = c.height;

              const normalized = preds.map(p => {
                const [x, y, w, h] = p.bbox;
                return {
                  label: p.class,
                  confidence: p.score,
                  bbox: {
                    x: (x / cw) * 100,
                    y: (y / ch) * 100,
                    w: (w / cw) * 100,
                    h: (h / ch) * 100,
                  },
                  distance: estimateDistance(p.bbox, p.class, ch),
                  id: `${p.class}-${Math.floor(x)}-${Math.floor(y)}`,
                };
              });

              setDetections(normalized);

              // FPS
              frameCount.current++;
              const now2 = Date.now();
              if (now2 - fpsTimer.current >= 1000) {
                setFps(frameCount.current);
                frameCount.current = 0;
                fpsTimer.current = now2;
              }
            }
          } catch (err) {
            console.error('[Detection] inference error:', err);
          }
          lastTime.current = now;
        }

        animRef.current = requestAnimationFrame(detect);
      };

      animRef.current = requestAnimationFrame(detect);
    };

    startLoop();

    return () => {
      runningRef.current = false;
      clearTimeout(startHandle);
      cancelAnimationFrame(animRef.current);
    };
  }, [model, detectionEnabled, setDetections]);

  return { modelLoading, fps, modelReady: !!model };
}

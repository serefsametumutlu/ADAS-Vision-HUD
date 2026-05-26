import { useRef, useEffect, useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';

function FallbackBackground({ scenario }) {
  const gradients = {
    highway: 'from-sky-900 via-sky-700 to-sky-500',
    city:    'from-slate-800 via-slate-600 to-slate-400',
    night:   'from-slate-950 via-indigo-950 to-slate-900',
  };
  return (
    <div className={`fixed inset-0 z-0 bg-gradient-to-b ${gradients[scenario] ?? gradients.highway}`}>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-900 to-transparent" />
      <div className="absolute inset-x-0 bottom-1/3 h-px bg-hud-cyan/20" />
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-hud-cyan/30 tracking-widest uppercase">
        Video file missing — switch to 3D mode
      </p>
    </div>
  );
}

function videoSrc(scenario) {
  const map = { highway: 'highway-day', city: 'city-day', night: 'night-drive' };
  return `/scenes/videos/${map[scenario] ?? map.highway}.mp4`;
}

export default function VideoScene() {
  const scenario = useSimulationStore(s => s.scenario);
  const speed    = useSimulationStore(s => s.speed);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  // Sync playback rate to speed (0.3× at 0 km/h, 2.5× at 250 km/h)
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = Math.max(0.3, Math.min(2.5, speed / 100));
  }, [speed]);

  // Reset error on scenario change
  useEffect(() => setError(false), [scenario]);

  if (error) return <FallbackBackground scenario={scenario} />;

  return (
    <video
      ref={videoRef}
      key={scenario}
      className="fixed inset-0 w-full h-full object-cover z-0"
      autoPlay
      muted
      loop
      playsInline
      onError={() => setError(true)}
    >
      <source src={videoSrc(scenario)} type="video/mp4" />
    </video>
  );
}

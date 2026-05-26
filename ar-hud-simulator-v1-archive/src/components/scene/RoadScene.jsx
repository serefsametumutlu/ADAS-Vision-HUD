import { useSimulationStore } from '../../store/simulationStore';
import VideoScene    from './VideoScene';
import ThreeScene    from './ThreeScene';
import ParallaxScene from './ParallaxScene';

export default function RoadScene() {
  const mode = useSimulationStore(s => s.backgroundMode);

  if (mode === 'video')    return <VideoScene />;
  if (mode === '3d')       return <ThreeScene />;
  if (mode === 'parallax') return <ParallaxScene />;
  return <ThreeScene />;
}

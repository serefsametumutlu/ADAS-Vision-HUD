import { useSimulationStore } from '../../../store/simulationStore';
import NavigationCarpet from './NavigationCarpet';
import RoadsideChevrons from './RoadsideChevrons';
import LaneGuides from './LaneGuides';
import YoloOverlay from './YoloOverlay';

export default function ARLayer() {
  const { perspective, horizonY } = useSimulationStore(s => s.calibration);

  return (
    <>
      <div
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{
          perspective: `${perspective}px`,
          perspectiveOrigin: `50% ${horizonY}%`,
        }}
      >
        <NavigationCarpet />
        <LaneGuides />
        <RoadsideChevrons />
      </div>
      <YoloOverlay />
    </>
  );
}

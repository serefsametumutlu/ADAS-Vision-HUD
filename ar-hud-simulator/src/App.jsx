import './index.css';
import World from './components/world/World';
import DashboardHood from './components/hud/DashboardHood';
import DetectionOverlay from './components/hud/DetectionOverlay';
import DetectionStatusIndicator from './components/hud/DetectionStatusIndicator';
import TopStatusBar from './components/hud/TopStatusBar';
import CenterSpeedPod from './components/hud/CenterSpeedPod';
import LeftPanel_Telemetry from './components/hud/LeftPanel_Telemetry';
import RightPanel_ADAS from './components/hud/RightPanel_ADAS';
import SeatPanel from './components/hud/SeatPanel';
import MiniMap from './components/hud/MiniMap';
import WarningSystem from './components/hud/WarningSystem';
import BootSequence from './components/BootSequence';
import ControlPanel from './components/controls/ControlPanel';
import HelpOverlay from './components/HelpOverlay';
import PerfMonitor from './components/PerfMonitor';
import ErrorBoundary from './components/ErrorBoundary';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useObjectDetector } from './detection/useObjectDetector';
import { useADASBrain } from './detection/useADASBrain';
import { useSpeedLimitDetector } from './detection/useSpeedLimitDetector';
import { useSafetyMonitor } from './utils/safetyMonitor';
import { useSimulationStore } from './store/simulationStore';

function ADASEngine() {
  useObjectDetector();
  useADASBrain();
  useSpeedLimitDetector();
  useSafetyMonitor();
  useKeyboardShortcuts();
  return null;
}

function HUDLayer() {
  const isCinematic  = useSimulationStore(s => s.isCinematic);
  const bootComplete = useSimulationStore(s => s.bootComplete);

  if (!bootComplete) return null;

  return (
    <>
      {/* Always visible */}
      <DetectionOverlay />
      <CenterSpeedPod />
      <WarningSystem />

      {/* Hidden in cinematic mode */}
      {!isCinematic && (
        <>
          <DashboardHood />
          <DetectionStatusIndicator />
          <TopStatusBar />
          <LeftPanel_Telemetry />
          <RightPanel_ADAS />
          <SeatPanel />
          <MiniMap />
        </>
      )}

      {/* Dev & help — always available */}
      <ControlPanel />
      <HelpOverlay />
      <PerfMonitor />
    </>
  );
}

export default function App() {
  const bootComplete = useSimulationStore(s => s.bootComplete);

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 bg-black">
        {/* Boot sequence — renders until complete */}
        {!bootComplete && <BootSequence />}

        {/* 3D world always mounts so the scene loads during boot */}
        <World />
        <ADASEngine />

        <HUDLayer />
      </div>
    </ErrorBoundary>
  );
}

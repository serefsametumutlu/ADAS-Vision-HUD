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
import { useObjectDetector } from './detection/useObjectDetector';
import { useADASBrain } from './detection/useADASBrain';
import { useSpeedLimitDetector } from './detection/useSpeedLimitDetector';
import { useSafetyMonitor } from './utils/safetyMonitor';

function ADASEngine() {
  useObjectDetector();
  useADASBrain();
  useSpeedLimitDetector();
  useSafetyMonitor();
  return null;
}

export default function App() {
  return (
    <div className="fixed inset-0 bg-black">
      {/* 3D world */}
      <World />
      <ADASEngine />

      {/* Cockpit frame — above 3D, below HUD */}
      <DashboardHood />

      {/* Detection boxes on windshield */}
      <DetectionOverlay />
      <DetectionStatusIndicator />

      {/* HUD panels */}
      <TopStatusBar />
      <LeftPanel_Telemetry />
      <RightPanel_ADAS />
      <CenterSpeedPod />
      <SeatPanel />
      <MiniMap />

      {/* Smart warning banner — always topmost */}
      <WarningSystem />
    </div>
  );
}

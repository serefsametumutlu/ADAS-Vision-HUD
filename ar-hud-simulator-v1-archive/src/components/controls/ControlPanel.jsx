import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';
import { applyScenarioPreset } from '../../hooks/useScenarioPresets';
import HudSlider from './HudSlider';
import HudToggle from './HudToggle';

// ── Collapsible section ───────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-hud-cyan/8">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-hud-cyan/5 transition-colors"
      >
        <span className="font-mono text-[9px] tracking-[0.25em] text-hud-cyan/60 uppercase">{title}</span>
        {open
          ? <ChevronDown size={10} className="text-hud-cyan/30" />
          : <ChevronRight size={10} className="text-hud-cyan/30" />
        }
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 flex flex-col gap-2.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Segmented button group ────────────────────────────────────────────
function SegGroup({ options, value, onChange }) {
  return (
    <div className="flex gap-px">
      {options.map(opt => (
        <button
          key={opt.value ?? opt}
          onClick={() => onChange(opt.value ?? opt)}
          className={`flex-1 font-mono text-[9px] tracking-widest uppercase py-1 px-1 border transition-all duration-150
                      ${(opt.value ?? opt) === value
                        ? 'border-hud-cyan bg-hud-cyan/15 text-hud-cyan shadow-[0_0_6px_rgba(0,255,255,0.2)]'
                        : 'border-hud-cyan/15 bg-transparent text-white/30 hover:bg-hud-cyan/8 hover:text-white/50'
                      }`}
        >
          {opt.label ?? opt}
        </button>
      ))}
    </div>
  );
}

// ── Warning button ────────────────────────────────────────────────────
function WarnBtn({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[9px] tracking-widest uppercase py-1.5 px-2 border transition-all duration-150
                  active:scale-95 ${color}`}
    >
      {label}
    </button>
  );
}

// ── FPS + runtime counter ─────────────────────────────────────────────
function useDebugStats() {
  const [fps, setFps] = useState(60);
  const [runtime, setRuntime] = useState('0:00');
  const frameRef = useRef(0);
  const lastRef = useRef(performance.now());
  const startRef = useRef(Date.now());

  useEffect(() => {
    let rafId;
    const loop = () => {
      frameRef.current++;
      const now = performance.now();
      if (now - lastRef.current >= 1000) {
        setFps(frameRef.current);
        frameRef.current = 0;
        lastRef.current = now;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const s = Math.floor((Date.now() - startRef.current) / 1000);
      setRuntime(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return { fps, runtime };
}

// ── Main panel ────────────────────────────────────────────────────────
export default function ControlPanel() {
  const {
    devPanelOpen, toggleDevPanel,
    // scene
    scenario, backgroundMode, autoMode, isPaused, cinematicMode, calibration,
    setBackgroundMode, toggleAuto, togglePause, toggleCinematicMode, toggleCalibration,
    // vehicle
    speed, targetSpeed, gear, currentLane, fuel, battery,
    setSpeed, setTargetSpeed, setGear, setLane, setFuel, setBattery,
    // navigation
    nextManeuver, distanceToManeuver, destination, currentRoad,
    setNextManeuver, setDistanceToManeuver, setDestination, setCurrentRoad,
    // vehicle ahead
    vehicleAhead, setVehicleAhead,
    // speed limit
    speedLimit, speedLimitDistance, setSpeedLimit, setSpeedLimitDistance,
    // adas
    adas, setADAS,
    // warnings
    warnings, triggerCollisionWarning, triggerLaneDeparture,
    triggerSpeedingWarning, triggerPedestrian, clearAllWarnings,
    // objects
    detectedObjects,
    // theme / perf
    theme, setTheme, showPerfMonitor, togglePerfMonitor,
  } = useSimulationStore();

  const { fps, runtime } = useDebugStats();

  return (
    <>
      {/* Gear button (always visible) */}
      <AnimatePresence>
        {!devPanelOpen && (
          <motion.button
            key="gear-btn"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={toggleDevPanel}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[60]
                       bg-black/80 backdrop-blur-sm border border-hud-cyan/25 border-r-0
                       p-2 text-hud-cyan/50 hover:text-hud-cyan hover:bg-hud-cyan/10
                       transition-all duration-200 shadow-[0_0_12px_rgba(0,255,255,0.1)]"
            title="Control Panel (D)"
          >
            <Settings size={14} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sliding panel */}
      <AnimatePresence>
        {devPanelOpen && (
          <motion.div
            key="control-panel"
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-[60] w-[380px] flex flex-col
                       bg-black/90 backdrop-blur-md border-l border-hud-cyan/20
                       shadow-[-8px_0_40px_rgba(0,255,255,0.06)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-hud-cyan/15 shrink-0">
              <div>
                <h2 className="font-mono text-hud-cyan tracking-[0.3em] uppercase text-xs">CONTROL DECK</h2>
                <p className="font-mono text-white/25 text-[8px] tracking-widest mt-0.5">AR HUD SIMULATOR</p>
              </div>
              <button
                onClick={toggleDevPanel}
                className="p-1 border border-hud-cyan/20 text-hud-cyan/40 hover:text-hud-cyan
                           hover:border-hud-cyan/60 transition-all"
              >
                <X size={12} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-hud-cyan/20">

              {/* ── THEME ─── */}
              <Section title="🎨 Color Theme">
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'cyan',    label: 'Cyan',    rgb: '0 240 200',   hex: '#00F0C8' },
                    { id: 'amber',   label: 'Amber',   rgb: '255 184 0',   hex: '#FFB800' },
                    { id: 'magenta', label: 'Magenta', rgb: '255 0 229',   hex: '#FF00E5' },
                    { id: 'green',   label: 'Green',   rgb: '0 255 140',   hex: '#00FF8C' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex flex-col items-center gap-1 py-2 border transition-all duration-200
                                  ${theme === t.id ? 'border-white/40 bg-white/8' : 'border-white/10 hover:border-white/25'}`}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: t.hex, boxShadow: theme === t.id ? `0 0 8px ${t.hex}` : 'none' }}
                      />
                      <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase">{t.label}</span>
                    </button>
                  ))}
                </div>
              </Section>

              {/* ── SCENE & MODE ─── */}
              <Section title="📍 Scene & Mode">
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[8px] text-white/25 tracking-widest uppercase">Scenario</span>
                  <SegGroup
                    value={scenario}
                    onChange={applyScenarioPreset}
                    options={['highway', 'city', 'night']}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[8px] text-white/25 tracking-widest uppercase">Background</span>
                  <SegGroup
                    value={backgroundMode}
                    onChange={setBackgroundMode}
                    options={[
                      { value: 'video', label: 'Video' },
                      { value: '3d', label: '3D' },
                      { value: 'parallax', label: 'Parallax' },
                    ]}
                  />
                </div>
                <HudToggle label="Auto Mode" value={autoMode} onChange={toggleAuto} />
                <HudToggle label="Pause Simulation" value={isPaused} onChange={togglePause} />
                <HudToggle label="Cinematic Mode (M)" value={cinematicMode} onChange={toggleCinematicMode} />
                <HudToggle label="Calibration Mode (K)" value={calibration.showCalibration} onChange={toggleCalibration} />
              </Section>

              {/* ── VEHICLE ─── */}
              <Section title="🚗 Vehicle">
                <HudSlider label="Speed" value={Math.round(speed)} min={0} max={240} unit=" km/h" onChange={setSpeed} />
                <HudSlider label="Target Speed" value={targetSpeed} min={0} max={240} unit=" km/h" onChange={setTargetSpeed} />
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[8px] text-white/25 tracking-widest uppercase">Gear</span>
                  <SegGroup
                    value={gear}
                    onChange={setGear}
                    options={['P', 'R', 'N', 'D']}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[8px] text-white/25 tracking-widest uppercase">Lane</span>
                  <SegGroup
                    value={currentLane}
                    onChange={setLane}
                    options={[
                      { value: 1, label: '1' },
                      { value: 2, label: '2' },
                      { value: 3, label: '3' },
                    ]}
                  />
                </div>
                <HudSlider label="Fuel" value={fuel} min={0} max={100} unit="%" onChange={setFuel} />
                <HudSlider label="Battery" value={battery} min={0} max={100} unit="%" onChange={setBattery} />
              </Section>

              {/* ── NAVIGATION ─── */}
              <Section title="🗺 Navigation" defaultOpen={false}>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[8px] text-white/25 tracking-widest uppercase">Maneuver</span>
                  <SegGroup
                    value={nextManeuver}
                    onChange={setNextManeuver}
                    options={[
                      { value: 'straight', label: 'Fwd' },
                      { value: 'left', label: 'Left' },
                      { value: 'right', label: 'Right' },
                      { value: 'uturn', label: 'U' },
                    ]}
                  />
                </div>
                <HudSlider label="Distance to Maneuver" value={distanceToManeuver} min={0} max={2000} unit=" m" onChange={setDistanceToManeuver} />
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[8px] text-white/25 tracking-widest uppercase">Destination</span>
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="bg-white/5 border border-hud-cyan/20 text-hud-cyan font-mono text-[10px]
                               px-2 py-1 outline-none focus:border-hud-cyan/50 tracking-wider"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[8px] text-white/25 tracking-widest uppercase">Current Road</span>
                  <input
                    type="text"
                    value={currentRoad}
                    onChange={e => setCurrentRoad(e.target.value)}
                    className="bg-white/5 border border-hud-cyan/20 text-hud-cyan font-mono text-[10px]
                               px-2 py-1 outline-none focus:border-hud-cyan/50 tracking-wider"
                  />
                </div>
              </Section>

              {/* ── VEHICLE AHEAD ─── */}
              <Section title="🚙 Vehicle Ahead" defaultOpen={false}>
                <HudToggle
                  label="Detected"
                  value={vehicleAhead.detected}
                  onChange={v => setVehicleAhead('detected', v)}
                />
                <HudSlider
                  label="Distance"
                  value={vehicleAhead.distance}
                  min={5}
                  max={100}
                  step={0.1}
                  unit=" m"
                  onChange={v => setVehicleAhead('distance', parseFloat(v.toFixed(1)))}
                />
                <HudSlider
                  label="Relative Speed"
                  value={vehicleAhead.relativeSpeed}
                  min={-30}
                  max={30}
                  unit=" km/h"
                  onChange={v => setVehicleAhead('relativeSpeed', v)}
                />
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[8px] text-white/25 tracking-widest uppercase">Vehicle Type</span>
                  <SegGroup
                    value={vehicleAhead.type}
                    onChange={v => setVehicleAhead('type', v)}
                    options={['car', 'truck', 'moto', 'bus']}
                  />
                </div>
              </Section>

              {/* ── SPEED LIMIT ─── */}
              <Section title="🚦 Speed Limit" defaultOpen={false}>
                <HudSlider label="Speed Limit" value={speedLimit} min={10} max={200} unit=" km/h" onChange={setSpeedLimit} />
                <div className="flex gap-px">
                  {[30, 50, 80, 100, 120].map(v => (
                    <button
                      key={v}
                      onClick={() => setSpeedLimit(v)}
                      className={`flex-1 font-mono text-[9px] py-1 border transition-all
                                  ${speedLimit === v
                                    ? 'border-hud-cyan bg-hud-cyan/15 text-hud-cyan'
                                    : 'border-hud-cyan/15 text-white/30 hover:bg-hud-cyan/8'
                                  }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <HudSlider label="Distance to Sign" value={speedLimitDistance} min={0} max={1000} unit=" m" onChange={setSpeedLimitDistance} />
              </Section>

              {/* ── ADAS ─── */}
              <Section title="🤖 ADAS" defaultOpen={false}>
                <HudToggle label="Lane Keep Assist" value={adas.laneKeep} onChange={v => setADAS('laneKeep', v)} />
                <HudToggle label="Adaptive Cruise" value={adas.adaptiveCruise} onChange={v => setADAS('adaptiveCruise', v)} />
                <HudToggle label="Auto Emergency Brake" value={adas.autoEmergencyBrake} onChange={v => setADAS('autoEmergencyBrake', v)} />
                <HudToggle label="Blind Spot Monitor" value={adas.blindSpotMonitor} onChange={v => setADAS('blindSpotMonitor', v)} />
                <HudSlider
                  label="Autonomy Level"
                  value={adas.autonomyLevel}
                  min={0}
                  max={5}
                  onChange={v => setADAS('autonomyLevel', v)}
                />
              </Section>

              {/* ── WARNING TRIGGERS ─── */}
              <Section title="⚠ Warning Triggers">
                <div className="grid grid-cols-2 gap-1.5">
                  <WarnBtn
                    label="🟥 Collision"
                    color="border-red-500/50 bg-red-950/20 text-red-400 hover:bg-red-950/40 active:bg-red-900/40"
                    onClick={triggerCollisionWarning}
                  />
                  <WarnBtn
                    label="🟧 Lane Dep."
                    color="border-yellow-500/50 bg-yellow-950/20 text-yellow-300 hover:bg-yellow-950/40"
                    onClick={triggerLaneDeparture}
                  />
                  <WarnBtn
                    label="🟨 Speeding"
                    color="border-orange-500/50 bg-orange-950/20 text-orange-300 hover:bg-orange-950/40"
                    onClick={triggerSpeedingWarning}
                  />
                  <WarnBtn
                    label="🟥 Pedestrian"
                    color="border-red-400/50 bg-red-950/20 text-red-300 hover:bg-red-950/40"
                    onClick={triggerPedestrian}
                  />
                </div>
                <WarnBtn
                  label="⬜ Clear All Warnings"
                  color="border-white/20 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                  onClick={clearAllWarnings}
                />
              </Section>

              {/* ── DEBUG ─── */}
              <Section title="🔧 Debug Info" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    ['FPS', `${fps}`],
                    ['Warnings', `${warnings.length}`],
                    ['Runtime', runtime],
                    ['Objects', `${detectedObjects.length}`],
                    ['Speed', `${Math.round(speed)} km/h`],
                    ['Scenario', scenario],
                    ['BG Mode', backgroundMode],
                    ['Auto', autoMode ? 'ON' : 'OFF'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="font-mono text-[8px] text-white/25 tracking-widest uppercase">{k}</span>
                      <span className="font-mono text-[9px] text-hud-cyan/70">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-1 border-t border-white/5">
                  <HudToggle label="FPS Monitor" value={showPerfMonitor} onChange={togglePerfMonitor} />
                </div>
              </Section>

              <div className="h-4" />
            </div>

            {/* Footer shortcut hint */}
            <div className="border-t border-hud-cyan/10 px-4 py-2 shrink-0">
              <p className="font-mono text-[8px] text-white/20 tracking-widest text-center uppercase">
                Press D to toggle · H for shortcuts
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

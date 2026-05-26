import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Maximize2, PanelBottomClose, PanelBottomOpen } from 'lucide-react';

import './index.css';
import { useSimulationStore }    from './store/simulationStore';
import { useSimulationLoop }     from './hooks/useSimulationLoop';
import { useKeyboardShortcuts }  from './hooks/useKeyboardShortcuts';
import { applyScenarioPreset }   from './hooks/useScenarioPresets';

import RoadScene            from './components/scene/RoadScene';
import ARLayer              from './components/hud/ar/ARLayer';
import TopStatusBar         from './components/hud/TopStatusBar';
import TelemetryConsole     from './components/hud/TelemetryConsole';
import CenterHudPod         from './components/hud/CenterHudPod';
import ObjectDetectionList  from './components/hud/ObjectDetectionList';
import CalibrationOverlay   from './components/hud/CalibrationOverlay';
import SteeringWheelOverlay from './components/hud/SteeringWheelOverlay';
import CornerBrackets       from './components/ui/CornerBrackets';
import PulseDot             from './components/ui/PulseDot';
import ControlPanel         from './components/controls/ControlPanel';
import HelpOverlay          from './components/HelpOverlay';
import BootSequence         from './components/BootSequence';
import ScreenshotButton     from './components/ScreenshotButton';
import PerfMonitor          from './components/PerfMonitor';
import ErrorBoundary        from './components/ErrorBoundary';

// Theme RGB map
const THEME_VARS = {
  cyan:    '0 240 200',
  amber:   '255 184 0',
  magenta: '255 0 229',
  green:   '0 255 140',
};

// ── Responsive guard ──────────────────────────────────────────────────
function TooSmall() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-8 z-[999]">
      <div className="text-center border border-hud-cyan/20 p-8 max-w-sm">
        <div className="font-display text-hud-cyan text-lg tracking-[0.3em] uppercase mb-3">AR HUD</div>
        <p className="font-mono text-[10px] text-white/40 tracking-widest leading-6">
          This application is optimized for screens 1024px and wider.
          Please use a desktop device or widen your browser window.
        </p>
        <div className="mt-4 font-mono text-[9px] text-hud-cyan/30 tracking-[0.2em] uppercase">
          Current: {window.innerWidth}px
        </div>
      </div>
    </div>
  );
}

// ── Warning border pulse ──────────────────────────────────────────────
function WarningBorderPulse() {
  const warnings  = useSimulationStore(s => s.warnings);
  const [pulse, setPulse] = useState(null);
  const prevLen   = useRef(0);

  useEffect(() => {
    if (warnings.length > prevLen.current) {
      const latest = warnings[warnings.length - 1];
      const cls = latest.severity === 'danger' ? 'warning-ring-danger' : 'warning-ring-warning';
      setPulse({ cls, key: Date.now() });
      const t = setTimeout(() => setPulse(null), 800);
      return () => clearTimeout(t);
    }
    prevLen.current = warnings.length;
  }, [warnings]);

  if (!pulse) return null;
  return (
    <div
      key={pulse.key}
      className={`fixed inset-0 z-[250] pointer-events-none ${pulse.cls}`}
    />
  );
}

// ── Ambient scan-line sweep ───────────────────────────────────────────
function ScanLine() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout;
    const schedule = () => {
      timeout = setTimeout(() => {
        setVisible(true);
        timeout = setTimeout(() => { setVisible(false); schedule(); }, 2200);
      }, 9000 + Math.random() * 5000);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -4, opacity: 0.5 }}
          animate={{ y: '100vh', opacity: 0.2 }}
          transition={{ duration: 2.2, ease: 'linear' }}
          className="fixed inset-x-0 top-0 z-[11] pointer-events-none h-px
                     bg-gradient-to-r from-transparent via-hud-cyan/40 to-transparent"
        />
      )}
    </AnimatePresence>
  );
}

// ── Shared button ─────────────────────────────────────────────────────
function HudBtn({ onClick, active = false, variant = 'cyan', compact = false, children }) {
  const base = `border font-mono tracking-widest uppercase transition-all duration-200 active:scale-95
                ${compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'}`;
  const styles = {
    cyan: active
      ? 'border-hud-cyan    bg-hud-cyan/20    text-hud-cyan'
      : 'border-hud-cyan/20 bg-transparent    text-hud-cyan/50 hover:bg-hud-cyan/10 hover:border-hud-cyan/50 hover:scale-105',
    ghost: 'border-white/10 bg-transparent text-white/30 hover:bg-white/5 hover:text-white/50 hover:scale-105',
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant] ?? styles.ghost}`}>
      {children}
    </button>
  );
}

function Sep() {
  return <div className="h-5 w-px bg-hud-cyan/12 mx-1 shrink-0 self-center" />;
}

// ── Warning toasts ────────────────────────────────────────────────────
function WarningStrip({ warnings, onDismiss }) {
  if (!warnings.length) return null;
  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[45] flex flex-col gap-1 min-w-72 max-w-lg">
      <AnimatePresence>
        {warnings.map(w => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center justify-between gap-4 px-3 py-1.5 border font-mono text-[10px]
                        tracking-wider uppercase backdrop-blur-sm
                        ${w.severity === 'danger'
                          ? 'border-red-500/60 text-red-400 bg-red-950/40'
                          : 'border-yellow-500/60 text-yellow-300 bg-yellow-950/40'}`}
          >
            <div className="flex items-center gap-2">
              <PulseDot color={w.severity === 'danger' ? 'danger' : 'warning'} size="sm" />
              <span>{w.message}</span>
            </div>
            <button onClick={() => onDismiss(w.id)} className="opacity-40 hover:opacity-100 transition-opacity">✕</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Cinematic hint ────────────────────────────────────────────────────
function CinematicHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const t = setTimeout(() => setVisible(false), 3000); return () => clearTimeout(t); }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <span className="font-mono text-xs text-hud-cyan/30 tracking-[0.4em] uppercase">
            Press M or ESC to exit cinematic mode
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Bottom toolbar ────────────────────────────────────────────────────
function BottomToolbar({
  scenario, backgroundMode, targetSpeed, autoMode, isPaused, toolbarCompact,
  setBackgroundMode, setTargetSpeed, toggleAuto, togglePause,
  toggleToolbarCompact, toggleCinematicMode,
}) {
  const c = toolbarCompact;
  const {
    triggerCollisionWarning, triggerLaneDeparture,
    triggerSpeedingWarning,  triggerPedestrian, toggleCalibration,
  } = useSimulationStore();

  const ALERTS = [
    { label: '⚠ COLL',  fn: triggerCollisionWarning, color: 'border-red-500/50    text-red-400    hover:bg-red-950/30'    },
    { label: '⚠ LANE',  fn: triggerLaneDeparture,    color: 'border-yellow-500/50 text-yellow-300 hover:bg-yellow-950/30' },
    { label: '⚠ SPEED', fn: triggerSpeedingWarning,  color: 'border-orange-500/50 text-orange-300 hover:bg-orange-950/30' },
    { label: '⚠ PED',   fn: triggerPedestrian,       color: 'border-red-400/50    text-red-300    hover:bg-red-950/30'    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[35] bg-black/80 backdrop-blur-sm border-t border-hud-cyan/15 px-3 py-1.5">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 max-w-screen-2xl mx-auto">

        <div className="flex items-center gap-1">
          <HudBtn compact={c} onClick={togglePause}  variant={isPaused   ? 'cyan' : 'ghost'}>{isPaused ? '▶' : '⏸'}</HudBtn>
          <HudBtn compact={c} onClick={toggleAuto}   variant={autoMode   ? 'cyan' : 'ghost'}>AUTO {autoMode ? 'ON' : 'OFF'}</HudBtn>
        </div>
        <Sep />
        <div className="flex items-center gap-1">
          {['video', '3d', 'parallax'].map(m => (
            <HudBtn key={m} compact={c} onClick={() => setBackgroundMode(m)} active={backgroundMode === m} variant="cyan">{m}</HudBtn>
          ))}
        </div>
        <Sep />
        <div className="flex items-center gap-1">
          {['highway', 'city', 'night'].map(s => (
            <HudBtn key={s} compact={c} onClick={() => applyScenarioPreset(s)} active={scenario === s} variant="cyan">{s}</HudBtn>
          ))}
        </div>
        <Sep />
        <div className="flex items-center gap-1">
          {[30, 60, 90, 120, 160].map(v => (
            <HudBtn key={v} compact={c} onClick={() => setTargetSpeed(v)} active={targetSpeed === v} variant="cyan">{v}</HudBtn>
          ))}
        </div>
        <Sep />
        <div className="flex items-center gap-1">
          {ALERTS.map(({ label, fn, color }) => (
            <button
              key={label} onClick={fn}
              className={`border font-mono tracking-widest uppercase transition-all duration-200 bg-transparent active:scale-95
                          ${c ? 'px-1.5 py-0.5 text-[8px]' : 'px-2 py-0.5 text-[9px]'} ${color}`}
            >{label}</button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <ScreenshotButton />
          <button
            onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(()=>{})}
            className="p-1 border border-hud-cyan/20 text-hud-cyan/40 hover:border-hud-cyan/50 hover:text-hud-cyan transition-all"
            title="Fullscreen (F)"
          >
            <Maximize2 size={12} />
          </button>
          <button
            onClick={toggleCalibration}
            className="font-mono text-[8px] tracking-widest text-hud-cyan/40 hover:text-hud-cyan border border-hud-cyan/20 hover:border-hud-cyan/50 transition-all px-1.5 py-0.5 uppercase"
          >CAL</button>
          <button
            onClick={toggleCinematicMode}
            className="p-1 border border-hud-cyan/20 text-hud-cyan/40 hover:border-hud-cyan/50 hover:text-hud-cyan transition-all"
            title="Cinematic (M)"
          ><Film size={12} /></button>
          <button
            onClick={toggleToolbarCompact}
            className="p-1 border border-hud-cyan/20 text-hud-cyan/40 hover:border-hud-cyan/50 hover:text-hud-cyan transition-all"
          >{c ? <PanelBottomOpen size={12} /> : <PanelBottomClose size={12} />}</button>
        </div>

      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────
export default function App() {
  const [bootDone,    setBootDone]    = useState(false);
  const [tooSmall,    setTooSmall]    = useState(window.innerWidth < 1024);

  useSimulationLoop();
  useKeyboardShortcuts();

  const {
    targetSpeed, scenario, backgroundMode, autoMode, isPaused,
    warnings, toolbarCompact, cinematicMode, theme,
    setBackgroundMode, setTargetSpeed,
    toggleAuto, togglePause, toggleToolbarCompact, toggleCinematicMode,
    toggleCalibration, clearWarning,
  } = useSimulationStore();

  // Apply color theme CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--hud-cyan', THEME_VARS[theme] ?? THEME_VARS.cyan);
  }, [theme]);

  // Responsive guard
  useEffect(() => {
    const check = () => setTooSmall(window.innerWidth < 1024);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (tooSmall) return <TooSmall />;

  return (
    <ErrorBoundary>
      {/* Boot sequence */}
      <AnimatePresence>
        {!bootDone && <BootSequence onComplete={() => setBootDone(true)} />}
      </AnimatePresence>

      {/* Main HUD — fades in after boot */}
      <motion.div
        className="fixed inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: bootDone ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Subtle ambient flicker overlay */}
        <div className="fixed inset-0 z-[9] pointer-events-none opacity-[0.025] animate-hud-flicker bg-hud-cyan" />

        {/* z-0 · Background */}
        <RoadScene />

        {/* z-5 · AR overlay */}
        <ARLayer />

        {/* z-8 · Steering wheel */}
        <SteeringWheelOverlay />

        {/* z-10 · Vignette */}
        <div
          className="fixed inset-0 z-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 88% 88% at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 100%)' }}
        />

        {/* z-11 · Ambient scan-line */}
        <ScanLine />

        {/* z-12 · HUD data panels (hidden in cinematic) */}
        <AnimatePresence>
          {!cinematicMode && (
            <motion.div
              key="hud-panels"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ObjectDetectionList />
              <TelemetryConsole />
            </motion.div>
          )}
        </AnimatePresence>
        <CenterHudPod />

        {/* z-25 · Corner brackets */}
        <div className="fixed inset-4 z-[25] pointer-events-none">
          <CornerBrackets color="cyan" size={5} />
        </div>

        {/* z-35 · Toolbar (hidden in cinematic) */}
        <AnimatePresence>
          {!cinematicMode && (
            <motion.div
              key="toolbar"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25 }}
            >
              <BottomToolbar
                scenario={scenario}
                backgroundMode={backgroundMode}
                targetSpeed={targetSpeed}
                autoMode={autoMode}
                isPaused={isPaused}
                toolbarCompact={toolbarCompact}
                setBackgroundMode={setBackgroundMode}
                setTargetSpeed={setTargetSpeed}
                toggleAuto={toggleAuto}
                togglePause={togglePause}
                toggleToolbarCompact={toggleToolbarCompact}
                toggleCinematicMode={toggleCinematicMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* z-40 · Top status bar (hidden in cinematic) */}
        <AnimatePresence>
          {!cinematicMode && (
            <motion.div
              key="topbar"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
            >
              <TopStatusBar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* z-45 · Warning toasts */}
        <WarningStrip warnings={warnings} onDismiss={clearWarning} />

        {/* z-50 · Calibration panel */}
        <CalibrationOverlay />

        {/* z-60 · Control panel + gear button */}
        <ControlPanel />

        {/* z-70 · FPS monitor */}
        <PerfMonitor />

        {/* z-80 · Help overlay */}
        <HelpOverlay />

        {/* Warning border ring pulse */}
        <WarningBorderPulse />

        {/* Cinematic hint */}
        {cinematicMode && <CinematicHint key={String(cinematicMode)} />}
      </motion.div>
    </ErrorBoundary>
  );
}

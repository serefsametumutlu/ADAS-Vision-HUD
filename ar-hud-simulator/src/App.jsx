import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp, CornerUpLeft, CornerUpRight, RefreshCw,
  Film, PanelBottomClose, PanelBottomOpen,
} from 'lucide-react';

import './index.css';
import { useSimulationStore }  from './store/simulationStore';
import { useSimulationLoop }   from './hooks/useSimulationLoop';
import { applyScenarioPreset } from './hooks/useScenarioPresets';

import RoadScene         from './components/scene/RoadScene';
import TopStatusBar      from './components/hud/TopStatusBar';
import TelemetryConsole  from './components/hud/TelemetryConsole';
import CornerBrackets    from './components/ui/CornerBrackets';
import GlowText          from './components/ui/GlowText';
import PulseDot          from './components/ui/PulseDot';
import AnimatedNumber    from './components/ui/AnimatedNumber';
import HudIcon           from './components/ui/HudIcon';

// ── Maneuver config ───────────────────────────────────────────────────
const MANEUVER = {
  straight: { icon: ArrowUp,       label: 'Continue straight' },
  left:     { icon: CornerUpLeft,  label: 'Turn left'         },
  right:    { icon: CornerUpRight, label: 'Turn right'        },
  uturn:    { icon: RefreshCw,     label: 'U-turn'            },
};

// ── Reusable button ───────────────────────────────────────────────────
function HudBtn({ onClick, active = false, variant = 'cyan', compact = false, children }) {
  const base = `border font-mono tracking-widest uppercase transition-all duration-200
                ${compact ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'}`;
  const styles = {
    cyan: active
      ? 'border-hud-cyan    bg-hud-cyan/20    text-hud-cyan    shadow-glow-cyan'
      : 'border-hud-cyan/25 bg-transparent    text-hud-cyan/55 hover:bg-hud-cyan/10 hover:border-hud-cyan/55',
    warning: active
      ? 'border-hud-warning  bg-hud-warning/20  text-hud-warning  shadow-glow-warning'
      : 'border-hud-warning/25 bg-transparent   text-hud-warning/55 hover:bg-hud-warning/10',
    danger: active
      ? 'border-hud-danger   bg-hud-danger/20   text-hud-danger   shadow-glow-danger'
      : 'border-hud-danger/25 bg-transparent    text-hud-danger/55  hover:bg-hud-danger/10',
    ghost: 'border-white/15 bg-transparent text-white/35 hover:bg-white/5 hover:text-white/55',
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant] ?? styles.ghost}`}>
      {children}
    </button>
  );
}

// ── Group label ───────────────────────────────────────────────────────
function GroupLabel({ children, compact }) {
  if (compact) return null;
  return (
    <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase shrink-0">
      {children}
    </span>
  );
}

// ── Vertical separator ────────────────────────────────────────────────
function Sep() {
  return <div className="h-6 w-px bg-hud-cyan/15 mx-1 shrink-0 self-center" />;
}

// ── Warning toast strip ───────────────────────────────────────────────
function WarningStrip({ warnings, onDismiss }) {
  if (!warnings.length) return null;
  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 flex flex-col gap-1 min-w-80 max-w-lg">
      <AnimatePresence>
        {warnings.map(w => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`flex items-center justify-between gap-4 px-4 py-2 border font-mono text-xs
                        tracking-wider uppercase backdrop-hud
                        ${w.severity === 'danger'
                          ? 'border-hud-danger/70 text-hud-danger  bg-hud-danger/10'
                          : 'border-hud-warning/70 text-hud-warning bg-hud-warning/10'}`}
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

// ── Left speed + maneuver panel ───────────────────────────────────────
function SpeedPanel({ speed, speedLimit, rpm, gear, nextManeuver, distanceToManeuver }) {
  const over = speed > speedLimit + 8;
  const mv   = MANEUVER[nextManeuver] ?? MANEUVER.straight;

  return (
    <div
      className="fixed top-14 left-8 z-30 backdrop-hud border border-hud-cyan/20 px-5 py-4"
      style={{ width: 280, boxShadow: '0 0 20px rgba(0,240,200,0.08)' }}
    >
      {/* Speed */}
      <span className="font-mono text-[10px] text-hud-cyan/40 tracking-widest uppercase">Speed</span>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <GlowText variant={over ? 'danger' : 'cyan'} size="4xl">
          <AnimatedNumber value={speed} decimals={0} />
        </GlowText>
        <span className="font-mono text-sm text-hud-cyan/50">km/h</span>
        {over && (
          <span className="font-mono text-[10px] text-hud-danger animate-pulse ml-1">OVER LIMIT</span>
        )}
      </div>

      {/* Secondary row */}
      <div className="flex gap-5 mt-2.5 pt-2.5 border-t border-hud-cyan/12">
        <div>
          <span className="font-mono text-[10px] text-white/25 block uppercase tracking-widest">RPM</span>
          <GlowText variant="cyan" size="sm">
            <AnimatedNumber value={rpm} duration={0.25} />
          </GlowText>
        </div>
        <div>
          <span className="font-mono text-[10px] text-white/25 block uppercase tracking-widest">Gear</span>
          <GlowText variant="cyan" size="sm">{gear}</GlowText>
        </div>
        <div>
          <span className="font-mono text-[10px] text-white/25 block uppercase tracking-widest">Limit</span>
          <GlowText variant={over ? 'danger' : 'cyan'} size="sm">{speedLimit}</GlowText>
        </div>
      </div>

      {/* Next maneuver */}
      <div className="mt-2.5 pt-2.5 border-t border-hud-cyan/12">
        <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest">Next Maneuver</span>
        <div className="flex items-center gap-3 mt-1.5">
          <HudIcon icon={mv.icon} size={22} color="cyan" />
          <div>
            <GlowText variant="cyan" size="md">
              <AnimatedNumber value={distanceToManeuver} duration={0.3} suffix=" m" />
            </GlowText>
            <span className="block font-tech text-xs text-white/35 mt-0.5">{mv.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Right system panel ────────────────────────────────────────────────
function SystemPanel({ scenario, backgroundMode, targetSpeed, autoMode, isPaused }) {
  return (
    <div
      className="fixed top-14 right-8 z-30 backdrop-hud border border-hud-cyan/20 px-5 py-4 text-right"
      style={{ width: 230, boxShadow: '0 0 20px rgba(0,240,200,0.08)' }}
    >
      <span className="font-mono text-[10px] text-hud-cyan/40 tracking-widest uppercase block mb-2">System</span>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-end gap-2">
          <span className="font-mono text-xs text-white/45">{scenario.toUpperCase()}</span>
          <PulseDot color={isPaused ? 'warning' : 'success'} size="sm" />
        </div>

        <div className="flex items-center justify-end gap-2 pt-1.5 border-t border-hud-cyan/10">
          <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest">BG Mode</span>
          <span className="font-mono text-xs text-hud-cyan/60">{backgroundMode.toUpperCase()}</span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest">Target</span>
          <span className="font-mono text-xs text-hud-cyan/60">{targetSpeed} km/h</span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest">Auto</span>
          <PulseDot color={autoMode ? 'success' : 'warning'} size="sm" />
        </div>

        {/* Enriched details */}
        <div className="pt-2 mt-0.5 border-t border-hud-cyan/10 space-y-1">
          <div className="flex items-center justify-end gap-2">
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Autonomy</span>
            <span className="font-display text-xs text-hud-cyan/70 tracking-widest">L2</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">GPS Sats</span>
            <span className="font-mono text-xs text-white/45">11 SAT</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Temp</span>
            <span className="font-mono text-xs text-white/45">24°C</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cinematic mode hint ───────────────────────────────────────────────
function CinematicHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <span className="font-mono text-xs text-hud-cyan/35 tracking-[0.4em] uppercase">
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
  setBackgroundMode, setTargetSpeed, toggleAuto, togglePause, toggleToolbarCompact, toggleCinematicMode,
  triggerCollisionWarning, triggerLaneDeparture, triggerSpeedingWarning, triggerPedestrian,
}) {
  const c = toolbarCompact;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-black/70 backdrop-blur-sm border-t border-hud-cyan/20 px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 max-w-screen-2xl mx-auto">

        {/* Simulation */}
        <div className="flex items-center gap-1.5">
          <GroupLabel compact={c}>SIM</GroupLabel>
          <HudBtn compact={c} onClick={togglePause} variant={isPaused ? 'warning' : 'ghost'}>
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </HudBtn>
          <HudBtn compact={c} onClick={toggleAuto} variant={autoMode ? 'cyan' : 'ghost'}>
            AUTO {autoMode ? 'ON' : 'OFF'}
          </HudBtn>
        </div>

        <Sep />

        {/* Background mode */}
        <div className="flex items-center gap-1.5">
          <GroupLabel compact={c}>BG</GroupLabel>
          {['video', '3d', 'parallax'].map(m => (
            <HudBtn key={m} compact={c} onClick={() => setBackgroundMode(m)} active={backgroundMode === m} variant="cyan">
              {m}
            </HudBtn>
          ))}
        </div>

        <Sep />

        {/* Scenario */}
        <div className="flex items-center gap-1.5">
          <GroupLabel compact={c}>SCENE</GroupLabel>
          {['highway', 'city', 'night'].map(s => (
            <HudBtn key={s} compact={c} onClick={() => applyScenarioPreset(s)} active={scenario === s} variant="cyan">
              {s}
            </HudBtn>
          ))}
        </div>

        <Sep />

        {/* Target speed */}
        <div className="flex items-center gap-1.5">
          <GroupLabel compact={c}>TGT</GroupLabel>
          {[30, 60, 90, 120, 160].map(v => (
            <HudBtn key={v} compact={c} onClick={() => setTargetSpeed(v)} active={targetSpeed === v} variant="cyan">
              {v}
            </HudBtn>
          ))}
        </div>

        <Sep />

        {/* Warning triggers */}
        <div className="flex items-center gap-1.5">
          <GroupLabel compact={c}>⚠</GroupLabel>
          <HudBtn compact={c} onClick={triggerCollisionWarning} variant="danger">COLL</HudBtn>
          <HudBtn compact={c} onClick={triggerLaneDeparture}    variant="warning">LANE</HudBtn>
          <HudBtn compact={c} onClick={triggerSpeedingWarning}  variant="warning">SPD</HudBtn>
          <HudBtn compact={c} onClick={triggerPedestrian}       variant="danger">PED</HudBtn>
        </div>

        {/* Right side: compact toggle + cinematic */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleCinematicMode}
            className="p-1.5 border border-hud-cyan/25 text-hud-cyan/50 hover:border-hud-cyan/60 hover:text-hud-cyan transition-all"
            title="Cinematic mode (M)"
          >
            <Film size={14} />
          </button>
          <button
            onClick={toggleToolbarCompact}
            className="p-1.5 border border-hud-cyan/25 text-hud-cyan/50 hover:border-hud-cyan/60 hover:text-hud-cyan transition-all"
            title="Compact toolbar"
          >
            {c ? <PanelBottomOpen size={14} /> : <PanelBottomClose size={14} />}
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────
export default function App() {
  useSimulationLoop();

  const {
    speed, rpm, gear, targetSpeed, speedLimit,
    nextManeuver, distanceToManeuver,
    scenario, backgroundMode, autoMode, isPaused,
    warnings, toolbarCompact, cinematicMode,
    setBackgroundMode, setTargetSpeed,
    toggleAuto, togglePause,
    toggleToolbarCompact, toggleCinematicMode,
    clearWarning,
    triggerCollisionWarning, triggerLaneDeparture,
    triggerSpeedingWarning, triggerPedestrian,
  } = useSimulationStore();

  // M / ESC keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'm' || e.key === 'M') toggleCinematicMode();
      if (e.key === 'Escape' && cinematicMode) toggleCinematicMode();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cinematicMode, toggleCinematicMode]);

  return (
    <div className="fixed inset-0 overflow-hidden">

      {/* ── Background scene ── */}
      <RoadScene />

      {/* ── Vignette ── */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* ── Viewport corner brackets ── */}
      <div className="fixed inset-4 z-30 pointer-events-none">
        <CornerBrackets color="cyan" size={5} />
      </div>

      {/* ── Top status bar — hidden in cinematic ── */}
      <AnimatePresence>
        {!cinematicMode && (
          <motion.div
            key="topbar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <TopStatusBar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Warning toasts ── */}
      <WarningStrip warnings={warnings} onDismiss={clearWarning} />

      {/* ── HUD Panels (always visible) ── */}
      <SpeedPanel
        speed={speed}
        speedLimit={speedLimit}
        rpm={rpm}
        gear={gear}
        nextManeuver={nextManeuver}
        distanceToManeuver={distanceToManeuver}
      />
      <SystemPanel
        scenario={scenario}
        backgroundMode={backgroundMode}
        targetSpeed={targetSpeed}
        autoMode={autoMode}
        isPaused={isPaused}
      />

      {/* ── Cinematic mode: hint + hide controls ── */}
      {cinematicMode && <CinematicHint key={String(cinematicMode)} />}

      {/* ── Dev controls — hidden in cinematic ── */}
      <AnimatePresence>
        {!cinematicMode && (
          <motion.div
            key="devcontrols"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <TelemetryConsole />
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
              triggerCollisionWarning={triggerCollisionWarning}
              triggerLaneDeparture={triggerLaneDeparture}
              triggerSpeedingWarning={triggerSpeedingWarning}
              triggerPedestrian={triggerPedestrian}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Version badge ── */}
      {!cinematicMode && (
        <div className="fixed z-20 font-mono text-[10px] text-hud-cyan/20 tracking-widest"
             style={{ bottom: '5.5rem', left: '2rem' }}>
          AR-HUD v0.5 · BUILD 240525
        </div>
      )}

    </div>
  );
}

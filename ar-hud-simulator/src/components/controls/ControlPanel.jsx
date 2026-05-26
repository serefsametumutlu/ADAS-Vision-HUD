import { useSimulationStore } from '../../store/simulationStore';

const GEARS = ['P', 'R', 'N', 'D', 'S'];
const LANES = ['Left', 'Center', 'Right'];
const SEAT_KEYS = ['driver', 'passenger', 'rearLeft', 'rearRight'];
const SEAT_LABELS = ['Driver', 'Passenger', 'Rear L', 'Rear R'];

function Row({ label, children }) {
  return (
    <div className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span className="text-[9px] font-mono tracking-widest text-white/40 w-24 shrink-0 uppercase">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step = 1, onChange }) {
  return (
    <Row label={label}>
      <div className="flex items-center gap-2">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 accent-cyan-400 h-1"
        />
        <span className="text-[10px] font-mono text-hud-cyan w-10 text-right">{value}</span>
      </div>
    </Row>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div
      className="flex items-center justify-between py-1"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className="w-8 h-4 rounded-full relative transition-colors"
        style={{ background: value ? '#00F0C8' : '#333' }}
      >
        <span
          className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
          style={{ left: value ? 'calc(100% - 14px)' : '2px' }}
        />
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <div
        className="text-[8px] font-mono font-bold tracking-[0.4em] text-hud-cyan/60 mb-1.5 pb-1"
        style={{ borderBottom: '1px solid rgba(0,240,200,0.15)' }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

export default function ControlPanel() {
  const devPanelOpen    = useSimulationStore(s => s.devPanelOpen);
  const toggleDevPanel  = useSimulationStore(s => s.toggleDevPanel);
  const speed           = useSimulationStore(s => s.speed);
  const targetSpeed     = useSimulationStore(s => s.targetSpeed);
  const setTargetSpeed  = useSimulationStore(s => s.setTargetSpeed);
  const gear            = useSimulationStore(s => s.gear);
  const setGear         = useSimulationStore(s => s.setGear);
  const lane            = useSimulationStore(s => s.lane);
  const setLane         = useSimulationStore(s => s.setLane);
  const adas            = useSimulationStore(s => s.adas);
  const setADAS         = useSimulationStore(s => s.setADAS);
  const seats           = useSimulationStore(s => s.seats);
  const setSeatStatus   = useSimulationStore(s => s.setSeatStatus);
  const detectionEnabled = useSimulationStore(s => s.detectionEnabled);
  const toggleDetection = useSimulationStore(s => s.toggleDetection);
  const togglePause     = useSimulationStore(s => s.togglePause);
  const isPaused        = useSimulationStore(s => s.isPaused);
  const toggleCinematic = useSimulationStore(s => s.toggleCinematic);
  const isCinematic     = useSimulationStore(s => s.isCinematic);
  const addWarning      = useSimulationStore(s => s.addWarning);
  const clearWarnings   = useSimulationStore(s => s.clearWarnings);

  return (
    <>
      {/* Backdrop */}
      {devPanelOpen && (
        <div
          className="fixed inset-0 z-[49]"
          onClick={toggleDevPanel}
        />
      )}

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[50] w-72 overflow-y-auto"
        style={{
          background: 'rgba(0,6,14,0.97)',
          borderLeft: '1px solid rgba(0,240,200,0.2)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
          transform: devPanelOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 sticky top-0"
          style={{ background: 'rgba(0,6,14,0.97)', borderBottom: '1px solid rgba(0,240,200,0.15)', zIndex: 1 }}
        >
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-hud-cyan">DEV CONTROL</span>
          <button
            onClick={toggleDevPanel}
            className="text-white/40 hover:text-white/80 text-lg"
          >×</button>
        </div>

        <div className="px-4 py-3">
          {/* VEHICLE */}
          <Section title="VEHICLE">
            <Row label="Speed (km/h)">
              <span className="text-[11px] font-mono text-hud-cyan">{Math.round(speed)} km/h</span>
            </Row>
            <SliderRow label="Target Speed" value={targetSpeed} min={0} max={200} onChange={setTargetSpeed} />
            <Row label="Gear">
              <div className="flex gap-1">
                {GEARS.map(g => (
                  <button
                    key={g}
                    onClick={() => setGear(g)}
                    className="w-8 h-7 text-[10px] font-mono rounded"
                    style={{
                      background: gear === g ? '#00F0C8' : 'rgba(255,255,255,0.06)',
                      color: gear === g ? '#000' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </Row>
            <Row label="Lane">
              <div className="flex gap-1">
                {LANES.map((l, i) => (
                  <button
                    key={l}
                    onClick={() => setLane(i)}
                    className="flex-1 h-7 text-[9px] font-mono rounded"
                    style={{
                      background: lane === i ? '#00B4D8' : 'rgba(255,255,255,0.06)',
                      color: lane === i ? '#000' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Row>
          </Section>

          {/* ADAS */}
          <Section title="ADAS">
            <Toggle label="Cruise Control" value={adas.cruiseEnabled} onChange={v => setADAS('cruiseEnabled', v)} />
            <Toggle label="Auto Brake" value={adas.autoBrakeEnabled} onChange={v => setADAS('autoBrakeEnabled', v)} />
            <Toggle label="Lane Keep Assist" value={adas.laneKeepEnabled} onChange={v => setADAS('laneKeepEnabled', v)} />
            <Toggle label="Blind Spot Monitor" value={adas.blindSpotEnabled} onChange={v => setADAS('blindSpotEnabled', v)} />
            <SliderRow label="Autonomy Level" value={adas.autonomyLevel} min={0} max={5} onChange={v => setADAS('autonomyLevel', v)} />
          </Section>

          {/* SEATS */}
          <Section title="SEATS">
            {SEAT_KEYS.map((key, i) => (
              <div key={key} className="py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase">{SEAT_LABELS[i]}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSeatStatus(key, { occupied: !seats[key].occupied })}
                      className="text-[8px] font-mono px-2 py-0.5 rounded"
                      style={{
                        background: seats[key].occupied ? 'rgba(0,240,200,0.15)' : 'rgba(255,255,255,0.06)',
                        color: seats[key].occupied ? '#00F0C8' : 'rgba(255,255,255,0.3)',
                        border: `1px solid ${seats[key].occupied ? 'rgba(0,240,200,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      }}
                    >
                      {seats[key].occupied ? 'OCCUPIED' : 'EMPTY'}
                    </button>
                    <button
                      onClick={() => setSeatStatus(key, { beltOn: !seats[key].beltOn })}
                      className="text-[8px] font-mono px-2 py-0.5 rounded"
                      style={{
                        background: seats[key].beltOn ? 'rgba(34,197,94,0.15)' : 'rgba(255,59,59,0.15)',
                        color: seats[key].beltOn ? '#22C55E' : '#FF3B3B',
                        border: `1px solid ${seats[key].beltOn ? 'rgba(34,197,94,0.3)' : 'rgba(255,59,59,0.3)'}`,
                      }}
                    >
                      {seats[key].beltOn ? 'BELT ON' : 'NO BELT'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Section>

          {/* DETECTION */}
          <Section title="DETECTION">
            <Toggle label="Object Detection" value={detectionEnabled} onChange={toggleDetection} />
          </Section>

          {/* WARNINGS */}
          <Section title="WARNINGS">
            {[
              { label: 'STOP Sign', type: 'stop', message: 'STOP TABELASI · DURUYOR', severity: 'critical' },
              { label: 'Pedestrian', type: 'pedestrian', message: 'YAYA TESPİT EDİLDİ · YAVAŞLIYOR', severity: 'warning' },
              { label: 'Collision', type: 'collision', message: 'ÇARPIŞMA UYARISI · FREN YAPILIYOR', severity: 'critical' },
              { label: 'Speeding', type: 'speed', message: 'HIZ LİMİTİ AŞILDI', severity: 'warning' },
              { label: 'Lane Departure', type: 'lane', message: 'ŞERİT İHLALİ · DÜZELTİLİYOR', severity: 'warning' },
            ].map(w => (
              <button
                key={w.type}
                onClick={() => addWarning({ ...w, duration: 4000 })}
                className="w-full text-left text-[9px] font-mono tracking-widest px-2 py-1.5 rounded mb-1 hover:opacity-80 transition-opacity"
                style={{
                  background: w.severity === 'critical' ? 'rgba(255,59,59,0.12)' : 'rgba(251,191,36,0.10)',
                  border: `1px solid ${w.severity === 'critical' ? 'rgba(255,59,59,0.25)' : 'rgba(251,191,36,0.2)'}`,
                  color: w.severity === 'critical' ? '#FF3B3B' : '#FBBF24',
                }}
              >
                ⚡ {w.label}
              </button>
            ))}
            <button
              onClick={clearWarnings}
              className="w-full text-[9px] font-mono tracking-widest px-2 py-1.5 rounded mt-1 hover:opacity-80 transition-opacity"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            >
              CLEAR ALL WARNINGS
            </button>
          </Section>

          {/* SIMULATION */}
          <Section title="SIMULATION">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={togglePause}
                className="flex-1 text-[9px] font-mono tracking-widest px-2 py-2 rounded"
                style={{
                  background: isPaused ? 'rgba(0,240,200,0.15)' : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: isPaused ? '#00F0C8' : 'rgba(255,255,255,0.5)',
                }}
              >
                {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
              </button>
              <button
                onClick={toggleCinematic}
                className="flex-1 text-[9px] font-mono tracking-widest px-2 py-2 rounded"
                style={{
                  background: isCinematic ? 'rgba(0,240,200,0.15)' : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: isCinematic ? '#00F0C8' : 'rgba(255,255,255,0.5)',
                }}
              >
                {isCinematic ? '🎬 EXIT' : '🎬 CINEMATIC'}
              </button>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

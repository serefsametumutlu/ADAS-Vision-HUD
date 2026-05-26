import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import PulseDot from '../ui/PulseDot';

const DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function formatDateTime(d) {
  const day  = DAYS[d.getDay()];
  const date = String(d.getDate()).padStart(2, '0');
  const mon  = MONTHS[d.getMonth()];
  const yr   = d.getFullYear();
  const time = d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${day} · ${date} ${mon} ${yr} · ${time}`;
}

const STATUS_ITEMS = [
  { label: 'GPS',  color: 'success' },
  { label: 'ADAS', color: 'success' },
  { label: 'NET',  color: 'success' },
];

export default function TopStatusBar() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 h-10 z-40 flex items-center justify-between px-6
                    bg-black/60 backdrop-blur-sm border-b border-hud-cyan/20">
      {/* Left — GPS coordinates */}
      <div className="flex items-center gap-2">
        <MapPin size={12} color="rgba(0,240,200,0.5)" />
        <span className="font-mono text-xs text-hud-cyan/70 tracking-widest uppercase">
          37.8746°N · 32.4932°E
        </span>
      </div>

      {/* Center — Live date + time */}
      <span className="font-mono text-xs text-hud-cyan/80 tracking-widest uppercase">
        {formatDateTime(now)}
      </span>

      {/* Right — Status dots */}
      <div className="flex items-center gap-5">
        {STATUS_ITEMS.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-hud-cyan/60 tracking-widest uppercase">{label}</span>
            <PulseDot color={color} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

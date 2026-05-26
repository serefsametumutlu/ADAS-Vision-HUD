import { useState } from 'react';
import { Camera } from 'lucide-react';

export default function ScreenshotButton() {
  const [flash, setFlash]     = useState(false);
  const [active, setActive]   = useState(false);

  const shoot = async () => {
    if (active) return;
    setActive(true);
    setFlash(true);
    setTimeout(() => setFlash(false), 120);

    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
        scale: window.devicePixelRatio ?? 1,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `ar-hud-snapshot-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.warn('Screenshot failed:', err);
    } finally {
      setActive(false);
    }
  };

  return (
    <>
      {/* Flash overlay */}
      {flash && (
        <div className="fixed inset-0 z-[500] bg-white/30 pointer-events-none" />
      )}

      <button
        onClick={shoot}
        disabled={active}
        title="Screenshot (saves PNG)"
        className="p-1.5 border border-hud-cyan/20 text-hud-cyan/40
                   hover:border-hud-cyan/60 hover:text-hud-cyan hover:bg-hud-cyan/5
                   active:scale-90 disabled:opacity-30
                   transition-all duration-150"
      >
        <Camera size={12} />
      </button>
    </>
  );
}

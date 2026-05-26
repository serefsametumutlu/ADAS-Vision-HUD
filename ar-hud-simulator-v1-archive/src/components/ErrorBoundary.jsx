import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[AR HUD] Runtime error:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[999] select-none">
        {/* Red grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,59,59,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,59,59,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Corner brackets */}
        {[['top-4 left-4','border-t border-l'], ['top-4 right-4','border-t border-r'],
          ['bottom-4 left-4','border-b border-l'], ['bottom-4 right-4','border-b border-r']].map(([pos, cls]) => (
          <div key={pos} className={`absolute ${pos} w-8 h-8 border-red-500/40 ${cls}`} />
        ))}

        {/* Content */}
        <div className="relative z-10 text-center max-w-xl px-8">
          <div className="font-mono text-[9px] tracking-[0.4em] text-red-500/60 uppercase mb-4">
            SYSTEM FAULT · CODE 0x{Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}
          </div>

          <h1 className="font-display text-4xl tracking-[0.3em] text-red-500 uppercase mb-2"
              style={{ textShadow: '0 0 20px rgba(255,59,59,0.7), 0 0 50px rgba(255,59,59,0.3)' }}>
            SYSTEM ERROR
          </h1>

          <div className="w-full h-px bg-red-500/30 mb-6" />

          <div className="font-mono text-[10px] text-red-400/70 tracking-wider mb-2 text-left bg-red-950/20 border border-red-500/20 px-4 py-3 max-h-28 overflow-auto">
            {String(this.state.error)}
          </div>

          <p className="font-mono text-[9px] text-white/30 tracking-widest mb-6">
            AR HUD RENDER PIPELINE HALTED — MANUAL RESTART REQUIRED
          </p>

          <button
            onClick={() => window.location.reload()}
            className="font-mono text-[10px] tracking-[0.3em] uppercase px-6 py-2
                       border border-red-500/50 text-red-400 bg-red-950/20
                       hover:bg-red-950/40 hover:border-red-500/80 transition-all duration-200
                       active:scale-95"
          >
            RESTART SYSTEM
          </button>
        </div>
      </div>
    );
  }
}

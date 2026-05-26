import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || 'Unknown error' };
  }

  componentDidCatch(err, info) {
    console.error('[AR HUD ErrorBoundary]', err, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
        {/* Scan lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.03) 2px, rgba(255,0,0,0.03) 4px)',
          }}
        />

        <div className="text-center z-10 px-8">
          <div
            className="text-4xl font-tech font-bold tracking-[0.3em] mb-2"
            style={{ color: '#FF3B3B', textShadow: '0 0 30px #FF3B3B, 0 0 60px #FF3B3B80', animation: 'glitch 2s infinite' }}
          >
            SYSTEM ERROR
          </div>
          <div className="text-[10px] font-mono tracking-[0.5em] text-red-400/60 mb-8">
            AR HUD v2.0 — CRITICAL FAULT
          </div>

          <div
            className="text-xs font-mono text-red-300/80 bg-red-900/20 border border-red-500/30 rounded px-4 py-3 max-w-md mx-auto mb-8 text-left"
          >
            {this.state.message}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="text-xs font-mono tracking-widest px-6 py-2 rounded border border-red-500/50 text-red-400 hover:bg-red-900/30 transition-colors"
          >
            RESTART SYSTEM
          </button>
        </div>

        <style>{`
          @keyframes glitch {
            0%, 90%, 100% { transform: translate(0); }
            91% { transform: translate(-2px, 1px); }
            93% { transform: translate(2px, -1px); }
            95% { transform: translate(-1px, 2px); }
          }
        `}</style>
      </div>
    );
  }
}

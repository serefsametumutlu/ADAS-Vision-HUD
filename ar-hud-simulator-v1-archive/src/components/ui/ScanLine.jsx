export default function ScanLine() {
  return (
    <div
      className="absolute inset-x-0 top-0 h-px pointer-events-none z-10 animate-scan-line"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(0,240,200,0.7) 50%, transparent)',
        mixBlendMode: 'screen',
        opacity: 0.6,
      }}
    />
  );
}

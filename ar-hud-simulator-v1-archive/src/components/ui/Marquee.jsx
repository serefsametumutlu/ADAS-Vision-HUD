export default function Marquee({ children, speed = 20 }) {
  const duration = `${speed}s`;
  return (
    <div className="overflow-hidden w-full">
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          animation: `marqueeScroll ${duration} linear infinite`,
        }}
      >
        <span style={{ paddingRight: '3rem' }}>{children}</span>
        <span style={{ paddingRight: '3rem' }}>{children}</span>
      </div>
    </div>
  );
}

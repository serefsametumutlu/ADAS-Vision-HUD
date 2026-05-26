export default function BlueprintGrid({ opacity = 0.05, gridSize = 40 }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(rgba(0,240,200,0.4) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,240,200,0.4) 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    />
  );
}

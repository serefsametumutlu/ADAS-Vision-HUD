export default function CrosswalkZebra({ position }) {
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[(i - 2.5) * 0.9, 0, 0.01]}>
          <planeGeometry args={[0.55, 7]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

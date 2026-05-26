// Global ref registry — module-level Map, zero React overhead
// Shape: Map<id: string, { ref: React.RefObject, label: string, bw, bh, bd: number }>
export const sceneRegistry = new Map();

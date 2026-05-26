// Shared scene data — used by SceneObjects (render) and SyntheticDetector (detection)
const SCENARIO = [
  // ── Vehicles ─────────────────────────────────────────────────────────
  { id: 'v0', type: 'vehicle', subType: 'car',   pos: [ 2.5, 0,  -30], color: '#cc3333', speed: 12, label: 'car',   bw: 1.8, bh: 1.6, bd: 4.2 },
  { id: 'v1', type: 'vehicle', subType: 'car',   pos: [-2.5, 0,  -55], color: '#3355cc', speed: 14, label: 'car',   bw: 1.8, bh: 1.6, bd: 4.2 },
  { id: 'v2', type: 'vehicle', subType: 'truck', pos: [ 2.5, 0,  -80], color: '#999999', speed: 10, label: 'truck', bw: 2.4, bh: 3.8, bd: 7.5 },
  { id: 'v3', type: 'vehicle', subType: 'car',   pos: [-2.5, 0, -120], color: '#eeeeee', speed: 13, label: 'car',   bw: 1.8, bh: 1.6, bd: 4.2 },
  { id: 'v4', type: 'vehicle', subType: 'car',   pos: [ 2.5, 0, -200], color: '#7722bb', speed: 15, label: 'car',   bw: 1.8, bh: 1.6, bd: 4.2 },
  { id: 'v5', type: 'vehicle', subType: 'car',   pos: [-2.5, 0, -280], color: '#ff8800', speed: 11, label: 'car',   bw: 1.8, bh: 1.6, bd: 4.2 },

  // ── Traffic Signs ─────────────────────────────────────────────────────
  { id: 's0', type: 'sign', signType: 'speed-50',   pos: [8, 0,  -45], label: 'speed sign', bw: 1.0, bh: 3.2, bd: 0.2 },
  { id: 's1', type: 'sign', signType: 'stop',        pos: [8, 0,  -98], label: 'stop sign',  bw: 1.0, bh: 3.2, bd: 0.2 },
  { id: 's2', type: 'sign', signType: 'pedestrian',  pos: [8, 0, -158], label: 'ped sign',   bw: 1.0, bh: 3.2, bd: 0.2 },
  { id: 's3', type: 'sign', signType: 'speed-80',    pos: [8, 0, -255], label: 'speed sign', bw: 1.0, bh: 3.2, bd: 0.2 },
  { id: 's4', type: 'sign', signType: 'speed-100',   pos: [8, 0, -405], label: 'speed sign', bw: 1.0, bh: 3.2, bd: 0.2 },

  // ── Traffic Lights ────────────────────────────────────────────────────
  { id: 'tl0', type: 'traffic-light', pos: [8, 0, -100], label: 'traffic light', bw: 0.6, bh: 6.5, bd: 0.6 },
  { id: 'tl1', type: 'traffic-light', pos: [8, 0, -305], label: 'traffic light', bw: 0.6, bh: 6.5, bd: 0.6 },

  // ── Pedestrians ───────────────────────────────────────────────────────
  { id: 'p0', type: 'pedestrian', pos: [-8,   0, -162], walkSpeed: 0,   label: 'person', bw: 0.6, bh: 1.8, bd: 0.4 },
  { id: 'p1', type: 'pedestrian', pos: [-8.5, 0, -166], walkSpeed: 0,   label: 'person', bw: 0.6, bh: 1.8, bd: 0.4 },
  { id: 'p2', type: 'pedestrian', pos: [ 8,   0, -328], walkSpeed: 0.3, label: 'person', bw: 0.6, bh: 1.8, bd: 0.4 },

  // ── Crosswalks (no detection) ─────────────────────────────────────────
  { id: 'c0', type: 'crosswalk', pos: [0, 0, -163] },
  { id: 'c1', type: 'crosswalk', pos: [0, 0, -325] },
];

export default SCENARIO;

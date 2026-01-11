export const GAME_WIDTH = 1000;
export const GAME_HEIGHT = 800;

export const NODE_RADIUS = 28; // Slightly larger for better touch targets
export const PACKET_RADIUS = 8;

export const INITIAL_SPEED = 0.005; 
export const MAX_SPEED = 0.025;
export const SPAWN_RATE_MS = 2000;
export const DIFFICULTY_RAMP_MS = 10000; 

export const COLORS = {
  DATA: '#3b82f6', // blue-500
  MALWARE: '#ef4444', // red-500
  ENCRYPTED: '#e2e8f0', // slate-200 (brighter for visibility)
  SERVER: '#22c55e', // green-500
  FIREWALL: '#f97316', // orange-500 (distinct from malware red)
  SWITCH: '#eab308', // yellow-500
  SOURCE: '#a855f7', // purple-500
  BG_NODE: '#0f172a', // slate-900
  CABLE: '#334155', // slate-700
  CABLE_ACTIVE: '#94a3b8', // slate-400
  TEXT_LIGHT: '#f8fafc',
  TEXT_DIM: '#94a3b8',
};

export const SCORES = {
  CORRECT: 100,
  INCORRECT: -50,
  DAMAGE: 15, // Increased penalty
};
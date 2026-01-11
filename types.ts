export enum NodeType {
  SOURCE = 'SOURCE',
  SWITCH = 'SWITCH',
  SERVER = 'SERVER', // Destination for Data
  FIREWALL = 'FIREWALL', // Destination for Malware
}

export enum PacketType {
  DATA = 'DATA',
  MALWARE = 'MALWARE',
  ENCRYPTED = 'ENCRYPTED',
}

export interface Node {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  // For switches: connected target IDs. For others: usually empty or single for source
  targets: string[]; 
}

export interface Packet {
  id: string;
  type: PacketType;
  realType: PacketType; // The true type if encrypted
  revealed: boolean;
  fromNodeId: string;
  toNodeId: string;
  progress: number; // 0.0 to 1.0
  speed: number;
}

export interface SwitchState {
  [nodeId: string]: number; // Index of the active target in the targets array
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  life: number;
  vx: number;
  vy: number;
}
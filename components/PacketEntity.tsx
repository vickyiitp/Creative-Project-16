import React from 'react';
import { Packet, PacketType, Node } from '../types';
import { COLORS, PACKET_RADIUS } from '../constants';
import { Shield, Database, Bug } from 'lucide-react';

interface Props {
  packet: Packet;
  fromNode: Node;
  toNode: Node;
  onDoubleClick: (packetId: string) => void;
}

export const PacketEntity: React.FC<Props> = ({ packet, fromNode, toNode, onDoubleClick }) => {
  // Linear interpolation
  const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress;
  const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress;

  let color = COLORS.ENCRYPTED;
  let glowColor = 'rgba(148, 163, 184, 0.5)';
  let Icon = Shield; // Default for encrypted

  if (packet.revealed || packet.type !== PacketType.ENCRYPTED) {
    if (packet.realType === PacketType.DATA) {
      color = COLORS.DATA;
      glowColor = 'rgba(59, 130, 246, 0.6)';
      Icon = Database;
    } else if (packet.realType === PacketType.MALWARE) {
      color = COLORS.MALWARE;
      glowColor = 'rgba(239, 68, 68, 0.6)';
      Icon = Bug;
    }
  }

  return (
    <g 
      transform={`translate(${x}, ${y})`} 
      style={{ cursor: packet.type === PacketType.ENCRYPTED && !packet.revealed ? 'pointer' : 'default' }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(packet.id);
      }}
    >
      {/* Pulse Effect */}
      <circle r={PACKET_RADIUS * 2.5} fill={glowColor} className="animate-pulse opacity-50" />
      
      {/* Core */}
      <circle r={PACKET_RADIUS * 1.5} fill={color} stroke="white" strokeWidth={1.5} />
      
      {/* Icon */}
      <foreignObject x={-PACKET_RADIUS} y={-PACKET_RADIUS} width={PACKET_RADIUS * 2} height={PACKET_RADIUS * 2}>
        <div className="flex items-center justify-center w-full h-full">
           <Icon size={12} color="white" />
        </div>
      </foreignObject>
    </g>
  );
};
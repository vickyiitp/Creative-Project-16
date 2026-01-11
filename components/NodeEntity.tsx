import React, { memo } from 'react';
import { Node, NodeType } from '../types';
import { COLORS, NODE_RADIUS, GAME_WIDTH, GAME_HEIGHT } from '../constants';
import { Server, ShieldAlert, Split, Globe } from 'lucide-react';

interface Props {
  node: Node;
  switchState?: number;
  onToggleSwitch: (nodeId: string) => void;
}

const NodeEntityComponent: React.FC<Props> = ({ node, switchState, onToggleSwitch }) => {
  const isSwitch = node.type === NodeType.SWITCH;

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSwitch) {
      // Prevent default touch behavior if needed, but usually onClick handles tap well
      onToggleSwitch(node.id);
    }
  };

  let NodeIcon = Globe;
  let color = COLORS.SOURCE;
  let label = "Source";
  let description = "Origin";

  switch (node.type) {
    case NodeType.SWITCH:
      NodeIcon = Split;
      color = COLORS.SWITCH;
      label = "Switch";
      description = "Tap to Toggle";
      break;
    case NodeType.SERVER:
      NodeIcon = Server;
      color = COLORS.SERVER;
      label = "Server";
      description = "Route Data Here";
      break;
    case NodeType.FIREWALL:
      NodeIcon = ShieldAlert;
      color = COLORS.FIREWALL;
      label = "Firewall";
      description = "Route Malware Here";
      break;
  }

  // Calculate position as percentage
  const leftPct = (node.x / GAME_WIDTH) * 100;
  const topPct = (node.y / GAME_HEIGHT) * 100;

  return (
    <div
      className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-20"
      style={{ 
        left: `${leftPct}%`, 
        top: `${topPct}%`,
      }}
    >
      <div 
        onClick={handleClick}
        role={isSwitch ? "button" : "img"}
        aria-label={`${label} Node`}
        title={description}
        className={`
          relative flex items-center justify-center
          rounded-full border-2 transition-all duration-200
          ${isSwitch ? 'cursor-pointer hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)]' : 'shadow-lg'}
        `}
        style={{
          width: NODE_RADIUS * 2,
          height: NODE_RADIUS * 2,
          backgroundColor: COLORS.BG_NODE,
          borderColor: color,
        }}
      >
        <NodeIcon size={NODE_RADIUS} color={color} />
        
        {/* Switch Indicator */}
        {isSwitch && (
          <div 
            className={`
              absolute -bottom-6 px-2 py-0.5 rounded text-[10px] font-mono font-bold border
              transition-colors duration-200
              ${switchState === 0 
                ? 'bg-slate-800 border-slate-600 text-yellow-400' 
                : 'bg-slate-800 border-slate-600 text-yellow-400'
              }
            `}
          >
             {switchState === 0 ? '← LEFT' : 'RIGHT →'}
          </div>
        )}
      </div>
      
      {/* Label */}
      <div className="mt-7 text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-slate-500 select-none pointer-events-none text-center bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
};

export const NodeEntity = memo(NodeEntityComponent);
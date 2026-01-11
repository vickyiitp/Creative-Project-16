import { Node, NodeType } from '../types';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants';

export const generateLevel = (): Node[] => {
  const nodes: Node[] = [];
  
  // Layout parameters
  const startY = 100;
  const endY = GAME_HEIGHT - 100;
  const totalLevels = 4; // Source -> Switch -> Switch -> Destination
  const levelHeight = (endY - startY) / totalLevels;

  // 1. Source Node
  nodes.push({
    id: 'source',
    type: NodeType.SOURCE,
    x: GAME_WIDTH / 2,
    y: startY,
    targets: ['sw_1_1'],
  });

  // 2. Layer 1 Switch (1 node)
  nodes.push({
    id: 'sw_1_1',
    type: NodeType.SWITCH,
    x: GAME_WIDTH / 2,
    y: startY + levelHeight,
    targets: ['sw_2_1', 'sw_2_2'],
  });

  // 3. Layer 2 Switches (2 nodes)
  const layer2Y = startY + levelHeight * 2;
  const layer2Spread = 300;
  nodes.push({
    id: 'sw_2_1',
    type: NodeType.SWITCH,
    x: GAME_WIDTH / 2 - layer2Spread / 2,
    y: layer2Y,
    targets: ['dest_1', 'dest_2'],
  });
  nodes.push({
    id: 'sw_2_2',
    type: NodeType.SWITCH,
    x: GAME_WIDTH / 2 + layer2Spread / 2,
    y: layer2Y,
    targets: ['dest_3', 'dest_4'],
  });

  // 4. Layer 3 Destinations (4 nodes)
  const layer3Y = startY + levelHeight * 3;
  const layer3Spread = 180;
  
  // Define destination types to force strategy
  const destConfigs = [
    { id: 'dest_1', type: NodeType.SERVER, xOffset: -1.5 },
    { id: 'dest_2', type: NodeType.FIREWALL, xOffset: -0.5 },
    { id: 'dest_3', type: NodeType.SERVER, xOffset: 0.5 },
    { id: 'dest_4', type: NodeType.FIREWALL, xOffset: 1.5 },
  ];

  destConfigs.forEach(cfg => {
    nodes.push({
      id: cfg.id,
      type: cfg.type,
      x: GAME_WIDTH / 2 + (cfg.xOffset * layer3Spread),
      y: layer3Y,
      targets: [],
    });
  });

  return nodes;
};
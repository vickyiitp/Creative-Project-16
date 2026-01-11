import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Node, Packet, SwitchState, PacketType, NodeType, Particle } from '../types';
import { generateLevel } from '../utils/levelGenerator';
import { COLORS, INITIAL_SPEED, SPAWN_RATE_MS, SCORES, GAME_WIDTH, GAME_HEIGHT, DIFFICULTY_RAMP_MS } from '../constants';
import { NodeEntity } from './NodeEntity';
import { PacketEntity } from './PacketEntity';

interface Props {
  isPlaying: boolean;
  isPaused: boolean;
  onGameOver: (finalScore: number) => void;
  onScoreUpdate: (score: number, health: number) => void;
}

export const GameCanvas: React.FC<Props> = ({ isPlaying, isPaused, onGameOver, onScoreUpdate }) => {
  // Game State
  const [nodes, setNodes] = useState<Node[]>([]);
  const [switchStates, setSwitchStates] = useState<SwitchState>({});
  
  // Refs for logic (mutable, no re-render)
  const packetsRef = useRef<Packet[]>([]);
  const lastSpawnTime = useRef<number>(0);
  const lastDifficultyTime = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const healthRef = useRef<number>(100);
  const speedMultiplierRef = useRef<number>(1);
  const animationFrameId = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const lastFrameTime = useRef<number>(0);

  // State for rendering (triggers re-render)
  const [renderPackets, setRenderPackets] = useState<Packet[]>([]);
  const [renderParticles, setRenderParticles] = useState<Particle[]>([]);

  // Init Level
  useEffect(() => {
    const levelNodes = generateLevel();
    setNodes(levelNodes);
    
    // Init switches
    const initialSwitches: SwitchState = {};
    levelNodes.forEach(n => {
      if (n.type === NodeType.SWITCH) {
        initialSwitches[n.id] = 0;
      }
    });
    setSwitchStates(initialSwitches);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Helper to create visual effects
  const createExplosion = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      const speed = 1 + Math.random() * 2;
      newParticles.push({
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        color,
        life: 1.0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }
    particlesRef.current.push(...newParticles);
  };

  const toggleSwitch = useCallback((nodeId: string) => {
    if (!isPlaying || isPaused) return;
    setSwitchStates(prev => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return prev;
      const currentIdx = prev[nodeId] || 0;
      const nextIdx = (currentIdx + 1) % node.targets.length;
      return { ...prev, [nodeId]: nextIdx };
    });
  }, [nodes, isPlaying, isPaused]);

  const handlePacketDoubleClick = useCallback((packetId: string) => {
    if (!isPlaying || isPaused) return;
    const packet = packetsRef.current.find(p => p.id === packetId);
    if (packet && packet.type === PacketType.ENCRYPTED && !packet.revealed) {
      packet.revealed = true;
      packet.type = packet.realType; // Visual change
      const node = nodes.find(n => n.id === packet.fromNodeId);
      // Small sparkle effect
      createExplosion(
        (node?.x || 0) + (Math.random() * 40 - 20), 
        (node?.y || 0) + (Math.random() * 40 - 20), 
        '#ffffff'
      );
    }
  }, [isPlaying, isPaused, nodes]);

  // Main Game Loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!isPlaying) return;
    
    // Pause handling
    if (isPaused) {
        lastFrameTime.current = timestamp; // Prevent time jump when unpausing
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = timestamp - (lastFrameTime.current || timestamp);
    lastFrameTime.current = timestamp;

    // Cap delta time to prevent glitches on tab switch (max 100ms)
    const dt = Math.min(deltaTime, 100);

    // 1. Difficulty Ramp
    if (timestamp - lastDifficultyTime.current > DIFFICULTY_RAMP_MS) {
      speedMultiplierRef.current = Math.min(speedMultiplierRef.current + 0.15, 3.0); // Cap max speed
      lastDifficultyTime.current = timestamp;
    }

    // 2. Spawning logic
    const currentSpawnRate = SPAWN_RATE_MS / Math.sqrt(speedMultiplierRef.current);
    if (timestamp - lastSpawnTime.current > currentSpawnRate) {
      const rand = Math.random();
      let pType = PacketType.DATA;
      let rType = PacketType.DATA;
      
      if (rand > 0.7) {
        pType = PacketType.MALWARE;
        rType = PacketType.MALWARE;
      } else if (rand > 0.5) {
        pType = PacketType.ENCRYPTED;
        rType = Math.random() > 0.5 ? PacketType.DATA : PacketType.MALWARE;
      }

      packetsRef.current.push({
        id: Math.random().toString(36).substr(2, 9),
        type: pType,
        realType: rType,
        revealed: false,
        fromNodeId: 'source',
        toNodeId: 'sw_1_1',
        progress: 0,
        speed: INITIAL_SPEED * speedMultiplierRef.current,
      });
      lastSpawnTime.current = timestamp;
    }

    // 3. Update Packets
    const activePackets: Packet[] = [];
    let scoreChanged = false;

    packetsRef.current.forEach(p => {
      // Scale movement by time delta for smooth 60fps
      // Assuming 16ms is baseline frame. p.speed is per frame.
      const movement = p.speed * (dt / 16.66);
      p.progress += movement;

      if (p.progress >= 1) {
        // Arrived logic
        const currentNode = nodes.find(n => n.id === p.toNodeId);
        if (currentNode) {
          if (currentNode.type === NodeType.SERVER || currentNode.type === NodeType.FIREWALL) {
            // Scoring
            let isCorrect = false;
            const effectiveType = p.type === PacketType.ENCRYPTED ? p.realType : p.type;
            
            if (currentNode.type === NodeType.SERVER && effectiveType === PacketType.DATA) isCorrect = true;
            if (currentNode.type === NodeType.FIREWALL && effectiveType === PacketType.MALWARE) isCorrect = true;

            // Encrypted packets not revealed count as dangerous if they are malware?
            // Game rule: If encrypted malware hits server -> damage. If encrypted data hits firewall -> incorrect (lost data).
            // Logic holds: effectiveType determines outcome.
            
            if (isCorrect) {
              scoreRef.current += SCORES.CORRECT;
              createExplosion(currentNode.x, currentNode.y, COLORS.SERVER);
            } else {
              scoreRef.current += SCORES.INCORRECT;
              healthRef.current -= SCORES.DAMAGE;
              createExplosion(currentNode.x, currentNode.y, COLORS.MALWARE);
            }
            scoreChanged = true;
          } else if (currentNode.type === NodeType.SWITCH) {
            // Routing
            const targetIndex = switchStates[currentNode.id] || 0;
            const nextTargetId = currentNode.targets[targetIndex];
            
            if (nextTargetId) {
              p.fromNodeId = currentNode.id;
              p.toNodeId = nextTargetId;
              p.progress = 0;
              activePackets.push(p);
            }
          }
        }
      } else {
        activePackets.push(p);
      }
    });

    packetsRef.current = activePackets;

    // 4. Update Particles
    const activeParticles: Particle[] = [];
    particlesRef.current.forEach(pt => {
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 0.03; // Fade out
      if (pt.life > 0) activeParticles.push(pt);
    });
    particlesRef.current = activeParticles;

    // 5. Game Over
    if (healthRef.current <= 0) {
      onGameOver(scoreRef.current);
      return; 
    }

    // 6. Update Render State
    if (scoreChanged) {
      onScoreUpdate(scoreRef.current, healthRef.current);
    }
    
    // Batch update render state
    setRenderPackets([...packetsRef.current]);
    setRenderParticles([...particlesRef.current]);

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, isPaused, nodes, switchStates, onGameOver, onScoreUpdate]);

  useEffect(() => {
    if (isPlaying && !animationFrameId.current) {
      lastFrameTime.current = performance.now();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = 0;
    };
  }, [isPlaying, gameLoop]);

  // Reset Logic
  useEffect(() => {
    if (isPlaying && healthRef.current <= 0) {
        // Reset Logic called by parent restarting
        healthRef.current = 100;
        scoreRef.current = 0;
        speedMultiplierRef.current = 1;
        packetsRef.current = [];
        particlesRef.current = [];
        onScoreUpdate(0, 100);
        lastDifficultyTime.current = performance.now();
        lastSpawnTime.current = performance.now();
    }
  }, [isPlaying, onScoreUpdate]);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden shadow-2xl rounded-xl">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
           backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
           backgroundSize: '40px 40px'
        }}
      />

      {/* SVG Layer */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 select-none"
        viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`}
        preserveAspectRatio="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Cables */}
        {nodes.map(node => {
          return node.targets.map((targetId, idx) => {
            const target = nodes.find(n => n.id === targetId);
            if (!target) return null;
            
            const isActive = node.type !== NodeType.SWITCH || switchStates[node.id] === idx;
            
            return (
              <line
                key={`${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={target.x}
                y2={target.y}
                stroke={isActive ? COLORS.CABLE_ACTIVE : COLORS.CABLE}
                strokeWidth={isActive ? 3 : 1.5}
                strokeOpacity={isActive ? 0.8 : 0.2}
                strokeLinecap="round"
                className="transition-colors duration-200"
              />
            );
          });
        })}

        {/* Packets */}
        {renderPackets.map(p => {
            const from = nodes.find(n => n.id === p.fromNodeId);
            const to = nodes.find(n => n.id === p.toNodeId);
            if (!from || !to) return null;
            return (
                <PacketEntity 
                    key={p.id} 
                    packet={p} 
                    fromNode={from} 
                    toNode={to} 
                    onDoubleClick={handlePacketDoubleClick} 
                />
            );
        })}

        {/* Particles */}
        {renderParticles.map(pt => (
          <circle 
            key={pt.id} 
            cx={pt.x} 
            cy={pt.y} 
            r={4 * pt.life} 
            fill={pt.color} 
            opacity={pt.life} 
          />
        ))}
      </svg>

      {/* HTML Layer for Interactive Nodes */}
      <div className="absolute inset-0 w-full h-full z-10">
        {nodes.map(node => (
          <NodeEntity 
            key={node.id} 
            node={node} 
            switchState={switchStates[node.id]} 
            onToggleSwitch={toggleSwitch} 
          />
        ))}
      </div>
      
      {/* Paused Overlay */}
      {isPaused && (
          <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-2xl text-center">
                  <h2 className="text-3xl font-bold font-['Orbitron'] mb-2 text-white">PAUSED</h2>
                  <p className="text-slate-400">System Halted</p>
              </div>
          </div>
      )}
    </div>
  );
};
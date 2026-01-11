import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { LandingPage } from './components/LandingPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Activity, Trophy, RefreshCw, Cpu, Home, Pause, Play, Smartphone } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [finalScore, setFinalScore] = useState(0);

  const startGame = () => {
    setScore(0);
    setHealth(100);
    setIsPaused(false);
    setGameState('PLAYING');
  };

  const handleGameOver = (final: number) => {
    setFinalScore(final);
    setGameState('GAMEOVER');
  };

  const handleScoreUpdate = (newScore: number, newHealth: number) => {
    setScore(newScore);
    setHealth(newHealth);
  };

  const togglePause = () => {
    if (gameState === 'PLAYING') {
        setIsPaused(!isPaused);
    }
  };

  const goHome = () => {
    setGameState('START');
    setIsPaused(false);
  };

  if (gameState === 'START') {
    return (
      <ErrorBoundary>
        <LandingPage onStart={startGame} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-black p-2 md:p-6 font-mono relative overflow-hidden select-none">
        <div className="scanlines"></div>
        
        {/* HUD */}
        <div className="w-full max-w-[1000px] flex justify-between items-center mb-4 z-50 text-white glass-panel p-3 md:p-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                  onClick={goHome} 
                  className="hover:text-blue-400 transition-colors p-2 hover:bg-white/5 rounded-full"
                  title="Return to Home"
              >
                  <Home size={20}/>
              </button>
              <div className="hidden sm:flex items-center space-x-2">
                  <Cpu className="text-blue-400" size={20} />
                  <span className="text-sm md:text-lg font-bold tracking-wider font-['Orbitron']">PACKET TRACER</span>
              </div>
          </div>

          <div className="flex items-center space-x-4 md:space-x-8">
              {/* Score */}
              <div className="flex items-center space-x-2">
                  <Trophy className="text-yellow-400" size={18} />
                  <span className="text-lg md:text-2xl font-bold font-['Orbitron']">{score.toLocaleString()}</span>
              </div>
              
              {/* Health */}
              <div className="flex items-center space-x-2">
                  <Activity className={`${health < 30 ? "text-red-500 animate-pulse" : "text-green-500"}`} size={20} />
                  <div className="w-20 md:w-32 h-2.5 md:h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-600/50">
                      <div 
                          className={`h-full transition-all duration-300 ${health < 30 ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{ width: `${Math.max(0, health)}%` }}
                      ></div>
                  </div>
              </div>

              {/* Pause Button */}
              <button 
                  onClick={togglePause}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-600 transition-colors"
                  aria-label={isPaused ? "Resume" : "Pause"}
              >
                  {isPaused ? <Play size={18} className="fill-white" /> : <Pause size={18} className="fill-white" />}
              </button>
          </div>
        </div>

        {/* Game Container */}
        {/* Enforce Aspect Ratio and bounds. On small screens, it takes full width. */}
        <div className="relative w-full max-w-[1000px] aspect-[5/4] flex-1 max-h-[85vh] bg-slate-900 rounded-xl overflow-hidden border border-slate-800/50 shadow-2xl">
          
          <GameCanvas 
              isPlaying={gameState === 'PLAYING'} 
              isPaused={isPaused}
              onGameOver={handleGameOver}
              onScoreUpdate={handleScoreUpdate}
          />

          {/* Game Over Modal */}
          {gameState === 'GAMEOVER' && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center animate-fade-in">
                  <div className="inline-block p-4 rounded-full bg-red-500/10 mb-6 border border-red-500/20">
                    <Activity size={48} className="text-red-500" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black font-['Orbitron'] text-white mb-2 tracking-tighter">SYSTEM FAILURE</h2>
                  <p className="text-slate-400 mb-8 uppercase tracking-widest text-sm">Network Integrity Compromised</p>
                  
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8 w-full max-w-sm">
                      <div className="text-sm text-slate-400 mb-1">FINAL SCORE</div>
                      <div className="text-4xl font-bold text-yellow-400 font-['Orbitron']">{finalScore.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex gap-4">
                      <button 
                          onClick={goHome}
                          className="px-6 py-3 border border-slate-600 hover:bg-slate-800 text-slate-300 font-bold rounded flex items-center gap-2 transition-all"
                      >
                          <Home size={18} />
                          <span>MENU</span>
                      </button>
                      <button 
                          onClick={startGame}
                          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25"
                      >
                          <RefreshCw size={18} />
                          <span>REBOOT</span>
                      </button>
                  </div>
              </div>
          )}

          {/* Mobile Orientation Hint */}
          <div className="absolute top-2 left-0 w-full flex md:hidden justify-center pointer-events-none opacity-50">
             <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full text-[10px] text-slate-300 border border-white/10">
                <Smartphone size={10} /> <span>Best in Landscape</span>
             </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest text-center">
           SECURE CONNECTION ESTABLISHED • v1.2.0
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
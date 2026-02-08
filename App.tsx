import React, { useState, useCallback } from 'react';
import Game from './components/Game.tsx';
import Menu from './components/Menu.tsx';
import AdUnit from './components/AdUnit.tsx';
import Celebration from './components/Celebration.tsx';
import { GameState, Difficulty } from './types.ts';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setGameState(GameState.PLAYING);
    setCompletionTime(null);
  }, []);

  const handleComplete = useCallback((time: number) => {
    setCompletionTime(time);
    setGameState(GameState.COMPLETED);
  }, []);

  const handleFail = useCallback(() => {
    setGameState(GameState.FAILED);
  }, []);

  const backToMenu = useCallback(() => {
    setGameState(GameState.MENU);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Noise Overlay Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-50 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {gameState === GameState.MENU && (
        <Menu onStart={startGame} />
      )}

      {gameState === GameState.PLAYING && (
        <Game 
          difficulty={difficulty} 
          onComplete={handleComplete} 
          onFail={handleFail} 
        />
      )}

      {gameState === GameState.COMPLETED && completionTime !== null && (
        <Celebration time={completionTime} onRestart={backToMenu} />
      )}

      {gameState === GameState.FAILED && (
        <div className="z-40 text-center animate-in fade-in zoom-in duration-500 w-full max-w-2xl px-4">
          <h1 className="text-7xl font-bold mb-8 tracking-tighter text-red-500">
            INSTABILITY CRITICAL
          </h1>
          <div className="flex gap-4 justify-center mb-8">
            <button 
              onClick={() => startGame(difficulty)}
              className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors"
            >
              REBOOT
            </button>
            <button 
              onClick={backToMenu}
              className="px-8 py-3 border border-white text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              MAIN_TERMINAL
            </button>
          </div>
          
          <AdUnit />
        </div>
      )}
    </div>
  );
};

export default App;
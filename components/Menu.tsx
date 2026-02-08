
import React from 'react';
import { Difficulty } from '../types.ts';

interface MenuProps {
  onStart: (difficulty: Difficulty) => void;
}

const Menu: React.FC<MenuProps> = ({ onStart }) => {
  return (
    <div className="z-40 flex flex-col items-center max-w-2xl px-8">
      <div className="mb-12 relative">
        <h1 className="text-9xl font-bold tracking-[0.2em] relative z-10">
          PEP
        </h1>
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-red-500 blur-2xl opacity-30 animate-pulse"></div>
      </div>

      <p className="text-xl mb-16 text-center leading-relaxed opacity-60 font-light">
        A single space. A simple objective.<br/>
        Reach the Core. Maintain stability.<br/>
        Reality is a variable.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        <button 
          onClick={() => onStart(Difficulty.EASY)}
          className="group relative px-8 py-10 bg-zinc-900 border border-zinc-800 hover:border-cyan-500 transition-all overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-cyan-400">EASY</h2>
            <p className="text-xs opacity-50 uppercase tracking-widest">Learn the patterns</p>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-cyan-500 group-hover:w-full transition-all duration-300"></div>
        </button>

        <button 
          onClick={() => onStart(Difficulty.HARD)}
          className="group relative px-8 py-10 bg-zinc-900 border border-zinc-800 hover:border-red-500 transition-all overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-red-500">HARD</h2>
            <p className="text-xs opacity-50 uppercase tracking-widest">Trust nothing</p>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-red-500 group-hover:w-full transition-all duration-300"></div>
        </button>
      </div>

      <div className="mt-16 text-[10px] tracking-[0.4em] opacity-30 font-mono flex flex-col items-center gap-2">
        <span>MOVE: WASD / ARROWS</span>
        <span>ACTION: SPACE</span>
      </div>
    </div>
  );
};

export default Menu;

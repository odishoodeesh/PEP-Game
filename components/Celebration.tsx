
import React, { useEffect, useRef } from 'react';
import { THEME } from '../constants.ts';

interface CelebrationProps {
  onRestart: () => void;
  time: number;
}

const Celebration: React.FC<CelebrationProps> = ({ onRestart, time }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];
    
    // Create cosmic particles
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3,
        color: Math.random() > 0.5 ? THEME.core : THEME.player,
      });
    }

    const render = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const timeNow = Date.now() / 1000;

      // Draw background "universe" waves
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = i === 0 ? `${THEME.core}22` : `${THEME.player}22`;
        ctx.lineWidth = 200;
        ctx.moveTo(0, canvas.height / 2 + Math.sin(timeNow + i) * 100);
        for (let x = 0; x < canvas.width; x += 10) {
          ctx.lineTo(x, canvas.height / 2 + Math.sin(timeNow + x * 0.002 + i) * 200);
        }
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw the "Prize": The Singularity Prism
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 - 50;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(timeNow * 0.5);
      
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        const gradient = ctx.createLinearGradient(-50, -50, 50, 50);
        gradient.addColorStop(0, THEME.player);
        gradient.addColorStop(0.5, '#FFF');
        gradient.addColorStop(1, THEME.core);
        
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 30;
        ctx.shadowColor = THEME.core;
        
        // Pulsing shape
        const scale = 1 + Math.sin(timeNow * 3) * 0.1;
        ctx.beginPath();
        ctx.moveTo(0, -60 * scale);
        ctx.lineTo(30 * scale, 0);
        ctx.lineTo(0, 60 * scale);
        ctx.lineTo(-30 * scale, 0);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      animationFrame = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-1000">
        <div className="space-y-2">
          <h2 className="text-sm font-mono tracking-[0.8em] text-cyan-400 uppercase opacity-70">Reality Shift Detected</h2>
          <h1 className="text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            ASCENDED
          </h1>
        </div>

        <div className="p-12 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl max-w-xl mx-auto space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">Artifact Recovered</span>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              The Chronos Shard
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-left font-mono text-xs">
            <div className="p-4 bg-black/40 border border-white/5">
              <span className="block opacity-40 mb-1">STABILITY_TIME</span>
              <span className="text-xl text-white">{(time / 1000).toFixed(2)}s</span>
            </div>
            <div className="p-4 bg-black/40 border border-white/5">
              <span className="block opacity-40 mb-1">UNIVERSE_ID</span>
              <span className="text-xl text-white">#{Math.floor(Math.random() * 9999)}</span>
            </div>
          </div>

          <p className="text-sm text-white/60 leading-relaxed font-light">
            You have successfully navigated the instability and reached the Core. 
            The Prize is yours. Reality has been rewritten.
          </p>

          <button 
            onClick={onRestart}
            className="w-full group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">RE-ENTER SIMULATION</span>
            <div className="absolute inset-0 bg-cyan-400 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>

      {/* Retro scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
    </div>
  );
};

export default Celebration;

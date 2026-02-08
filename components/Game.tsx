import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Difficulty, 
  Player, 
  Hazard, 
  Wall, 
  Vector2D 
} from '../types';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  INITIAL_STABILITY, 
  START_POS, 
  CORE_POINT, 
  WALLS, 
  HAZARDS, 
  THEME 
} from '../constants';

interface GameProps {
  difficulty: Difficulty;
  onComplete: (time: number) => void;
  onFail: () => void;
}

const Game: React.FC<GameProps> = ({ difficulty, onComplete, onFail }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(undefined);
  const startTimeRef = useRef<number>(Date.now());
  const [stability, setStability] = useState(INITIAL_STABILITY);
  
  const playerRef = useRef<Player>({
    pos: { ...START_POS },
    vel: { x: 0, y: 0 },
    stability: INITIAL_STABILITY,
    isDistorted: false,
    size: 24,
  });

  const hazardsRef = useRef<Hazard[]>(HAZARDS.map(h => ({ ...h })));
  const keysPressed = useRef<Record<string, boolean>>({});
  const cameraOffset = useRef<Vector2D>({ x: 0, y: 0 });

  const config = {
    speed: difficulty === Difficulty.EASY ? 0.6 : 0.9,
    friction: difficulty === Difficulty.EASY ? 0.93 : 0.97,
    stabilityDrain: difficulty === Difficulty.EASY ? 0.05 : 0.15,
    cameraDrift: difficulty === Difficulty.HARD,
    misdirection: difficulty === Difficulty.HARD,
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.code] = true;
    if (e.code === 'Space') {
      if (difficulty === Difficulty.HARD) {
        playerRef.current.stability -= 5;
      }
    }
  }, [difficulty]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.code] = false;
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const update = useCallback(() => {
    const player = playerRef.current;
    
    // Movement Input
    if (keysPressed.current['ArrowUp'] || keysPressed.current['KeyW']) player.vel.y -= config.speed;
    if (keysPressed.current['ArrowDown'] || keysPressed.current['KeyS']) player.vel.y += config.speed;
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) player.vel.x -= config.speed;
    if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) player.vel.x += config.speed;

    // Physics
    player.vel.x *= config.friction;
    player.vel.y *= config.friction;

    player.pos.x += player.vel.x;
    player.pos.y += player.vel.y;

    // Hard Mode Penalties
    if (difficulty === Difficulty.HARD) {
      const speedSq = player.vel.x * player.vel.x + player.vel.y * player.vel.y;
      if (speedSq < 0.1) player.stability -= 0.1;
    }

    // Wall Collisions
    for (const wall of WALLS) {
      const p = player.pos;
      const s = player.size / 2;
      
      if (p.x + s > wall.x && p.x - s < wall.x + wall.w &&
          p.y + s > wall.y && p.y - s < wall.y + wall.h) {
        
        const dx = (p.x < wall.x + wall.w / 2) ? wall.x - (p.x + s) : (wall.x + wall.w) - (p.x - s);
        const dy = (p.y < wall.y + wall.h / 2) ? wall.y - (p.y + s) : (wall.y + wall.h) - (p.y - s);

        if (Math.abs(dx) < Math.abs(dy)) {
          player.pos.x += dx;
          player.vel.x *= -0.2; // Small bounce
        } else {
          player.pos.y += dy;
          player.vel.y *= -0.2;
        }
      }
    }

    // Hazard Logic & Collisions
    for (const hazard of hazardsRef.current) {
      if (hazard.type === 'patrol') {
        hazard.pos.y += hazard.vel.y;
        if (hazard.pos.y > 700 || hazard.pos.y < 100) hazard.vel.y *= -1;
      }
      hazard.phase += 0.05;

      const dx = player.pos.x - hazard.pos.x;
      const dy = player.pos.y - hazard.pos.y;
      const distSq = dx * dx + dy * dy;
      
      const hPulse = hazard.type === 'pulse' ? Math.sin(hazard.phase) * 10 : 0;
      const threshold = (player.size / 2) + ((hazard.size.x + hPulse) / 2);
      
      if (distSq < threshold * threshold) {
        // Immediate game over on touching red object
        onFail();
        return false;
      }
    }

    // Passive Drain
    player.stability -= config.stabilityDrain;
    setStability(Math.max(0, Math.floor(player.stability)));

    // Fail Condition (Stability)
    if (player.stability <= 0) {
      onFail();
      return false;
    }

    // Win Condition
    const dCoreX = player.pos.x - CORE_POINT.x;
    const dCoreY = player.pos.y - CORE_POINT.y;
    if (dCoreX * dCoreX + dCoreY * dCoreY < 45 * 45) {
      onComplete(Date.now() - startTimeRef.current);
      return false;
    }

    // Camera Effects
    if (config.cameraDrift) {
      cameraOffset.current.x = (cameraOffset.current.x * 0.9) + Math.sin(Date.now() / 1000) * 5;
      cameraOffset.current.y = (cameraOffset.current.y * 0.9) + Math.cos(Date.now() / 1500) * 4;
    } else {
      cameraOffset.current.x *= 0.8;
      cameraOffset.current.y *= 0.8;
    }

    return true;
  }, [difficulty, config, onFail, onComplete]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.save();
    ctx.translate(cameraOffset.current.x, cameraOffset.current.y);

    // Draw Walls
    ctx.fillStyle = THEME.wall;
    for (const wall of WALLS) {
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
    }

    // Draw Core
    const time = Date.now() / 500;
    const corePulse = 20 + Math.sin(time) * 5;
    const grad = ctx.createRadialGradient(CORE_POINT.x, CORE_POINT.y, 0, CORE_POINT.x, CORE_POINT.y, 70);
    grad.addColorStop(0, THEME.core);
    grad.addColorStop(0.5, THEME.core + '44');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(CORE_POINT.x, CORE_POINT.y, corePulse + 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFF';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FFF';
    ctx.beginPath();
    ctx.arc(CORE_POINT.x, CORE_POINT.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Hazards
    for (const hazard of hazardsRef.current) {
      const hPulse = hazard.type === 'pulse' ? Math.sin(hazard.phase) * 10 : 0;
      ctx.fillStyle = THEME.hazard;
      ctx.shadowBlur = 15;
      ctx.shadowColor = THEME.hazard;
      
      ctx.beginPath();
      if (difficulty === Difficulty.HARD && Math.random() > 0.98) {
        ctx.rect(hazard.pos.x - 40, hazard.pos.y, 80, 1);
      } else {
        const szX = hazard.size.x + hPulse;
        const szY = hazard.size.y + hPulse;
        ctx.rect(hazard.pos.x - szX / 2, hazard.pos.y - szY / 2, szX, szY);
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw Player
    const player = playerRef.current;
    ctx.save();
    ctx.translate(player.pos.x, player.pos.y);
    
    const speed = Math.sqrt(player.vel.x * player.vel.x + player.vel.y * player.vel.y);
    const angle = Math.atan2(player.vel.y, player.vel.x);
    ctx.rotate(angle);
    
    const stretchX = 1 + speed * 0.08;
    const stretchY = 1 / stretchX;
    ctx.scale(stretchX, stretchY);

    ctx.fillStyle = THEME.player;
    ctx.shadowBlur = 20;
    ctx.shadowColor = THEME.player;
    ctx.beginPath();
    ctx.arc(0, 0, player.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    ctx.restore();

    // UI Overlay
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(40, 40, 300, 10);
    
    if (stability < 25) {
      ctx.fillStyle = Math.sin(Date.now() / 100) > 0 ? THEME.hazard : '#FFF';
    } else if (stability < 50) {
      ctx.fillStyle = '#FFA500';
    } else {
      ctx.fillStyle = THEME.player;
    }
    
    ctx.fillRect(40, 40, (stability / INITIAL_STABILITY) * 300, 10);
    
    ctx.font = 'bold 12px JetBrains Mono';
    ctx.fillStyle = '#FFF';
    ctx.fillText('STABILITY_CORE', 40, 30);
    ctx.fillText(`${stability}%`, 310, 30);
    
    ctx.font = '10px JetBrains Mono';
    ctx.globalAlpha = 0.5;
    ctx.fillText(`MODE: ${difficulty}`, 40, 70);
    ctx.fillText(`COORD: ${Math.floor(player.pos.x)},${Math.floor(player.pos.y)}`, 40, 85);
    ctx.globalAlpha = 1.0;

  }, [difficulty, stability]);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (update()) {
      draw(ctx);
      requestRef.current = requestAnimationFrame(loop);
    }
  }, [update, draw]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loop]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#050505]">
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        className="max-w-full max-h-full shadow-2xl border border-white/5"
      />
      
      {/* HUD Accents */}
      <div className="absolute top-10 left-10 w-4 h-4 border-t-2 border-l-2 border-white/20"></div>
      <div className="absolute top-10 right-10 w-4 h-4 border-t-2 border-r-2 border-white/20"></div>
      <div className="absolute bottom-10 left-10 w-4 h-4 border-b-2 border-l-2 border-white/20"></div>
      <div className="absolute bottom-10 right-10 w-4 h-4 border-b-2 border-r-2 border-white/20"></div>
    </div>
  );
};

export default Game;
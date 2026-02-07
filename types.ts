
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED'
}

export enum Difficulty {
  EASY = 'EASY',
  HARD = 'HARD'
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  pos: Vector2D;
  vel: Vector2D;
  stability: number;
  isDistorted: boolean;
  size: number;
}

export interface Hazard {
  id: string;
  pos: Vector2D;
  size: Vector2D;
  vel: Vector2D;
  type: 'patrol' | 'pulse' | 'static';
  phase: number;
}

export interface Wall {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GameConfig {
  playerSpeed: number;
  friction: number;
  stabilityDrain: number;
  hazards: Hazard[];
  walls: Wall[];
  corePoint: Vector2D;
}

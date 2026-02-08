import { Wall, Hazard, Vector2D } from './types.ts';

export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 800;

export const INITIAL_STABILITY = 100;

export const START_POS: Vector2D = { x: 100, y: 400 };
export const CORE_POINT: Vector2D = { x: 1100, y: 400 };

export const WALLS: Wall[] = [
  // Outer boundaries
  { x: 0, y: 0, w: CANVAS_WIDTH, h: 20 },
  { x: 0, y: CANVAS_HEIGHT - 20, w: CANVAS_WIDTH, h: 20 },
  { x: 0, y: 0, w: 20, h: CANVAS_HEIGHT },
  { x: CANVAS_WIDTH - 20, y: 0, w: 20, h: CANVAS_HEIGHT },
  
  // Obstacles - Level Design
  { x: 250, y: 20, w: 40, h: 300 },
  { x: 250, y: 480, w: 40, h: 300 },
  { x: 500, y: 200, w: 40, h: 400 },
  { x: 750, y: 20, w: 40, h: 350 },
  { x: 750, y: 450, w: 40, h: 350 },
  { x: 950, y: 250, w: 40, h: 300 },
];

export const HAZARDS: Hazard[] = [
  { id: 'h1', pos: { x: 400, y: 100 }, size: { x: 30, y: 30 }, vel: { x: 0, y: 3 }, type: 'patrol', phase: 0 },
  { id: 'h2', pos: { x: 650, y: 500 }, size: { x: 30, y: 30 }, vel: { x: 0, y: -4 }, type: 'patrol', phase: Math.PI },
  { id: 'h3', pos: { x: 850, y: 150 }, size: { x: 40, y: 40 }, vel: { x: 0, y: 0 }, type: 'pulse', phase: 0 },
  { id: 'h4', pos: { x: 850, y: 650 }, size: { x: 40, y: 40 }, vel: { x: 0, y: 0 }, type: 'pulse', phase: Math.PI },
];

export const THEME = {
  bg: '#050505',
  player: '#00F0FF',
  core: '#FF00FF',
  hazard: '#FF3D00',
  wall: '#1A1A1A',
  text: '#FFFFFF',
  ui: 'rgba(255, 255, 255, 0.1)',
};
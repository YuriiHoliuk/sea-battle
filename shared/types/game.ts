/**
 * Core game types for Sea Battle
 */

/**
 * Grid position representing x,y coordinates
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Ship orientation
 */
export enum Orientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

/**
 * Ship types with their respective sizes
 */
export enum ShipType {
  CARRIER = 'carrier',
  BATTLESHIP = 'battleship',
  CRUISER = 'cruiser',
  SUBMARINE = 'submarine',
  DESTROYER = 'destroyer',
}

/**
 * Ship sizes by type
 */
export const SHIP_SIZES: Record<ShipType, number> = {
  [ShipType.CARRIER]: 5,
  [ShipType.BATTLESHIP]: 4,
  [ShipType.CRUISER]: 3,
  [ShipType.SUBMARINE]: 3,
  [ShipType.DESTROYER]: 2,
};

/**
 * A ship on the game board
 */
export interface Ship {
  id: string;
  type: ShipType;
  position: Position;
  orientation: Orientation;
  hits: Position[];
  isSunk: boolean;
}

/**
 * Cell state on the game grid
 */
export enum CellState {
  EMPTY = 'empty',
  SHIP = 'ship',
  HIT = 'hit',
  MISS = 'miss',
}

/**
 * Game state
 */
export enum GameState {
  WAITING = 'waiting',
  PLACING_SHIPS = 'placing_ships',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

/**
 * Player action in the game
 */
export enum PlayerAction {
  PLACE_SHIP = 'place_ship',
  ROTATE_SHIP = 'rotate_ship',
  FIRE = 'fire',
  READY = 'ready',
}

/**
 * Shot result
 */
export enum ShotResult {
  HIT = 'hit',
  MISS = 'miss',
  SUNK = 'sunk',
}

/**
 * Game settings
 */
export interface GameSettings {
  gridSize: number;
  timePerTurn: number; // in seconds
}

/**
 * Game mode
 */
export enum GameMode {
  SINGLEPLAYER = 'singleplayer',
  MULTIPLAYER = 'multiplayer',
  PRIVATE = 'private',
}

/**
 * Difficulty level for AI
 */
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
} 
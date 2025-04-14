/**
 * Game constants for Sea Battle
 */

/**
 * Standard grid size
 */
export const GRID_SIZE = 10;

/**
 * Standard ship configuration
 */
export const SHIPS_CONFIG = {
  CARRIER: { length: 5, count: 1 },
  BATTLESHIP: { length: 4, count: 1 },
  CRUISER: { length: 3, count: 1 },
  SUBMARINE: { length: 3, count: 1 },
  DESTROYER: { length: 2, count: 1 },
};

/**
 * Game rules
 */
export const GAME_RULES = {
  TURN_TIMEOUT_SECONDS: 30,
  MAX_PLAYERS: 2,
  SHOTS_PER_TURN: 1,
};

/**
 * Game scoring
 */
export const SCORING = {
  POINTS_FOR_HIT: 10,
  POINTS_FOR_SUNK: 30,
  POINTS_FOR_WIN: 100,
  RATING_K_FACTOR: 32, // ELO K-factor
};

/**
 * AI difficulty settings
 */
export const AI_DIFFICULTY = {
  EASY: {
    ACCURACY: 0.3, // 30% chance to make optimal move
    MEMORY: 1, // remembers last 1 hit
  },
  MEDIUM: {
    ACCURACY: 0.6, // 60% chance to make optimal move
    MEMORY: 3, // remembers last 3 hits
  },
  HARD: {
    ACCURACY: 0.9, // 90% chance to make optimal move
    MEMORY: 10, // remembers last 10 hits
  },
}; 
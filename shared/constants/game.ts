/**
 * Game Constants for Sea Battle
 */

// Grid Size
export const GRID_SIZE = 10;

// Default Timeouts (ms)
export const DEFAULT_TURN_TIMEOUT = 30000; // 30 seconds
export const DEFAULT_GAME_TIMEOUT = 1800000; // 30 minutes

// Game Events
export enum GameEvents {
  JOIN_GAME = 'game:join',
  LEAVE_GAME = 'game:leave',
  GAME_CREATED = 'game:created',
  GAME_STARTED = 'game:started',
  GAME_ENDED = 'game:ended',
  PLACE_SHIP = 'game:place_ship',
  ROTATE_SHIP = 'game:rotate_ship',
  PLAYER_READY = 'game:player_ready',
  FIRE_SHOT = 'game:fire_shot',
  SHOT_RESULT = 'game:shot_result',
  TURN_CHANGE = 'game:turn_change',
  CHAT_MESSAGE = 'game:chat_message',
  GAME_ERROR = 'game:error',
}

// Socket Events
export enum SocketEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
}

// Error Codes
export enum ErrorCodes {
  INVALID_MOVE = 'invalid_move',
  INVALID_POSITION = 'invalid_position',
  GAME_NOT_FOUND = 'game_not_found',
  PLAYER_NOT_FOUND = 'player_not_found',
  NOT_YOUR_TURN = 'not_your_turn',
  SHIP_ALREADY_PLACED = 'ship_already_placed',
  INVALID_SHIP_PLACEMENT = 'invalid_ship_placement',
  GAME_ALREADY_STARTED = 'game_already_started',
  GAME_ALREADY_ENDED = 'game_already_ended',
  ROOM_FULL = 'room_full',
}

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
    SMART_SHOT_PROBABILITY: 0.3,
    MEMORY_TURNS: 2,
  },
  MEDIUM: {
    ACCURACY: 0.6, // 60% chance to make optimal move
    MEMORY: 3, // remembers last 3 hits
    SMART_SHOT_PROBABILITY: 0.6,
    MEMORY_TURNS: 5,
  },
  HARD: {
    ACCURACY: 0.9, // 90% chance to make optimal move
    MEMORY: 10, // remembers last 10 hits
    SMART_SHOT_PROBABILITY: 0.9,
    MEMORY_TURNS: 10,
  },
}; 
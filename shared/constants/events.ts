/**
 * Socket.IO event names for Sea Battle
 */

/**
 * Connection events
 */
export const CONNECTION_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  ERROR: 'error',
};

/**
 * Authentication events
 */
export const AUTH_EVENTS = {
  AUTHENTICATE: 'authenticate',
  AUTHENTICATION_SUCCESS: 'authentication_success',
  AUTHENTICATION_ERROR: 'authentication_error',
};

/**
 * Matchmaking events
 */
export const MATCHMAKING_EVENTS = {
  JOIN_QUEUE: 'join_queue',
  LEAVE_QUEUE: 'leave_queue',
  MATCH_FOUND: 'match_found',
  MATCH_ACCEPTED: 'match_accepted',
  MATCH_DECLINED: 'match_declined',
  MATCH_TIMEOUT: 'match_timeout',
  QUEUE_STATUS: 'queue_status',
};

/**
 * Lobby events
 */
export const LOBBY_EVENTS = {
  CREATE_LOBBY: 'create_lobby',
  JOIN_LOBBY: 'join_lobby',
  LEAVE_LOBBY: 'leave_lobby',
  LOBBY_UPDATED: 'lobby_updated',
  LOBBY_CLOSED: 'lobby_closed',
  LOBBY_CHAT: 'lobby_chat',
  START_GAME: 'start_game',
  LOBBY_ERROR: 'lobby_error',
};

/**
 * Game events
 */
export const GAME_EVENTS = {
  GAME_CREATED: 'game_created',
  GAME_STARTED: 'game_started',
  GAME_UPDATED: 'game_updated',
  GAME_ENDED: 'game_ended',
  PLACE_SHIP: 'place_ship',
  SHIP_PLACED: 'ship_placed',
  PLACEMENT_ERROR: 'placement_error',
  ALL_SHIPS_PLACED: 'all_ships_placed',
  READY: 'ready',
  PLAYER_READY: 'player_ready',
  FIRE_SHOT: 'fire_shot',
  SHOT_RESULT: 'shot_result',
  TURN_STARTED: 'turn_started',
  TURN_ENDED: 'turn_ended',
  GAME_ACTION: 'game_action',
  OPPONENT_DISCONNECTED: 'opponent_disconnected',
  OPPONENT_RECONNECTED: 'opponent_reconnected',
  GAME_ERROR: 'game_error',
};

/**
 * Chat events
 */
export const CHAT_EVENTS = {
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
};

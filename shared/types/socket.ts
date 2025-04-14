/**
 * Socket Types for Sea Battle
 */

import { CellState, GameState, Position, ShotResult } from './game';
import { Player } from './player';

/**
 * Socket Message Types
 */

// Player Connection
export interface PlayerConnectPayload {
  playerId: string;
  username: string;
}

export interface PlayerDisconnectPayload {
  playerId: string;
  reason?: string;
}

// Room Management
export interface JoinRoomPayload {
  roomId: string;
  playerId: string;
}

export interface LeaveRoomPayload {
  roomId: string;
  playerId: string;
}

// Game Creation & Management
export interface GameCreatedPayload {
  gameId: string;
  players: Player[];
  state: GameState;
  createdAt: number;
}

export interface GameStartedPayload {
  gameId: string;
  players: Player[];
  firstTurnPlayerId: string;
  startedAt: number;
}

export interface GameEndedPayload {
  gameId: string;
  winnerId: string;
  reason: string;
  endedAt: number;
}

// Game Actions
export interface PlaceShipPayload {
  gameId: string;
  playerId: string;
  shipId: string;
  position: Position;
  direction: 'horizontal' | 'vertical';
}

export interface PlayerReadyPayload {
  gameId: string;
  playerId: string;
  ready: boolean;
}

export interface FireShotPayload {
  gameId: string;
  playerId: string;
  position: Position;
}

export interface ShotResultPayload {
  gameId: string;
  playerId: string; // The player who fired
  targetId: string; // The player who was targeted
  position: Position;
  result: ShotResult;
  newCellState: CellState;
  shipSunk?: string; // Ship ID if a ship was sunk
}

export interface TurnChangePayload {
  gameId: string;
  nextPlayerId: string;
  turnStartTime: number;
  turnTimeoutSeconds: number;
}

// Chat
export interface ChatMessagePayload {
  gameId: string;
  playerId: string;
  username: string;
  message: string;
  timestamp: number;
}

// Error
export interface GameErrorPayload {
  gameId: string;
  playerId: string;
  errorCode: string;
  message: string;
}

/**
 * Player Types for Sea Battle
 */

import { Grid, Ship, PlayerStats } from './game';

// Player Status Enum
export enum PlayerStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
  IN_GAME = 'in_game',
  AWAY = 'away',
}

// Player Interface
export interface Player {
  id: string;
  username: string;
  status: PlayerStatus;
  stats?: PlayerStats;
  avatar?: string;
}

// Game Player Interface (extends Player with game-specific data)
export interface GamePlayer extends Player {
  grid: Grid;
  ships: Ship[];
  isReady: boolean;
  isTurn: boolean;
}

// Player Action Messages
export interface PlaceShipAction {
  shipId: string;
  position: { x: number; y: number };
  direction: 'horizontal' | 'vertical';
}

export interface FireAction {
  position: { x: number; y: number };
}

export interface ReadyAction {
  ready: boolean;
}

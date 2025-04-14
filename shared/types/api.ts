/**
 * API-related types for Sea Battle
 */

/**
 * Standard API response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Authentication request payload
 */
export interface AuthRequest {
  email: string;
  password: string;
}

/**
 * Authentication response payload
 */
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * Ship placement request payload
 */
export interface PlaceShipRequest {
  gameId: string;
  shipType: string;
  position: {
    x: number;
    y: number;
  };
  orientation: string;
}

/**
 * Fire shot request payload
 */
export interface FireShotRequest {
  gameId: string;
  position: {
    x: number;
    y: number;
  };
}

/**
 * Game creation request
 */
export interface CreateGameRequest {
  mode: string;
  inviteCode?: string;
  difficulty?: string; // for AI games
} 
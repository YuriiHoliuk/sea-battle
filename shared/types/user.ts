/**
 * User-related types for Sea Battle
 */

/**
 * User authentication status
 */
export enum AuthStatus {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

/**
 * User roles
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

/**
 * User profile information
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

/**
 * User game statistics
 */
export interface UserStats {
  userId: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  shotsFired: number;
  shotsHit: number;
  accuracy: number; // percentage (0-100)
  shipsDestroyed: number;
  winRate: number; // percentage (0-100)
  rating: number; // ELO rating
}

/**
 * Achievement status
 */
export enum AchievementStatus {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
}

/**
 * User achievement
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  status: AchievementStatus;
  unlockedAt?: string;
  progress?: number; // percentage (0-100)
}

/**
 * User settings for the game
 */
export interface UserSettings {
  userId: string;
  notifications: boolean;
  sound: boolean;
  music: boolean;
  theme: string;
  autoRotateShips: boolean;
  language: string;
}

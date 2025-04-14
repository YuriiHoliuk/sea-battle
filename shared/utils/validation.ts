/**
 * Validation utility functions for Sea Battle
 */
import { Position, Ship, ShipType, Orientation } from '../types/game';
import { isShipWithinGrid, doesShipOverlapWithAny } from './grid';
import { GRID_SIZE, SHIPS_CONFIG } from '../constants/game';

/**
 * Validate a position is within the grid
 */
export function validatePosition(position: Position, gridSize = GRID_SIZE): boolean {
  if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
    return false;
  }
  return position.x >= 0 && position.x < gridSize && position.y >= 0 && position.y < gridSize;
}

/**
 * Validate ship type
 */
export function validateShipType(type: string): boolean {
  return Object.values(ShipType).includes(type as ShipType);
}

/**
 * Validate ship orientation
 */
export function validateOrientation(orientation: string): boolean {
  return Object.values(Orientation).includes(orientation as Orientation);
}

/**
 * Validate ship placement on the grid
 */
export function validateShipPlacement(
  ship: Ship,
  existingShips: Ship[],
  gridSize = GRID_SIZE
): { valid: boolean; message?: string } {
  // Validate ship type
  if (!validateShipType(ship.type)) {
    return { valid: false, message: 'Invalid ship type' };
  }

  // Validate orientation
  if (!validateOrientation(ship.orientation)) {
    return { valid: false, message: 'Invalid orientation' };
  }

  // Validate position
  if (!validatePosition(ship.position, gridSize)) {
    return { valid: false, message: 'Invalid position' };
  }

  // Check if ship is within grid boundaries
  if (!isShipWithinGrid(ship, gridSize)) {
    return { valid: false, message: 'Ship is out of grid boundaries' };
  }

  // Check if ship overlaps with any existing ships
  if (doesShipOverlapWithAny(ship, existingShips)) {
    return { valid: false, message: 'Ship overlaps with existing ships' };
  }

  // Check if we already have the maximum number of this ship type
  const shipType = ship.type as ShipType;
  const shipsOfThisType = existingShips.filter(s => s.type === shipType).length;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (shipsOfThisType >= (SHIPS_CONFIG as any)[shipType.toUpperCase()].count) {
    return { valid: false, message: `Maximum number of ${shipType} ships reached` };
  }

  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  return { valid: true };
}

/**
 * Validate username
 */
export function validateUsername(username: string): { valid: boolean; message?: string } {
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters long' };
  }

  if (username.length > 20) {
    return { valid: false, message: 'Username must be at most 20 characters long' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      message: 'Username can only contain letters, numbers, underscores, and hyphens',
    };
  }

  return { valid: true };
}

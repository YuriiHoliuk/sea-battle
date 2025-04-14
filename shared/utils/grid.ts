/**
 * Grid Utilities for Sea Battle
 */

import {
  CellState,
  Direction,
  Grid,
  Orientation,
  Position,
  Ship,
  ShipType,
  SHIP_SIZES,
} from '../types/game';
import { GRID_SIZE } from '../constants/game';

// Default empty grid
export const DEFAULT_GRID: Grid = Array(GRID_SIZE)
  .fill(null)
  .map(() => Array(GRID_SIZE).fill(CellState.EMPTY));

/**
 * Checks if a position is valid on the grid
 */
export function isValidPosition(position: Position): boolean {
  return position.x >= 0 && position.x < GRID_SIZE && position.y >= 0 && position.y < GRID_SIZE;
}

/**
 * Checks if a ship can be placed at the specified position and direction
 */
export function canPlaceShip(
  grid: Grid,
  ship: Ship,
  position: Position,
  direction: Direction
): boolean {
  const shipSize = SHIP_SIZES[ship.type];

  // Check if ship fits on the grid
  if (direction === Direction.HORIZONTAL) {
    if (position.x + shipSize > GRID_SIZE) return false;
  } else {
    if (position.y + shipSize > GRID_SIZE) return false;
  }

  // Check if all cells are empty and there's no adjacent ships
  for (let i = -1; i <= shipSize; i++) {
    for (let j = -1; j <= 1; j++) {
      const x = direction === Direction.HORIZONTAL ? position.x + i : position.x + j;
      const y = direction === Direction.HORIZONTAL ? position.y + j : position.y + i;

      // Skip checks outside the grid
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) continue;

      // If there's already a ship in the cell or adjacent cells, return false
      if (i >= 0 && i < shipSize && j === 0) {
        if (grid[y][x] !== CellState.EMPTY) return false;
      } else {
        // Check adjacent cells (diagonal and surrounding)
        if (grid[y][x] === CellState.SHIP) return false;
      }
    }
  }

  return true;
}

/**
 * Places a ship on the grid and returns the updated grid
 */
export function placeShip(grid: Grid, ship: Ship, position: Position, direction: Direction): Grid {
  if (!canPlaceShip(grid, ship, position, direction)) {
    return grid;
  }

  const newGrid = grid.map(row => [...row]);
  const shipSize = SHIP_SIZES[ship.type];

  for (let i = 0; i < shipSize; i++) {
    if (direction === Direction.HORIZONTAL) {
      newGrid[position.y][position.x + i] = CellState.SHIP;
    } else {
      newGrid[position.y + i][position.x] = CellState.SHIP;
    }
  }

  return newGrid;
}

/**
 * Randomly places all ships on the grid
 */
export function autoPlaceShips(ships: Ship[]): { grid: Grid; placedShips: Ship[] } {
  let grid = [...DEFAULT_GRID.map(row => [...row])];
  const placedShips: Ship[] = [];

  for (const ship of ships) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      attempts++;

      // Generate random position and direction
      const position: Position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const direction = Math.random() > 0.5 ? Direction.HORIZONTAL : Direction.VERTICAL;

      if (canPlaceShip(grid, ship, position, direction)) {
        grid = placeShip(grid, ship, position, direction);

        // Update ship with its position
        const updatedShip = {
          ...ship,
          position,
          direction,
          orientation:
            direction === Direction.HORIZONTAL ? Orientation.HORIZONTAL : Orientation.VERTICAL,
        };

        placedShips.push(updatedShip);
        placed = true;
      }
    }

    if (!placed) {
      // If we couldn't place all ships, start over with an empty grid
      return autoPlaceShips(ships);
    }
  }

  return { grid, placedShips };
}

/**
 * Grid utility functions for Sea Battle
 */
import { Orientation, Ship, SHIP_SIZES, ShipType } from '../types/game';
import { GRID_SIZE } from '../constants/game';

/**
 * Check if a position is within the grid boundaries
 */
export function isWithinGrid(position: Position, gridSize = GRID_SIZE): boolean {
  return position.x >= 0 && position.x < gridSize && position.y >= 0 && position.y < gridSize;
}

/**
 * Get all positions occupied by a ship
 */
export function getShipPositions(ship: Ship): Position[] {
  const { position, orientation, type } = ship;
  const shipLength = SHIP_SIZES[type as ShipType];
  const positions: Position[] = [];

  for (let i = 0; i < shipLength; i++) {
    if (orientation === Orientation.HORIZONTAL) {
      positions.push({ x: position.x + i, y: position.y });
    } else {
      positions.push({ x: position.x, y: position.y + i });
    }
  }

  return positions;
}

/**
 * Check if a ship would be within grid boundaries
 */
export function isShipWithinGrid(ship: Ship, gridSize = GRID_SIZE): boolean {
  const positions = getShipPositions(ship);
  return positions.every(pos => isWithinGrid(pos, gridSize));
}

/**
 * Check if ships overlap
 */
export function doShipsOverlap(ship1: Ship, ship2: Ship): boolean {
  const positions1 = getShipPositions(ship1);
  const positions2 = getShipPositions(ship2);

  return positions1.some(pos1 => positions2.some(pos2 => pos1.x === pos2.x && pos1.y === pos2.y));
}

/**
 * Check if ship overlaps with any ship in array
 */
export function doesShipOverlapWithAny(ship: Ship, ships: Ship[]): boolean {
  return ships.some(existingShip => doShipsOverlap(ship, existingShip));
}

/**
 * Check if all ships are placed
 */
export function areAllShipsPlaced(placedShips: Ship[]): boolean {
  const shipCounts: Record<ShipType, number> = {
    [ShipType.CARRIER]: 0,
    [ShipType.BATTLESHIP]: 0,
    [ShipType.CRUISER]: 0,
    [ShipType.SUBMARINE]: 0,
    [ShipType.DESTROYER]: 0,
  };

  placedShips.forEach(ship => {
    shipCounts[ship.type as ShipType]++;
  });

  return (
    shipCounts[ShipType.CARRIER] === 1 &&
    shipCounts[ShipType.BATTLESHIP] === 1 &&
    shipCounts[ShipType.CRUISER] === 1 &&
    shipCounts[ShipType.SUBMARINE] === 1 &&
    shipCounts[ShipType.DESTROYER] === 1
  );
}

/**
 * Check if a position has already been targeted
 */
export function isPositionTargeted(position: Position, shots: Position[]): boolean {
  return shots.some(shot => shot.x === position.x && shot.y === position.y);
}

/**
 * Check if a ship is hit by a shot
 */
export function isShipHitByShot(ship: Ship, shot: Position): boolean {
  const positions = getShipPositions(ship);
  return positions.some(pos => pos.x === shot.x && pos.y === shot.y);
}

/**
 * Format position to human-readable string (e.g. "A5")
 */
export function formatPosition(position: Position): string {
  const letterMapping = 'ABCDEFGHIJ';
  return `${letterMapping[position.x]}${position.y + 1}`;
}

/**
 * Game Helper Utilities for Sea Battle
 */

import { v4 as uuidv4 } from 'uuid';
import {
  CellState,
  Direction,
  Grid,
  Orientation,
  Position,
  Ship,
  ShipType,
  SHIP_SIZES,
  ShotResult,
} from '../types/game';
import { GRID_SIZE } from '../constants/game';

/**
 * Creates a new ship instance with default values
 */
export function createShip(type: ShipType): Ship {
  return {
    id: uuidv4(),
    type,
    position: { x: 0, y: 0 }, // Default position that will be updated
    orientation: Orientation.HORIZONTAL,
    hits: [],
    isSunk: false,
  };
}

/**
 * Creates all ships needed for a game
 */
export function createShips(): Ship[] {
  return [
    createShip(ShipType.CARRIER),
    createShip(ShipType.BATTLESHIP),
    createShip(ShipType.CRUISER),
    createShip(ShipType.SUBMARINE),
    createShip(ShipType.DESTROYER),
  ];
}

/**
 * Creates an empty grid
 */
export function createEmptyGrid(size: number = GRID_SIZE): Grid {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(CellState.EMPTY));
}

/**
 * Checks if a coordinate is within the grid bounds
 */
export function isWithinBounds(pos: Position, gridSize: number = GRID_SIZE): boolean {
  return pos.x >= 0 && pos.x < gridSize && pos.y >= 0 && pos.y < gridSize;
}

/**
 * Processes a shot on the grid and returns the result
 */
export function processShot(
  grid: Grid,
  position: Position,
  ships: Ship[]
): {
  result: ShotResult;
  newGrid: Grid;
  updatedShips: Ship[];
  shipSunk?: Ship;
} {
  if (!isWithinBounds(position)) {
    throw new Error('Shot is outside the grid bounds');
  }

  const newGrid = grid.map(row => [...row]);
  let result: ShotResult = ShotResult.MISS;
  let shipSunk: Ship | undefined;

  // Get the cell state at the shot position
  const cellState = grid[position.y][position.x];

  if (cellState === CellState.EMPTY) {
    // Miss
    newGrid[position.y][position.x] = CellState.MISS;
    result = ShotResult.MISS;
  } else if (cellState === CellState.SHIP) {
    // Hit
    newGrid[position.y][position.x] = CellState.HIT;
    result = ShotResult.HIT;

    // Update the ship that was hit
    const updatedShips = ships.map(ship => {
      // Check if this shot hit this ship
      const isShipHit = isPositionOnShip(ship, position);

      if (isShipHit) {
        // Add hit to the ship
        const newHits = [...ship.hits, { ...position }];
        const shipSize = SHIP_SIZES[ship.type];
        const isSunk = newHits.length >= shipSize;

        const updatedShip = {
          ...ship,
          hits: newHits,
          isSunk,
        };

        // Check if the ship was sunk by this hit
        if (isSunk && !ship.isSunk) {
          result = ShotResult.SUNK;
          shipSunk = updatedShip;
        }

        return updatedShip;
      }

      return ship;
    });

    return { result, newGrid, updatedShips, shipSunk };
  }

  return { result, newGrid, updatedShips: ships };
}

/**
 * Checks if a position is on a given ship
 */
export function isPositionOnShip(ship: Ship, position: Position): boolean {
  const shipSize = SHIP_SIZES[ship.type];

  if (ship.orientation === Orientation.HORIZONTAL) {
    return (
      position.y === ship.position.y &&
      position.x >= ship.position.x &&
      position.x < ship.position.x + shipSize
    );
  } else {
    return (
      position.x === ship.position.x &&
      position.y >= ship.position.y &&
      position.y < ship.position.y + shipSize
    );
  }
}

/**
 * Checks if all ships are sunk
 */
export function areAllShipsSunk(ships: Ship[]): boolean {
  return ships.every(ship => ship.isSunk);
}

/**
 * Converts an Orientation to a Direction (for compatibility)
 */
export function orientationToDirection(orientation: Orientation): Direction {
  return orientation === Orientation.HORIZONTAL ? Direction.HORIZONTAL : Direction.VERTICAL;
}

/**
 * Converts a Direction to an Orientation (for compatibility)
 */
export function directionToOrientation(direction: Direction): Orientation {
  return direction === Direction.HORIZONTAL ? Orientation.HORIZONTAL : Orientation.VERTICAL;
}

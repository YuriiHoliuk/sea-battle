/**
 * Grid utility functions for Sea Battle
 */
import { Position, Orientation, Ship, SHIP_SIZES, ShipType } from '../types/game';
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

  return positions1.some(pos1 => 
    positions2.some(pos2 => pos1.x === pos2.x && pos1.y === pos2.y)
  );
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

  return shipCounts[ShipType.CARRIER] === 1 
    && shipCounts[ShipType.BATTLESHIP] === 1
    && shipCounts[ShipType.CRUISER] === 1
    && shipCounts[ShipType.SUBMARINE] === 1
    && shipCounts[ShipType.DESTROYER] === 1;
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
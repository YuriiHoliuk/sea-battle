import { CellState, Grid as GridType, Position, Ship } from '../../types/game';
import { Ship as ShipClass } from './Ship';

/**
 * Type for validation result including success status and error message
 */
export interface ValidationResult {
  isValid: boolean;
  errorCode?: ShipPlacementErrorCode;
  errorMessage?: string;
}

/**
 * Error codes for ship placement validation failures
 */
export enum ShipPlacementErrorCode {
  OUTSIDE_GRID = 'outside_grid',
  OVERLAPPING = 'overlapping',
  INVALID_ORIENTATION = 'invalid_orientation',
  ALREADY_PLACED = 'already_placed',
  INVALID_POSITION = 'invalid_position',
  ADJACENT_SHIPS = 'adjacent_ships', // Optional rule: ships cannot be adjacent
}

/**
 * Class that provides validation for ship placement with detailed error messages
 */
export class ShipPlacementValidator {
  private grid: GridType;
  private ships: Ship[];
  private size: number;
  private adjacentShipsAllowed: boolean;

  /**
   * Create a new ship placement validator
   *
   * @param grid The grid state
   * @param ships Currently placed ships
   * @param size Grid size (default 10)
   * @param adjacentShipsAllowed Whether ships can be placed adjacent to each other (default true)
   */
  constructor(
    grid: GridType,
    ships: Ship[],
    size: number = 10,
    adjacentShipsAllowed: boolean = true
  ) {
    this.grid = grid;
    this.ships = ships;
    this.size = size;
    this.adjacentShipsAllowed = adjacentShipsAllowed;
  }

  /**
   * Validates a ship placement and returns detailed validation result
   */
  public validateShipPlacement(ship: Ship | ShipClass): ValidationResult {
    // Check for already placed ships of the same type
    if (this.ships.some(s => s.type === ship.type && s.id !== ship.id)) {
      return {
        isValid: false,
        errorCode: ShipPlacementErrorCode.ALREADY_PLACED,
        errorMessage: `A ${ship.type} has already been placed on the grid`,
      };
    }

    // Check if orientation is valid
    if (ship.orientation !== 'horizontal' && ship.orientation !== 'vertical') {
      return {
        isValid: false,
        errorCode: ShipPlacementErrorCode.INVALID_ORIENTATION,
        errorMessage: 'Ship orientation must be horizontal or vertical',
      };
    }

    const positions = this.getShipPositions(ship);

    // Check if all ship positions are within grid boundaries
    const outsidePosition = positions.find(pos => !this.isValidPosition(pos));
    if (outsidePosition) {
      return {
        isValid: false,
        errorCode: ShipPlacementErrorCode.OUTSIDE_GRID,
        errorMessage: `Ship placement at (${ship.position.x}, ${ship.position.y}) would place part of the ship outside the grid`,
      };
    }

    // Check if ship overlaps with existing ships
    const overlappingPosition = positions.find(pos => this.grid[pos.y][pos.x] === CellState.SHIP);
    if (overlappingPosition) {
      return {
        isValid: false,
        errorCode: ShipPlacementErrorCode.OVERLAPPING,
        errorMessage: `Ship overlaps with another ship at position (${overlappingPosition.x}, ${overlappingPosition.y})`,
      };
    }

    // Check if ship is adjacent to other ships (if adjacentShipsAllowed is false)
    if (!this.adjacentShipsAllowed) {
      const adjacentToOtherShip = positions.some(pos => this.hasAdjacentShip(pos));
      if (adjacentToOtherShip) {
        return {
          isValid: false,
          errorCode: ShipPlacementErrorCode.ADJACENT_SHIPS,
          errorMessage:
            'Ship is adjacent to another ship. Ships must have at least one cell spacing between them',
        };
      }
    }

    // All checks passed
    return { isValid: true };
  }

  /**
   * Gets all positions occupied by a ship
   */
  private getShipPositions(ship: Ship | ShipClass): Position[] {
    const { position, orientation } = ship;
    const shipSize = this.getShipSize(ship);
    const positions: Position[] = [];

    for (let i = 0; i < shipSize; i++) {
      if (orientation === 'horizontal') {
        positions.push({ x: position.x + i, y: position.y });
      } else {
        positions.push({ x: position.x, y: position.y + i });
      }
    }

    return positions;
  }

  /**
   * Gets the size of a ship based on its type
   */
  private getShipSize(ship: Ship | ShipClass): number {
    const shipSizes = {
      carrier: 5,
      battleship: 4,
      cruiser: 3,
      submarine: 3,
      destroyer: 2,
    };

    return shipSizes[ship.type];
  }

  /**
   * Checks if a position is within grid boundaries
   */
  private isValidPosition(position: Position): boolean {
    return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
  }

  /**
   * Checks if a position has an adjacent ship
   * This includes diagonally adjacent positions
   */
  private hasAdjacentShip(position: Position): boolean {
    const adjacentPositions = [
      { x: position.x - 1, y: position.y }, // Left
      { x: position.x + 1, y: position.y }, // Right
      { x: position.x, y: position.y - 1 }, // Up
      { x: position.x, y: position.y + 1 }, // Down
      { x: position.x - 1, y: position.y - 1 }, // Diagonal up-left
      { x: position.x + 1, y: position.y - 1 }, // Diagonal up-right
      { x: position.x - 1, y: position.y + 1 }, // Diagonal down-left
      { x: position.x + 1, y: position.y + 1 }, // Diagonal down-right
    ];

    return adjacentPositions.some(
      pos => this.isValidPosition(pos) && this.grid[pos.y][pos.x] === CellState.SHIP
    );
  }
}

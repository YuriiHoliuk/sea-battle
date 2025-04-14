import { CellState, Grid as GridType, Position, Ship } from '../../types/game';

/**
 * Grid class representing the 10x10 game board
 */
export class Grid {
  private grid: GridType;
  private ships: Ship[] = [];
  private readonly size: number;

  /**
   * Creates a new grid with optional custom size (default 10x10)
   */
  constructor(size: number = 10) {
    this.size = size;
    this.grid = this.createEmptyGrid();
  }

  /**
   * Creates an empty grid filled with EMPTY cell state
   */
  private createEmptyGrid(): GridType {
    return Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(CellState.EMPTY));
  }

  /**
   * Gets the current state of the grid
   */
  public getGrid(): GridType {
    return this.grid;
  }

  /**
   * Gets the ships placed on the grid
   */
  public getShips(): Ship[] {
    return [...this.ships];
  }

  /**
   * Gets the cell state at a specific position
   */
  public getCellState(position: Position): CellState {
    if (!this.isValidPosition(position)) {
      throw new Error('Invalid position');
    }

    return this.grid[position.y][position.x];
  }

  /**
   * Sets the cell state at a specific position
   */
  public setCellState(position: Position, state: CellState): void {
    if (!this.isValidPosition(position)) {
      throw new Error('Invalid position');
    }

    this.grid[position.y][position.x] = state;
  }

  /**
   * Checks if a position is valid (within grid boundaries)
   */
  public isValidPosition(position: Position): boolean {
    return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
  }

  /**
   * Places a ship on the grid if the position is valid
   */
  public placeShip(ship: Ship): boolean {
    if (!this.isValidShipPlacement(ship)) {
      return false;
    }

    // Add the ship to the ships list
    this.ships.push({ ...ship });

    // Mark the grid cells as occupied by a ship
    const positions = this.getShipPositions(ship);
    positions.forEach(pos => {
      this.grid[pos.y][pos.x] = CellState.SHIP;
    });

    return true;
  }

  /**
   * Validates if a ship placement is valid (within boundaries and not overlapping)
   */
  public isValidShipPlacement(ship: Ship): boolean {
    const positions = this.getShipPositions(ship);

    // Check if all positions are valid and not occupied
    return positions.every(
      pos => this.isValidPosition(pos) && this.grid[pos.y][pos.x] === CellState.EMPTY
    );
  }

  /**
   * Gets all positions occupied by a ship based on its position, orientation, and type
   */
  private getShipPositions(ship: Ship): Position[] {
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
  private getShipSize(ship: Ship): number {
    // This would use the SHIP_SIZES from the game.ts types
    // For simplicity, get the size directly from the ship's hits array max length
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
   * Records a shot at the given position and returns the result
   */
  public receiveShot(position: Position): CellState {
    if (!this.isValidPosition(position)) {
      throw new Error('Invalid position');
    }

    // Get current cell state
    const currentState = this.grid[position.y][position.x];

    // If it's already been hit, return the current state
    if (currentState === CellState.HIT || currentState === CellState.MISS) {
      return currentState;
    }

    // Update cell state based on whether there's a ship
    if (currentState === CellState.SHIP) {
      this.grid[position.y][position.x] = CellState.HIT;

      // Update the ship's hits
      const hitShip = this.ships.find(ship =>
        this.getShipPositions(ship).some(pos => pos.x === position.x && pos.y === position.y)
      );

      if (hitShip) {
        hitShip.hits.push({ ...position });

        // Check if ship is sunk
        const shipPositions = this.getShipPositions(hitShip);
        if (shipPositions.every(pos => this.grid[pos.y][pos.x] === CellState.HIT)) {
          hitShip.isSunk = true;
        }
      }

      return CellState.HIT;
    } else {
      this.grid[position.y][position.x] = CellState.MISS;
      return CellState.MISS;
    }
  }

  /**
   * Checks if all ships on the grid are sunk
   */
  public areAllShipsSunk(): boolean {
    return this.ships.length > 0 && this.ships.every(ship => ship.isSunk);
  }

  /**
   * Resets the grid to empty state
   */
  public reset(): void {
    this.grid = this.createEmptyGrid();
    this.ships = [];
  }
}

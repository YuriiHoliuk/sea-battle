import { Grid } from '@sea-battle/shared/src/game/Grid';
import { Ship } from '@sea-battle/shared/src/game/Ship';
import { Position, ShipType, Orientation } from '@sea-battle/shared/types/game';

/**
 * Service for validating ship placements and communicating with the server
 */
export class ShipPlacementService {
  /**
   * Validates a ship placement without modifying the grid
   *
   * @param grid Current game grid
   * @param ship Ship to validate
   * @returns A tuple containing [isValid, errorMessage]
   */
  public static validateShipPlacement(grid: Grid, ship: Ship): [boolean, string | null] {
    // Create a clone of the grid for validation
    const validationGrid = new Grid();

    // Add all existing ships to the validation grid
    grid.getShips().forEach(existingShip => {
      if (existingShip.id !== ship.id) {
        validationGrid.placeShip(existingShip);
      }
    });

    // Attempt to place the ship
    const isValid = validationGrid.placeShip(ship);

    // Get error message if placement failed
    const errorMessage = isValid
      ? null
      : validationGrid.getLastPlacementResult()?.errorMessage || 'Invalid placement';

    return [isValid, errorMessage];
  }

  /**
   * Sends the ship placement to the server
   *
   * @param gameId Game ID
   * @param ships Array of ships to send to the server
   * @returns Promise that resolves when ships are successfully placed
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static async sendShipPlacementToServer(gameId: string, ships: Ship[]): Promise<boolean> {
    try {
      // TODO: Implement actual API call
      console.warn('Sending ship placement to server - API call pending implementation');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('Error sending ship placement to server', error);
      return false;
    }
  }

  /**
   * Auto-places ships on the grid
   *
   * @param gridSize Size of the grid (default 10)
   * @returns A grid with ships auto-placed
   */
  public static autoPlaceShips(gridSize: number = 10): Grid {
    const grid = new Grid(gridSize);
    const shipTypes = Object.values(ShipType);

    // Try to place each ship type
    shipTypes.forEach(shipType => {
      let placed = false;
      let maxAttempts = 100;

      while (!placed && maxAttempts > 0) {
        const orientation = Math.random() > 0.5 ? Orientation.HORIZONTAL : Orientation.VERTICAL;
        const position: Position = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        };

        // Create ship
        const ship = new Ship(shipType, position, orientation);

        // Try to place the ship
        placed = grid.placeShip(ship);
        maxAttempts--;
      }
    });

    return grid;
  }
}

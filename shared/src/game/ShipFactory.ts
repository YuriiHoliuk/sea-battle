import { Orientation, Position, ShipType } from '../../types/game';
import { Ship } from './Ship';

/**
 * Factory class for creating different types of ships
 */
export class ShipFactory {
  /**
   * Creates a Carrier ship (length 5)
   */
  public static createCarrier(
    position: Position,
    orientation: Orientation = Orientation.HORIZONTAL
  ): Ship {
    return new Ship(ShipType.CARRIER, position, orientation);
  }

  /**
   * Creates a Battleship (length 4)
   */
  public static createBattleship(
    position: Position,
    orientation: Orientation = Orientation.HORIZONTAL
  ): Ship {
    return new Ship(ShipType.BATTLESHIP, position, orientation);
  }

  /**
   * Creates a Cruiser (length 3)
   */
  public static createCruiser(
    position: Position,
    orientation: Orientation = Orientation.HORIZONTAL
  ): Ship {
    return new Ship(ShipType.CRUISER, position, orientation);
  }

  /**
   * Creates a Submarine (length 3)
   */
  public static createSubmarine(
    position: Position,
    orientation: Orientation = Orientation.HORIZONTAL
  ): Ship {
    return new Ship(ShipType.SUBMARINE, position, orientation);
  }

  /**
   * Creates a Destroyer (length 2)
   */
  public static createDestroyer(
    position: Position,
    orientation: Orientation = Orientation.HORIZONTAL
  ): Ship {
    return new Ship(ShipType.DESTROYER, position, orientation);
  }

  /**
   * Creates a full set of ships for a player at default positions
   * Note: These positions will likely need to be adjusted before actual gameplay
   */
  public static createDefaultFleet(): Ship[] {
    return [
      this.createCarrier({ x: 0, y: 0 }),
      this.createBattleship({ x: 0, y: 1 }),
      this.createCruiser({ x: 0, y: 2 }),
      this.createSubmarine({ x: 0, y: 3 }),
      this.createDestroyer({ x: 0, y: 4 }),
    ];
  }
}

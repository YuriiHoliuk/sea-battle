import { v4 as uuidv4 } from 'uuid';
import {
  Orientation,
  Position,
  Ship as ShipInterface,
  ShipType,
  SHIP_SIZES,
} from '../../types/game';

/**
 * Ship class representing a ship on the game board
 */
export class Ship implements ShipInterface {
  public id: string;
  public type: ShipType;
  public position: Position;
  public orientation: Orientation;
  public hits: Position[];
  public isSunk: boolean;

  /**
   * Creates a new ship
   */
  constructor(
    type: ShipType,
    position: Position,
    orientation: Orientation = Orientation.HORIZONTAL
  ) {
    this.id = uuidv4();
    this.type = type;
    this.position = { ...position };
    this.orientation = orientation;
    this.hits = [];
    this.isSunk = false;
  }

  /**
   * Gets the size of the ship based on its type
   */
  public getSize(): number {
    return SHIP_SIZES[this.type];
  }

  /**
   * Gets all positions occupied by the ship
   */
  public getOccupiedPositions(): Position[] {
    const positions: Position[] = [];
    const size = this.getSize();

    for (let i = 0; i < size; i++) {
      if (this.orientation === Orientation.HORIZONTAL) {
        positions.push({ x: this.position.x + i, y: this.position.y });
      } else {
        positions.push({ x: this.position.x, y: this.position.y + i });
      }
    }

    return positions;
  }

  /**
   * Rotates the ship between horizontal and vertical orientations
   */
  public rotate(): void {
    this.orientation =
      this.orientation === Orientation.HORIZONTAL ? Orientation.VERTICAL : Orientation.HORIZONTAL;
  }

  /**
   * Registers a hit at the given position
   * Returns true if the hit was successful (position is part of the ship)
   */
  public registerHit(position: Position): boolean {
    // Check if the position is part of the ship
    const isPartOfShip = this.getOccupiedPositions().some(
      pos => pos.x === position.x && pos.y === position.y
    );

    if (!isPartOfShip) {
      return false;
    }

    // Check if already hit at this position
    const alreadyHit = this.hits.some(hit => hit.x === position.x && hit.y === position.y);

    if (!alreadyHit) {
      this.hits.push({ ...position });
      this.checkIfSunk();
    }

    return true;
  }

  /**
   * Checks if the ship is sunk (all positions hit)
   */
  private checkIfSunk(): void {
    const occupiedPositions = this.getOccupiedPositions();
    this.isSunk = occupiedPositions.every(position =>
      this.hits.some(hit => hit.x === position.x && hit.y === position.y)
    );
  }

  /**
   * Moves the ship to a new position
   */
  public moveTo(position: Position): void {
    this.position = { ...position };
  }

  /**
   * Creates a serializable representation of the ship
   */
  public toJSON(): ShipInterface {
    return {
      id: this.id,
      type: this.type,
      position: { ...this.position },
      orientation: this.orientation,
      hits: [...this.hits],
      isSunk: this.isSunk,
    };
  }

  /**
   * Creates a ship from a serialized representation
   */
  public static fromJSON(data: ShipInterface): Ship {
    const ship = new Ship(data.type, data.position, data.orientation);
    ship.id = data.id;
    ship.hits = [...data.hits];
    ship.isSunk = data.isSunk;
    return ship;
  }
}

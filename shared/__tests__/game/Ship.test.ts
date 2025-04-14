import { Orientation, ShipType } from '../../types/game';
import { Ship } from '../../src/game/Ship';

describe('Ship', () => {
  test('should create ship with default horizontal orientation', () => {
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 4 });

    expect(ship.type).toBe(ShipType.DESTROYER);
    expect(ship.position).toEqual({ x: 3, y: 4 });
    expect(ship.orientation).toBe(Orientation.HORIZONTAL);
    expect(ship.hits).toEqual([]);
    expect(ship.isSunk).toBe(false);
    expect(ship.id).toBeDefined();
  });

  test('should create ship with specified orientation', () => {
    const ship = new Ship(ShipType.CRUISER, { x: 2, y: 3 }, Orientation.VERTICAL);

    expect(ship.type).toBe(ShipType.CRUISER);
    expect(ship.position).toEqual({ x: 2, y: 3 });
    expect(ship.orientation).toBe(Orientation.VERTICAL);
  });

  test('should get correct ship size', () => {
    const carrier = new Ship(ShipType.CARRIER, { x: 0, y: 0 });
    const battleship = new Ship(ShipType.BATTLESHIP, { x: 0, y: 0 });
    const cruiser = new Ship(ShipType.CRUISER, { x: 0, y: 0 });
    const submarine = new Ship(ShipType.SUBMARINE, { x: 0, y: 0 });
    const destroyer = new Ship(ShipType.DESTROYER, { x: 0, y: 0 });

    expect(carrier.getSize()).toBe(5);
    expect(battleship.getSize()).toBe(4);
    expect(cruiser.getSize()).toBe(3);
    expect(submarine.getSize()).toBe(3);
    expect(destroyer.getSize()).toBe(2);
  });

  test('should get correct occupied positions for horizontal ship', () => {
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 4 }, Orientation.HORIZONTAL);
    const positions = ship.getOccupiedPositions();

    expect(positions).toHaveLength(2);
    expect(positions).toContainEqual({ x: 3, y: 4 });
    expect(positions).toContainEqual({ x: 4, y: 4 });
  });

  test('should get correct occupied positions for vertical ship', () => {
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 4 }, Orientation.VERTICAL);
    const positions = ship.getOccupiedPositions();

    expect(positions).toHaveLength(2);
    expect(positions).toContainEqual({ x: 3, y: 4 });
    expect(positions).toContainEqual({ x: 3, y: 5 });
  });

  test('should rotate ship correctly', () => {
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 4 }, Orientation.HORIZONTAL);

    // Initial positions
    const initialPositions = ship.getOccupiedPositions();
    expect(initialPositions).toContainEqual({ x: 3, y: 4 });
    expect(initialPositions).toContainEqual({ x: 4, y: 4 });

    // Rotate to vertical
    ship.rotate();
    expect(ship.orientation).toBe(Orientation.VERTICAL);

    const verticalPositions = ship.getOccupiedPositions();
    expect(verticalPositions).toContainEqual({ x: 3, y: 4 });
    expect(verticalPositions).toContainEqual({ x: 3, y: 5 });

    // Rotate back to horizontal
    ship.rotate();
    expect(ship.orientation).toBe(Orientation.HORIZONTAL);

    const finalPositions = ship.getOccupiedPositions();
    expect(finalPositions).toEqual(initialPositions);
  });

  test('should register hits correctly', () => {
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 4 }, Orientation.HORIZONTAL);

    // Hit on the ship
    const hitResult1 = ship.registerHit({ x: 3, y: 4 });
    expect(hitResult1).toBe(true);
    expect(ship.hits).toHaveLength(1);
    expect(ship.hits[0]).toEqual({ x: 3, y: 4 });
    expect(ship.isSunk).toBe(false);

    // Miss (position not on ship)
    const hitResult2 = ship.registerHit({ x: 5, y: 4 });
    expect(hitResult2).toBe(false);
    expect(ship.hits).toHaveLength(1);

    // Hit again on the same spot (should not add a new hit)
    const hitResult3 = ship.registerHit({ x: 3, y: 4 });
    expect(hitResult3).toBe(true);
    expect(ship.hits).toHaveLength(1);

    // Hit on the other part of the ship
    const hitResult4 = ship.registerHit({ x: 4, y: 4 });
    expect(hitResult4).toBe(true);
    expect(ship.hits).toHaveLength(2);
    expect(ship.isSunk).toBe(true); // Destroyer has 2 segments, both hit now
  });

  test('should update sunk status when all positions are hit', () => {
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 4 }, Orientation.HORIZONTAL);

    expect(ship.isSunk).toBe(false);

    // Hit first position
    ship.registerHit({ x: 3, y: 4 });
    expect(ship.isSunk).toBe(false);

    // Hit second position
    ship.registerHit({ x: 4, y: 4 });
    expect(ship.isSunk).toBe(true);
  });

  test('should move ship to new position', () => {
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 4 }, Orientation.HORIZONTAL);

    ship.moveTo({ x: 5, y: 6 });
    expect(ship.position).toEqual({ x: 5, y: 6 });

    // Check that the occupied positions have updated
    const positions = ship.getOccupiedPositions();
    expect(positions).toContainEqual({ x: 5, y: 6 });
    expect(positions).toContainEqual({ x: 6, y: 6 });
  });

  test('should serialize to JSON correctly', () => {
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 4 }, Orientation.HORIZONTAL);
    ship.registerHit({ x: 3, y: 4 });

    const json = ship.toJSON();

    expect(json.id).toBe(ship.id);
    expect(json.type).toBe(ShipType.DESTROYER);
    expect(json.position).toEqual({ x: 3, y: 4 });
    expect(json.orientation).toBe(Orientation.HORIZONTAL);
    expect(json.hits).toEqual([{ x: 3, y: 4 }]);
    expect(json.isSunk).toBe(false);
  });

  test('should deserialize from JSON correctly', () => {
    const originalShip = new Ship(ShipType.DESTROYER, { x: 3, y: 4 }, Orientation.HORIZONTAL);
    originalShip.registerHit({ x: 3, y: 4 });

    const json = originalShip.toJSON();
    const deserializedShip = Ship.fromJSON(json);

    expect(deserializedShip.id).toBe(originalShip.id);
    expect(deserializedShip.type).toBe(originalShip.type);
    expect(deserializedShip.position).toEqual(originalShip.position);
    expect(deserializedShip.orientation).toBe(originalShip.orientation);
    expect(deserializedShip.hits).toEqual(originalShip.hits);
    expect(deserializedShip.isSunk).toBe(originalShip.isSunk);
  });

  test('should rotate the ship between horizontal and vertical orientations', () => {
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 3 }, Orientation.HORIZONTAL);

    // Initially horizontal
    expect(ship.orientation).toBe(Orientation.HORIZONTAL);

    // Occupied positions should be horizontal (x changes, y stays the same)
    let positions = ship.getOccupiedPositions();
    expect(positions).toEqual([
      { x: 3, y: 3 },
      { x: 4, y: 3 },
    ]);

    // Rotate to vertical
    ship.rotate();
    expect(ship.orientation).toBe(Orientation.VERTICAL);

    // Occupied positions should now be vertical (x stays the same, y changes)
    positions = ship.getOccupiedPositions();
    expect(positions).toEqual([
      { x: 3, y: 3 },
      { x: 3, y: 4 },
    ]);

    // Rotate back to horizontal
    ship.rotate();
    expect(ship.orientation).toBe(Orientation.HORIZONTAL);
  });

  test('should update occupied positions after rotation', () => {
    const ship = new Ship(ShipType.CARRIER, { x: 2, y: 2 }, Orientation.HORIZONTAL);

    // Initially horizontal
    let positions = ship.getOccupiedPositions();
    expect(positions).toEqual([
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 6, y: 2 },
    ]);

    // Rotate to vertical
    ship.rotate();

    // Now positions should be vertical
    positions = ship.getOccupiedPositions();
    expect(positions).toEqual([
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
      { x: 2, y: 5 },
      { x: 2, y: 6 },
    ]);
  });

  test('should integrate with hit tracking when rotated', () => {
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 3 }, Orientation.HORIZONTAL);

    // Register hit on horizontal position
    ship.registerHit({ x: 3, y: 3 });
    expect(ship.hits).toEqual([{ x: 3, y: 3 }]);
    expect(ship.isSunk).toBe(false);

    // Rotate ship
    ship.rotate();

    // Hit should still be registered and positions updated
    expect(ship.hits).toEqual([{ x: 3, y: 3 }]);

    // Register hit on new vertical position
    ship.registerHit({ x: 3, y: 4 });
    expect(ship.hits).toEqual([
      { x: 3, y: 3 },
      { x: 3, y: 4 },
    ]);
    expect(ship.isSunk).toBe(true); // Ship should now be sunk
  });
});

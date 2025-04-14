import { Orientation, ShipType } from '../../types/game';
import { ShipFactory } from '../../src/game/ShipFactory';

describe('ShipFactory', () => {
  test('should create Carrier correctly', () => {
    const position = { x: 2, y: 3 };
    const ship = ShipFactory.createCarrier(position);

    expect(ship.type).toBe(ShipType.CARRIER);
    expect(ship.position).toEqual(position);
    expect(ship.orientation).toBe(Orientation.HORIZONTAL);
    expect(ship.getSize()).toBe(5);
  });

  test('should create Battleship correctly', () => {
    const position = { x: 2, y: 3 };
    const ship = ShipFactory.createBattleship(position);

    expect(ship.type).toBe(ShipType.BATTLESHIP);
    expect(ship.position).toEqual(position);
    expect(ship.orientation).toBe(Orientation.HORIZONTAL);
    expect(ship.getSize()).toBe(4);
  });

  test('should create Cruiser correctly', () => {
    const position = { x: 2, y: 3 };
    const ship = ShipFactory.createCruiser(position);

    expect(ship.type).toBe(ShipType.CRUISER);
    expect(ship.position).toEqual(position);
    expect(ship.orientation).toBe(Orientation.HORIZONTAL);
    expect(ship.getSize()).toBe(3);
  });

  test('should create Submarine correctly', () => {
    const position = { x: 2, y: 3 };
    const ship = ShipFactory.createSubmarine(position);

    expect(ship.type).toBe(ShipType.SUBMARINE);
    expect(ship.position).toEqual(position);
    expect(ship.orientation).toBe(Orientation.HORIZONTAL);
    expect(ship.getSize()).toBe(3);
  });

  test('should create Destroyer correctly', () => {
    const position = { x: 2, y: 3 };
    const ship = ShipFactory.createDestroyer(position);

    expect(ship.type).toBe(ShipType.DESTROYER);
    expect(ship.position).toEqual(position);
    expect(ship.orientation).toBe(Orientation.HORIZONTAL);
    expect(ship.getSize()).toBe(2);
  });

  test('should create ship with specified orientation', () => {
    const position = { x: 2, y: 3 };
    const ship = ShipFactory.createCarrier(position, Orientation.VERTICAL);

    expect(ship.type).toBe(ShipType.CARRIER);
    expect(ship.position).toEqual(position);
    expect(ship.orientation).toBe(Orientation.VERTICAL);
  });

  test('should create default fleet with all ship types', () => {
    const fleet = ShipFactory.createDefaultFleet();

    expect(fleet).toHaveLength(5);

    // Check that all ship types are present
    const shipTypes = fleet.map(ship => ship.type);
    expect(shipTypes).toContain(ShipType.CARRIER);
    expect(shipTypes).toContain(ShipType.BATTLESHIP);
    expect(shipTypes).toContain(ShipType.CRUISER);
    expect(shipTypes).toContain(ShipType.SUBMARINE);
    expect(shipTypes).toContain(ShipType.DESTROYER);

    // Check default positions
    expect(fleet.find(ship => ship.type === ShipType.CARRIER)?.position).toEqual({ x: 0, y: 0 });
    expect(fleet.find(ship => ship.type === ShipType.BATTLESHIP)?.position).toEqual({ x: 0, y: 1 });
    expect(fleet.find(ship => ship.type === ShipType.CRUISER)?.position).toEqual({ x: 0, y: 2 });
    expect(fleet.find(ship => ship.type === ShipType.SUBMARINE)?.position).toEqual({ x: 0, y: 3 });
    expect(fleet.find(ship => ship.type === ShipType.DESTROYER)?.position).toEqual({ x: 0, y: 4 });
  });
});

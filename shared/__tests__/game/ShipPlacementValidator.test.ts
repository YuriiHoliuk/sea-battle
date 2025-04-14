import {
  ShipPlacementValidator,
  ShipPlacementErrorCode,
} from '../../src/game/ShipPlacementValidator';
import { CellState, ShipType, Orientation } from '../../types/game';
import { Ship } from '../../src/game/Ship';

describe('ShipPlacementValidator', () => {
  // Create empty 10x10 grid for testing
  const createEmptyGrid = (size = 10) => {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill(CellState.EMPTY));
  };

  // Create a basic ship object
  const createShip = (
    type = ShipType.DESTROYER,
    x = 0,
    y = 0,
    orientation = Orientation.HORIZONTAL
  ) => {
    const ship = new Ship(type, { x, y }, orientation);
    return ship;
  };

  describe('validateShipPlacement', () => {
    it('should return valid result for valid placement', () => {
      const grid = createEmptyGrid();
      const ships: Ship[] = [];
      const validator = new ShipPlacementValidator(grid, ships, 10, true);
      const ship = createShip(ShipType.DESTROYER, 0, 0, Orientation.HORIZONTAL);

      const result = validator.validateShipPlacement(ship);

      expect(result.isValid).toBe(true);
      expect(result.errorCode).toBeUndefined();
      expect(result.errorMessage).toBeUndefined();
    });

    it('should return invalid result for placement outside grid (horizontal)', () => {
      const grid = createEmptyGrid();
      const ships: Ship[] = [];
      const validator = new ShipPlacementValidator(grid, ships, 10, true);
      const ship = createShip(ShipType.DESTROYER, 9, 0, Orientation.HORIZONTAL);

      const result = validator.validateShipPlacement(ship);

      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ShipPlacementErrorCode.OUTSIDE_GRID);
      expect(result.errorMessage).toBeDefined();
    });

    it('should return invalid result for placement outside grid (vertical)', () => {
      const grid = createEmptyGrid();
      const ships: Ship[] = [];
      const validator = new ShipPlacementValidator(grid, ships, 10, true);
      const ship = createShip(ShipType.DESTROYER, 0, 9, Orientation.VERTICAL);

      const result = validator.validateShipPlacement(ship);

      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ShipPlacementErrorCode.OUTSIDE_GRID);
      expect(result.errorMessage).toBeDefined();
    });

    it('should return invalid result for overlapping ships', () => {
      const grid = createEmptyGrid();
      const existingShip = createShip(ShipType.BATTLESHIP, 2, 2, Orientation.HORIZONTAL);

      // Update grid to reflect existing ship
      grid[2][2] = CellState.SHIP;
      grid[2][3] = CellState.SHIP;
      grid[2][4] = CellState.SHIP;
      grid[2][5] = CellState.SHIP;

      const ships = [existingShip];
      const validator = new ShipPlacementValidator(grid, ships, 10, true);

      // Try to place ship overlapping at [2,2] but with a different type
      const ship = createShip(ShipType.DESTROYER, 1, 2, Orientation.HORIZONTAL);

      const result = validator.validateShipPlacement(ship);

      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ShipPlacementErrorCode.OVERLAPPING);
      expect(result.errorMessage).toBeDefined();
    });

    it('should return invalid result for invalid orientation', () => {
      const grid = createEmptyGrid();
      const ships: Ship[] = [];
      const validator = new ShipPlacementValidator(grid, ships, 10, true);

      // Create a ship with incorrect orientation
      const ship = createShip(ShipType.DESTROYER, 0, 0);
      // @ts-expect-error - Testing invalid orientation
      ship.orientation = 'diagonal';

      const result = validator.validateShipPlacement(ship);

      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ShipPlacementErrorCode.INVALID_ORIENTATION);
      expect(result.errorMessage).toBeDefined();
    });

    it('should return invalid result for already placed ship', () => {
      const grid = createEmptyGrid();
      const existingShip = createShip(ShipType.DESTROYER, 0, 0, Orientation.HORIZONTAL);
      const ships = [existingShip];
      const validator = new ShipPlacementValidator(grid, ships, 10, true);

      // Try to place a ship with the same type but at a different position
      const sameTypeShip = createShip(ShipType.DESTROYER, 5, 5, Orientation.HORIZONTAL);

      const result = validator.validateShipPlacement(sameTypeShip);

      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ShipPlacementErrorCode.ALREADY_PLACED);
      expect(result.errorMessage).toBeDefined();
    });

    it('should return invalid result for invalid position', () => {
      const grid = createEmptyGrid();
      const ships: Ship[] = [];
      const validator = new ShipPlacementValidator(grid, ships, 10, true);

      // Create ship with invalid position
      const ship = createShip(ShipType.DESTROYER, -1, 0, Orientation.HORIZONTAL);

      const result = validator.validateShipPlacement(ship);

      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ShipPlacementErrorCode.OUTSIDE_GRID);
      expect(result.errorMessage).toBeDefined();
    });

    it('should return invalid result for adjacent ships when not allowed', () => {
      const grid = createEmptyGrid();
      const existingShip = createShip(ShipType.CARRIER, 0, 0, Orientation.HORIZONTAL);

      // Update grid to reflect existing ship
      grid[0][0] = CellState.SHIP;
      grid[0][1] = CellState.SHIP;
      grid[0][2] = CellState.SHIP;
      grid[0][3] = CellState.SHIP;
      grid[0][4] = CellState.SHIP;

      const ships = [existingShip];
      const validator = new ShipPlacementValidator(grid, ships, 10, false); // Adjacent ships NOT allowed

      // Try to place ship adjacent to existing one with a different type
      const ship = createShip(ShipType.DESTROYER, 0, 1, Orientation.HORIZONTAL);

      const result = validator.validateShipPlacement(ship);

      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(ShipPlacementErrorCode.ADJACENT_SHIPS);
      expect(result.errorMessage).toBeDefined();
    });

    it('should allow adjacent ships when adjacentShipsAllowed is true', () => {
      const grid = createEmptyGrid();
      const existingShip = createShip(ShipType.CARRIER, 0, 0, Orientation.HORIZONTAL);

      // Update grid to reflect existing ship
      grid[0][0] = CellState.SHIP;
      grid[0][1] = CellState.SHIP;
      grid[0][2] = CellState.SHIP;
      grid[0][3] = CellState.SHIP;
      grid[0][4] = CellState.SHIP;

      const ships = [existingShip];
      const validator = new ShipPlacementValidator(grid, ships, 10, true); // Adjacent ships allowed

      // Try to place ship adjacent to existing one with a different type
      const ship = createShip(ShipType.DESTROYER, 0, 1, Orientation.HORIZONTAL);

      const result = validator.validateShipPlacement(ship);

      expect(result.isValid).toBe(true);
      expect(result.errorCode).toBeUndefined();
      expect(result.errorMessage).toBeUndefined();
    });

    it('should validate all ship types properly', () => {
      // Test all ship types
      const shipTypes = [
        { type: ShipType.CARRIER, size: 5 },
        { type: ShipType.BATTLESHIP, size: 4 },
        { type: ShipType.CRUISER, size: 3 },
        { type: ShipType.SUBMARINE, size: 3 },
        { type: ShipType.DESTROYER, size: 2 },
      ];

      shipTypes.forEach(({ type, size }) => {
        // Create clean validator for each test to avoid "already placed" errors
        const freshGrid = createEmptyGrid();
        const freshValidator = new ShipPlacementValidator(freshGrid, [], 10, true);

        // Test horizontal placement at edge
        const horizontalShip = createShip(type, 10 - size, 0, Orientation.HORIZONTAL);
        const horizontalResult = freshValidator.validateShipPlacement(horizontalShip);
        expect(horizontalResult.isValid).toBe(true);

        // Test vertical placement at edge
        const verticalShip = createShip(type, 0, 10 - size, Orientation.VERTICAL);
        const verticalResult = freshValidator.validateShipPlacement(verticalShip);
        expect(verticalResult.isValid).toBe(true);

        // Test invalid horizontal placement (outside grid)
        const invalidHorizontalShip = createShip(type, 10 - size + 1, 0, Orientation.HORIZONTAL);
        const invalidHorizontalResult = freshValidator.validateShipPlacement(invalidHorizontalShip);
        expect(invalidHorizontalResult.isValid).toBe(false);

        // Test invalid vertical placement (outside grid)
        const invalidVerticalShip = createShip(type, 0, 10 - size + 1, Orientation.VERTICAL);
        const invalidVerticalResult = freshValidator.validateShipPlacement(invalidVerticalShip);
        expect(invalidVerticalResult.isValid).toBe(false);
      });
    });
  });
});

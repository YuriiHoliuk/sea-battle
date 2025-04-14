import { CellState, Orientation, ShipType, Position } from '../../types/game';
import { Grid } from '../../src/game/Grid';
import { Ship } from '../../src/game/Ship';
import { ShipPlacementErrorCode } from '../../src/game/ShipPlacementValidator';

describe('Grid', () => {
  let grid: Grid;

  // Helper function to create a ship
  const createShip = (
    id: string,
    type: ShipType,
    position: Position,
    orientation: Orientation
  ): Ship => {
    const ship = new Ship(type, position, orientation);
    // Override the auto-generated ID for testing
    Object.defineProperty(ship, 'id', { value: id });
    return ship;
  };

  beforeEach(() => {
    // Create a fresh grid before each test
    grid = new Grid(10);
  });

  test('should create a 10x10 grid by default', () => {
    const gridState = grid.getGrid();
    expect(gridState.length).toBe(10); // 10 rows
    expect(gridState[0].length).toBe(10); // 10 columns
  });

  test('should create a grid with custom size', () => {
    const customGrid = new Grid(8);
    const gridState = customGrid.getGrid();
    expect(gridState.length).toBe(8);
    expect(gridState[0].length).toBe(8);
  });

  test('should initialize all cells as empty', () => {
    const gridState = grid.getGrid();
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        expect(gridState[y][x]).toBe(CellState.EMPTY);
      }
    }
  });

  test('should get and set cell state correctly', () => {
    const position = { x: 5, y: 5 };

    // Test get initial state
    expect(grid.getCellState(position)).toBe(CellState.EMPTY);

    // Test set state
    grid.setCellState(position, CellState.SHIP);
    expect(grid.getCellState(position)).toBe(CellState.SHIP);

    // Test another state
    grid.setCellState(position, CellState.HIT);
    expect(grid.getCellState(position)).toBe(CellState.HIT);
  });

  test('should throw error when getting/setting invalid position', () => {
    // Invalid positions
    const invalidPositions = [
      { x: -1, y: 5 },
      { x: 5, y: -1 },
      { x: 10, y: 5 },
      { x: 5, y: 10 },
    ];

    invalidPositions.forEach(pos => {
      expect(() => grid.getCellState(pos)).toThrow('Invalid position');
      expect(() => grid.setCellState(pos, CellState.SHIP)).toThrow('Invalid position');
    });
  });

  test('should validate position correctly', () => {
    // Valid positions
    expect(grid.isValidPosition({ x: 0, y: 0 })).toBe(true);
    expect(grid.isValidPosition({ x: 9, y: 9 })).toBe(true);
    expect(grid.isValidPosition({ x: 5, y: 5 })).toBe(true);

    // Invalid positions
    expect(grid.isValidPosition({ x: -1, y: 5 })).toBe(false);
    expect(grid.isValidPosition({ x: 5, y: -1 })).toBe(false);
    expect(grid.isValidPosition({ x: 10, y: 5 })).toBe(false);
    expect(grid.isValidPosition({ x: 5, y: 10 })).toBe(false);
  });

  test('should place ship correctly when position is valid', () => {
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 3 }, Orientation.HORIZONTAL);

    expect(grid.placeShip(ship)).toBe(true);

    // Check that ship cells are marked as SHIP
    expect(grid.getCellState({ x: 3, y: 3 })).toBe(CellState.SHIP);
    expect(grid.getCellState({ x: 4, y: 3 })).toBe(CellState.SHIP);

    // Check that the ship was added to the grid's ships list
    expect(grid.getShips().length).toBe(1);
  });

  test('should reject ship placement when position is invalid', () => {
    // Ship that would go out of bounds
    const outOfBoundsShip = new Ship(ShipType.CARRIER, { x: 7, y: 5 }, Orientation.HORIZONTAL);

    expect(grid.placeShip(outOfBoundsShip)).toBe(false);
    expect(grid.getShips().length).toBe(0);

    // Now place a valid ship
    const validShip = new Ship(ShipType.DESTROYER, { x: 3, y: 3 }, Orientation.HORIZONTAL);

    expect(grid.placeShip(validShip)).toBe(true);

    // Try to place a ship that would overlap
    const overlappingShip = new Ship(ShipType.CRUISER, { x: 2, y: 3 }, Orientation.HORIZONTAL);

    expect(grid.placeShip(overlappingShip)).toBe(false);
    expect(grid.getShips().length).toBe(1);
  });

  test('should record shots correctly', () => {
    // Place a ship
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 3 }, Orientation.HORIZONTAL);
    grid.placeShip(ship);

    // Miss
    expect(grid.receiveShot({ x: 0, y: 0 })).toBe(CellState.MISS);
    expect(grid.getCellState({ x: 0, y: 0 })).toBe(CellState.MISS);

    // Hit
    expect(grid.receiveShot({ x: 3, y: 3 })).toBe(CellState.HIT);
    expect(grid.getCellState({ x: 3, y: 3 })).toBe(CellState.HIT);

    // Hit again (should still return HIT)
    expect(grid.receiveShot({ x: 3, y: 3 })).toBe(CellState.HIT);
  });

  test('should track ship sinking', () => {
    // Place a destroyer (length 2)
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 3 }, Orientation.HORIZONTAL);
    grid.placeShip(ship);

    // Initially, all ships are not sunk
    expect(grid.areAllShipsSunk()).toBe(false);

    // Hit first position
    grid.receiveShot({ x: 3, y: 3 });
    expect(grid.areAllShipsSunk()).toBe(false);

    // Hit second position (ship should be sunk)
    grid.receiveShot({ x: 4, y: 3 });
    expect(grid.areAllShipsSunk()).toBe(true);
  });

  test('should reset grid correctly', () => {
    // Place a ship and fire some shots
    const ship = new Ship(ShipType.DESTROYER, { x: 3, y: 3 }, Orientation.HORIZONTAL);
    grid.placeShip(ship);
    grid.receiveShot({ x: 0, y: 0 }); // Miss
    grid.receiveShot({ x: 3, y: 3 }); // Hit

    // Reset the grid
    grid.reset();

    // Check that all cells are empty
    const gridState = grid.getGrid();
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        expect(gridState[y][x]).toBe(CellState.EMPTY);
      }
    }

    // Check that ships list is empty
    expect(grid.getShips().length).toBe(0);
  });

  describe('constructor', () => {
    it('should create a grid with the specified size', () => {
      // Use methods to access private properties
      expect(grid.getGrid().length).toBe(10);
      expect(grid.getGrid()[0].length).toBe(10);
    });

    it('should initialize all cells as empty', () => {
      const cells = grid.getGrid();
      for (let y = 0; y < grid.getGrid().length; y++) {
        for (let x = 0; x < grid.getGrid()[0].length; x++) {
          expect(cells[y][x]).toBe(CellState.EMPTY);
        }
      }
    });

    it('should accept adjacentShipsAllowed parameter', () => {
      const gridWithAdjacent = new Grid(10, true);
      const gridWithoutAdjacent = new Grid(10, false);

      // No direct way to test the internal flag, so we'll test the behavior
      // by placing adjacent ships and checking the result

      // Place first ship
      const ship1 = createShip('1', ShipType.CARRIER, { x: 0, y: 0 }, Orientation.HORIZONTAL);

      // Place second ship adjacent to the first (different type to avoid ALREADY_PLACED error)
      const ship2 = createShip('2', ShipType.DESTROYER, { x: 0, y: 1 }, Orientation.HORIZONTAL);

      expect(gridWithAdjacent.placeShip(ship1)).toBe(true);
      expect(gridWithAdjacent.placeShip(ship2)).toBe(true); // Should allow adjacent ships

      expect(gridWithoutAdjacent.placeShip(ship1)).toBe(true);
      expect(gridWithoutAdjacent.placeShip(ship2)).toBe(false); // Should not allow adjacent ships

      // Check the error code for adjacent ships
      const result = gridWithoutAdjacent.getLastPlacementResult();
      expect(result?.valid).toBe(false);
      expect(result?.errorCode).toBe(ShipPlacementErrorCode.ADJACENT_SHIPS);
    });
  });

  describe('placeShip', () => {
    it('should place a valid ship on the grid', () => {
      const ship = createShip('1', ShipType.DESTROYER, { x: 0, y: 0 }, Orientation.HORIZONTAL);

      expect(grid.placeShip(ship)).toBe(true);

      // Verify ship was placed on grid
      const cells = grid.getGrid();
      expect(cells[0][0]).toBe(CellState.SHIP);
      expect(cells[0][1]).toBe(CellState.SHIP);

      // Verify ship was added to ships array
      expect(grid.getShips().length).toBe(1);
      expect(grid.getShips()[0]).toEqual(expect.objectContaining({ id: ship.id }));

      // Verify last placement result is valid
      const result = grid.getLastPlacementResult();
      expect(result?.valid).toBe(true);
    });

    it('should not place a ship that overlaps with existing ships', () => {
      // Place first ship
      const ship1 = createShip('1', ShipType.CARRIER, { x: 0, y: 0 }, Orientation.HORIZONTAL);

      grid.placeShip(ship1);

      // Try to place overlapping ship of a different type
      const ship2 = createShip('2', ShipType.DESTROYER, { x: 1, y: 0 }, Orientation.HORIZONTAL);

      expect(grid.placeShip(ship2)).toBe(false);

      // Verify second ship was not added
      expect(grid.getShips().length).toBe(1);

      // Verify last placement result has correct error
      const result = grid.getLastPlacementResult();
      expect(result?.valid).toBe(false);
      expect(result?.errorCode).toBe(ShipPlacementErrorCode.OVERLAPPING);
    });

    it('should not place a ship that extends outside the grid', () => {
      const ship = createShip('1', ShipType.DESTROYER, { x: 9, y: 0 }, Orientation.HORIZONTAL);

      expect(grid.placeShip(ship)).toBe(false);

      // Verify ship was not added
      expect(grid.getShips().length).toBe(0);

      // Verify last placement result has correct error
      const result = grid.getLastPlacementResult();
      expect(result?.valid).toBe(false);
      expect(result?.errorCode).toBe(ShipPlacementErrorCode.OUTSIDE_GRID);
    });

    it('should not place a ship with invalid orientation', () => {
      const ship = new Ship(ShipType.DESTROYER, { x: 0, y: 0 }, Orientation.HORIZONTAL);

      // @ts-expect-error - Testing invalid orientation
      ship.orientation = 'diagonal';

      expect(grid.placeShip(ship)).toBe(false);

      // Verify ship was not added
      expect(grid.getShips().length).toBe(0);

      // Verify last placement result has correct error
      const result = grid.getLastPlacementResult();
      expect(result?.valid).toBe(false);
      expect(result?.errorCode).toBe(ShipPlacementErrorCode.INVALID_ORIENTATION);
    });

    it('should not place the same ship twice', () => {
      const ship = createShip('1', ShipType.DESTROYER, { x: 0, y: 0 }, Orientation.HORIZONTAL);

      expect(grid.placeShip(ship)).toBe(true);

      // Try to place the same type of ship
      const sameTypeShip = createShip(
        '2',
        ShipType.DESTROYER,
        { x: 5, y: 5 },
        Orientation.HORIZONTAL
      );

      expect(grid.placeShip(sameTypeShip)).toBe(false);

      // Verify ship was added only once
      expect(grid.getShips().length).toBe(1);

      // Verify last placement result has correct error
      const result = grid.getLastPlacementResult();
      expect(result?.valid).toBe(false);
      expect(result?.errorCode).toBe(ShipPlacementErrorCode.ALREADY_PLACED);
    });

    it('should handle ship rotation during placement', () => {
      const ship = new Ship(ShipType.DESTROYER, { x: 0, y: 0 }, Orientation.HORIZONTAL);

      // Initial placement in horizontal orientation
      expect(grid.placeShip(ship)).toBe(true);

      // Cells should be marked as ships
      expect(grid.getCellState({ x: 0, y: 0 })).toBe(CellState.SHIP);
      expect(grid.getCellState({ x: 1, y: 0 })).toBe(CellState.SHIP);

      // Reset grid for next test
      grid.reset();

      // Rotate ship to vertical before placement
      ship.rotate();
      expect(ship.orientation).toBe(Orientation.VERTICAL);

      // Place in vertical orientation
      expect(grid.placeShip(ship)).toBe(true);

      // Cells should be marked as ships in vertical orientation
      expect(grid.getCellState({ x: 0, y: 0 })).toBe(CellState.SHIP);
      expect(grid.getCellState({ x: 0, y: 1 })).toBe(CellState.SHIP);
    });

    it('should reject rotated ship placement when it would go out of bounds', () => {
      const ship = new Ship(ShipType.DESTROYER, { x: 9, y: 8 }, Orientation.HORIZONTAL);

      // Ship in horizontal orientation at the edge would be partly out of bounds
      expect(grid.placeShip(ship)).toBe(false);

      // Rotate to vertical, which would fit
      ship.rotate();
      expect(ship.orientation).toBe(Orientation.VERTICAL);

      // Now placement should be valid
      expect(grid.placeShip(ship)).toBe(true);

      // Reset grid for next test
      grid.reset();

      // Test with a carrier (size 5)
      const carrier = new Ship(ShipType.CARRIER, { x: 5, y: 7 }, Orientation.HORIZONTAL);
      expect(grid.placeShip(carrier)).toBe(true); // Fits horizontally

      // Reset grid
      grid.reset();

      // Rotate carrier to vertical
      carrier.rotate();
      carrier.position = { x: 5, y: 7 };

      // Would go out of bounds vertically from position y=7
      expect(grid.placeShip(carrier)).toBe(false);

      const result = grid.getLastPlacementResult();
      expect(result?.valid).toBe(false);
      expect(result?.errorCode).toBe(ShipPlacementErrorCode.OUTSIDE_GRID);
    });
  });

  describe('getLastPlacementResult', () => {
    it('should return the last placement result', () => {
      // Place a valid ship
      const ship1 = createShip('1', ShipType.CARRIER, { x: 0, y: 0 }, Orientation.HORIZONTAL);

      grid.placeShip(ship1);

      let result = grid.getLastPlacementResult();
      expect(result?.valid).toBe(true);

      // Place an invalid ship of a different type
      const ship2 = createShip('2', ShipType.DESTROYER, { x: 9, y: 0 }, Orientation.HORIZONTAL);

      grid.placeShip(ship2);

      result = grid.getLastPlacementResult();
      expect(result?.valid).toBe(false);
      expect(result?.errorCode).toBe(ShipPlacementErrorCode.OUTSIDE_GRID);
    });

    it('should return null before any placement attempts', () => {
      const result = grid.getLastPlacementResult();
      expect(result).toBeNull();
    });
  });

  describe('isValidShipPlacement', () => {
    it('should be deprecated but still work for backward compatibility', () => {
      // Create ships to test with
      const validShip = createShip('1', ShipType.DESTROYER, { x: 0, y: 0 }, Orientation.HORIZONTAL);
      const invalidShip = createShip(
        '2',
        ShipType.DESTROYER,
        { x: 9, y: 0 },
        Orientation.HORIZONTAL
      );

      // Test valid placement
      expect(grid.isValidShipPlacement(validShip)).toBe(true);

      // Test invalid placement
      expect(grid.isValidShipPlacement(invalidShip)).toBe(false);

      // Place the valid ship and verify it's there
      grid.placeShip(validShip);
      expect(grid.getShips().length).toBe(1);

      // Try placing it again and verify it fails
      expect(grid.isValidShipPlacement(validShip)).toBe(false);
    });
  });

  describe('receiveShot', () => {
    it('should update the cell state when a shot is fired', () => {
      const position = { x: 0, y: 0 };
      grid.receiveShot(position);
      const cells = grid.getGrid();
      expect(cells[0][0]).toBe(CellState.MISS);
    });

    it('should mark a hit when a ship is hit', () => {
      const ship = createShip('1', ShipType.DESTROYER, { x: 0, y: 0 }, Orientation.HORIZONTAL);

      grid.placeShip(ship);

      const position = { x: 0, y: 0 };
      grid.receiveShot(position);

      const cells = grid.getGrid();
      expect(cells[0][0]).toBe(CellState.HIT);
      expect(grid.getShips()[0].hits).toContainEqual(position);
    });

    it('should not change cell state for already fired positions', () => {
      const position = { x: 0, y: 0 };

      grid.receiveShot(position); // First shot (miss)
      const cells = grid.getGrid();
      expect(cells[0][0]).toBe(CellState.MISS);

      grid.receiveShot(position); // Second shot (same position)
      expect(cells[0][0]).toBe(CellState.MISS); // Should remain a miss
    });
  });

  describe('areAllShipsSunk', () => {
    it('should mark a ship as sunk when all positions are hit', () => {
      const ship = createShip('1', ShipType.DESTROYER, { x: 0, y: 0 }, Orientation.HORIZONTAL);

      grid.placeShip(ship);

      // Fire at all ship positions
      grid.receiveShot({ x: 0, y: 0 });
      grid.receiveShot({ x: 1, y: 0 });

      // Get the ship after shots to check its status
      const ships = grid.getShips();
      expect(ships[0].isSunk).toBe(true);
      expect(grid.areAllShipsSunk()).toBe(true);
    });

    it('should not mark a ship as sunk when not all positions are hit', () => {
      const ship = createShip('1', ShipType.DESTROYER, { x: 0, y: 0 }, Orientation.HORIZONTAL);

      grid.placeShip(ship);

      // Fire at only one position
      grid.receiveShot({ x: 0, y: 0 });

      // Get the ship after shots to check its status
      const ships = grid.getShips();
      expect(ships[0].isSunk).toBe(false);
      expect(grid.areAllShipsSunk()).toBe(false);
    });
  });
});

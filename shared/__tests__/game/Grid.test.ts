import { CellState, Orientation, ShipType } from '../../types/game';
import { Grid } from '../../src/game/Grid';
import { Ship } from '../../src/game/Ship';

describe('Grid', () => {
  let grid: Grid;

  beforeEach(() => {
    grid = new Grid();
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
});

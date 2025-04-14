import { useState } from 'react';
import { Grid } from '@sea-battle/shared/src/game/Grid';
import { Ship as ShipModel } from '@sea-battle/shared/src/game/Ship';
import { ShipFactory } from '@sea-battle/shared/src/game/ShipFactory';
import { Orientation, Position } from '@sea-battle/shared/types/game';
import { ShipPlacementService } from '../services/ShipPlacementService';
import GameGrid from './GameGrid';
import Ship from './Ship';
import '../styles/ShipPlacementBoard.css';

interface ShipPlacementBoardProps {
  onPlacementComplete?: (grid: Grid, ships: ShipModel[]) => void;
}

/**
 * ShipPlacementBoard component
 * Combines the GameGrid and Ship components for ship placement
 */
const ShipPlacementBoard: React.FC<ShipPlacementBoardProps> = ({ onPlacementComplete }) => {
  // Grid state
  const [grid, setGrid] = useState<Grid>(new Grid());

  // Initial ships to place
  const [availableShips, setAvailableShips] = useState<ShipModel[]>(() =>
    ShipFactory.createDefaultFleet()
  );

  // Placed ships
  const [placedShips, setPlacedShips] = useState<ShipModel[]>([]);

  // Currently selected ship for placement
  const [selectedShip, setSelectedShip] = useState<ShipModel | null>(null);

  // Ship orientations
  const [shipOrientations, setShipOrientations] = useState<Record<string, Orientation>>({});

  // Placement error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Visual feedback for hovering over grid cells
  const [hoverPosition, setHoverPosition] = useState<Position | null>(null);
  const [isValidPlacement, setIsValidPlacement] = useState<boolean>(false);

  // Get ship orientation
  const getShipOrientation = (ship: ShipModel): Orientation => {
    return shipOrientations[ship.id] || ship.orientation;
  };

  // Handle ship selection
  const handleShipSelect = (ship: ShipModel) => {
    setSelectedShip(ship);
    setErrorMessage(null);
  };

  // Handle ship rotation
  const handleRotateShip = (ship: ShipModel) => {
    const newOrientation =
      getShipOrientation(ship) === Orientation.HORIZONTAL
        ? Orientation.VERTICAL
        : Orientation.HORIZONTAL;

    setShipOrientations(prev => ({
      ...prev,
      [ship.id]: newOrientation,
    }));
  };

  // Handle cell hover to show ship placement preview
  const handleCellHover = (position: Position) => {
    if (!selectedShip) return;

    setHoverPosition(position);

    // Create a temporary ship at hover position for validation
    const tempShip = new ShipModel(selectedShip.type, position, getShipOrientation(selectedShip));

    // Validate placement using service
    const [isValid] = ShipPlacementService.validateShipPlacement(grid, tempShip);
    setIsValidPlacement(isValid);
  };

  // Handle cell click to place ship
  const handleCellClick = (position: Position) => {
    if (!selectedShip) return;

    // Create a ship at the clicked position
    const shipToPlace = new ShipModel(
      selectedShip.type,
      position,
      getShipOrientation(selectedShip)
    );

    // Validate placement using service
    const [isValid, validationErrorMessage] = ShipPlacementService.validateShipPlacement(
      grid,
      shipToPlace
    );

    if (isValid) {
      // Clone the grid
      const updatedGrid = new Grid();

      // Add all placed ships to the grid
      placedShips.forEach(ship => {
        updatedGrid.placeShip(ship);
      });

      // Place the new ship
      updatedGrid.placeShip(shipToPlace);

      // Update grid
      setGrid(updatedGrid);

      // Move ship from available to placed
      setPlacedShips(prev => [...prev, shipToPlace]);
      setAvailableShips(prev => prev.filter(s => s.id !== selectedShip.id));

      // Clear selection and error
      setSelectedShip(null);
      setErrorMessage(null);

      // Check if all ships are placed
      if (availableShips.length === 1) {
        // All ships are placed
        if (onPlacementComplete) {
          onPlacementComplete(updatedGrid, [...placedShips, shipToPlace]);
        }
      }
    } else {
      // Show error message
      setErrorMessage(validationErrorMessage || 'Invalid ship placement');
    }
  };

  // Handle auto-placement
  const handleAutoPlace = () => {
    // Use service to auto-place ships
    const autoPlacedGrid = ShipPlacementService.autoPlaceShips();

    // Update the grid
    setGrid(autoPlacedGrid);

    // Update placed ships
    setPlacedShips(autoPlacedGrid.getShips());

    // Clear available ships
    setAvailableShips([]);

    // Clear selection and error
    setSelectedShip(null);
    setErrorMessage(null);

    // Notify completion
    if (onPlacementComplete) {
      onPlacementComplete(autoPlacedGrid, autoPlacedGrid.getShips());
    }
  };

  // Handle resetting the board
  const handleReset = () => {
    setGrid(new Grid());
    setAvailableShips(ShipFactory.createDefaultFleet());
    setPlacedShips([]);
    setSelectedShip(null);
    setErrorMessage(null);
    setHoverPosition(null);
    setShipOrientations({});
  };

  // Render placement preview
  const renderPlacementPreview = () => {
    if (!selectedShip || !hoverPosition) return null;

    const orientation = getShipOrientation(selectedShip);
    const shipSize = selectedShip.getSize();
    const positions: Position[] = [];

    // Calculate all positions the ship would occupy
    for (let i = 0; i < shipSize; i++) {
      if (orientation === Orientation.HORIZONTAL) {
        positions.push({ x: hoverPosition.x + i, y: hoverPosition.y });
      } else {
        positions.push({ x: hoverPosition.x, y: hoverPosition.y + i });
      }
    }

    return (
      <div className="placement-preview">
        {positions.map((pos, index) => (
          <div
            key={`preview-${index}`}
            className={`preview-cell ${isValidPlacement ? 'valid' : 'invalid'}`}
            style={{
              left: `${pos.x * 40}px`,
              top: `${pos.y * 40}px`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="ship-placement-board">
      <div className="grid-container">
        <h2>Place Your Ships</h2>

        {errorMessage && <div className="placement-error">{errorMessage}</div>}

        <div className="placement-grid">
          <GameGrid
            grid={grid.getGrid()}
            onCellClick={handleCellClick}
            onCellHover={handleCellHover}
            showLabels={true}
          />

          {renderPlacementPreview()}
        </div>
      </div>

      <div className="ship-selection">
        <h3>Your Fleet</h3>

        <div className="available-ships">
          {availableShips.map(ship => (
            <div
              key={ship.id}
              className={`ship-item ${selectedShip?.id === ship.id ? 'selected' : ''}`}
              onClick={() => handleShipSelect(ship)}
            >
              <Ship
                ship={ship}
                orientation={getShipOrientation(ship)}
                draggable={false}
                onRotate={() => handleRotateShip(ship)}
              />
              <button
                className="rotate-button"
                onClick={e => {
                  e.stopPropagation();
                  handleRotateShip(ship);
                }}
              >
                Rotate
              </button>
            </div>
          ))}
        </div>

        {availableShips.length === 0 && (
          <div className="all-ships-placed">All ships have been placed!</div>
        )}

        <div className="placement-controls">
          <button
            className="auto-place-button"
            onClick={handleAutoPlace}
            disabled={availableShips.length === 0}
          >
            Auto-Place
          </button>

          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipPlacementBoard;

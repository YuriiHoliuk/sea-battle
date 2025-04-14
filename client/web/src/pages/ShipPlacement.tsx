import { useState } from 'react';
import { Grid } from '@sea-battle/shared/src/game/Grid';
import { Ship } from '@sea-battle/shared/src/game/Ship';
import { ShipFactory } from '@sea-battle/shared/src/game/ShipFactory';
import { Orientation, Position } from '@sea-battle/shared/types/game';
import '../styles/ShipPlacement.css';

/**
 * ShipPlacement page component
 * Allows players to drag and drop ships onto the grid
 */
const ShipPlacement = () => {
  // Initialize the grid
  const [grid, setGrid] = useState<Grid>(new Grid());

  // Initialize a list of ships to place
  const [ships, setShips] = useState<Ship[]>(() => ShipFactory.createDefaultFleet());

  // Track the currently dragged ship
  const [draggedShip, setDraggedShip] = useState<Ship | null>(null);

  // Track rotation of ships
  const [shipOrientations, setShipOrientations] = useState<Record<string, Orientation>>({});

  // Track placement errors
  const [placementError, setPlacementError] = useState<string | null>(null);

  // Track if all ships are placed
  const [allShipsPlaced, setAllShipsPlaced] = useState<boolean>(false);

  // Start dragging a ship
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, ship: Ship) => {
    setDraggedShip(ship);
    // Set drag image offset
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();

    // Store the orientation in the transfer data
    e.dataTransfer.setData('ship', JSON.stringify(ship));

    // Set the drag image offset based on ship size and orientation
    e.dataTransfer.setDragImage(img, rect.width / 2, rect.height / 2);
  };

  // Handle drag over the grid cell
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Allow the drop
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle dropping a ship on the grid
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, cellPosition: Position) => {
    e.preventDefault();

    if (!draggedShip) return;

    // Get the orientation from state or default to horizontal
    const orientation = shipOrientations[draggedShip.id] || Orientation.HORIZONTAL;

    // Create a copy of the dragged ship at the drop position
    const shipToPlace = new Ship(draggedShip.type, cellPosition, orientation);

    // Clone the grid to update it
    const updatedGrid = new Grid();

    // Add all previously placed ships to the grid
    grid.getShips().forEach(ship => {
      if (ship.id !== draggedShip.id) {
        updatedGrid.placeShip(ship);
      }
    });

    // Try to place the ship
    const success = updatedGrid.placeShip(shipToPlace);

    if (success) {
      // Clear any previous errors
      setPlacementError(null);

      // Update the grid
      setGrid(updatedGrid);

      // Remove the placed ship from the unplaced ships list
      const updatedShips = ships.filter(s => s.id !== draggedShip.id);
      setShips(updatedShips);

      // Check if all ships are placed
      if (updatedShips.length === 0) {
        setAllShipsPlaced(true);
      }
    } else {
      // Get the error message
      const validationResult = updatedGrid.getLastPlacementResult();
      setPlacementError(validationResult?.errorMessage || 'Invalid ship placement');
    }

    // Reset the dragged ship
    setDraggedShip(null);
  };

  // Rotate a ship
  const handleRotateShip = (ship: Ship) => {
    const newOrientation =
      shipOrientations[ship.id] === Orientation.HORIZONTAL
        ? Orientation.VERTICAL
        : Orientation.HORIZONTAL;

    setShipOrientations({
      ...shipOrientations,
      [ship.id]: newOrientation,
    });
  };

  // Reset the grid and ships
  const handleReset = () => {
    setGrid(new Grid());
    setShips(ShipFactory.createDefaultFleet());
    setPlacementError(null);
    setAllShipsPlaced(false);
    setShipOrientations({});
  };

  // Handle completing ship placement
  const handleConfirmPlacement = () => {
    if (allShipsPlaced) {
      // TODO: Save the grid and proceed to the next step
      console.warn('All ships placed - ready to start game');
    }
  };

  // Render the grid
  const renderGrid = () => {
    const gridData = grid.getGrid();
    return (
      <div className="ship-placement-grid">
        {gridData.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={`grid-cell ${cell}`}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, { x: colIndex, y: rowIndex })}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Render the ships to place
  const renderShipsToPlace = () => {
    return (
      <div className="ships-container">
        <h3>Ships to Place</h3>
        <div className="ship-list">
          {ships.map(ship => {
            const orientation = shipOrientations[ship.id] || Orientation.HORIZONTAL;
            const shipSize = ship.getSize();
            return (
              <div
                key={ship.id}
                className={`ship ship-${ship.type} ship-${orientation} size-${shipSize}`}
                draggable="true"
                onDragStart={e => handleDragStart(e, ship)}
                onDoubleClick={() => handleRotateShip(ship)}
              >
                {Array(shipSize)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="ship-cell" />
                  ))}
                <div className="ship-label">{ship.type}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="ship-placement-page">
      <h1>Place Your Ships</h1>
      <p className="instructions">
        Drag and drop your ships onto the grid. Double-click to rotate.
      </p>

      {placementError && <div className="error-message">{placementError}</div>}

      <div className="placement-container">
        {renderGrid()}

        <div className="side-panel">
          {ships.length > 0 ? (
            renderShipsToPlace()
          ) : (
            <div className="all-placed-message">All ships have been placed!</div>
          )}

          <div className="placement-controls">
            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>

            <button
              className="confirm-button"
              onClick={handleConfirmPlacement}
              disabled={!allShipsPlaced}
            >
              Confirm Placement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipPlacement;

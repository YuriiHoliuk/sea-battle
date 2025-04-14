import { useState } from 'react';
import { CellState, GameState } from '@sea-battle/shared/types/game';
import ShipPlacementBoard from './components/ShipPlacementBoard';
import { Grid } from '@sea-battle/shared/src/game/Grid';
import { Ship } from '@sea-battle/shared/src/game/Ship';
import './App.css';

function App() {
  // Game state
  const [gameState, setGameState] = useState<GameState>(GameState.PLACING_SHIPS);

  // Player grid and ships
  const [playerGrid, setPlayerGrid] = useState<Grid | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playerShips, setPlayerShips] = useState<Ship[] | null>(null);

  // Handle ship placement completion
  const handleShipPlacementComplete = (grid: Grid, ships: Ship[]) => {
    setPlayerGrid(grid);
    setPlayerShips(ships);
    setGameState(GameState.WAITING);

    // TODO: Send ship placement to server
    console.warn('Ship placement complete - pending server implementation');
  };

  // Reset game
  const handleReset = () => {
    setPlayerGrid(null);
    setPlayerShips(null);
    setGameState(GameState.PLACING_SHIPS);
  };

  // Render based on game state
  const renderGameContent = () => {
    switch (gameState) {
      case GameState.PLACING_SHIPS:
        return <ShipPlacementBoard onPlacementComplete={handleShipPlacementComplete} />;

      case GameState.WAITING:
        return (
          <div className="waiting-screen">
            <h2>Waiting for opponent...</h2>
            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>
          </div>
        );

      case GameState.IN_PROGRESS:
        return (
          <div className="game-container">
            <div className="grid player-grid">
              <h2>Your Fleet</h2>
              <div className="grid-board">
                {playerGrid && renderGrid(playerGrid.getGrid(), false)}
              </div>
            </div>

            <div className="grid enemy-grid">
              <h2>Enemy Waters</h2>
              <div className="grid-board">
                {Array(10)
                  .fill(null)
                  .map((_, row) => (
                    <div key={`row-${row}`} className="grid-row">
                      {Array(10)
                        .fill(null)
                        .map((_, col) => (
                          <div
                            key={`cell-${row}-${col}`}
                            className={`grid-cell ${CellState.EMPTY}`}
                            data-row={row}
                            data-col={col}
                          />
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Helper function to render a grid
  const renderGrid = (grid: CellState[][], isEnemy: boolean) => {
    return grid.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid-row">
        {row.map((cell, colIndex) => {
          // For enemy grid, don't show ships unless they're hit
          const cellState = isEnemy && cell === CellState.SHIP ? CellState.EMPTY : cell;

          return (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className={`grid-cell ${cellState}`}
              data-row={rowIndex}
              data-col={colIndex}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div className="app">
      <h1>Sea Battle</h1>
      <p className="description">A multiplayer online battleship game</p>

      {renderGameContent()}

      <p className="status">
        Game Status: <span>{gameState}</span>
      </p>

      <footer>
        <p>Created by YuriiHoliuk</p>
      </footer>
    </div>
  );
}

export default App;

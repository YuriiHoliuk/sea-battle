import { useState } from 'react';
import { CellState } from '@sea-battle/shared/types/game';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>Sea Battle</h1>
      <p className="description">A multiplayer online battleship game</p>
      
      <div className="game-container">
        <div className="grid player-grid">
          <h2>Your Fleet</h2>
          <div className="grid-board">
            {Array(10).fill(null).map((_, row) => (
              <div key={`row-${row}`} className="grid-row">
                {Array(10).fill(null).map((_, col) => (
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

        <div className="grid enemy-grid">
          <h2>Enemy Waters</h2>
          <div className="grid-board">
            {Array(10).fill(null).map((_, row) => (
              <div key={`row-${row}`} className="grid-row">
                {Array(10).fill(null).map((_, col) => (
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

      <div className="controls">
        <button onClick={() => console.log('Starting game...')}>
          Start Game
        </button>
        <button onClick={() => console.log('Placing ships...')}>
          Place Ships
        </button>
      </div>

      <p className="status">
        Game Status: <span>Waiting for opponent</span>
      </p>
      
      <footer>
        <p>Created by YuriiHoliuk</p>
      </footer>
    </div>
  );
}

export default App; 
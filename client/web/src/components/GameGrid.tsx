import { CellState, Position } from '@sea-battle/shared/types/game';
import { Grid as GridType } from '@sea-battle/shared/src/game/Grid';
import '../styles/GameGrid.css';

interface GameGridProps {
  grid: GridType;
  onCellClick?: (position: Position) => void;
  onCellHover?: (position: Position) => void;
  onCellDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onCellDrop?: (e: React.DragEvent<HTMLDivElement>, position: Position) => void;
  showLabels?: boolean;
  isEnemyGrid?: boolean;
}

/**
 * GameGrid component for displaying the game grid
 */
const GameGrid: React.FC<GameGridProps> = ({
  grid,
  onCellClick,
  onCellHover,
  onCellDragOver,
  onCellDrop,
  showLabels = true,
  isEnemyGrid = false,
}) => {
  // Row and column labels
  const columnLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const rowLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  // Handle cell click
  const handleCellClick = (position: Position) => {
    if (onCellClick) {
      onCellClick(position);
    }
  };

  // Handle cell hover
  const handleCellHover = (position: Position) => {
    if (onCellHover) {
      onCellHover(position);
    }
  };

  // Get cell class based on cell state
  const getCellClass = (cellState: CellState, isEnemyGrid: boolean) => {
    // For enemy grid, don't show ships unless they're hit
    if (isEnemyGrid && cellState === CellState.SHIP) {
      return CellState.EMPTY;
    }
    return cellState;
  };

  return (
    <div className="game-grid-container">
      {showLabels && (
        <div className="column-labels">
          <div className="corner-spacer"></div>
          {columnLabels.map(label => (
            <div key={`col-${label}`} className="grid-label column-label">
              {label}
            </div>
          ))}
        </div>
      )}

      <div className="grid-with-row-labels">
        {showLabels && (
          <div className="row-labels">
            {rowLabels.map(label => (
              <div key={`row-${label}`} className="grid-label row-label">
                {label}
              </div>
            ))}
          </div>
        )}

        <div className="game-grid">
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid-row">
              {row.map((cell, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`grid-cell ${getCellClass(cell, isEnemyGrid)}`}
                  onClick={() => handleCellClick({ x: colIndex, y: rowIndex })}
                  onMouseEnter={() => handleCellHover({ x: colIndex, y: rowIndex })}
                  onDragOver={onCellDragOver}
                  onDrop={e => onCellDrop && onCellDrop(e, { x: colIndex, y: rowIndex })}
                  data-row={rowIndex}
                  data-col={colIndex}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameGrid;

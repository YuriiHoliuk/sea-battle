import { Orientation } from '@sea-battle/shared/types/game';
import { Ship as ShipModel } from '@sea-battle/shared/src/game/Ship';
import '../styles/Ship.css';

interface ShipProps {
  ship: ShipModel;
  orientation?: Orientation;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onRotate?: () => void;
  isPlaced?: boolean;
}

/**
 * Ship component for displaying a ship
 */
const Ship: React.FC<ShipProps> = ({
  ship,
  orientation = Orientation.HORIZONTAL,
  draggable = true,
  onDragStart,
  onRotate,
  isPlaced = false,
}) => {
  const shipSize = ship.getSize();
  const shipType = ship.type;

  // Handle ship rotation
  const handleDoubleClick = () => {
    if (onRotate) {
      onRotate();
    }
  };

  // Handle ship drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart(e);
    }
  };

  return (
    <div
      className={`ship-component ship-${shipType} ship-${orientation} ${isPlaced ? 'placed' : ''}`}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDoubleClick={handleDoubleClick}
    >
      {Array(shipSize)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="ship-cell">
            {ship.hits.some(
              hit =>
                (orientation === Orientation.HORIZONTAL &&
                  hit.x === ship.position.x + i &&
                  hit.y === ship.position.y) ||
                (orientation === Orientation.VERTICAL &&
                  hit.x === ship.position.x &&
                  hit.y === ship.position.y + i)
            ) && <div className="ship-hit-marker">×</div>}
          </div>
        ))}
      {!isPlaced && (
        <div className="ship-info">
          <span className="ship-name">{shipType}</span>
          <span className="ship-size">{shipSize}</span>
        </div>
      )}
    </div>
  );
};

export default Ship;

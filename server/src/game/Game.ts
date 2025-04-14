import { GameState, ShotResult, Position, Ship, CellState, SHIP_SIZES } from '@sea-battle/shared';
import { GAME_RULES } from '@sea-battle/shared';

/**
 * Represents a player in the game
 */
interface Player {
  id: string;
  ships: Ship[];
  shots: Position[];
  ready: boolean;
}

/**
 * Game class to manage a Sea Battle game session
 */
export class Game {
  id: string;
  players: Map<string, Player>;
  state: GameState;
  currentTurn: string | null;
  winner: string | null;
  createdAt: Date;
  lastActivity: Date;

  constructor(id: string, hostId: string) {
    this.id = id;
    this.players = new Map();
    this.state = GameState.WAITING;
    this.currentTurn = null;
    this.winner = null;
    this.createdAt = new Date();
    this.lastActivity = new Date();

    // Add host player
    this.addPlayer(hostId);
  }

  /**
   * Add a player to the game
   */
  addPlayer(playerId: string): boolean {
    if (this.players.size >= GAME_RULES.MAX_PLAYERS) {
      return false;
    }

    this.players.set(playerId, {
      id: playerId,
      ships: [],
      shots: [],
      ready: false,
    });

    // If we have max players, transition to ship placement phase
    if (this.players.size === GAME_RULES.MAX_PLAYERS) {
      this.state = GameState.PLACING_SHIPS;
    }

    this.updateLastActivity();
    return true;
  }

  /**
   * Place a ship for a player
   */
  placeShip(playerId: string, ship: Ship): { valid: boolean; message?: string } {
    const player = this.players.get(playerId);

    if (!player) {
      return { valid: false, message: 'Player not found' };
    }

    if (this.state !== GameState.PLACING_SHIPS) {
      return { valid: false, message: 'Game is not in ship placement phase' };
    }

    // Validate ship placement
    const validationResult = this.validateShipPlacement(ship, player.ships);
    if (!validationResult.valid) {
      return validationResult;
    }

    // Add ship to player's fleet
    player.ships.push(ship);
    this.updateLastActivity();

    return { valid: true };
  }

  /**
   * Validate ship placement
   */
  private validateShipPlacement(
    ship: Ship,
    existingShips: Ship[]
  ): { valid: boolean; message?: string } {
    // Check if ship already exists
    if (existingShips.some(s => s.id === ship.id)) {
      return { valid: false, message: 'Ship already placed' };
    }

    // Check if ship is within grid bounds
    const shipLength = SHIP_SIZES[ship.type];
    if (ship.orientation === 'horizontal') {
      if (
        ship.position.x < 0 ||
        ship.position.x + shipLength > 10 ||
        ship.position.y < 0 ||
        ship.position.y >= 10
      ) {
        return { valid: false, message: 'Ship placement out of bounds' };
      }
    } else {
      if (
        ship.position.y < 0 ||
        ship.position.y + shipLength > 10 ||
        ship.position.x < 0 ||
        ship.position.x >= 10
      ) {
        return { valid: false, message: 'Ship placement out of bounds' };
      }
    }

    // Check for overlapping ships
    for (const existingShip of existingShips) {
      if (this.doShipsOverlap(ship, existingShip)) {
        return { valid: false, message: 'Ships cannot overlap' };
      }
    }

    return { valid: true };
  }

  /**
   * Check if ships overlap
   */
  private doShipsOverlap(ship1: Ship, ship2: Ship): boolean {
    const positions1 = this.getShipPositions(ship1);
    const positions2 = this.getShipPositions(ship2);

    return positions1.some(pos1 => positions2.some(pos2 => pos1.x === pos2.x && pos1.y === pos2.y));
  }

  /**
   * Get all positions occupied by a ship
   */
  private getShipPositions(ship: Ship): Position[] {
    const { position, orientation, type } = ship;
    const shipLength = SHIP_SIZES[type];
    const positions: Position[] = [];

    for (let i = 0; i < shipLength; i++) {
      if (orientation === 'horizontal') {
        positions.push({ x: position.x + i, y: position.y });
      } else {
        positions.push({ x: position.x, y: position.y + i });
      }
    }

    return positions;
  }

  /**
   * Set player ready status
   */
  setPlayerReady(playerId: string): boolean {
    const player = this.players.get(playerId);

    if (!player) {
      return false;
    }

    player.ready = true;
    this.updateLastActivity();

    // Check if all players are ready
    if (this.areAllPlayersReady()) {
      this.state = GameState.IN_PROGRESS;

      // Set initial turn
      const playerIds = Array.from(this.players.keys());
      this.currentTurn = playerIds[Math.floor(Math.random() * playerIds.length)];
    }

    return true;
  }

  /**
   * Player fires a shot
   */
  fireShot(playerId: string, position: Position): { result: ShotResult | null; message?: string } {
    if (this.state !== GameState.IN_PROGRESS) {
      return { result: null, message: 'Game is not in progress' };
    }

    if (this.currentTurn !== playerId) {
      return { result: null, message: 'Not your turn' };
    }

    const player = this.players.get(playerId);
    if (!player) {
      return { result: null, message: 'Player not found' };
    }

    // Get opponent
    const opponentId = Array.from(this.players.keys()).find(id => id !== playerId);
    if (!opponentId) {
      return { result: null, message: 'Opponent not found' };
    }

    const opponent = this.players.get(opponentId)!;

    // Check if position was already targeted
    if (player.shots.some(shot => shot.x === position.x && shot.y === position.y)) {
      return { result: null, message: 'Position already targeted' };
    }

    // Record the shot
    player.shots.push(position);
    this.updateLastActivity();

    // Check if hit
    const hitShip = opponent.ships.find(ship => this.isShipHitByShot(ship, position));

    if (hitShip) {
      // Update ship hits
      hitShip.hits.push(position);

      // Check if ship is sunk
      const isSunk = hitShip.hits.length === SHIP_SIZES[hitShip.type];
      hitShip.isSunk = isSunk;

      // Check win condition
      if (this.areAllShipsSunk(opponentId)) {
        this.state = GameState.COMPLETED;
        this.winner = playerId;
        return { result: ShotResult.SUNK, message: 'Game over' };
      }

      return { result: isSunk ? ShotResult.SUNK : ShotResult.HIT };
    }

    // Switch turns
    this.currentTurn = opponentId;

    return { result: ShotResult.MISS };
  }

  /**
   * Check if a ship is hit by a shot
   */
  private isShipHitByShot(ship: Ship, shot: Position): boolean {
    const positions = this.getShipPositions(ship);
    return positions.some(pos => pos.x === shot.x && pos.y === shot.y);
  }

  /**
   * Check if all players are ready
   */
  private areAllPlayersReady(): boolean {
    return Array.from(this.players.values()).every(player => player.ready);
  }

  /**
   * Check if all ships are sunk for a player
   */
  private areAllShipsSunk(playerId: string): boolean {
    const player = this.players.get(playerId);
    if (!player) return false;

    return player.ships.every(ship => ship.isSunk);
  }

  /**
   * Update last activity timestamp
   */
  private updateLastActivity(): void {
    this.lastActivity = new Date();
  }

  /**
   * Get game state for client
   */
  getGameStateForPlayer(playerId: string) {
    const player = this.players.get(playerId);
    if (!player) return null;

    // Get opponent
    const opponentId = Array.from(this.players.keys()).find(id => id !== playerId);
    if (!opponentId) return null;

    const opponent = this.players.get(opponentId)!;

    // Create opponent grid with hidden ships
    const opponentGrid = Array(10)
      .fill(null)
      .map(() => Array(10).fill(CellState.EMPTY));

    // Mark shots on opponent grid
    player.shots.forEach(shot => {
      const isHit = opponent.ships.some(ship =>
        ship.hits.some(hit => hit.x === shot.x && hit.y === shot.y)
      );
      opponentGrid[shot.y][shot.x] = isHit ? CellState.HIT : CellState.MISS;
    });

    // Mark sunk ships on opponent grid (show ship locations)
    opponent.ships.forEach(ship => {
      if (ship.isSunk) {
        const positions = this.getShipPositions(ship);
        positions.forEach(pos => {
          opponentGrid[pos.y][pos.x] = CellState.HIT;
        });
      }
    });

    return {
      gameId: this.id,
      state: this.state,
      isYourTurn: this.currentTurn === playerId,
      winner: this.winner,
      yourShips: player.ships,
      yourShots: player.shots,
      opponentGrid,
    };
  }
}

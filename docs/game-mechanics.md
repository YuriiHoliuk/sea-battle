# Sea Battle Game Mechanics

## Overview

Sea Battle is a turn-based strategy game where players position ships on a grid and attempt to sink their opponent's fleet by guessing the locations of their ships. This document outlines the core game mechanics, rules, and technical implementation details.

## Game Grid

- The game is played on a 10x10 grid for each player
- Grid coordinates are represented as (x, y) where:
  - x ranges from 0 to 9 (horizontal position)
  - y ranges from 0 to 9 (vertical position)
- Each cell on the grid can be in one of these states:
  - Empty: No ship present
  - Occupied: Contains a ship segment
  - Hit: Contains a ship segment that has been hit
  - Miss: An empty cell that has been targeted

## Ships

### Ship Types and Sizes

The game includes five ship types for each player:

| Ship Type  | Size (cells) | Quantity |
| ---------- | ------------ | -------- |
| Carrier    | 5            | 1        |
| Battleship | 4            | 1        |
| Cruiser    | 3            | 1        |
| Submarine  | 3            | 1        |
| Destroyer  | 2            | 1        |

### Ship Placement Rules

- Ships must be placed entirely within the 10x10 grid
- Ships can be oriented horizontally or vertically, not diagonally
- Ships cannot overlap with each other
- Ships cannot extend beyond the grid boundaries
- During placement, ships can be rotated between horizontal and vertical orientations

## Gameplay

### Setup Phase

1. Each player places all five ships on their own grid
2. Placement can be done manually or using a "random placement" option
3. Players cannot see each other's ship placements
4. Once both players have confirmed their placements, the game begins

### Combat Phase

1. Players take turns firing at coordinates on the opponent's grid
2. The game randomly determines which player goes first
3. After a shot is fired, the result is immediately revealed:
   - Hit: The shot hit an enemy ship
   - Miss: The shot hit an empty cell
   - Sunk: All segments of a ship have been hit, revealing the full ship
4. If a player hits an enemy ship, they do NOT get an extra turn (unlike some variations of the game)
5. Players cannot fire at the same coordinates twice

### End Game Conditions

- A player wins when all enemy ships are sunk (all 17 ship segments are hit)
- The game tracks the number of turns taken to win
- If a player disconnects, they have 30 seconds to reconnect before forfeiting

## Technical Implementation

### Ship Representation

Ships are represented in code as:

```typescript
interface Ship {
  type: 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';
  position: { x: number; y: number }; // Starting coordinate (top-left)
  orientation: 'horizontal' | 'vertical';
  segments: { x: number; y: number; hit: boolean }[]; // All ship segments with hit status
}
```

### Grid Representation

The game grid is represented as a 2D array:

```typescript
type CellState = 'empty' | 'occupied' | 'hit' | 'miss';
type Grid = CellState[][];
```

### Hit Detection

1. When a player fires at coordinates (x, y):
   - Check if those coordinates contain a ship segment
   - Update the grid cell and ship segment accordingly
   - Check if the hit resulted in a ship being fully sunk
   - Check if all ships are sunk (game over condition)

## Game Modes

### Single Player

- Play against AI with three difficulty levels:
  - Easy: Random targeting
  - Medium: Targets based on probability and focuses fire around hits
  - Hard: Uses Monte Carlo simulation for optimal targeting

### Multiplayer

- Real-time matchmaking based on player rating
- Private lobby system with invite codes
- Ranking system with seasonal leaderboards

## Network Protocol

- WebSocket-based communication for real-time updates
- JSON message format for game state synchronization
- Message types include: shot fired, hit result, game state update, chat message
- Fallback mechanisms for handling temporary disconnections

## Future Enhancements

- Special abilities for ships
- Weather effects that impact gameplay
- Multi-player team battles (2v2)
- Customizable game rules
- Replay system for watching past games

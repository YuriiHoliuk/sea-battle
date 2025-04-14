/**
 * Shared module exports for Sea Battle
 */

// Export all types
export * from './types/game';
export * from './types/player';
export * from './types/socket';

// Export all constants
export * from './constants/game';

// Export all utilities
export * from './utils/grid';
export * from './utils/gameHelpers';

// Export game classes explicitly to avoid name conflicts with types
export { Grid as GridImpl } from './src/game/Grid';
export { Ship as ShipImpl } from './src/game/Ship';
export { ShipFactory } from './src/game/ShipFactory';
export {
  ShipPlacementValidator,
  ValidationResult,
  ShipPlacementErrorCode,
} from './src/game/ShipPlacementValidator';

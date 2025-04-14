import { Server as SocketIOServer } from 'socket.io';
import http from 'node:http';
import { GameEvents, SocketEvents } from '@sea-battle/shared';
import { SERVER_CONFIG } from '../config/index.js';

// Game session interface
interface GameSession {
  id: string;
  host: string;
  players: string[];
  created: Date;
  status: string;
}

// Active game sessions
const gameSessions = new Map<string, GameSession>();

/**
 * Initialize Socket.IO server
 */
export const initializeSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [SERVER_CONFIG.CLIENT_URL, SERVER_CONFIG.MOBILE_CLIENT_URL],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket middleware for authentication (to be implemented)
  io.use((socket, next) => {
    // For now, allow all connections
    next();
  });

  // Handle client connections
  io.on(SocketEvents.CONNECT, socket => {
    console.warn(`Player connected: ${socket.id}`);

    // Join matchmaking queue
    socket.on(GameEvents.JOIN_GAME, () => {
      console.warn(`Player ${socket.id} joined matchmaking queue`);
      // Implementation will be added in matchmaking service
    });

    // Create private game
    socket.on(GameEvents.GAME_CREATED, () => {
      const gameId = generateGameId();
      console.warn(`Player ${socket.id} created game: ${gameId}`);

      // Create game session
      gameSessions.set(gameId, {
        id: gameId,
        host: socket.id,
        players: [socket.id],
        created: new Date(),
        status: 'waiting',
      });

      // Join the game room
      socket.join(gameId);

      // Send confirmation to the client
      socket.emit(GameEvents.GAME_CREATED, { gameId });
    });

    // Join private game
    socket.on(GameEvents.JOIN_GAME, ({ gameId }) => {
      const game = gameSessions.get(gameId);

      if (!game) {
        socket.emit(GameEvents.GAME_ERROR, { message: 'Game not found' });
        return;
      }

      if (game.players.length >= 2) {
        socket.emit(GameEvents.GAME_ERROR, { message: 'Game is full' });
        return;
      }

      // Add player to game
      game.players.push(socket.id);

      // Join the game room
      socket.join(gameId);

      // Notify all players
      io.to(gameId).emit('lobby_updated', {
        gameId,
        players: game.players.length,
      });

      // If game is full, start the game
      if (game.players.length === 2) {
        game.status = 'starting';
        io.to(gameId).emit(GameEvents.GAME_STARTED, { gameId });
      }
    });

    // Handle disconnect
    socket.on(SocketEvents.DISCONNECT, () => {
      console.warn(`Player disconnected: ${socket.id}`);

      // Find games with this player and handle cleanup
      for (const [gameId, game] of gameSessions.entries()) {
        if (game.players.includes(socket.id)) {
          // Notify other players
          socket.to(gameId).emit('opponent_disconnected');

          // If host disconnects, end the game
          if (game.host === socket.id) {
            gameSessions.delete(gameId);
          } else {
            // Remove player from game
            game.players = game.players.filter(id => id !== socket.id);
          }
        }
      }
    });
  });

  return io;
};

/**
 * Generate a unique game ID
 */
const generateGameId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

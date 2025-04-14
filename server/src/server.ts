import http from 'node:http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { initializeSocketServer } from './socket/socketManager';
import app from './app';

// Load environment variables
dotenv.config();

// Create HTTP server using the Express app
const server = http.createServer(app);

// Socket.io server will be used by the socketManager
new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialize socket server
initializeSocketServer(server);

// Custom error type for node errors with code property
interface NodeError extends Error {
  code?: string;
}

// Start the server with fallback ports if primary is in use
const startServer = async () => {
  const primaryPort = process.env.PORT || 3000;
  const fallbackPorts = [3001, 3002, 3003, 3004];
  let currentPort = primaryPort;

  const tryPort = (port: number | string): Promise<boolean> => {
    return new Promise(resolve => {
      server.once('error', (err: NodeError) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is in use, trying another one...`);
          resolve(false);
        }
      });

      server.once('listening', () => {
        resolve(true);
      });

      server.listen(port);
    });
  };

  // Try primary port first
  let success = await tryPort(currentPort);

  // If primary port fails, try fallbacks
  let portIndex = 0;
  while (!success && portIndex < fallbackPorts.length) {
    currentPort = fallbackPorts[portIndex];
    server.close();
    success = await tryPort(currentPort);
    portIndex++;
  }

  if (success) {
    console.warn(`Server running on port ${currentPort}`);
  } else {
    console.error('Failed to start server: all ports in use');
    process.exit(1);
  }
};

startServer();

import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { GameEvents } from '@sea-battle/shared';
import { SERVER_CONFIG } from './config/index.js';
import { initializeSocketServer } from './socket/socketManager.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Apply middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Sea Battle API is running' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
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
    return new Promise((resolve) => {
      server.once('error', (err: NodeError) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is in use, trying another one...`);
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
    console.log(`Server running on port ${currentPort}`);
  } else {
    console.error('Failed to start server: all ports in use');
    process.exit(1);
  }
};

startServer(); 
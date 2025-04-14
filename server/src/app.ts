import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

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
  res.status(200).json({ status: 'ok' });
});

export default app;

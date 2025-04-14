# Sea Battle Architecture

## Overview

Sea Battle is a multiplayer online game with a client-server architecture. The system consists of two main components:

1. **Client Applications** - Web (React) and Mobile (React Native) frontends
2. **Backend Server** - Node.js with Express providing game logic and services

## System Components

### Client Architecture

Both the web and mobile clients follow similar architecture patterns, sharing code through the `/shared` directory:

```
client/
├── web/               # React web application
│   ├── public/        # Static assets
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and socket services
│   │   ├── state/         # State management
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main application component
│   ├── package.json
│   └── tsconfig.json
│
└── mobile/            # React Native application
    ├── src/
    │   ├── components/    # UI components
    │   ├── hooks/         # React hooks
    │   ├── navigation/    # Navigation configuration
    │   ├── screens/       # Screen components
    │   ├── services/      # API and socket services
    │   ├── state/         # State management
    │   ├── utils/         # Utility functions
    │   └── App.tsx        # Main application component
    ├── ios/           # iOS specific code
    ├── android/       # Android specific code
    ├── package.json
    └── tsconfig.json
```

### Server Architecture

The server follows a modular architecture organized by feature domains:

```
server/
├── src/
│   ├── config/         # Configuration settings
│   ├── api/            # API routes and controllers
│   ├── game/           # Game logic
│   │   ├── grid.ts     # Grid and placement logic
│   │   ├── ship.ts     # Ship models
│   │   ├── combat.ts   # Combat mechanics
│   │   └── game.ts     # Game state management
│   ├── matchmaking/    # Matchmaking service
│   │   ├── queue.ts    # Queue management
│   │   └── rating.ts   # ELO rating system
│   ├── ai/             # AI opponents for single player
│   ├── auth/           # Authentication
│   ├── user/           # User management
│   ├── socket/         # WebSocket handlers
│   ├── db/             # Database models and connection
│   ├── utils/          # Utility functions
│   └── server.ts       # Main server entry point
├── package.json
└── tsconfig.json
```

### Shared Code

Common code and types shared between client and server:

```
shared/
├── types/         # TypeScript interfaces and types
│   ├── game.ts    # Game related types
│   ├── user.ts    # User related types
│   └── api.ts     # API response types
├── constants/     # Shared constants
│   ├── game.ts    # Game constants (grid size, ship types)
│   └── events.ts  # Socket event names
├── utils/         # Shared utility functions
│   ├── grid.ts    # Grid helper functions
│   └── validation.ts  # Validation helpers
├── package.json
└── tsconfig.json
```

## Communication Flow

### Client-Server Communication

The system utilizes two forms of communication:

1. **REST API** - For non-real-time operations:
   - User authentication and registration
   - User profile management
   - Game history and statistics
   - Leaderboards

2. **WebSockets (Socket.IO)** - For real-time game interactions:
   - Game state updates
   - Player moves and actions
   - Matchmaking
   - Chat messages

### Real-time Game Flow

1. **Game Initialization**:
   - Client connects to Socket.IO server
   - Client requests matchmaking or private game
   - Server pairs players and creates game session
   - Server sends initial game state to all players

2. **Game Play**:
   - Player submits move (shot coordinates)
   - Server validates move
   - Server updates game state
   - Server broadcasts updated state to all players
   - Turn alternates between players

3. **Game Completion**:
   - Server detects win condition
   - Server updates player statistics
   - Server broadcasts game results
   - Game session is closed

## Data Models

### Core Game Models

1. **Grid** - A 10x10 grid representing the player's board
2. **Ship** - A game piece with attributes like length, position, and orientation
3. **Player** - Contains player data and grid
4. **Game** - Contains players, game state, and history of moves

### User Models

1. **User** - Basic user account information
2. **Profile** - Extended user profile data
3. **Statistics** - Game performance metrics
4. **Achievements** - Unlocked achievements and progress

## Deployment Architecture

The system is containerized using Docker for consistent development and deployment:

```
┌────────────────┐       ┌────────────────┐
│                │       │                │
│  Client Apps   │◄─────►│  Load Balancer │
│                │       │                │
└────────────────┘       └────────┬───────┘
                                  │
                                  ▼
┌────────────────┐       ┌────────────────┐
│                │       │                │
│  Redis Cache   │◄─────►│  API Servers   │
│                │       │                │
└────────────────┘       └────────┬───────┘
                                  │
┌────────────────┐                │
│                │                │
│   PostgreSQL   │◄───────────────┘
│   Database     │
│                │
└────────────────┘
```

This architecture supports horizontal scaling to handle thousands of concurrent games.

## Security Considerations

1. **Authentication** - JWT-based authentication with secure token handling
2. **Input Validation** - Server-side validation of all inputs
3. **Rate Limiting** - Protection against flooding attacks
4. **Secure WebSockets** - Authenticated WebSocket connections
5. **Data Validation** - Server-side validation of game moves to prevent cheating 
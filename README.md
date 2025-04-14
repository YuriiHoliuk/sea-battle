# Sea Battle

A multiplayer online Sea Battle game with both web and mobile clients, supporting real-time gameplay and matchmaking.

## Project Structure

This project is organized as a monorepo using Yarn Workspaces with the following structure:

```
sea-battle/
├── client/             # Client applications
│   ├── web/            # React web client
│   └── mobile/         # React Native mobile client
├── server/             # Node.js backend server
├── shared/             # Shared code and types
├── docs/               # Documentation
└── scripts/            # Development and build scripts
```

## Features

- Real-time multiplayer gameplay using WebSockets
- Cross-platform compatibility (web and mobile)
- Matchmaking service with skill-based pairing
- Single-player mode with AI opponents of varying difficulties
- User authentication and profiles
- Player progression and achievements
- Ship customization and cosmetics

## Technology Stack

- **Frontend**: React (web) and React Native (mobile)
- **Backend**: Node.js with Express
- **Real-time Communication**: Socket.IO
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **DevOps**: Docker, CI/CD pipelines

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- Yarn package manager
- Docker and Docker Compose (for development environment)
- Git

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/username/sea-battle.git
   cd sea-battle
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Start the development environment:
   ```
   yarn dev
   ```

### Docker Development Environment

You can also run the application using Docker for a consistent development environment:

1. Make sure Docker and Docker Compose are installed on your system.

2. Start the Docker development environment:

   ```
   docker-compose up
   ```

3. The application will be available at:

   - Web client: http://localhost:5173
   - Server API: http://localhost:3000

4. To rebuild the containers after making changes to dependencies:

   ```
   docker-compose up --build
   ```

5. To stop the containers:
   ```
   docker-compose down
   ```

The Docker setup includes:

- Hot-reloading for both client and server code
- Shared volume mounts for real-time development
- Proper networking between services
- Environment variable configuration

## Production Deployment

### Prerequisites

- A Linux server with Docker and Docker Compose installed
- Git access to the repository
- Domain name (optional)

### Deployment Steps

1. Clone the repository to your production server:

   ```
   git clone https://github.com/username/sea-battle.git
   cd sea-battle
   ```

2. Create a production environment file:

   ```
   cp .env.production.example .env.production
   ```

3. Edit the `.env.production` file with your production settings:

   ```
   nano .env.production
   ```

4. Deploy using the provided script:

   ```
   ./scripts/deploy.sh
   ```

   Alternatively, you can manually deploy with:

   ```
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. The application will be available at:
   - Web client: http://your-server-ip (port 80)
   - Server API: http://your-server-ip:3000 (only if port 3000 is exposed)

### Production Configuration

The production setup uses:

- Multi-stage Docker builds for optimized image size
- Nginx to serve static files and provide reverse proxy to API
- Proper security headers and caching configurations
- Automatic container restart on failure

### Staging Environment

The project includes a staging environment configuration for testing before production deployment.

1. Deploy to staging using the provided script:

   ```
   ./scripts/deploy-staging.sh
   ```

2. The staging application will be available at:
   - Web client: http://localhost:8080
   - Server API: http://localhost:8081

The staging environment uses:

- The `develop` branch of the Git repository
- Different ports to avoid conflicts with production
- A separate database and environment configuration
- The same Docker infrastructure as production for consistency

### Updating Production

To update a running production instance:

1. Pull the latest changes:

   ```
   git pull origin main
   ```

2. Rebuild and restart the containers:
   ```
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

## Project Roadmap

1. Setup project repository and base architecture
2. Implement game grid and ship placement logic
3. Develop turn-based combat system
4. Build real-time multiplayer infrastructure
5. Develop matchmaking service
6. Implement AI for single-player mode
7. Create user authentication and profile system
8. Implement player progression and achievements
9. Develop customization and cosmetic systems
10. Cross-platform testing and optimization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The project uses Task Master by [@eyaltoledano](https://x.com/eyaltoledano) for AI-driven development management

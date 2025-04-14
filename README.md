# Sea Battle

[![CI/CD Pipeline](https://github.com/username/sea-battle/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/username/sea-battle/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Yarn Workspaces](https://img.shields.io/badge/Yarn-Workspaces-2C8EBB)](https://classic.yarnpkg.com/en/docs/workspaces/)

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

## Continuous Integration and Deployment

The project uses GitHub Actions for continuous integration and deployment with the following workflow:

1. **Testing**: Runs linting and unit tests for all packages
2. **Building**: Builds the application and creates artifacts
3. **Docker**: Builds and pushes Docker images to the registry
4. **Staging Deployment**: Automatically deploys to the staging environment
5. **Production Deployment**: Deploys to production after approval

The CI/CD pipeline ensures:

- Code quality through automated testing
- Consistent builds across environments
- Automated deployments to staging for immediate testing
- Controlled deployments to production with manual approval
- Proper versioning of Docker images

### CI/CD Configuration

The CI/CD pipeline is configured in `.github/workflows/ci-cd.yml`. You can customize it by:

1. Modifying the trigger branches
2. Changing the Docker registry credentials
3. Updating the deployment targets
4. Adding additional testing or building steps

### Required Secrets

For the CI/CD pipeline to work properly, you need to add the following secrets to your GitHub repository:

- `DOCKER_USERNAME`: Your Docker registry username
- `DOCKER_PASSWORD`: Your Docker registry password
- `STAGING_SSH_KEY`: SSH private key for staging server
- `PRODUCTION_SSH_KEY`: SSH private key for production server
- `STAGING_HOST`: Hostname of the staging server
- `PRODUCTION_HOST`: Hostname of the production server

## API Documentation

API documentation is available using the OpenAPI (Swagger) specification. You can access it at:

- Development: http://localhost:3000/api-docs
- Staging: https://staging-api.seabattle-game.example.com/api-docs
- Production: https://api.seabattle-game.example.com/api-docs

The API documentation provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## Game Mechanics

Detailed documentation about the game mechanics and rules is available in the [Game Mechanics Documentation](docs/game-mechanics.md).

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

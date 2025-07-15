# URL Shortener

A high-performance URL shortener service built with NestJS, featuring JWT authentication, caching, and scalable architecture.

## Features

- 🔗 **URL Shortening**: Convert long URLs into short, memorable links using Base62 encoding
- 🔐 **JWT Authentication**: Secure user authentication and authorization
- ⚡ **Redis Caching**: High-speed caching for frequently accessed URLs
- 📊 **PostgreSQL Database**: Reliable data persistence
- 🏗️ **Clean Architecture**: Domain-driven design with clear separation of concerns
- 🔄 **Auto-increment Counter**: Ensures unique short URLs using Redis atomic operations

## Architecture

The application follows Clean Architecture principles with clear separation of concerns between layers.

### Backend Architecture

```mermaid
graph TB
    subgraph "Application Layer"
        Controller[Controllers]
        UseCase[Use Cases]
        Controller --> UseCase
    end

    subgraph "Domain Layer"
        Entity[Entities]
        Port[Ports/Interfaces]
        DTO[DTOs]
    end

    subgraph "Infrastructure Layer"
        Redis[(Redis Cache)]
        PostgreSQL[(PostgreSQL DB)]
        Repository[Repository Adapters]
        CacheAdapter[Cache Adapter]
        ConfigAdapter[Config Adapter]
    end

    subgraph "URL Shortening Flow"
        direction TB
        A[Increment Redis counter] --> B[Generate Base62 from counter]
        B --> C[Create short URL: domain/base62]
        C --> D[Store in PostgreSQL]
        D --> E[Return short URL]
    end

    subgraph "URL Resolution Flow"
        direction TB
        F[Extract Base62 from URL] --> G[Check Redis cache]
        G --> H{Cache hit?}
        H -->|Yes| I[Return original URL]
        H -->|No| J[Query PostgreSQL]
        J --> K[Cache result in Redis]
        K --> L[Return original URL]
    end

    UseCase --> Entity
    UseCase --> Port
    Repository --> PostgreSQL
    CacheAdapter --> Redis
```

### Clean Architecture (Ports & Adapters)

## Code Structure

This project follows the principles of clean architecture, organizing code into distinct layers with a focus on maintainability, flexibility, and testability. The codebase is structured into three main folders:

#### Domain (src/domain)

This folder encapsulates the entities of the application. It defines the entities and dtos of the application.

#### Infrastructure (src/infrastructure)

The infrastructure folder contains the implementations of external interfaces defined in the domain layer. This layer serves as the bridge between the domain and external frameworks or services. Despite being the entry point for external communication, the code within this layer does not dictate the choice of frameworks or external dependencies, maintaining flexibility and allowing for easy adaptation to changes.

#### Usecases (src/usecases)

The usecases folder represents the application-specific use cases and orchestrators. It defines the use cases, entities, and business rules, serving as the heart of the application. Each use case is implemented through interfaces defined in the domain layer, ensuring loose coupling and easy replacement of components.

### Key principles

- Clean architecture: The project embraces the clean architecture principles, separating concerns and providing a clear and scalable structure for development.
- Dependency Inversion: Dependencies are inverted to ensure that high-level modules (domain and usecases) do not depend on low-level modules (infrastructure). Instead, both depend on abstractions.
- Framework Independence: The codebase is designed to be framework-agnostic, allowing for the adoption of different frameworks or libraries without affecting the core business logic.
- Testability: The clean separation of concerns facilitates easy unit testing of business logic and use cases without the need for external dependencies.

This structure ensures that the application remains modular, maintainable, and adaptable to future changes or technology choices. Developers can focus on implementing business logic without being tied to specific frameworks or external dependencies.

## Technology Stack

- **Backend**: NestJS (Node.js)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose

## Services Used

### PostgreSQL

- **Purpose**: Primary database for storing users, URLs, and metadata

### Redis

- **Purpose**: High-speed caching and atomic counter operations

## Local Development Setup

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd url-shortener
```

### 2. Create Environment File

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/url_shortener
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=url_shortener

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Application Configuration
APP_ENV=development
DOMAIN=http://localhost:3001
INCREMENT_KEY=url_counter

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
SALT_VALUE=10
```

### 3. Run with Docker Compose

```bash
# Start all services (PostgreSQL, Redis, API)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 4. Alternative: Local Development

If you prefer to run the services locally:

```bash
# Install dependencies
npm install

# Start PostgreSQL and Redis with Docker
docker-compose up -d db redis

# Run migrations (if applicable)
npm run migration:run

# Start the application in development mode
npm run start:dev
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### URLs

- `POST /urls` - Create a short URL (authenticated)
- `GET /urls` - Get user's URLs (authenticated)
- `GET /:shortCode` - Redirect to original URL
- `DELETE /urls/:id` - Delete URL (authenticated)

## How URL Shortening Works

1. **User Request**: User submits a long URL for shortening
2. **Counter Increment**: Redis atomically increments a global counter
3. **Base62 Encoding**: The counter value is encoded using Base62 (0-9, a-z, A-Z)
4. **Short URL Generation**: Combined with domain to create the short URL
5. **Storage**: Original URL, short code, and metadata stored in PostgreSQL
6. **Response**: Short URL returned to user

## Environment Variables

| Variable         | Description                  | Default               |
| ---------------- | ---------------------------- | --------------------- |
| `DATABASE_URL`   | PostgreSQL connection string | -                     |
| `REDIS_HOST`     | Redis host address           | localhost             |
| `REDIS_PORT`     | Redis port                   | 6379                  |
| `REDIS_PASSWORD` | Redis password               | -                     |
| `DOMAIN`         | Base domain for short URLs   | http://localhost:3001 |
| `INCREMENT_KEY`  | Redis key for URL counter    | url_counter           |
| `JWT_SECRET`     | JWT signing secret           | -                     |
| `JWT_EXPIRES_IN` | JWT expiration time          | 24h                   |
| `SALT_VALUE`     | Password hashing salt rounds | 10                    |

## Available Scripts

```bash
# Development
npm run start:dev        # Start in watch mode
npm run start:debug      # Start with debugging

# Production
npm run build           # Build the application
npm run start:prod      # Start in production mode

# Testing
npm run test            # Run unit tests

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
```

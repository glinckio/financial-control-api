# Project Name

A NestJS application with clean architecture, following best practices.

## Description

This project is built with NestJS and follows clean architecture principles. It includes:

- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Role-based Authorization
- Logging
- Error Handling
- Testing (Unit, Integration, E2E)
- Documentation

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=project_name

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
MAIL_FROM=your-email@gmail.com
```

## Project Structure

```
src/
├── application/     # Application layer (controllers, services)
├── domain/         # Domain layer (entities, use cases)
├── infrastructure/ # Infrastructure layer (repositories, external services)
├── common/         # Shared code (utilities, constants)
├── config/         # Configuration
├── decorators/     # Custom decorators
├── filters/        # Exception filters
├── guards/         # Authentication guards
├── interceptors/   # Interceptors
├── interfaces/     # TypeScript interfaces
├── middleware/     # Custom middleware
├── pipes/          # Custom pipes
└── test/          # Test files
    ├── e2e/       # End-to-end tests
    ├── integration/ # Integration tests
    └── unit/      # Unit tests
```

## API Documentation

API documentation is available at `/api` when running the application.

## License

This project is [MIT licensed](LICENSE).

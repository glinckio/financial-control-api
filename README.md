# 🚀 Project Name

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-EA2845?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

## 📝 Description

A robust and scalable NestJS application built with clean architecture principles and modern best practices. This project serves as a solid foundation for building enterprise-grade applications.

### ✨ Key Features

- 🔐 **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control
  - Secure password hashing with bcrypt

- 🗄️ **Database & ORM**

  - PostgreSQL database
  - TypeORM for database operations
  - Database migrations support

- 🛡️ **Security**

  - Helmet for security headers
  - Compression for performance
  - Environment-based configuration

- 📊 **Logging & Monitoring**

  - Winston logger integration
  - Structured logging
  - Error tracking

- 🧪 **Testing**

  - Unit testing with Jest
  - E2E testing
  - Integration testing
  - Test coverage reporting

- 📧 **Email Support**
  - Nodemailer integration
  - Configurable email templates
  - SMTP support

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Docker (optional)

### 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/project-name.git
cd project-name
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

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

### 🏃‍♂️ Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

### 🐳 Docker Support

Build and run with Docker:

```bash
# Build the image
docker build -t project-name .

# Run with docker-compose
docker-compose up -d
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📁 Project Structure

```
src/
├── 📂 application/     # Application layer (controllers, services)
├── 📂 domain/         # Domain layer (entities, use cases)
├── 📂 infrastructure/ # Infrastructure layer (repositories, external services)
├── 📂 common/         # Shared code (utilities, constants)
├── 📂 config/         # Configuration
├── 📂 decorators/     # Custom decorators
├── 📂 filters/        # Exception filters
├── 📂 guards/         # Authentication guards
├── 📂 interceptors/   # Interceptors
├── 📂 interfaces/     # TypeScript interfaces
├── 📂 middleware/     # Custom middleware
├── 📂 pipes/          # Custom pipes
└── 📂 test/          # Test files
    ├── 📂 e2e/       # End-to-end tests
    ├── 📂 integration/ # Integration tests
    └── 📂 unit/      # Unit tests
```

## 📚 API Documentation

API documentation is available at `/api` when running the application. The documentation is automatically generated using Swagger/OpenAPI.

## 🔧 Available Scripts

- `npm run build` - Build the application
- `npm run format` - Format code using Prettier
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot-reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Lint the code
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Generate test coverage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- All contributors who have helped shape this project

---

<div align="center">
Made with ❤️ by [Your Name]
</div>

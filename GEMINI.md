
# Project Overview

This is a full-stack web application for event management and a forum.

**Backend:**
*   **Framework:** NestJS (TypeScript)
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Authentication:** JWT

**Frontend:**
*   **Framework:** React (TypeScript)
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand
*   **Routing:** React Router

# Building and Running

## Backend

**Installation:**
```bash
cd backend
npm install
```

**Running the application:**
```bash
# development
npm run start:dev

# production
npm run start:prod
```

**Testing:**
```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Frontend

**Installation:**
```bash
cd frontend/freeday-web
npm install
```

**Running the application:**
```bash
# development
npm run dev
```

**Building for production:**
```bash
npm run build
```

# Development Conventions

*   The backend follows the standard NestJS project structure.
*   The frontend uses functional components with hooks.
*   Both projects use Prettier for code formatting and ESLint for linting.
*   The backend uses Prisma for database migrations. To create a new migration, run:
    ```bash
    npx prisma migrate dev --name <migration-name>
    ```

# 🌟 FreeDay - Event Management & Companion Finder

FreeDay is a comprehensive full-stack web application designed to bridge the gap between event organizers and participants. It provides a trusted space for students and young adults to discover weekend events, manage registrations, and find companions through an integrated forum.

---

## 🚀 Key Features

### 👤 For Participants (Event Seekers)
- **Event Discovery:** Browse, search, and filter events by time, location, price, and tags.
- **Event Registration:** Seamlessly register for events, manage attendance, and join waitlists.
- **Forum & Companion Finder:** Create and interact with forum posts to find companions for events.
- **My Events Dashboard:** Track registered events and save favorite events for later.
- **Google Calendar Integration:** Sync registered events directly to your Google Calendar.
- **Smart Map Integration:** View precise event locations, directions, and distances via Map API.

### 🏢 For Organizers
- **Event Management:** Create, publish, update, and cancel event listings with detailed schedules, capacities, and locations.
- **Financial Dashboard (Phase 1):** Real-time statistics on total registrations, deposit amounts, system commissions (15%), net revenue, and conversion rates.
- **Registration Tracking:** View lists of registrants, manage statuses, and handle participant communications.
- **Direct Messaging:** 1:1 chat support with participants for inquiries.

### 🛡️ For Administrators
- **Content Moderation:** Approve, hide, or delete events, forum posts, and comments that violate platform policies.
- **User Management:** Ban/unban users, manage roles (e.g., assigning Organizer roles).
- **System Auditing:** Review violation reports and track system activities via comprehensive audit logs.

---

## 🛠️ Technology Stack

**Backend (API Server)**
* **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT + OAuth2 (Google/Facebook)

**Frontend (Web App)**
* **Framework:** React (TypeScript)
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Routing:** React Router

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)

### ⚙️ Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Configuration:**
   Create a `.env` file based on your local setup (configure `DATABASE_URL`, JWT secrets, OAuth credentials, etc.).
4. **Database Migration:**
   ```bash
   npx prisma migrate dev
   ```
5. **Run the application:**
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run start:prod
   ```

### 🖥️ Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend2
   # Note: The active frontend directory is named frontend2
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Configuration:**
   Create a `.env` file for frontend environment variables (e.g., `VITE_API_URL`).
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure Highlights

- `backend/src/events`: Contains core event management logic and the advanced financial statistics implementation (Phase 1).
- `backend/prisma/schema.prisma`: The ultimate source of truth for the database schema, covering Users, Events, Forums, Wallets, and Transactions.
- `frontend2/src/pages`: Contains main React views including the robust `EventManagerPage` with detailed UI/UX implementations.
- `frontend2/src/services`: API wrappers for backend communication (e.g., `eventService`, `registrationService`).

---

## 🤝 Development Conventions
- **Code Style:** Both projects utilize Prettier for formatting and ESLint for linting to maintain code quality.
- **Component Design:** The React frontend heavily relies on functional components and hooks.
- **Database Changes:** All schema changes must go through Prisma migrations:
  ```bash
  npx prisma migrate dev --name <descriptive-name>
  ```

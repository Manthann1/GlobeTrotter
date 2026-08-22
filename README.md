# 🌍 GlobeTrotter — Master Travel Planning Platform

[![Stack](https://img.shields.io/badge/Stack-PERN-blue.svg)](https://github.com/Manthann1/GlobeTrotter)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20TailwindCSS-61DAFB.svg)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20Prisma-339933.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](#license)

**GlobeTrotter** is a modern, full-stack PERN (PostgreSQL, Express, React, Node.js) travel itinerary planner and destination discovery application. It empowers travelers to discover top global destinations, craft multi-city travel itineraries, schedule daily activities, calculate detailed budget breakdowns, view trip calendars, and share or clone public itineraries within a vibrant travel community.

---

## 📌 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Getting Started & Setup](#-getting-started--setup)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Environment Variables Configuration](#2-environment-variables-configuration)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Database Setup & Seeding](#4-database-setup--seeding)
  - [5. Run Development Servers](#5-run-development-servers)
- [🔑 Demo Credentials](#-demo-credentials)
- [📡 API Reference](#-api-reference)
- [🗄️ Database Model (Prisma)](#️-database-model-prisma)
- [🧪 Testing & Utilities](#-testing--utilities)
- [📜 Available npm Scripts](#-available-npm-scripts)
- [📄 License](#-license)

---

## ✨ Key Features

### 🔐 Authentication & User Profile
- **JWT-Based Authentication**: Secure login, registration, and token validation.
- **Profile Management**: Update user bio, avatar, phone number, currency preference (`INR`, `USD`, `EUR`, `JPY`, `AED`), and default language.
- **Protected Routes**: Client-side authentication guard for private pages.

### 🗺️ Destination & Activity Discovery
- **Rich Destination Catalog**: Browse 15+ curated cities across India (*Jaipur, Udaipur, Goa, Alleppey, Varanasi, Leh, Manali, Mumbai, Delhi, Rishikesh*) and International hot-spots (*Paris, Tokyo, Rome, Bali, Dubai*).
- **Curated Activities**: 80+ activities with images, category tags, costs, estimated durations, and user ratings.
- **Saved Favorites**: Save favorite cities directly to your account profile.

### 🧳 Trip Management & Itinerary Builder
- **Full Trip Lifecycle**: Create, view, edit, and delete trips with statuses (`DRAFT`, `PLANNED`, `ACTIVE`, `COMPLETED`, `CANCELLED`).
- **Multi-Stop Itineraries**: Add multiple destinations (stops) per trip with arrival/departure date ranges and custom sequence ordering.
- **Activity Scheduling**: Drag-and-drop or select activities into specific stop dates and time slots with snapshot pricing.

### 📅 Calendar & Financial Planning
- **Interactive Calendar View**: Visually inspect scheduled trips and activities across a monthly calendar timeline.
- **Budget Breakdown**: Define total trip budget, daily expenditure caps, and category allocations (*Lodging, Food, Transport, Activities, Shopping*). Dynamic budget tracking highlights over-budget categories.

### 👥 Community & Social Sharing
- **Public Community Hub**: Explore public trips created by fellow travelers.
- **Shareable Tokens**: Generate public share links (`/trips/shared/:token`) for view-only itinerary access without requiring login.
- **Trip Cloning**: Copy shared community trips into your personal workspace with pre-populated stops and activities.

### 📊 Admin Analytics Dashboard
- **System Metrics**: Admin view of total registered users, total trips created, cities catalog, and total activity count.
- **User Management**: View registered user directory and platform activity status.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **UI FX**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma ORM 6](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Auth & Hashing**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **Utility**: `dotenv`, `cors`, `nodemon`

---

## 📁 Project Structure

```text
GlobeTrotter/
├── backend/
│   ├── prisma/
│   │   ├── migrations/          # PostgreSQL Prisma migration history
│   │   ├── schema.prisma        # Complete Database Schema (10 Models)
│   │   └── seed.js              # Comprehensive Seeding Script (Cities, Activities, Trips)
│   ├── scripts/                 # PowerShell DB helpers & Integration test scripts
│   │   ├── init_local_db.ps1    # Automated PostgreSQL cluster setup
│   │   ├── start_local_db.ps1   # Database startup helper
│   │   └── run_integration_tests.js # API Integration Test Suite
│   ├── src/
│   │   ├── controllers/         # Request handlers (auth, trips, stops, activities, cities, admin)
│   │   ├── middleware/          # Auth JWT token parser, Error & 404 handlers
│   │   ├── routes/              # Express API route modules
│   │   ├── schemas/             # Zod input validation schemas
│   │   ├── services/            # Core business logic services
│   │   ├── utils/               # App helper utilities
│   │   ├── app.js               # Express application initialization
│   │   └── server.js            # Server entry point
│   ├── .env.example             # Environment variables blueprint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Navbar, Footer, Sidebar, ProtectedRoute
│   │   │   ├── modals/          # Add Stop, Activity & Budget Modals
│   │   │   └── ui/              # TripCard, CityCard, ActivityCard, StatsCard
│   │   ├── context/             # AuthContext state management
│   │   ├── data/                # Mock backup data & fallback constants
│   │   ├── pages/               # App pages (Dashboard, Explore, TripBuilder, Calendar, etc.)
│   │   ├── services/            # Axios API client modules
│   │   ├── App.jsx              # Application router & layout structure
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   └── package.json
│
├── update-seed-2.js             # Seeding utility
├── package.json                 # Root script runner
└── README.md                    # Project Documentation
```

---

## ⚙️ Prerequisites

Before getting started, ensure you have installed:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **PostgreSQL**: Local PostgreSQL instance (`v14+`) or a hosted PostgreSQL service (e.g. Neon, Supabase, Railway).

---

## 🚀 Getting Started & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Manthann1/GlobeTrotter.git
cd GlobeTrotter
```

### 2. Environment Variables Configuration

Create a `.env` file in the `backend/` directory based on `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` to configure your PostgreSQL connection string and secret key:

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

JWT_SECRET=globetrotter_super_secure_jwt_secret_dev_key_2026
JWT_EXPIRES_IN=7d

# PostgreSQL Connection String (adjust port/credentials as needed)
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/globetrotter?schema=public"
```

### 3. Install Dependencies

Install root, backend, and frontend dependencies:

```bash
# Install root dependencies
npm install

# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend
```

### 4. Database Setup & Seeding

Run Prisma migrations and populate the database with 15+ cities, 80+ activities, and sample trips:

```bash
# Generate Prisma Client & push schema to PostgreSQL
npm run db:push --prefix backend

# Seed database with cities, activities, users & sample trips
npm run db:seed --prefix backend
```

> **Tip (Windows Users)**: You can also use the included PowerShell script to initialize a local database instance:
> ```powershell
> npm run db:init-local --prefix backend
> ```

### 5. Run Development Servers

Start both the backend API server and frontend Vite development server:

```bash
# Run backend (Port 5000) & frontend (Port 5173) from workspace root:
npm run dev:backend
# In a second terminal:
npm run dev:frontend
```

Now open your browser and navigate to **`http://localhost:5173`**.

---

## 🔑 Demo Credentials

After seeding the database, you can log in using the pre-seeded accounts:

| User Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Standard User** | `aarav@globetrotter.in` | `Explorer@2026` | Regular Traveler |
| **Admin User** | `admin@globetrotter.in` | `Admin@2026` | System Administrator |

---

## 📡 API Reference

Base API URL: `http://localhost:5000/api`

### 🔑 Auth Endpoints (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |
| `PUT` | `/api/auth/me` | Update authenticated user profile | Private |

### 🧳 Trip Endpoints (`/api/trips`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/trips` | Fetch user trips (or filter by status/public) | Private |
| `POST` | `/api/trips` | Create a new trip | Private |
| `GET` | `/api/trips/:id` | Get trip details (with stops, activities & budget) | Public / Private |
| `PATCH` | `/api/trips/:id` | Update trip info, status, or budget | Private |
| `DELETE` | `/api/trips/:id` | Delete a trip | Private |
| `GET` | `/api/trips/shared/:token` | View public trip via share token | Public |
| `GET` | `/api/trips/public` | Get all public community trips | Public |

### 📍 Stop Endpoints (`/api/stops`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/trips/:tripId/stops` | Add a city stop to a trip | Private |
| `DELETE` | `/api/stops/:id` | Remove a stop from a trip | Private |

### 🎯 Trip Activity Endpoints (`/api/trip-activities`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/stops/:stopId/activities` | Schedule an activity into a stop | Private |
| `DELETE` | `/api/trip-activities/:id` | Remove an activity from a stop | Private |

### 🏙️ City & Activity Catalog Endpoints (`/api/cities`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cities` | Search and filter cities by name/country | Public |
| `GET` | `/api/cities/:id` | Get single city details | Public |
| `GET` | `/api/cities/:id/activities` | Get activities for a specific city | Public |

### 📊 Admin Endpoints (`/api/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | System-wide platform metrics | Admin |
| `GET` | `/api/admin/users` | List all registered users | Admin |

### 🩺 Health Endpoint
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check | Public |

---

## 🗄️ Database Model (Prisma)

The application database consists of 10 primary entity models defined in `backend/prisma/schema.prisma`:

```mermaid
erDiagram
    User ||--o{ Trip : creates
    User ||--o{ SavedCity : saves
    Trip ||--o{ Stop : contains
    Trip ||--o| Budget : sets
    Trip ||--o{ SharedLink : generates
    City ||--o{ Stop : host
    City ||--o{ Activity : features
    Stop ||--o{ TripActivity : schedules
    Activity ||--o{ TripActivity : links
```

- **`User`**: Account credentials, profile, preferences, admin status.
- **`Trip`**: Main itinerary record (dates, budget, status, public visibility, share token).
- **`City`**: Destination catalog with geographic coords, region, cost index, popularity score.
- **`Activity`**: Curated activities tied to cities with pricing, rating, duration, and tags.
- **`Stop`**: Ordered destination stop within a trip with arrival/departure dates.
- **`TripActivity`**: Specific scheduled activity instance with snapshot pricing.
- **`Budget`**: Category caps (lodging, food, transport, activities, shopping) and daily caps.
- **`SavedCity`**: User saved destination bookmarks.
- **`SharedLink`**: Public view token & hit count tracker.
- **`PasswordResetToken`**: Secure forgot-password tokens.

---

## 🧪 Testing & Utilities

Run backend integration test suites:

```bash
# Run API endpoint integration tests
node backend/scripts/run_integration_tests.js

# Verify database connections & seed status
node backend/scripts/verify_db.js
```

---

## 📜 Available npm Scripts

### Root Scripts (`/package.json`)
- `npm run dev:backend` — Starts backend in development mode with Nodemon.
- `npm run dev:frontend` — Starts frontend in development mode with Vite.
- `npm run db:start` — Runs backend database startup script.
- `npm run db:seed` — Runs backend database seeding script.
- `npm run db:studio` — Opens Prisma Studio UI for database management.

### Backend Scripts (`/backend/package.json`)
- `npm run dev` — Run server with Nodemon watcher.
- `npm run start` — Run server in production node environment.
- `npm run db:generate` — Generate Prisma Client.
- `npm run db:push` — Push schema to database without migration files.
- `npm run db:migrate` — Apply database migrations.
- `npm run db:seed` — Populate database with initial data.
- `npm run db:studio` — Launch visual database editor.

### Frontend Scripts (`/frontend/package.json`)
- `npm run dev` — Start Vite dev server on port 5173.
- `npm run build` — Build production bundle.
- `npm run preview` — Preview built production bundle locally.
- `npm run lint` — Execute ESLint.

---

## 📄 License

This project is open-source and licensed under the [ISC License](LICENSE).

---

<p center>
  Made with ❤️ for global travelers.
</p>

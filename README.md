
# 🌍 Globe Trotter

Globe Trotter is a full-stack smart travel planning application that helps users discover destinations, create and manage trips, organize activities, track budgets, and interact with the travel community.

## ✨ Features

- 🔐 User Registration & Login
- 👤 User Profile Management
- 🗺️ Explore Travel Destinations
- 🔎 Search and Filter Trips
- 🧳 Create and Manage Trips
- 📅 Calendar-based Trip Planning
- 💰 Trip Budget Analysis
- 👥 Travel Community
- 📋 My Trips
- 📝 Trip Activities Management
- 🔄 Trip Sharing and Copying
- 🛡️ Authentication and Protected Routes
- 📡 REST API
- 🗄️ PostgreSQL Database
- 🔗 Prisma ORM

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod

### Tools

- Git
- GitHub
- VS Code
- Nodemon

## 📁 Project Structure

```text
Globe Trotter/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── modals/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── scripts/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── .env.example
│   └── package.json
│
└── README.md

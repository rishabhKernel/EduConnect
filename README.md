# EduConnect Portal for Parent-Teacher Communication & Student Progress Tracker

A comprehensive full-stack web application that enables effective communication between parents and teachers while allowing real-time tracking of student academic performance.

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based role authentication

## Features

- Role-based access control (Parents, Teachers, Admin)
- Secure authentication and authorization
- Student progress tracking with advanced filters
- Grade and assignment management
- Attendance tracking and reporting
- Behavior reporting system
- Real-time messaging between parents and teachers
- Meeting scheduling and management
- Announcements and notifications
- Profile and settings management

## Project Structure

```
parent-teacher-portal/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.js       # Main app component
│   └── public/          # Static files
└── README.md
```

## 🚀 Quick Start - How to Run

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or cloud) - [Download](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud option)
- **npm** (comes with Node.js)

### Step-by-Step Setup

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up MongoDB:**
   - **Option A (Local)**: Start MongoDB service on your machine
   - **Option B (Cloud)**: Create free account at MongoDB Atlas and get connection string

3. **Create environment file:**
   - Create `backend/.env` file with:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=mongodb://localhost:27017/parent-teacher-portal
     JWT_SECRET=your_super_secret_jwt_key_change_this
     JWT_EXPIRE=7d
     ```
   - For MongoDB Atlas, use: `mongodb+srv://username:password@cluster.mongodb.net/parent-teacher-portal`

4. **Start the application:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/health

### 📖 Detailed Instructions

For complete setup instructions, troubleshooting, and first-time setup guide, see **[RUNNING_GUIDE.md](./RUNNING_GUIDE.md)**

### Running Separately

- **Backend only**: `npm run server` (runs on port 5000)
- **Frontend only**: `npm run client` or `cd frontend && npm start` (runs on port 3000)

## Documentation

Comprehensive design documentation is available in the `docs/` directory:

### Design Documents
- **[Design Summary](docs/DESIGN_SUMMARY.md)** - High-level overview and executive summary
- **[System Architecture](docs/ARCHITECTURE.md)** - Architecture patterns, technology choices, and system design
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Complete database design with relationships and indexes
- **[Module Breakdown](docs/MODULE_BREAKDOWN.md)** - Detailed breakdown of all 12 modules
- **[Page Flow](docs/PAGE_FLOW.md)** - User navigation, routing, and page flows
- **[API Overview](docs/API_OVERVIEW.md)** - Complete RESTful API documentation

### Quick Start
1. Start with [Design Summary](docs/DESIGN_SUMMARY.md) for an overview
2. Review [System Architecture](docs/ARCHITECTURE.md) for technical details
3. Check [Database Schema](docs/DATABASE_SCHEMA.md) for data structure
4. Explore [Module Breakdown](docs/MODULE_BREAKDOWN.md) for feature details
5. Reference [API Overview](docs/API_OVERVIEW.md) for API endpoints

## Default Routes

- Landing Page: `http://localhost:3000/`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Parent Dashboard: `http://localhost:3000/parent/dashboard`
- Teacher Dashboard: `http://localhost:3000/teacher/dashboard`

## License

ISC


# EduConnect Portal for Parent-Teacher Communication & Student Progress Tracker

🌐 **Live Demo Hosted on GitHub Pages:** [https://rishabhkernel.github.io/EduConnect/]

A comprehensive full-stack web application that enables effective communication between parents and teachers while allowing real-time tracking of student academic performance. 

## 🚀 Quick Start - How to Run

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud)

### Step-by-Step Setup
1. **Install Dependencies:**
   ```bash
   npm run install-all
   ```
2. **Setup MongoDB & Environment Variables:**
   Create a `.env` file in the `backend/` folder:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/parent-teacher-portal
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   ```
3. **Start the application:**
   ```bash
   npm run dev
   ```
4. **Access:**
   - App: http://localhost:3000
   - API: http://localhost:5000

## 🐳 Quick Start with Docker (Recommended)

### Prerequisites
- **Docker** (v20.10 or higher)
- **Docker Compose** (v1.29 or higher)

### Step-by-Step Setup with Docker
1. **Clone and Navigate to Project:**
   ```bash
   git clone https://github.com/rishabhKernel/EduConnect.git
   cd EduConnect
   ```

2. **Build and Run All Services:**
   ```bash
   docker-compose up --build
   ```

3. **Access Services:**
   - Frontend App: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

4. **View Running Containers:**
   ```bash
   docker ps
   ```

5. **Stop Services:**
   ```bash
   docker-compose down
   ```

### Docker Architecture

The application is containerized into three services:

1. **Backend Container**
   - Image: `educonnect-backend`
   - Port: 5000
   - Base: Node.js 18 Alpine
   - Features: JWT auth, Express API, MongoDB connection

2. **Frontend Container**
   - Image: `educonnect-frontend`
   - Port: 3000
   - Base: Nginx Alpine (optimized React build)
   - Features: React SPA, client-side routing, Tailwind CSS

3. **Database Container**
   - Image: `mongo:latest`
   - Port: 27017
   - Features: MongoDB with persistent volumes

### Useful Docker Commands

```bash
# Build specific service
docker build -t educonnect-backend ./backend

# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all containers
docker-compose stop

# Remove all containers and volumes
docker-compose down -v

# Rebuild and run
docker-compose up --build

# Check running containers
docker ps

# Inspect a container
docker inspect educonnect-backend
```

### Docker Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Docker daemon not running:**
- Start Docker Desktop (Mac/Windows)
- On Linux: `sudo systemctl start docker`

**Clean rebuild:**
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

## 🔑 Test Login Credentials

### Parent Accounts
- Email: `virat.kohli@example.com` | `rahul.mehta@example.com` | `neha.singh@example.com`
- Password: `password123`

### Teacher Accounts
- Email: `priya.sharma@school.com` | `rajesh.kumar@school.com` | `anita.verma@school.com`
- Password: `password123`

## 🏗️ System Architecture & Tech Stack

The application follows a **three-tier architecture**:
1. **Frontend**: React.js, Tailwind CSS, React Router, React Context API, Axios.
2. **Backend**: Node.js, Express.js. Auth via JWT & bcrypt.
3. **Database**: MongoDB & Mongoose.

### Containerization
- **Docker**: Application containerization for consistent development and deployment
- **Docker Compose**: Multi-container orchestration for seamless setup
- **Nginx**: Reverse proxy for frontend (React SPA with proper routing)
- **Alpine Linux**: Lightweight base images for optimized container sizes

## 📊 Database Schema Summary
The database is fully normalized (3NF) and contains the following main collections:
1. **Users**: Stores Parent, Teacher, and Admin accounts. Uses bcrypt for password hashing.
2. **Students**: Links students to parents and teachers.
3. **Grades**: Tracks academic performance across subjects.
4. **Assignments**: Created by teachers for students, tracking due dates and submissions.
5. **Attendance**: Records daily student attendance (present, absent, late, excused).
6. **Behavior**: Tracks positive, negative, and neutral behavioral observations.
7. **Messages**: Stores secure parent-teacher communication threads.
8. **Meetings**: Schedules meetings (in-person, online, phone).
9. **Announcements**: Broadcasts announcements from teachers/admins to users.

## 📡 API Overview (Base: `/api`)

Protected routes require a JWT token (`Authorization: Bearer <token>`).

- **`/auth`**: POST `/register`, POST `/login`, GET `/me`
- **`/users`**: GET `/` (users), PUT `/profile`, PUT `/password`
- **`/students`**: GET, POST, PUT, DELETE for student management.
- **`/grades` & `/assignments`**: Endpoints for academic tracking and assignment lifecycle.
- **`/attendance` & `/behavior`**: Tracking systems for daily metrics.
- **`/messages` & `/meetings`**: Secure communication and scheduling between Parent/Teacher.
- **`/announcements`**: Broadcast messages system.

## 🧩 Module Breakdown & Application Flow

1. **Authentication:** Secure login/registration with role-based routing (Parent, Teacher, Admin).
2. **Dashboards:** Dedicated hubs for Parents and Teachers displaying quick stats, unread messages, and recent activities.
3. **Student Progress:** Visual tracking of grades, GPAs, and subject performance via charts and filters.
4. **Assignments & Attendance:** Teachers can create assignments and log attendance; parents can view completion statuses and records.
5. **Messaging & Meetings:** Real-time-ready communication framework and meeting scheduler (request, confirm, decline).
6. **Profile & Settings:** Allows users to update demographics, toggle passwords, and manage preferences.

*Routing flow typically takes users from Landing -> Login -> Dashboard -> (Sub-modules like Progress, Messaging, Meetings, Profile).*

## 📁 Project Structure

```
EduConnect/
├── frontend/                    # React.js application
���   ├── src/                    # Source code
│   ├── public/                 # Static files
│   ├── Dockerfile              # Frontend container definition
│   ├── nginx.conf              # Nginx configuration for SPA
│   └── package.json            # Frontend dependencies
├── backend/                     # Node.js/Express API
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API endpoints
│   ├── controllers/            # Business logic
│   ├── middleware/             # Auth & validation
│   ├── server.js               # Main server file
│   ├── Dockerfile              # Backend container definition
│   └── package.json            # Backend dependencies
├── docs/                        # Documentation
│   ├── DESIGN_SUMMARY.md       # Project overview
│   ├── ARCHITECTURE.md         # System architecture
│   ├── DATABASE_SCHEMA.md      # Database design
│   ├── MODULE_BREAKDOWN.md     # Feature details
│   ├── PAGE_FLOW.md            # User routing
│   └── API_OVERVIEW.md         # API documentation
├── docker-compose.yml           # Multi-container orchestration
├── .dockerignore                # Docker build ignore rules
└── README.md                    # This file
```

## 📚 Documentation

For detailed documentation, see the `/docs` folder:
- **DESIGN_SUMMARY.md** - High-level project overview
- **ARCHITECTURE.md** - Technical architecture details
- **DATABASE_SCHEMA.md** - Complete database design
- **MODULE_BREAKDOWN.md** - All 12 modules explained
- **PAGE_FLOW.md** - Application routing and user flow
- **API_OVERVIEW.md** - Complete API documentation

## 🔐 Security Features

- JWT-based authentication with secure tokens
- Bcrypt password hashing
- Role-based access control (RBAC)
- Input validation via express-validator
- Secure headers with CORS configuration
- Environment variables for sensitive data
- Non-root user execution in Docker containers

## 📦 Technology Stack

**Frontend:**
- React 18.2
- Tailwind CSS 3.3
- React Router 6.20
- Axios for API calls
- React Icons
- date-fns for date handling

**Backend:**
- Node.js 18+
- Express.js 4.18
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS for cross-origin requests

**DevOps:**
- Docker for containerization
- Docker Compose for orchestration
- Nginx for reverse proxy
- Alpine Linux for lightweight images

## 🚀 Deployment

The application is deployed on:
- **Frontend**: GitHub Pages (https://rishabhkernel.github.io/EduConnect/)
- **Backend**: Render (Cloud service)

## 📸 Docker Screenshots (Assignment 1 - Containerizing Applications With Docker)

### Screenshot 1: Docker Image Build
**Command:** `docker build -t educonnect-backend ./backend`

### Screenshot 2: Docker Compose Up (Running Container)
**Command:** `docker-compose up --build`

### Screenshot 3: Docker PS Output
**Command:** `docker ps`

## 📝 License

ISC

## 👨‍💻 Author

**Rishabh Chaurasia** (rishabhKernel)

---

**Last Updated**: April 2026  
**Status**: Production Ready with Docker Support

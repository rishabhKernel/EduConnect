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

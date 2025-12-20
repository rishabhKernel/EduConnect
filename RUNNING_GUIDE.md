# How to Run the Project - Step by Step Guide

This guide will help you set up and run the Parent-Teacher Communication Portal on your local machine.

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **MongoDB** (Local or Cloud)
   - **Option A - Local MongoDB**: Download from https://www.mongodb.com/try/download/community
   - **Option B - MongoDB Atlas** (Cloud - Free): Sign up at https://www.mongodb.com/cloud/atlas
   - Verify MongoDB: `mongod --version` (if local)

3. **Code Editor** (Optional but recommended)
   - VS Code, WebStorm, or any editor of your choice

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies

Open your terminal/command prompt in the project root directory and run:

```bash
# Install all dependencies (root, backend, and frontend)
npm run install-all
```

Or install separately:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Set Up MongoDB

#### Option A: Using Local MongoDB

1. Make sure MongoDB is running on your machine:
   ```bash
   # On Windows (if MongoDB is installed as a service, it should start automatically)
   # Or start manually:
   mongod
   
   # On Mac/Linux:
   sudo systemctl start mongod
   # Or:
   mongod
   ```

2. MongoDB will run on `mongodb://localhost:27017` by default

#### Option B: Using MongoDB Atlas (Cloud - Recommended for beginners)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/parent-teacher-portal`)

### Step 3: Configure Environment Variables

1. Create a `.env` file in the `backend` directory:
   ```bash
   # Navigate to backend folder
   cd backend
   
   # Create .env file
   # On Windows (PowerShell):
   New-Item .env
   
   # On Mac/Linux:
   touch .env
   ```

2. Add the following content to `backend/.env`:

   **For Local MongoDB:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/parent-teacher-portal
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   ```

   **For MongoDB Atlas:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/parent-teacher-portal
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   ```

   ⚠️ **Important**: Replace `your-username` and `your-password` with your actual MongoDB Atlas credentials.

### Step 4: Start the Application

From the project root directory, run:

```bash
npm run dev
```

This command will:
- Start the backend server on `http://localhost:5000`
- Start the frontend React app on `http://localhost:3000`
- Automatically open your browser to `http://localhost:3000`

### Step 5: Access the Application

Open your web browser and navigate to:

- **Frontend (React App)**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

You should see:
- The landing page at `http://localhost:3000`
- A health check response at `http://localhost:5000/api/health` showing `{"status":"OK","message":"Server is running"}`

---

## 🎯 Running Components Separately

If you prefer to run the frontend and backend separately:

### Run Backend Only

```bash
npm run server
```

Backend will run on: `http://localhost:5000`

### Run Frontend Only

```bash
npm run client
```

Or manually:

```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

---

## 🌐 Accessing the Application

### Public Routes (No Login Required)

- **Landing Page**: http://localhost:3000/
- **Login Page**: http://localhost:3000/login
- **Register Page**: http://localhost:3000/register

### Protected Routes (Login Required)

After registering/logging in, you'll be redirected based on your role:

- **Parent Dashboard**: http://localhost:3000/parent/dashboard
- **Teacher Dashboard**: http://localhost:3000/teacher/dashboard

### Other Pages (After Login)

- Student Progress: http://localhost:3000/progress
- Assignments: http://localhost:3000/assignments
- Attendance: http://localhost:3000/attendance
- Behavior Reports: http://localhost:3000/behavior
- Messaging: http://localhost:3000/messages
- Meetings: http://localhost:3000/meetings
- Announcements: http://localhost:3000/announcements
- Profile: http://localhost:3000/profile

---

## 🧪 Testing the Setup

### 1. Test Backend Connection

Open your browser or use curl:

```bash
# Browser: http://localhost:5000/api/health
# Or use curl:
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

### 2. Test MongoDB Connection

Check your terminal/console where the backend is running. You should see:
```
MongoDB connected successfully
```

If you see an error, check:
- MongoDB is running (if local)
- MongoDB connection string in `.env` is correct
- Network connectivity (if using Atlas)

### 3. Test Frontend

1. Open http://localhost:3000
2. You should see the landing page
3. Click "Register" to create an account
4. After registration, you'll be logged in and redirected to your dashboard

---

## 🐛 Troubleshooting

### Problem: "Cannot find module" errors

**Solution**: Make sure all dependencies are installed:
```bash
npm run install-all
```

### Problem: MongoDB connection error

**Solutions**:
1. **Local MongoDB**: Make sure MongoDB service is running
   ```bash
   # Windows: Check Services
   # Mac/Linux: sudo systemctl status mongod
   ```

2. **MongoDB Atlas**: 
   - Verify your connection string in `.env`
   - Check that your IP is whitelisted
   - Verify username and password are correct

3. **Connection String Format**:
   - Local: `mongodb://localhost:27017/parent-teacher-portal`
   - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/parent-teacher-portal`

### Problem: Port 5000 or 3000 already in use

**Solutions**:

1. **Change Backend Port**:
   - Update `PORT` in `backend/.env` to a different port (e.g., `5001`)
   - Update `proxy` in `frontend/package.json` to match

2. **Change Frontend Port**:
   - Set environment variable: `PORT=3001 npm start`
   - Or create `.env` in frontend: `PORT=3001`

3. **Kill the process using the port**:
   ```bash
   # Windows:
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux:
   lsof -ti:5000 | xargs kill
   ```

### Problem: Frontend can't connect to backend

**Solutions**:
1. Make sure backend is running on port 5000
2. Check `proxy` setting in `frontend/package.json` (should be `"proxy": "http://localhost:5000"`)
3. Check CORS settings in `backend/server.js`
4. Verify backend health: http://localhost:5000/api/health

### Problem: "JWT_SECRET" error

**Solution**: Make sure `.env` file exists in `backend/` directory with `JWT_SECRET` defined.

### Problem: React app shows blank page

**Solutions**:
1. Check browser console for errors (F12)
2. Verify all frontend dependencies are installed
3. Clear browser cache
4. Check if backend is running and accessible

---

## 📝 First Time Setup Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed/running OR MongoDB Atlas account created
- [ ] All dependencies installed (`npm run install-all`)
- [ ] `.env` file created in `backend/` directory
- [ ] MongoDB connection string configured in `.env`
- [ ] JWT_SECRET set in `.env`
- [ ] Backend server starts without errors
- [ ] Frontend app starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:5000/api/health
- [ ] Can register a new user account

---

## 🎓 Next Steps

After successfully running the application:

1. **Create Test Accounts**:
   - Register as a Parent
   - Register as a Teacher
   - (Optional) Register as Admin

2. **Explore Features**:
   - Create students (as Teacher)
   - Link students to parents
   - Create assignments and grades
   - Test messaging between parent and teacher
   - Schedule meetings

3. **Review Documentation**:
   - Check `docs/` folder for detailed documentation
   - Read API documentation in `docs/API_OVERVIEW.md`
   - Understand database schema in `docs/DATABASE_SCHEMA.md`

---

## 💡 Tips

- **Hot Reload**: Both frontend and backend support hot reload. Changes will automatically refresh.
- **Database**: Use MongoDB Compass (GUI) to view your database: https://www.mongodb.com/products/compass
- **API Testing**: Use Postman or Thunder Client (VS Code extension) to test API endpoints
- **Logs**: Check terminal/console for server logs and errors
- **Browser DevTools**: Use F12 to check network requests and console errors

---

## 🆘 Still Having Issues?

1. Check the terminal/console for error messages
2. Verify all prerequisites are installed
3. Ensure MongoDB is running and accessible
4. Check that all environment variables are set correctly
5. Review the troubleshooting section above
6. Check browser console (F12) for frontend errors

---

**Happy Coding! 🚀**


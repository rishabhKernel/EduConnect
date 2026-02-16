# EduConnect - Login Credentials & Setup Guide

## ✅ Setup Complete!

Your EduConnect application is now fully set up and running locally.

### 🚀 Running Services

- **Backend Server**: http://localhost:5000 (Running ✅)
- **Frontend Server**: http://localhost:3000 (Running ✅)
- **Database**: MongoDB (Connected ✅)

---

## 🔑 Test Login Credentials

### Parent Accounts
```
Email: virat.kohli@example.com
Password: password123

Email: rahul.mehta@example.com
Password: password123

Email: neha.singh@example.com
Password: password123
```

### Teacher Accounts
```
Email: priya.sharma@school.com
Password: password123

Email: rajesh.kumar@school.com
Password: password123

Email: anita.verma@school.com
Password: password123
```

---

## 📊 Database Contents

The database has been seeded with:
- **5 Teachers** with subject specialties
- **9 Parents** with assigned students
- **14 Students** with grades, attendance, and behavior records
- **206 Grades** across all subjects
- **21 Assignments** from teachers
- **2,130 Attendance Records** (subject-wise)
- **71 Behavior Reports**
- **20 Messages** between parents and teachers
- **10 Meetings** (some pending for teacher acceptance)
- **5 Announcements**

---

## 🔧 Configuration

### Frontend Config
The frontend is now configured to:
- Use `http://localhost:5000` for development
- Use the production URL for production builds

**File**: `frontend/src/config.js`

---

## 🎯 Next Steps

1. **Open your browser** and go to: http://localhost:3000
2. **Click "Login"** on the landing page
3. **Use any of the credentials above** to test the application
4. **Explore the dashboards** for parents and teachers

---

## 📝 Troubleshooting

### If login still fails:
1. Check that both servers are running (backend on 5000, frontend on 3000)
2. Open browser DevTools (F12) → Network tab
3. Try logging in and check the network request to `/api/auth/login`
4. Look for error messages in the response

### To restart services:
```bash
# Backend
cd backend
npm start

# Frontend (in another terminal)
cd frontend
npm start
```

---

## 🛑 Stopping Services

When you're done, you can stop the servers by:
1. Pressing `Ctrl+C` in each terminal
2. Or use the process manager in your IDE

---

**Happy testing! 🎉**

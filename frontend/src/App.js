import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

import ParentDashboard from './pages/ParentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentProgress from './pages/StudentProgress';
import Assignments from './pages/Assignments';
import Attendance from './pages/Attendance';
import BehaviorReports from './pages/BehaviorReports';
import Messaging from './pages/Messaging';
import Meetings from './pages/Meetings';
import Announcements from './pages/Announcements';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      {/* IMPORTANT: basename is REQUIRED for GitHub Pages */}
      <Router basename="/EduConnect">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Parent Dashboard */}
          <Route
            path="/parent/dashboard"
            element={
              <PrivateRoute>
                <ParentDashboard />
              </PrivateRoute>
            }
          />

          {/* Teacher Dashboard */}
          <Route
            path="/teacher/dashboard"
            element={
              <PrivateRoute>
                <TeacherDashboard />
              </PrivateRoute>
            }
          />

          {/* Common Protected Routes */}
          <Route
            path="/progress"
            element={
              <PrivateRoute>
                <StudentProgress />
              </PrivateRoute>
            }
          />

          <Route
            path="/assignments"
            element={
              <PrivateRoute>
                <Assignments />
              </PrivateRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <Attendance />
              </PrivateRoute>
            }
          />

          <Route
            path="/behavior"
            element={
              <PrivateRoute>
                <BehaviorReports />
              </PrivateRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Messaging />
              </PrivateRoute>
            }
          />

          <Route
            path="/meetings"
            element={
              <PrivateRoute>
                <Meetings />
              </PrivateRoute>
            }
          />

          <Route
            path="/announcements"
            element={
              <PrivateRoute>
                <Announcements />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

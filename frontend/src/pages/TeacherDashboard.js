import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  FiUsers,
  FiFileText,
  FiMail,
  FiCalendar,
  FiBell,
  FiTrendingUp,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingAssignments: 0,
    unreadMessages: 0,
    upcomingMeetings: 0,
    recentAnnouncements: 0,
    attendanceToday: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        studentsRes,
        assignmentsRes,
        messagesRes,
        meetingsRes,
        announcementsRes,
        attendanceRes,
      ] = await Promise.all([
        axios.get('/api/students'),
        axios.get('/api/assignments'),
        axios.get('/api/messages/unread-count'),
        axios.get('/api/meetings?status=confirmed'),
        axios.get('/api/announcements'),
        axios.get('/api/attendance'),
      ]);

      const today = new Date().toISOString().split('T')[0];

      const todayAttendance = attendanceRes.data.filter(
        (a) =>
          new Date(a.date).toISOString().split('T')[0] === today &&
          a.status === 'present'
      );

      setStats({
        totalStudents: studentsRes.data.length,
        pendingAssignments: assignmentsRes.data.filter(
          (a) => a.status === 'published'
        ).length,
        unreadMessages: messagesRes.data.unreadCount || 0,
        upcomingMeetings: meetingsRes.data.length || 0,
        recentAnnouncements: announcementsRes.data.length || 0,
        attendanceToday: todayAttendance.length,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="h-14 w-14 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 🌈 NEW BACKGROUND */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900" />

        {/* Color Blobs */}
        <div className="absolute -top-32 -left-32 h-96 w-96 bg-pink-500 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 bg-indigo-500 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse" />

        {/* Content */}
        <div className="relative z-10 space-y-10 p-6 animate-fade-in">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-extrabold text-white">
              Welcome, {user?.firstName} 👋
            </h1>
            <p className="text-white/80 mt-2">
              Your teaching overview at a glance
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={FiUsers}
              title="Total Students"
              value={stats.totalStudents}
              gradient="from-blue-500 to-indigo-500"
              link="/attendance"
            />
            <StatCard
              icon={FiFileText}
              title="Active Assignments"
              value={stats.pendingAssignments}
              gradient="from-purple-500 to-pink-500"
              link="/assignments"
            />
            <StatCard
              icon={FiUsers}
              title="Attendance Today"
              value={stats.attendanceToday}
              gradient="from-green-500 to-emerald-500"
              link="/attendance"
            />
            <StatCard
              icon={FiMail}
              title="Unread Messages"
              value={stats.unreadMessages}
              gradient="from-orange-500 to-amber-500"
              link="/messages"
            />
            <StatCard
              icon={FiCalendar}
              title="Upcoming Meetings"
              value={stats.upcomingMeetings}
              gradient="from-red-500 to-rose-500"
              link="/meetings"
            />
            <StatCard
              icon={FiBell}
              title="Announcements"
              value={stats.recentAnnouncements}
              gradient="from-indigo-500 to-violet-500"
              link="/announcements"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <QuickAction
                to="/assignments"
                icon={FiFileText}
                label="Create Assignment"
                gradient="from-purple-500 to-pink-500"
              />
              <QuickAction
                to="/attendance"
                icon={FiUsers}
                label="Mark Attendance"
                gradient="from-blue-500 to-indigo-500"
              />
              <QuickAction
                to="/behavior"
                icon={FiTrendingUp}
                label="Report Behavior"
                gradient="from-green-500 to-emerald-500"
              />
              <QuickAction
                to="/announcements"
                icon={FiBell}
                label="Post Announcement"
                gradient="from-orange-500 to-amber-500"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

/* ==========================
   Components
========================== */

const StatCard = ({ icon: Icon, title, value, gradient, link }) => {
  return (
    <Link
      to={link}
      className="group relative rounded-2xl p-6 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex items-center justify-between text-white">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-90">
            {title}
          </p>
          <p className="text-4xl font-extrabold mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur group-hover:scale-110 transition-transform">
          <Icon size={26} />
        </div>
      </div>
    </Link>
  );
};

const QuickAction = ({ to, icon: Icon, label, gradient }) => {
  return (
    <Link
      to={to}
      className="group relative rounded-2xl p-5 overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 text-center text-white">
        <Icon
          size={28}
          className="mx-auto mb-3 transition-transform duration-300 group-hover:scale-125"
        />
        <p className="text-sm font-semibold tracking-wide">{label}</p>
      </div>
    </Link>
  );
};

export default TeacherDashboard;

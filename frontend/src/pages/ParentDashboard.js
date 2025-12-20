import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  FiTrendingUp,
  FiUsers,
  FiFileText,
  FiMail,
  FiCalendar,
  FiBell,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ParentDashboard = () => {
  const { user } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalGrades: 0,
    averageGrade: 0,
    attendanceRate: 0,
    unreadMessages: 0,
    upcomingMeetings: 0,
    recentAnnouncements: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        studentsRes,
        gradesRes,
        attendanceRes,
        messagesRes,
        meetingsRes,
        announcementsRes,
      ] = await Promise.all([
        axios.get('/api/students'),
        axios.get('/api/grades'),
        axios.get('/api/attendance'),
        axios.get('/api/messages/unread-count'),
        axios.get('/api/meetings?status=confirmed'),
        axios.get('/api/announcements'),
      ]);

      setStudents(studentsRes.data);

      const grades = gradesRes.data;
      const attendance = attendanceRes.data;

      const totalGrades = grades.length;
      const avgGrade =
        grades.length > 0
          ? grades.reduce(
              (sum, g) => sum + (g.grade / g.maxGrade) * 100,
              0
            ) / grades.length
          : 0;

      const presentCount = attendance.filter(
        (a) => a.status === 'present'
      ).length;

      const attendanceRate =
        attendance.length > 0
          ? (presentCount / attendance.length) * 100
          : 0;

      setStats({
        totalGrades,
        averageGrade: Math.round(avgGrade),
        attendanceRate: Math.round(attendanceRate),
        unreadMessages: messagesRes.data.unreadCount || 0,
        upcomingMeetings: meetingsRes.data.length || 0,
        recentAnnouncements: announcementsRes.data.length || 0,
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
          <div className="h-14 w-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 🌈 BACKGROUND */}
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-indigo-900 to-purple-900" />

        {/* Floating blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30 animate-pulse" />

        {/* CONTENT */}
        <div className="relative z-10 space-y-10 p-6 animate-fade-in">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-extrabold text-white">
              Welcome back, {user?.firstName} 👋
            </h1>
            <p className="text-white/80 mt-2">
              Track your children’s academic journey
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={FiTrendingUp}
              title="Average Grade"
              value={`${stats.averageGrade}%`}
              gradient="from-sky-500 to-indigo-500"
              link="/progress"
            />
            <StatCard
              icon={FiUsers}
              title="Attendance Rate"
              value={`${stats.attendanceRate}%`}
              gradient="from-emerald-500 to-green-500"
              link="/attendance"
            />
            <StatCard
              icon={FiFileText}
              title="Total Grades"
              value={stats.totalGrades}
              gradient="from-purple-500 to-pink-500"
              link="/assignments"
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

          {/* Students List */}
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-5">
              Your Children
            </h2>

            {students.length === 0 ? (
              <p className="text-white/70">
                No students associated with your account.
              </p>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <Link
                    key={student._id}
                    to={`/progress?studentId=${student._id}`}
                    className="group block rounded-xl p-4 bg-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex justify-between items-center text-white">
                      <div>
                        <h3 className="font-semibold">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-white/70">
                          {student.studentId} • Grade {student.grade}{' '}
                          {student.section}
                        </p>
                      </div>
                      <FiTrendingUp
                        size={22}
                        className="transition-transform duration-300 group-hover:scale-125"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

/* ===============================
   Components
================================ */

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

export default ParentDashboard;

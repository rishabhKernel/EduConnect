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
  FiPlus,
  FiX,
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  const [childForm, setChildForm] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    dateOfBirth: '',
    grade: '',
    section: '',
  });
  const [formError, setFormError] = useState('');

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

  const handleAddChild = async (e) => {
    e.preventDefault();
    setFormError('');
    setAddingChild(true);

    try {
      await axios.post('/api/students', childForm);
      setShowAddModal(false);
      setChildForm({
        firstName: '',
        lastName: '',
        studentId: '',
        dateOfBirth: '',
        grade: '',
        section: '',
      });
      fetchDashboardData(); // Refresh the list
    } catch (error) {
      console.error('Error adding child:', error);
      setFormError(error.response?.data?.message || 'Failed to add child. Please try again.');
    } finally {
      setAddingChild(false);
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
        <div className="relative z-10 space-y-6 sm:space-y-10 p-4 sm:p-6 animate-fade-in">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Welcome back, {user?.firstName} 👋
            </h1>
            <p className="text-white/80 mt-2">
              Track your children’s academic journey
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Your Children
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg text-sm sm:text-base"
              >
                <FiPlus size={18} />
                <span>Add Child</span>
              </button>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/70 mb-4">
                  No students associated with your account.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg"
                >
                  <FiPlus size={20} />
                  <span>Add Your First Child</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {students.map((student) => (
                  <Link
                    key={student._id}
                    to={`/progress?studentId=${student._id}`}
                    className="group block rounded-xl p-3 sm:p-4 bg-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex justify-between items-center text-white">
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/70">
                          {student.studentId} • Grade {student.grade}{' '}
                          {student.section}
                        </p>
                      </div>
                      <FiTrendingUp
                        size={20}
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

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-white/20">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Add Your Child</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/60 hover:text-white transition"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddChild} className="p-4 sm:p-6 space-y-4">
              {formError && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={childForm.firstName}
                    onChange={(e) => setChildForm({ ...childForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={childForm.lastName}
                    onChange={(e) => setChildForm({ ...childForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Student ID</label>
                <input
                  type="text"
                  required
                  value={childForm.studentId}
                  onChange={(e) => setChildForm({ ...childForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="STU001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={childForm.dateOfBirth}
                  onChange={(e) => setChildForm({ ...childForm, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Grade</label>
                  <select
                    required
                    value={childForm.grade}
                    onChange={(e) => setChildForm({ ...childForm, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="" className="bg-slate-800">Select Grade</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-slate-800">Grade {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Section</label>
                  <select
                    value={childForm.section}
                    onChange={(e) => setChildForm({ ...childForm, section: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="" className="bg-slate-800">Select Section</option>
                    {['A', 'B', 'C', 'D', 'E'].map((sec) => (
                      <option key={sec} value={sec} className="bg-slate-800">Section {sec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingChild}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg hover:from-cyan-600 hover:to-emerald-600 transition disabled:opacity-50"
                >
                  {addingChild ? 'Adding...' : 'Add Child'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
      className="group relative rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex items-center justify-between text-white">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-widest opacity-90">
            {title}
          </p>
          <p className="text-2xl sm:text-4xl font-extrabold mt-1 sm:mt-2">{value}</p>
        </div>
        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur group-hover:scale-110 transition-transform">
          <Icon size={20} className="sm:w-6 sm:h-6" />
        </div>
      </div>
    </Link>
  );
};

export default ParentDashboard;

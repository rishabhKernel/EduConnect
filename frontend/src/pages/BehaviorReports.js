import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const BehaviorReports = () => {
  // Add custom animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
        opacity: 0;
      }
      .animate-slide-down {
        animation: slideDown 0.5s ease-out forwards;
        opacity: 0;
      }
      .animate-slide-up {
        animation: slideUp 0.4s ease-out forwards;
        opacity: 0;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const { user } = useContext(AuthContext);
  const [behaviors, setBehaviors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBehavior, setEditingBehavior] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    type: 'positive',
    category: 'academic',
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    severity: 'medium',
    subject: '',
  });
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    studentId: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    fetchBehaviors();
    if (isTeacher) {
      fetchStudents();
    }
  }, [filters]);

  const fetchBehaviors = async () => {
    try {
      const params = {};
      if (filters.studentId) params.studentId = filters.studentId;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await axios.get('/api/behavior', { params });
      setBehaviors(response.data);
    } catch (error) {
      console.error('Error fetching behavior reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBehavior) {
        await axios.put(`/api/behavior/${editingBehavior._id}`, formData);
      } else {
        await axios.post('/api/behavior', formData);
      }
      setShowModal(false);
      setEditingBehavior(null);
      setFormData({
        studentId: '',
        type: 'positive',
        category: 'academic',
        title: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        severity: 'medium',
        subject: '',
      });
      fetchBehaviors();
    } catch (error) {
      console.error('Error saving behavior report:', error);
      alert('Error saving behavior report');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this behavior report?')) return;
    try {
      await axios.delete(`/api/behavior/${id}`);
      fetchBehaviors();
    } catch (error) {
      console.error('Error deleting behavior report:', error);
      alert('Error deleting behavior report');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'positive': return 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-md';
      case 'negative': return 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-md';
      case 'neutral': return 'bg-gradient-to-r from-slate-400 to-gray-500 text-white shadow-md';
      default: return 'bg-gradient-to-r from-slate-400 to-gray-500 text-white shadow-md';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-slate-100">
        <div className="space-y-6 page-hero max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Behavior Reports</h1>
              <p className="text-slate-300 mt-2 font-medium">Track and manage student behavior</p>
            </div>
          {isTeacher && (
            <button
              onClick={() => {
                setEditingBehavior(null);
                setFormData({
                  studentId: '',
                  type: 'positive',
                  category: 'academic',
                  title: '',
                  description: '',
                  date: format(new Date(), 'yyyy-MM-dd'),
                  severity: 'medium',
                  subject: '',
                });
                setShowModal(true);
              }}
              className="btn flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-amber-400 hover:from-indigo-700 hover:to-amber-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <FiPlus size={20} />
              <span>Report Behavior</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-slate-900/20 rounded-xl shadow-2xl p-4 card border border-amber-800/20 animate-slide-down text-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {isTeacher && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Student</label>
                <select
                  value={filters.studentId}
                  onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-200"
                >
                  <option value="">All Students</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">All Types</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">All Categories</option>
                <option value="academic">Academic</option>
                <option value="social">Social</option>
                <option value="behavioral">Behavioral</option>
                <option value="participation">Participation</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>
        </div>

        {/* Behavior Reports */}
        <div className="grid gap-6">
          {behaviors.length === 0 ? (
            <div className="bg-gradient-to-br from-indigo-900/30 to-slate-900/20 rounded-xl shadow-2xl p-8 text-center border border-amber-800/20 animate-fade-in text-slate-100">
              <p className="text-amber-300 font-medium">No behavior reports found</p>
            </div>
          ) : (
            behaviors.map((behavior, index) => (
              <div 
                key={behavior._id} 
                className="bg-gradient-to-br from-indigo-800/20 via-purple-900/12 to-slate-800/12 rounded-xl shadow-lg p-6 card border border-amber-800/12 hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 animate-fade-in text-slate-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">{behavior.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getTypeColor(behavior.type)} transform hover:scale-110 transition-transform duration-200`}>
                        {behavior.type}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-md capitalize">
                        {behavior.category}
                      </span>
                    </div>
                    <p className="text-slate-200 mb-4 leading-relaxed">{behavior.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-amber-200 font-medium">
                      <span><strong>Student:</strong> {behavior.studentId?.firstName} {behavior.studentId?.lastName}</span>
                      <span><strong>Date:</strong> {format(new Date(behavior.date), 'MMM dd, yyyy')}</span>
                      {behavior.subject && <span><strong>Subject:</strong> {behavior.subject}</span>}
                      <span className="capitalize"><strong>Severity:</strong> {behavior.severity}</span>
                    </div>
                  </div>
                  {isTeacher && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingBehavior(behavior);
                          setFormData({
                            studentId: behavior.studentId?._id || behavior.studentId,
                            type: behavior.type,
                            category: behavior.category,
                            title: behavior.title,
                            description: behavior.description,
                            date: format(new Date(behavior.date), 'yyyy-MM-dd'),
                            severity: behavior.severity,
                            subject: behavior.subject || '',
                          });
                          setShowModal(true);
                        }}
                        className="p-2 text-amber-300 hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:scale-110 hover:shadow-md"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(behavior._id)}
                        className="p-2 text-rose-400 hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:scale-110 hover:shadow-md"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        </div>
      </div>

      {/* Modal - moved outside constrained container */}
      {showModal && isTeacher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-800/12 animate-slide-up text-slate-100">
            <div className="p-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-amber-300 bg-clip-text text-transparent mb-4">
                {editingBehavior ? 'Edit Behavior Report' : 'Create Behavior Report'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Student</label>
                  <select
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-200"
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.firstName} {student.lastName} - {student.studentId}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Type</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-200"
                    >
                      <option value="positive">Positive</option>
                      <option value="negative">Negative</option>
                      <option value="neutral">Neutral</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Category</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-200"
                    >
                      <option value="academic">Academic</option>
                      <option value="social">Social</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="participation">Participation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Severity</label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-200"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Subject (Optional)</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBehavior(null);
                    }}
                    className="px-4 py-2 border border-amber-400/12 rounded-lg text-slate-200 hover:bg-white/5 transition-all duration-200 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-amber-400 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-amber-500 transition-all duration-200 transform hover:scale-105"
                  >
                    {editingBehavior ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BehaviorReports;


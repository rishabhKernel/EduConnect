import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { FiPlus, FiEdit, FiTrash2, FiBell, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Announcements = () => {
  const { user } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'all',
    targetStudentIds: [],
    priority: 'medium',
    expiresAt: '',
  });
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    priority: '',
    targetAudience: '',
  });

  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const canCreate = isTeacher || isAdmin;

  useEffect(() => {
    fetchAnnouncements();
    if (canCreate) {
      fetchStudents();
    }
  }, [filters]);

  const fetchAnnouncements = async () => {
    try {
      const params = {};
      if (filters.priority) params.priority = filters.priority;
      if (filters.targetAudience) params.targetAudience = filters.targetAudience;

      const response = await axios.get('/api/announcements', { params });
      // Filter out expired announcements
      const now = new Date();
      const activeAnnouncements = response.data.filter(ann => {
        if (!ann.isActive) return false;
        if (ann.expiresAt && new Date(ann.expiresAt) < now) return false;
        return true;
      });
      setAnnouncements(activeAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
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
      if (editingAnnouncement) {
        await axios.put(`/api/announcements/${editingAnnouncement._id}`, formData);
      } else {
        await axios.post('/api/announcements', formData);
      }
      setShowModal(false);
      setEditingAnnouncement(null);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Error saving announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await axios.delete(`/api/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Error deleting announcement');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
        targetAudience: 'all',
      targetStudentIds: [],
      priority: 'medium',
      expiresAt: '',
    });
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white border-red-600';
      case 'high': return 'bg-orange-500 text-white border-orange-500';
      case 'low': return 'bg-indigo-500 text-white border-indigo-500';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'urgent' || priority === 'high') {
      return <FiAlertCircle className="inline mr-1" />;
    }
    return <FiBell className="inline mr-1" />;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Announcements</h1>
              <p className="text-slate-300 mt-2">View and manage system announcements</p>
            </div>
            {canCreate && (
              <button
                onClick={() => {
                  setEditingAnnouncement(null);
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:-translate-y-0.5"
              >
                <FiPlus size={18} />
                <span>Create Announcement</span>
              </button>
            )}
          </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-indigo-900/20 via-purple-900/12 to-slate-900/8 rounded-lg shadow-lg p-4 border border-amber-600/6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/50 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Target Audience</label>
              <select
                value={filters.targetAudience}
                onChange={(e) => setFilters({ ...filters, targetAudience: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/50 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">All Audiences</option>
                <option value="all">All</option>
                <option value="parents">Parents</option>
                <option value="teachers">Teachers</option>
                <option value="specific">Specific</option>
              </select>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="grid gap-6">
          {announcements.length === 0 ? (
            <div className="bg-white/6 rounded-lg shadow p-8 text-center border border-white/10">
              <p className="text-slate-300">No announcements found</p>
            </div>
          ) : (
              announcements.map((announcement) => (
              <div
                key={announcement._id}
                className={`bg-gradient-to-br from-slate-800/60 via-slate-900/60 to-[#020617]/60 text-slate-100 rounded-lg p-6 border-l-4 ${
                  announcement.priority === 'urgent' ? 'border-red-400' :
                  announcement.priority === 'high' ? 'border-orange-400' :
                  announcement.priority === 'medium' ? 'border-amber-500' : 'border-blue-400'
                } shadow-2xl backdrop-blur-md card hover-glow`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getPriorityIcon(announcement.priority)}
                            <h3 className="text-xl font-semibold text-white">{announcement.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPriorityColor(announcement.priority)} shadow-sm`}>{announcement.priority}</span>
                          </div>
                          <p className="text-slate-200 mb-4 whitespace-pre-wrap">{announcement.content}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                      <div>
                        <strong>Target:</strong> {announcement.targetAudience}
                      </div>
                      <div>
                        <strong>Posted:</strong> {format(new Date(announcement.createdAt), 'MMM dd, yyyy HH:mm')}
                      </div>
                      {announcement.expiresAt && (
                        <div>
                          <strong>Expires:</strong> {format(new Date(announcement.expiresAt), 'MMM dd, yyyy')}
                        </div>
                      )}
                      <div>
                        <strong>Author:</strong> {announcement.authorId?.firstName} {announcement.authorId?.lastName}
                      </div>
                    </div>
                  </div>
                  {canCreate && (
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingAnnouncement(announcement);
                          setFormData({
                            title: announcement.title,
                            content: announcement.content,
                            targetAudience: announcement.targetAudience,
                            targetStudentIds: announcement.targetStudentIds?.map(s => s._id || s) || [],
                            priority: announcement.priority,
                            expiresAt: announcement.expiresAt
                              ? format(new Date(announcement.expiresAt), "yyyy-MM-dd'T'HH:mm")
                              : '',
                          });
                          setShowModal(true);
                        }}
                        className="p-2 text-amber-200 hover:bg-amber-50/20 rounded transition"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement._id)}
                        className="p-2 text-red-400 hover:bg-red-50/10 rounded transition"
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

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ scale: 0.98, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0 }} transition={{ duration: 0.18 }} className="bg-gradient-to-b from-[#07112a]/70 to-[#000000]/60 backdrop-blur-md rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-800/10 text-slate-100">
                    <div className="p-0 rounded-t-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-700 to-amber-500 p-5">
                        <h2 className="text-2xl font-bold text-white mb-0">{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</h2>
                      </div>
                      <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-200 mb-1">Title</label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900/40 border border-amber-500/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-slate-100"
                        />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-200 mb-1">Content</label>
                        <textarea
                          required
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          rows="6"
                            className="w-full px-3 py-2 bg-slate-900/40 border border-amber-500/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-slate-100"
                        />
                      </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                        <select
                          required
                          value={formData.targetAudience}
                          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value, targetStudentIds: e.target.value !== 'specific' ? [] : formData.targetStudentIds })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                          <option value="all">All</option>
                          <option value="parents">Parents</option>
                          <option value="teachers">Teachers</option>
                          <option value="specific">Specific Students</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-1">Priority</label>
                        <select
                          required
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900/40 text-slate-100 border border-amber-500/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                    {formData.targetAudience === 'specific' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Students</label>
                        <select
                          multiple
                          value={formData.targetStudentIds}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions, option => option.value);
                            setFormData({ ...formData, targetStudentIds: selected });
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                          size="5"
                        >
                          {students.map((student) => (
                            <option key={student._id} value={student._id}>
                              {student.firstName} {student.lastName} - {student.studentId}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-400 mt-1">Hold Ctrl/Cmd to select multiple students</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Expiration Date (Optional)</label>
                      <input
                        type="datetime-local"
                        value={formData.expiresAt}
                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setEditingAnnouncement(null);
                          resetForm();
                        }}
                        className="px-4 py-2 border border-white/10 rounded-md text-slate-700 hover:bg-white/5"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                      >
                        {editingAnnouncement ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Announcements;


import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Assignments = () => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    maxGrade: 100,
    studentIds: [],
  });
  const [students, setStudents] = useState([]);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('/api/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
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
      if (editingAssignment) {
        await axios.put(`/api/assignments/${editingAssignment._id}`, formData);
      } else {
        await axios.post('/api/assignments', formData);
      }
      setShowModal(false);
      setEditingAssignment(null);
      setFormData({
        title: '',
        description: '',
        subject: '',
        dueDate: '',
        maxGrade: 100,
        studentIds: [],
      });
      fetchAssignments();
    } catch (error) {
      console.error('Error saving assignment:', error);
      alert('Error saving assignment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await axios.delete(`/api/assignments/${id}`);
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Error deleting assignment');
    }
  };

  const openEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description || '',
      subject: assignment.subject,
      dueDate: assignment.dueDate ? format(new Date(assignment.dueDate), 'yyyy-MM-dd') : '',
      maxGrade: assignment.maxGrade || 100,
      studentIds: assignment.studentIds?.map(s => s._id || s) || [],
    });
    setShowModal(true);
  };

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    fetchAssignments();
    if (isTeacher) {
      fetchStudents();
    }
  }, []);
    return (
      <Layout>
        <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Assignments</h1>
                <p className="text-slate-300 mt-1 sm:mt-2 text-sm sm:text-base">View and manage assignments</p>
              </div>
              {isTeacher && (
                <button
                  onClick={() => {
                    setEditingAssignment(null);
                    setFormData({
                      title: '',
                      description: '',
                      subject: '',
                      dueDate: '',
                      maxGrade: 100,
                      studentIds: [],
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <FiPlus size={18} />
                  <span>Create Assignment</span>
                </button>
              )}
            </div>

            <div className="grid gap-6">
              {assignments.length === 0 ? (
                <div className="bg-white/6 rounded-lg shadow-lg p-8 text-center border border-white/10">
                  <p className="text-white/60">No assignments found</p>
                </div>
              ) : (
                <AnimatePresence>
                  {assignments.map((assignment) => (
                    <motion.div
                      key={assignment._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      whileHover={{ translateY: -4, boxShadow: '0 20px 40px rgba(2,6,23,0.6)' }}
                      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                      className="bg-gradient-to-br from-indigo-800/60 via-purple-900/30 to-slate-800/40 text-slate-100 rounded-lg p-6 border-l-4 border-amber-500/60 shadow-2xl backdrop-blur-md"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white">{assignment.title}</h3>
                          <p className="text-slate-300 mt-1">{assignment.description}</p>
                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                            <span><strong>Subject:</strong> {assignment.subject}</span>
                            <span><strong>Due Date:</strong> {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</span>
                            <span><strong>Max Grade:</strong> {assignment.maxGrade}</span>
                            <span className={`px-2 py-1 rounded capitalize ${
                                assignment.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                              assignment.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {assignment.status}
                            </span>
                          </div>
                          {assignment.studentIds && assignment.studentIds.length > 0 && (
                             <p className="text-sm text-slate-300 mt-2">Assigned to {assignment.studentIds.length} student(s)</p>
                          )}
                        </div>
                        {isTeacher && (
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => openEditModal(assignment)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded transition"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(assignment._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

          </motion.div>
        </div>

        {/* Modal - moved outside constrained container */}
        <AnimatePresence>
          {showModal && isTeacher && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ scale: 0.98, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0 }} transition={{ duration: 0.18 }} className="bg-gradient-to-b from-indigo-900 to-slate-900 backdrop-blur-md rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10 text-slate-100">
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">{editingAssignment ? 'Edit Assignment' : 'Create Assignment'}</h2>
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-1">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="4"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-slate-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-1">Subject</label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-1">Due Date</label>
                        <input
                          type="date"
                          required
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-slate-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-1">Max Grade</label>
                      <input
                        type="number"
                        value={formData.maxGrade}
                        onChange={(e) => setFormData({ ...formData, maxGrade: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-1">Assign to Students</label>
                      <select
                        multiple
                        value={formData.studentIds}
                        onChange={(e) => setFormData({
                          ...formData,
                          studentIds: Array.from(e.target.selectedOptions, option => option.value)
                        })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 text-slate-100"
                      >
                        {students.map((student) => (
                          <option key={student._id} value={student._id}>
                            {student.firstName} {student.lastName} - {student.studentId}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-300 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setEditingAssignment(null);
                        }}
                        className="px-4 py-2 border border-white/10 rounded-md text-slate-200 hover:bg-white/5"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                      >
                        {editingAssignment ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    );
  };

  export default Assignments;


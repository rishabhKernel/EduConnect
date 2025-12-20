import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { FiPlus, FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi';

const Meetings = () => {
  const { user } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    parentId: '',
    teacherId: '',
    studentId: '',
    scheduledDate: '',
    duration: 30,
    location: 'in-person',
    meetingLink: '',
    notes: '',
  });
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  });

  const isParent = user?.role === 'parent';
  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    fetchMeetings();
    fetchStudents();
    fetchUsers();
  }, [filters]);

  const fetchMeetings = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await axios.get('/api/meetings', { params });
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMeeting) {
        await axios.put(`/api/meetings/${editingMeeting._id}`, formData);
      } else {
        if (isParent) {
          formData.parentId = user.id;
        } else if (isTeacher) {
          formData.teacherId = user.id;
        }
        await axios.post('/api/meetings', formData);
      }
      setShowModal(false);
      setEditingMeeting(null);
      resetForm();
      fetchMeetings();
    } catch (error) {
      console.error('Error saving meeting:', error);
      alert('Error saving meeting');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;
    try {
      await axios.delete(`/api/meetings/${id}`);
      fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      alert('Error deleting meeting');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/meetings/${id}/status`, { status });
      fetchMeetings();
    } catch (error) {
      console.error('Error updating meeting status:', error);
      alert('Error updating meeting status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      parentId: '',
      teacherId: '',
      studentId: '',
      scheduledDate: '',
      duration: 30,
      location: 'in-person',
      meetingLink: '',
      notes: '',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 page-hero">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Meetings</h1>
            <p className="text-slate-300 mt-2">Schedule and manage parent-teacher meetings</p>
          </div>
          <button
            onClick={() => {
              setEditingMeeting(null);
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transform transition"
          >
            <FiPlus size={20} />
            <span>Schedule Meeting</span>
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-lg p-4 card bg-gradient-to-br from-indigo-800/20 to-slate-900/10 border border-amber-800/12 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>
        </div>

        {/* Meetings List */}
        <div className="grid gap-6">
          {meetings.length === 0 ? (
            <div className="bg-slate-900/40 rounded-lg shadow p-8 text-center">
              <p className="text-slate-300">No meetings found</p>
            </div>
          ) : (
            meetings.map((meeting) => (
              <div key={meeting._id} className="bg-gradient-to-br from-indigo-800/10 to-slate-900/20 rounded-lg shadow p-6 card border border-amber-800/12 hover:scale-[1.01] transform transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-100">{meeting.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-4">{meeting.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Date:</strong> {format(new Date(meeting.scheduledDate), 'MMM dd, yyyy HH:mm')}
                      </div>
                      <div>
                        <strong>Duration:</strong> {meeting.duration} min
                      </div>
                      <div>
                        <strong>Location:</strong> {meeting.location}
                      </div>
                      <div>
                        <strong>Student:</strong> {meeting.studentId?.firstName} {meeting.studentId?.lastName}
                      </div>
                    </div>
                    {isParent && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Teacher:</strong> {meeting.teacherId?.firstName} {meeting.teacherId?.lastName}
                      </div>
                    )}
                    {isTeacher && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Parent:</strong> {meeting.parentId?.firstName} {meeting.parentId?.lastName}
                      </div>
                    )}
                    {meeting.notes && (
                      <div className="mt-4 p-3 bg-slate-800/30 rounded">
                        <strong className="text-sm text-slate-200">Notes:</strong>
                        <p className="text-sm text-slate-300 mt-1">{meeting.notes}</p>
                      </div>
                    )}
                  </div>
                    <div className="flex flex-col space-y-2 ml-4">
                    {(isParent || isTeacher) && meeting.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(meeting._id, 'confirmed')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(meeting._id, 'cancelled')}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {(isParent || isTeacher) && meeting.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(meeting._id, 'completed')}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Mark Complete
                      </button>
                    )}
                      <button
                        onClick={() => {
                          setEditingMeeting(meeting);
                          setFormData({
                            title: meeting.title,
                            description: meeting.description || '',
                            parentId: meeting.parentId?._id || meeting.parentId,
                            teacherId: meeting.teacherId?._id || meeting.teacherId,
                            studentId: meeting.studentId?._id || meeting.studentId,
                            scheduledDate: format(new Date(meeting.scheduledDate), "yyyy-MM-dd'T'HH:mm"),
                            duration: meeting.duration || 30,
                            location: meeting.location || 'in-person',
                            meetingLink: meeting.meetingLink || '',
                            notes: meeting.notes || '',
                          });
                          setShowModal(true);
                        }}
                        className="p-2 text-amber-300 hover:bg-amber-800/10 rounded transition"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(meeting._id)}
                        className="p-2 text-red-400 hover:bg-red-800/10 rounded transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal - moved outside constrained container */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 text-slate-100 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-800/12">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-100 mb-4">
                {editingMeeting ? 'Edit Meeting' : 'Schedule Meeting'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Student</label>
                    <select
                      required
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      <option value="">Select Student</option>
                      {students.map((student) => (
                        <option key={student._id} value={student._id} className="text-slate-100">
                          {student.firstName} {student.lastName} - {student.studentId}
                        </option>
                      ))}
                    </select>
                  </div>
                  {isParent && (
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-1">Teacher</label>
                      <select
                        required
                        value={formData.teacherId}
                        onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                      >
                        <option value="">Select Teacher</option>
                        {users.filter(u => u.role === 'teacher').map((teacher) => (
                          <option key={teacher._id} value={teacher._id} className="text-slate-100">
                            {teacher.firstName} {teacher.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {isTeacher && (
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-1">Parent</label>
                      <select
                        required
                        value={formData.parentId}
                        onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                      >
                        <option value="">Select Parent</option>
                        {users.filter(u => u.role === 'parent').map((parent) => (
                          <option key={parent._id} value={parent._id} className="text-slate-100">
                            {parent.firstName} {parent.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Duration (min)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Location</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      <option value="in-person">In-Person</option>
                      <option value="online">Online</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                </div>
                {formData.location === 'online' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Meeting Link</label>
                    <input
                      type="url"
                      value={formData.meetingLink}
                      onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingMeeting(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-amber-800/12 rounded-md text-slate-200 hover:bg-slate-800/50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-95"
                  >
                    {editingMeeting ? 'Update' : 'Schedule'}
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

export default Meetings;


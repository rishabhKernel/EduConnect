import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const Attendance = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'present',
    subject: '',
    notes: '',
  });
  const [students, setStudents] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkData, setBulkData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    subject: '',
    students: []
  });
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Physical Education'];
  const [filters, setFilters] = useState({
    studentId: '',
    startDate: '',
    endDate: '',
    status: '',
    subject: '',
  });
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    fetchAttendance();
    if (isTeacher) {
      fetchStudents();
    }
  }, [filters]);

  const fetchAttendance = async () => {
    try {
      const params = {};
      if (filters.studentId) params.studentId = filters.studentId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.status) params.status = filters.status;
      if (filters.subject) params.subject = filters.subject;

      const response = await axios.get('/api/attendance', { params });
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
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
      if (editingRecord) {
        await axios.put(`/api/attendance/${editingRecord._id}`, formData);
      } else {
        await axios.post('/api/attendance', formData);
      }
      setShowModal(false);
      setEditingRecord(null);
      setFormData({
        studentId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        status: 'present',
        subject: '',
        notes: '',
      });
      fetchAttendance();
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error saving attendance record');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
    try {
      await axios.delete(`/api/attendance/${id}`);
      fetchAttendance();
    } catch (error) {
      console.error('Error deleting attendance:', error);
      alert('Error deleting attendance record');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <div className="space-y-6 page-hero max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Attendance</h1>
              <p className="text-white mt-2">Track student attendance records</p>
            </div>
          {isTeacher && (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingRecord(null);
                  setFormData({
                    studentId: '',
                    date: format(new Date(), 'yyyy-MM-dd'),
                    status: 'present',
                    subject: '',
                    notes: '',
                  });
                  setShowModal(true);
                }}
                className="btn flex items-center space-x-2"
              >
                <FiPlus size={20} />
                <span>Mark Attendance</span>
              </button>
              <button
                onClick={() => {
                  setBulkData({
                    date: format(new Date(), 'yyyy-MM-dd'),
                    subject: '',
                    students: students.map(s => ({ id: s._id, name: `${s.firstName} ${s.lastName}`, status: 'present' }))
                  });
                  setShowBulkModal(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 hover-glow"
              >
                <FiPlus size={20} />
                <span>Bulk Attendance</span>
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-indigo-800/20 via-purple-800/10 to-slate-800/6 rounded-xl shadow-lg p-4 card border border-amber-600/6  backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {isTeacher && (
              <div>
                <label className="block text-sm font-medium text-white mb-1">Student</label>
                <select
                  value={filters.studentId}
                  onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/40  border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
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
              <label className="block text-sm font-medium  mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/40  border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium  mb-1">Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/40  border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium  mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/40  border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium  mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/40  border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-gradient-to-br from-indigo-800/10 via-purple-900/6 to-slate-800/6 rounded-xl shadow-xl overflow-hidden card border border-amber-600/6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-indigo-300">
              <thead className="bg-gradient-to-r from-indigo-700 to-amber-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Notes</th>
                  {isTeacher && (
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-indigo-50 ">
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={isTeacher ? 6 : 5} className="px-6 py-4 text-center text-indigo-600">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <tr key={record._id} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {format(new Date(record.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {record.studentId?.firstName} {record.studentId?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {record.subject || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm ">
                        {record.notes || '-'}
                      </td>
                      {isTeacher && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingRecord(record);
                                setFormData({
                                  studentId: record.studentId?._id || record.studentId,
                                  date: format(new Date(record.date), 'yyyy-MM-dd'),
                                  status: record.status,
                                  subject: record.subject || '',
                                  notes: record.notes || '',
                                });
                                setShowModal(true);
                              }}
                              className="text-amber-200 hover:text-amber-400 transition"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(record._id)}
                              className="text-red-400 hover:text-red-600 transition"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        </div>
      </div>

      {/* Modal - moved outside the constrained container */}
      {showModal && isTeacher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl border border-amber-800/10 text-slate-100">
            <div className="p-0 rounded-t-md overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-700 to-amber-500 p-4">
                <h2 className="text-2xl font-bold text-white mb-0">{editingRecord ? 'Edit Attendance' : 'Mark Attendance'}</h2>
              </div>
            </div>
            <div className="p-6 flex flex-col h-full">
              <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                <div className="overflow-y-auto pr-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Student</label>
                    <select
                      required
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40  border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
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
                      <label className="block text-sm font-medium  mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800/40  border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium  mb-1">Status</label>
                      <select
                        required
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Notes (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                </div>
                <div className="flex-shrink-0 sticky bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-4 flex justify-end space-x-4 border-t border-amber-800/20">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingRecord(null);
                    }}
                    className="px-4 py-2 border border-amber-400/10 rounded-md text-slate-200 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                  >
                    {editingRecord ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Attendance Modal - moved outside the constrained container */}
      {showBulkModal && isTeacher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl ring-1 ring-amber-800/8 text-slate-100">
            <div className="p-6 flex flex-col h-full">
              <h2 className="text-2xl font-semibold text-white mb-4">Bulk Attendance</h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={bulkData.date}
                      onChange={(e) => setBulkData({ ...bulkData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Subject</label>
                    <select
                      required
                      value={bulkData.subject}
                      onChange={(e) => setBulkData({ ...bulkData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject} className="bg-slate-700 text-slate-100">
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="max-h-[48vh] overflow-y-auto border border-amber-800/8 rounded-lg p-2 bg-slate-800/40">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 text-sm font-medium text-slate-200">Student</th>
                        <th className="text-left py-2 px-2 text-sm font-medium text-slate-200">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkData.students.map((student, index) => (
                        <tr key={student.id} className="border-b hover:bg-indigo-800/20">
                          <td className="py-2 px-2 text-sm text-slate-100 font-medium">{student.name}</td>
                          <td className="py-2 px-2">
                            <select
                              value={student.status}
                              onChange={(e) => {
                                const updated = [...bulkData.students];
                                updated[index].status = e.target.value;
                                setBulkData({ ...bulkData, students: updated });
                              }}
                              className="w-full px-2 py-1 border border-amber-400 rounded-md text-sm bg-slate-800/40 text-slate-100"
                            >
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                              <option value="late">Late</option>
                              <option value="excused">Excused</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex-shrink-0 sticky bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-4 flex justify-end space-x-4 border-t border-amber-800/20">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkModal(false);
                    setBulkData({ date: format(new Date(), 'yyyy-MM-dd'), subject: '', students: [] });
                  }}
                  className="px-4 py-2 border border-amber-400/10 rounded-md text-slate-200 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      const failedStudents = [];
                      for (const student of bulkData.students) {
                        try {
                          await axios.post('/api/attendance', {
                            studentId: student.id,
                            date: bulkData.date,
                            status: student.status,
                            subject: bulkData.subject,
                            notes: ''
                          });
                        } catch (error) {
                          console.error(`Error for student ${student.name}:`, error.response?.data?.message || error.message);
                          failedStudents.push({
                            name: student.name,
                            error: error.response?.data?.message || error.message
                          });
                        }
                      }
                      
                      if (failedStudents.length === 0) {
                        setShowBulkModal(false);
                        setBulkData({ date: format(new Date(), 'yyyy-MM-dd'), subject: '', students: [] });
                        fetchAttendance();
                        alert('Bulk attendance saved successfully!');
                      } else if (failedStudents.length === bulkData.students.length) {
                        const errorMsg = failedStudents[0].error;
                        alert(`Failed to save attendance:\n${errorMsg}`);
                      } else {
                        const successCount = bulkData.students.length - failedStudents.length;
                        alert(`Saved ${successCount} records. Failed: ${failedStudents.map(s => s.name).join(', ')}`);
                        setShowBulkModal(false);
                        setBulkData({ date: format(new Date(), 'yyyy-MM-dd'), subject: '', students: [] });
                        fetchAttendance();
                      }
                    } catch (error) {
                      console.error('Error saving bulk attendance:', error);
                      alert('Unexpected error while saving bulk attendance.');
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Attendance;

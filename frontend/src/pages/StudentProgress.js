import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

const StudentProgress = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    gradeType: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchGrades();
    }
  }, [selectedStudent, filters]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
      if (response.data.length > 0 && !selectedStudent) {
        setSelectedStudent(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const params = { studentId: selectedStudent, ...filters };
      const response = await axios.get('/api/grades', { params });
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const calculateAverage = (subject) => {
    const subjectGrades = grades.filter(g => !subject || g.subject === subject);
    if (subjectGrades.length === 0) return 0;
    const sum = subjectGrades.reduce((acc, g) => acc + (g.grade / g.maxGrade * 100), 0);
    return Math.round(sum / subjectGrades.length);
  };

  const subjects = [...new Set(grades.map(g => g.subject))];

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
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Student Progress</h1>
          <p className="text-slate-300 mt-2">Track academic performance and grades</p>
        </div>

        {/* Student Selector */}
        {user?.role === 'parent' && students.length > 1 && (
          <div className="bg-gradient-to-br from-indigo-800/20 to-slate-900/10 rounded-lg shadow p-4 card border border-amber-800/12">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Select Student
            </label>
            <select
              value={selectedStudent || ''}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              {students.map((student) => (
                <option key={student._id} value={student._id} className="text-slate-100">
                  {student.firstName} {student.lastName} - {student.studentId}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filters */}
        <div className="rounded-lg p-6 card bg-gradient-to-br from-indigo-800/20 to-slate-900/10 border border-amber-800/12 shadow-inner">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Subject</label>
              <select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject} className="text-slate-100">{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Grade Type</label>
              <select
                name="gradeType"
                value={filters.gradeType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">All Types</option>
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
                <option value="project">Project</option>
                <option value="participation">Participation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-800/40 text-slate-100 border border-amber-800/12 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>
        </div>

        {/* Subject Averages */}
        {subjects.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-800/10 to-slate-900/20 rounded-lg shadow p-6 card border border-amber-800/12">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Subject Averages</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subjects.map((subject) => {
                const avg = calculateAverage(subject);
                return (
                    <div key={subject} className="p-4 bg-slate-800/30 rounded-lg card">
                    <p className="text-sm text-slate-300">{subject}</p>
                    <p className="text-2xl font-bold text-white mt-2">{avg}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Grades Table */}
        <div className="bg-gradient-to-br from-indigo-900/10 to-slate-900/20 rounded-lg shadow overflow-hidden card border border-amber-800/12">
          <div className="px-6 py-4 border-b border-amber-800/12">
            <h2 className="text-lg font-semibold text-slate-100">Grade History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-800/12">
              <thead className="bg-slate-800/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase">Comments</th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-amber-800/12">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-slate-300">
                      No grades found
                    </td>
                  </tr>
                ) : (
                  grades.map((grade) => {
                    const percentage = Math.round((grade.grade / grade.maxGrade) * 100);
                    return (
                      <tr key={grade._id} className="hover:bg-slate-800/10">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                          {format(new Date(grade.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                          {grade.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100 capitalize">
                          {grade.gradeType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                          {grade.grade} / {grade.maxGrade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-medium ${percentage >= 80 ? 'text-green-400' : percentage >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                            {percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {grade.comments || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProgress;


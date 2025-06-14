import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents, deleteStudent, deleteUser, getUser } from '../services/api';
import Header from '../components/Header';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
  
  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');      const response = await getStudents();
      console.log('🔍 Frontend - API Response:', response);
      if (response.success) {
        console.log('🔍 Frontend - Students data:', response.data);
        console.log('🔍 Frontend - Student count:', response.data?.length);
        console.log('🔍 Frontend - Student names:', response.data?.map(s => s.name));
        setStudents(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch students');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = getUser();
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchStudents();
  }, [navigate, fetchStudents]);
  const handleDeleteStudent = async (studentId, source) => {
    const studentType = source === 'registration' ? 'registered student' : 'manually added student';
    if (!window.confirm(`Are you sure you want to delete this ${studentType}?`)) {
      return;
    }

    try {
      setDeleteLoading(studentId);
      
      // Use different API endpoints based on source
      let response;
      if (source === 'registration') {
        // For registered users, we'll need a different endpoint
        response = await deleteUser(studentId);
      } else {
        // For manual students
        response = await deleteStudent(studentId);
      }
      
      if (response.success) {
        setStudents(students.filter(student => student._id !== studentId));
      } else {
        setError(response.message || `Failed to delete ${studentType}`);
      }
    } catch (err) {
      setError(err.message || `Failed to delete ${studentType}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage students and system administration
              </p>
            </div>            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => navigate('/add-student')}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Student
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Students
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {students.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Registered Students
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {students.filter(s => s.source === 'registration').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">➕</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Manual Entries
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {students.filter(s => s.source === 'manual').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">📚</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Classes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {new Set(students.map(s => s.class).filter(c => c && c !== 'Not specified')).size}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Students Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Students List
                </h3>
                <div className="max-w-lg w-full lg:max-w-xs">
                  <input
                    type="text"
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>              {filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No students found.</p>
                  <button
                    onClick={() => navigate('/add-student')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add First Student
                  </button>
                </div>
              ) : (                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.email || 'Not provided'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.age || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.class || student.course || 'Not specified'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              student.source === 'registration' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {student.source === 'registration' ? 'Registered' : 'Manual'}
                            </span>
                          </td>                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/edit-student/${student._id}?source=${student.source}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student._id, student.source)}
                                disabled={deleteLoading === student._id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                {deleteLoading === student._id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = '/.netlify/functions';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    course: '',
    phone: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    console.log('📱 App component mounted');
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading students...');
      
      const response = await fetch(`${API_BASE}/students`);
      if (!response.ok) throw new Error('Failed to load students');
      
      const data = await response.json();
      setStudents(data);
      console.log('✅ Students loaded:', data.length);
    } catch (error) {
      console.error('❌ Error loading students:', error);
      showNotification('Error loading students. Using offline mode.', 'error');
      
      // Fallback to localStorage for development
      const localData = localStorage.getItem('students');
      if (localData) {
        const parsedData = JSON.parse(localData);
        setStudents(parsedData);
        console.log('📦 Loaded from localStorage:', parsedData.length);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveStudent = async (studentData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });
      
      if (!response.ok) {
        // Fallback to localStorage if API fails
        const newStudent = { ...studentData, id: Date.now().toString() };
        const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
        const updatedStudents = [...existingStudents, newStudent];
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        setStudents(updatedStudents);
        showNotification('Student saved locally!', 'success');
      } else {
        showNotification('Student saved successfully!', 'success');
        await loadStudents();
      }
      
      clearForm();
    } catch (error) {
      console.error('Error saving student:', error);
      showNotification('Error saving student', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/students?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });
      
      if (!response.ok) {
        // Fallback to localStorage
        const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
        const updatedStudents = existingStudents.map(student => 
          (student.id === id || student._id === id) ? { ...student, ...studentData } : student
        );
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        setStudents(updatedStudents);
        showNotification('Student updated locally!', 'success');
      } else {
        showNotification('Student updated successfully!', 'success');
        await loadStudents();
      }
      
      clearForm();
    } catch (error) {
      console.error('Error updating student:', error);
      showNotification('Error updating student', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/students?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        // Fallback to localStorage
        const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
        const updatedStudents = existingStudents.filter(student => 
          student.id !== id && student._id !== id
        );
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        setStudents(updatedStudents);
        showNotification('Student deleted locally!', 'success');
      } else {
        showNotification('Student deleted successfully!', 'success');
        await loadStudents();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      showNotification('Error deleting student', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      updateStudent(editingId, formData);
    } else {
      saveStudent(formData);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      studentId: student.studentId || '',
      name: student.name || '',
      email: student.email || '',
      course: student.course || '',
      phone: student.phone || ''
    });
    setEditingId(student._id || student.id);
  };

  const clearForm = () => {
    setFormData({
      studentId: '',
      name: '',
      email: '',
      course: '',
      phone: ''
    });
    setEditingId(null);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const filteredStudents = students.filter(student =>
    (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.course || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const totalCourses = [...new Set(students.map(s => s.course).filter(Boolean))].length;

  return (
    <div className="App">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}

      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="container">
        <h1>Student Management System</h1>
        
        {/* Dashboard */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p>{totalStudents}</p>
          </div>
          <div className="stat-card">
            <h3>Total Courses</h3>
            <p>{totalCourses}</p>
          </div>
        </div>

        {/* Search */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Form */}
        <div className="form-section">
          <h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Student ID:</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Course:</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            
            <button type="submit">
              {editingId ? 'Update Student' : 'Add Student'}
            </button>
            <button type="button" onClick={clearForm}>
              Clear Form
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="table-section">
          <h2>Student Records ({filteredStudents.length})</h2>
          <div className="table-container">
            {filteredStudents.length === 0 ? (
              <p className="no-data">No students found. Add your first student above!</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student._id || student.id}>
                      <td>{student.studentId || 'N/A'}</td>
                      <td>{student.name || 'N/A'}</td>
                      <td>{student.email || 'N/A'}</td>
                      <td>{student.course || 'N/A'}</td>
                      <td>{student.phone || 'N/A'}</td>
                      <td>
                        <button 
                          onClick={() => handleEdit(student)}
                          className="btn-edit"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteStudent(student._id || student.id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

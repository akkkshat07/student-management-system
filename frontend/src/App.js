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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStudents(data);
      console.log('✅ Students loaded:', data.length);
    } catch (error) {
      console.error('❌ Error loading students:', error);
      showNotification('Using offline mode - data stored locally', 'error');
      
      // Fallback to localStorage
      const localData = localStorage.getItem('students');
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          setStudents(parsedData);
          console.log('📦 Loaded from localStorage:', parsedData.length);
        } catch (parseError) {
          console.error('Error parsing localStorage data:', parseError);
          setStudents([]);
        }
      } else {
        setStudents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (studentsData) => {
    try {
      localStorage.setItem('students', JSON.stringify(studentsData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
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
        throw new Error('Network request failed');
      }
      
      showNotification('Student saved successfully!', 'success');
      await loadStudents();
      clearForm();
    } catch (error) {
      console.error('Error saving student:', error);
      
      // Fallback to localStorage
      const newStudent = { 
        ...studentData, 
        id: Date.now().toString(),
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      saveToLocalStorage(updatedStudents);
      showNotification('Student saved locally!', 'success');
      clearForm();
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
        throw new Error('Network request failed');
      }
      
      showNotification('Student updated successfully!', 'success');
      await loadStudents();
      clearForm();
    } catch (error) {
      console.error('Error updating student:', error);
      
      // Fallback to localStorage
      const updatedStudents = students.map(student => 
        (student.id === id || student._id === id) 
          ? { ...student, ...studentData, updatedAt: new Date().toISOString() } 
          : student
      );
      setStudents(updatedStudents);
      saveToLocalStorage(updatedStudents);
      showNotification('Student updated locally!', 'success');
      clearForm();
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
        throw new Error('Network request failed');
      }
      
      showNotification('Student deleted successfully!', 'success');
      await loadStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      
      // Fallback to localStorage
      const updatedStudents = students.filter(student => 
        student.id !== id && student._id !== id
      );
      setStudents(updatedStudents);
      saveToLocalStorage(updatedStudents);
      showNotification('Student deleted locally!', 'success');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email) {
      showNotification('Please fill in required fields', 'error');
      return;
    }
    
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
    Object.values(student).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
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
        <h1>🎓 Student Management System</h1>
        
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
            placeholder="🔍 Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Form */}
        <div className="form-section">
          <h2>{editingId ? '✏️ Edit Student' : '➕ Add New Student'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Student ID:</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  placeholder="Enter student ID"
                />
              </div>
              
              <div className="form-group">
                <label>Full Name: *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email: *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Course:</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  placeholder="Enter course name"
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="form-buttons">
              <button type="submit">
                {editingId ? '🔄 Update Student' : '➕ Add Student'}
              </button>
              <button type="button" onClick={clearForm}>
                🗑️ Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="table-section">
          <h2>📊 Student Records ({filteredStudents.length})</h2>
          <div className="table-container">
            {filteredStudents.length === 0 ? (
              <div className="no-data">
                {students.length === 0 ? (
                  <div>
                    <h3>🚀 Welcome to Student Management System!</h3>
                    <p>No students added yet. Use the form above to add your first student.</p>
                  </div>
                ) : (
                  <p>No students match your search criteria.</p>
                )}
              </div>
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
                    <tr key={student._id || student.id || Math.random()}>
                      <td>{student.studentId || '-'}</td>
                      <td>{student.name || '-'}</td>
                      <td>{student.email || '-'}</td>
                      <td>{student.course || '-'}</td>
                      <td>{student.phone || '-'}</td>
                      <td>
                        <button 
                          onClick={() => handleEdit(student)}
                          className="btn-edit"
                          title="Edit student"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => deleteStudent(student._id || student.id)}
                          className="btn-delete"
                          title="Delete student"
                        >
                          🗑️ Delete
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

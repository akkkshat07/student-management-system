// API Configuration - Update this with your deployed backend URL
const API_BASE_URL = 'https://your-backend-app.railway.app/api'; // or your Heroku URL

// Example API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const API_BASE = '/.netlify/functions';
let students = [];
let editingStudentId = null;

// API Functions
async function loadStudents() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/students`);
        if (!response.ok) throw new Error('Failed to load students');
        
        students = await response.json();
        displayStudents(students);
        updateDashboard();
    } catch (error) {
        console.error('Error loading students:', error);
        showNotification('Error loading students. Using offline mode.', 'error');
        // Fallback to localStorage for development
        const localData = localStorage.getItem('students');
        if (localData) {
            students = JSON.parse(localData);
            displayStudents(students);
        }
    } finally {
        showLoading(false);
    }
}

async function saveStudent(studentData) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        
        if (!response.ok) throw new Error('Failed to save student');
        
        showNotification('Student saved successfully!', 'success');
        await loadStudents();
        clearForm();
    } catch (error) {
        console.error('Error saving student:', error);
        showNotification('Error saving student', 'error');
    } finally {
        showLoading(false);
    }
}

async function updateStudent(id, studentData) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/students?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        
        if (!response.ok) throw new Error('Failed to update student');
        
        showNotification('Student updated successfully!', 'success');
        await loadStudents();
        clearForm();
        editingStudentId = null;
    } catch (error) {
        console.error('Error updating student:', error);
        showNotification('Error updating student', 'error');
    } finally {
        showLoading(false);
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/students?id=${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete student');
        
        showNotification('Student deleted successfully!', 'success');
        await loadStudents();
    } catch (error) {
        console.error('Error deleting student:', error);
        showNotification('Error deleting student', 'error');
    } finally {
        showLoading(false);
    }
}

// UI Functions
function displayStudents(studentList) {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    studentList.forEach(student => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${student.studentId || 'N/A'}</td>
            <td>${student.name || 'N/A'}</td>
            <td>${student.email || 'N/A'}</td>
            <td>${student.course || 'N/A'}</td>
            <td>${student.phone || 'N/A'}</td>
            <td>
                <button onclick="editStudent('${student._id || student.id}')" class="btn-edit">Edit</button>
                <button onclick="deleteStudent('${student._id || student.id}')" class="btn-delete">Delete</button>
            </td>
        `;
    });
}

function editStudent(id) {
    const student = students.find(s => (s._id || s.id) === id);
    if (!student) return;
    
    document.getElementById('studentId').value = student.studentId || '';
    document.getElementById('name').value = student.name || '';
    document.getElementById('email').value = student.email || '';
    document.getElementById('course').value = student.course || '';
    document.getElementById('phone').value = student.phone || '';
    
    editingStudentId = id;
    document.getElementById('submitBtn').textContent = 'Update Student';
}

function clearForm() {
    document.getElementById('studentForm').reset();
    editingStudentId = null;
    document.getElementById('submitBtn').textContent = 'Add Student';
}

function updateDashboard() {
    const totalStudents = students.length;
    const courses = [...new Set(students.map(s => s.course).filter(Boolean))];
    
    const dashboardElement = document.getElementById('dashboard');
    if (dashboardElement) {
        dashboardElement.innerHTML = `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Total Students</h3>
                    <p>${totalStudents}</p>
                </div>
                <div class="stat-card">
                    <h3>Total Courses</h3>
                    <p>${courses.length}</p>
                </div>
            </div>
        `;
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showLoading(show) {
    let loader = document.getElementById('loader');
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader';
            loader.className = 'loader';
            loader.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(loader);
        }
    } else {
        if (loader) {
            loader.remove();
        }
    }
}

function searchStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredStudents = students.filter(student => 
        (student.name || '').toLowerCase().includes(searchTerm) ||
        (student.email || '').toLowerCase().includes(searchTerm) ||
        (student.course || '').toLowerCase().includes(searchTerm) ||
        (student.studentId || '').toLowerCase().includes(searchTerm)
    );
    displayStudents(filteredStudents);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    
    const form = document.getElementById('studentForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const studentData = {
                studentId: document.getElementById('studentId').value,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                course: document.getElementById('course').value,
                phone: document.getElementById('phone').value
            };
            
            if (editingStudentId) {
                updateStudent(editingStudentId, studentData);
            } else {
                saveStudent(studentData);
            }
        });
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchStudents);
    }
});
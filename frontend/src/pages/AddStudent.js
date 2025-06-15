import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStudent } from '../services/api';
import Header from '../components/Header';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    class: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age <= 0) {
        newErrors.age = 'Age must be a positive number';
      } else if (age > 100) {
        newErrors.age = 'Age must be less than 100';
      }
    }

    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    } else if (formData.class.trim().length < 1) {
      newErrors.class = 'Class cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');
    try {
      const studentData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        age: parseInt(formData.age),
        class: formData.class.trim()
      };

      const response = await addStudent(studentData);

      if (response.success) {
        navigate('/dashboard');
      } else {
        setApiError(response.message || 'Failed to add student');
      }
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        setApiError(error.errors.join(', '));
      } else {
        setApiError(error.message || 'An error occurred while adding student');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
            <p className="mt-1 text-sm text-gray-600">
              Fill in the student information below to add them to the system.
            </p>
          </div>
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {apiError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{apiError}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="form-label">Student Name</label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                      placeholder="Enter student's full name"
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                      placeholder="Enter student's email address"
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="age" className="form-label">Age</label>
                  <div className="mt-1">
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.age}
                      onChange={handleChange}
                      className={`input-field ${errors.age ? 'border-red-300 focus:ring-red-500' : ''}`}
                      placeholder="Enter student's age"
                    />
                    {errors.age && <p className="error-message">{errors.age}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="class" className="form-label">Class</label>
                  <div className="mt-1">
                    <input
                      id="class"
                      name="class"
                      type="text"
                      value={formData.class}
                      onChange={handleChange}
                      className={`input-field ${errors.class ? 'border-red-300 focus:ring-red-500' : ''}`}
                      placeholder="Enter student's class"
                    />
                    {errors.class && <p className="error-message">{errors.class}</p>}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Adding Student...' : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;

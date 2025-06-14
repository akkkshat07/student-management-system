import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStudent } from '../services/api';
import Header from '../components/Header';

const AddStudent = () => {  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    class: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear API error
    if (apiError) {
      setApiError('');
    }
  };
  // Validate form
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
    }    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    } else if (formData.class.trim().length < 1) {
      newErrors.class = 'Class cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');    try {      const studentData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        age: parseInt(formData.age),
        class: formData.class.trim()
      };

      console.log('📤 Sending student data:', studentData);
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
            <p className="mt-1 text-sm text-gray-600">
              Fill in the student information below to add them to the system.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* API Error Display */}
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

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="form-label">
                    Student Name
                  </label>
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
                    {errors.name && (
                      <p className="error-message">{errors.name}</p>
                    )}
                  </div>                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
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
                    {errors.email && (
                      <p className="error-message">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Age Field */}
                <div>
                  <label htmlFor="age" className="form-label">
                    Age
                  </label>
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
                    {errors.age && (
                      <p className="error-message">{errors.age}</p>
                    )}
                  </div>
                </div>

                {/* Class Field */}
                <div>
                  <label htmlFor="class" className="form-label">
                    Class
                  </label>
                  <div className="mt-1">
                    <input
                      id="class"
                      name="class"
                      type="text"
                      value={formData.class}
                      onChange={handleChange}
                      className={`input-field ${errors.class ? 'border-red-300 focus:ring-red-500' : ''}`}
                      placeholder="Enter student's class (e.g., Grade 10, Computer Science)"
                    />
                    {errors.class && (
                      <p className="error-message">{errors.class}</p>
                    )}                  </div>                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn-primary ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Student...
                      </>
                    ) : (
                      'Add Student'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>          {/* Help Text */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex-shrink-0 mb-3">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Student Information Guidelines
                </h3>                <div className="text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1 text-left">                    <li>Student name should be their full name</li>
                    <li>Email address must be valid</li>
                    <li>Age should be between 1 and 100 years</li>
                    <li>Class can be grade level, course name, or program</li>
                    <li>All fields are required</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;

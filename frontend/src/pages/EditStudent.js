import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getStudent, getUserById, editStudent, editUser } from '../services/api';
import Header from '../components/Header';

const EditStudent = () => {  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    class: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStudent, setIsLoadingStudent] = useState(true);
  const [apiError, setApiError] = useState('');
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || 'manual';
  // Fetch student data on component mount
  useEffect(() => {
    if (id) {
      fetchStudentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const fetchStudentData = async () => {
    setIsLoadingStudent(true);
    setLoadError('');
    try {
      let response;
      if (source === 'registration') {
        response = await getUserById(id);
      } else {
        response = await getStudent(id);
      }
      
      if (response.success) {
        const student = response.data;        setFormData({
          name: student.name,
          email: student.email || '',
          age: student.age ? student.age.toString() : '',
          class: student.class || ''
        });
      } else {
        setLoadError(response.message || 'Failed to load student data');
      }
    } catch (error) {
      setLoadError(error.message || 'An error occurred while loading student data');
    } finally {
      setIsLoadingStudent(false);
    }
  };

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
      };      console.log('📤 Sending updated student data:', studentData);
      
      let response;
      if (source === 'registration') {
        response = await editUser(id, studentData);
      } else {
        response = await editStudent(id, studentData);
      }
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setApiError(response.message || 'Failed to update student');
      }
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        setApiError(error.errors.join(', '));
      } else {
        setApiError(error.message || 'An error occurred while updating student');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoadingStudent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading student data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error Loading Student</h3>
                  <p className="mt-2 text-sm text-red-700">{loadError}</p>
                  <div className="mt-4">
                    <button
                      onClick={fetchStudentData}
                      className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition duration-200"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="ml-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded transition duration-200"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update the student information below.
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
                )}                {/* Name Field */}
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
                  </div>
                </div>

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
                </div>                {/* Class Field */}
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
                    )}
                  </div>                </div>

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
                        Updating Student...
                      </>
                    ) : (
                      'Update Student'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Update Guidelines
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make sure to review all changes before updating</li>
                    <li>Student name should be their full name</li>
                    <li>Age should be between 1 and 100 years</li>
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

export default EditStudent;

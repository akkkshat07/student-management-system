import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

const Signup = () => {  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    class: '',
    role: 'student',
    adminCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('📤 Sending signup data:', formData);
    
    try {
      const response = await signup(formData);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Redirect to dashboard
        navigate('/dashboard');
      }    } catch (err) {
      console.error('❌ Signup error:', err);
      console.error('Error response:', err.response?.data);
      
      // Extract error message from the response
      let errorMessage = 'Registration failed';
      
      if (err.response?.data) {
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          // Handle validation errors array
          errorMessage = err.response.data.errors.join(', ');
        } else if (err.response.data.message) {
          // Handle single error message
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join Our Platform
          </h2>
          <p className="text-gray-600 mb-2">
            Create your student account to get started
          </p>
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-4 py-3 pl-11 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none relative block w-full px-4 py-3 pl-11 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Age and Class Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      required
                      min="1"
                      max="100"
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                      placeholder="Age"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                      Class *
                    </label>
                    <input
                      id="class"
                      name="class"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                      placeholder="Grade/Course"
                      value={formData.class}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength="6"
                      className="appearance-none relative block w-full px-4 py-3 pl-11 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>                {/* Role Selection */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 bg-white"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Admin Code Field - Only shown when admin role is selected */}
                {formData.role === 'admin' && (
                  <div>
                    <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Admin Invite Code
                      </span>
                    </label>
                    <input
                      id="adminCode"
                      name="adminCode"
                      type="password"
                      required={formData.role === 'admin'}
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                      placeholder="Enter admin invite code"
                      value={formData.adminCode}
                      onChange={handleChange}
                    />
                    <p className="mt-1 text-xs text-amber-600">
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Admin registration requires a valid invite code
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}          <div className="px-8 py-4 bg-gray-50 border-t">
            <p className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <span className="text-indigo-600 font-medium">Terms of Service</span>
              {' '}and{' '}
              <span className="text-indigo-600 font-medium">Privacy Policy</span>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
            <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600">Secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
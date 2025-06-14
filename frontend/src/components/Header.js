import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">
                Student Management
              </span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Dashboard
              </Link>              {user?.role === 'admin' && (
                <Link
                  to="/add-student"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Add Student
                </Link>
              )}
            </div>
          </div>

          {/* User info and logout */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="text-gray-700 font-medium">{user.name}</p>
                  <p className="text-gray-500 capitalize">{user.role}</p>
                </div>
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>          {user?.role === 'admin' && (
            <Link
              to="/add-student"
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Add Student
            </Link>
          )}
          
          {/* Mobile user info */}
          {user && (
            <div className="px-3 py-2 border-t border-gray-200 mt-3 pt-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{user.name}</p>
                  <p className="text-gray-500 text-sm capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;

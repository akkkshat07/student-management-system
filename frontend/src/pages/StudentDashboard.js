import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Verify user is a student
      if (parsedUser.role !== 'student') {
        navigate('/login');
        return;
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Mock data for student activities (in real app, this would come from API)
  const upcomingAssignments = [
    { id: 1, title: 'Mathematics Assignment', dueDate: '2025-06-20', subject: 'Mathematics' },
    { id: 2, title: 'Science Project', dueDate: '2025-06-22', subject: 'Science' },
    { id: 3, title: 'English Essay', dueDate: '2025-06-25', subject: 'English' }
  ];

  const recentGrades = [
    { id: 1, subject: 'Mathematics', assignment: 'Quiz 1', grade: 'A', date: '2025-06-10' },
    { id: 2, subject: 'Science', assignment: 'Lab Report', grade: 'B+', date: '2025-06-08' },
    { id: 3, subject: 'English', assignment: 'Essay 1', grade: 'A-', date: '2025-06-05' }
  ];

  const weeklySchedule = [
    { day: 'Monday', classes: ['Math 9:00 AM', 'Science 11:00 AM', 'English 2:00 PM'] },
    { day: 'Tuesday', classes: ['History 10:00 AM', 'PE 1:00 PM', 'Art 3:00 PM'] },
    { day: 'Wednesday', classes: ['Math 9:00 AM', 'Science 11:00 AM', 'Music 2:00 PM'] },
    { day: 'Thursday', classes: ['English 10:00 AM', 'History 1:00 PM', 'Math 3:00 PM'] },
    { day: 'Friday', classes: ['Science 9:00 AM', 'PE 11:00 AM', 'Study Hall 2:00 PM'] }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{getGreeting()}, {user?.name}!</h2>
              <p className="text-blue-100 mt-2">Ready to continue your learning journey?</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Today</p>
              <p className="text-xl font-semibold">{formatDate(currentTime)}</p>
              <p className="text-blue-100 text-lg">{formatTime(currentTime)}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assignments Due</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAssignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Grades</p>
                <p className="text-2xl font-bold text-gray-900">{recentGrades.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3M8 7h8" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Classes Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weeklySchedule.find(day => day.day === currentTime.toLocaleDateString('en-US', { weekday: 'long' }))?.classes.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Assignments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h3>
            </div>
            <div className="p-0">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition duration-150">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{assignment.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">Due: {assignment.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Grades</h3>
            </div>
            <div className="p-0">
              {recentGrades.map((grade) => (
                <div key={grade.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition duration-150">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{grade.assignment}</h4>
                      <p className="text-sm text-gray-600 mt-1">{grade.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{grade.grade}</p>
                      <p className="text-sm text-gray-500">{grade.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weeklySchedule.map((day) => (
                <div key={day.day} className={`p-4 rounded-lg border ${
                  day.day === currentTime.toLocaleDateString('en-US', { weekday: 'long' }) 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <h4 className={`font-semibold mb-3 ${
                    day.day === currentTime.toLocaleDateString('en-US', { weekday: 'long' }) 
                      ? 'text-blue-900' 
                      : 'text-gray-900'
                  }`}>
                    {day.day}
                  </h4>
                  <div className="space-y-2">
                    {day.classes.map((classItem, index) => (
                      <div key={index} className={`text-sm p-2 rounded ${
                        day.day === currentTime.toLocaleDateString('en-US', { weekday: 'long' }) 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-white text-gray-700'
                      }`}>
                        {classItem}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm font-medium text-gray-900">View Library</p>
              </button>
              
              <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Submit Assignment</p>
              </button>
              
              <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Study Groups</p>
              </button>
              
              <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <svg className="w-8 h-8 text-red-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Help & Support</p>
              </button>
            </div>
          </div>
        </div>      </div>
    </div>
  );
};

export default StudentDashboard;

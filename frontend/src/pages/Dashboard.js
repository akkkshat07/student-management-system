import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
   
      console.log('No user data found, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      console.log('User data:', user);
      console.log('User role:', user.role);

      if (user.role === 'admin') {
        console.log('Redirecting admin to admin dashboard');
        navigate('/admin-dashboard');
      } else if (user.role === 'student') {
        console.log('Redirecting student to student dashboard');
        navigate('/student-dashboard');
      } else {
        console.log('Unknown role, redirecting to login');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      <p>Loading dashboard...</p>
    </div>
  );
};

export default Dashboard;

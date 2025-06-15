import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.log('🚀 Starting React app...');

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('✅ React app rendered successfully');
  
  // Hide the fallback loading message
  setTimeout(() => {
    const fallbackElement = document.querySelector('.fallback');
    if (fallbackElement) {
      fallbackElement.style.display = 'none';
      console.log('🎯 Fallback message hidden');
    }
  }, 100);
  
} catch (error) {
  console.error('❌ React app failed to render:', error);
}
// Testing React step by step
console.log('🚀 Step 1: Loading React modules...');

try {
  // Test if React loads
  const React = require('react');
  console.log('✅ React loaded successfully:', React);
  
  const ReactDOM = require('react-dom/client');
  console.log('✅ ReactDOM loaded successfully:', ReactDOM);
  
  console.log('🚀 Step 2: Finding root element...');
  const rootElement = document.getElementById('root');
  console.log('📍 Root element found:', !!rootElement, rootElement);
  
  if (rootElement) {
    console.log('🚀 Step 3: Creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    console.log('✅ React root created:', root);
    
    console.log('🚀 Step 4: Creating simple React element...');
    // Create the simplest possible React element
    const SimpleElement = React.createElement(
      'div',
      {
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#ff00ff', // Purple screen
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontSize: '24px',
          fontFamily: 'Arial',
          zIndex: 9999
        }
      },
      React.createElement('h1', null, '🟣 REACT ELEMENT TEST'),
      React.createElement('p', null, 'This is a React.createElement - no JSX!'),
      React.createElement('p', null, 'Time: ' + new Date().toLocaleTimeString())
    );
    
    console.log('✅ React element created:', SimpleElement);
    
    console.log('🚀 Step 5: Rendering React element...');
    root.render(SimpleElement);
    console.log('✅ React element rendered!');
    
    // Alert after render
    setTimeout(() => {
      alert('🟣 REACT WORKING! React.createElement successfully rendered.');
    }, 500);
    
  } else {
    console.error('❌ Root element not found!');
    alert('❌ ERROR: Root element not found!');
  }
  
} catch (error) {
  console.error('❌ React loading error:', error);
  alert('❌ REACT ERROR: ' + error.message);
  
  // Fallback to plain JavaScript
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#ff0000;color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:24px;font-family:Arial;">
        <h1>❌ REACT FAILED TO LOAD</h1>
        <p>Error: ${error.message}</p>
        <p>Check console for details</p>
      </div>
    `;
  }
}

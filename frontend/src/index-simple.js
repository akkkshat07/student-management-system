// Simple DOM manipulation test - no React
console.log('🚀 Starting simple DOM test...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📍 DOM is ready');
    
    const rootElement = document.getElementById('root');
    console.log('📍 Root element found:', !!rootElement);
    
    if (rootElement) {
        // Clear any existing content
        rootElement.innerHTML = '';
        
        // Create a simple test div
        const testDiv = document.createElement('div');
        testDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #0000ff;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            font-size: 24px;
            font-family: Arial, sans-serif;
            z-index: 9999;
        `;
        
        testDiv.innerHTML = `
            <h1>🔵 BLUE SCREEN TEST</h1>
            <p>This is plain JavaScript - no React!</p>
            <p>Time: ${new Date().toLocaleTimeString()}</p>
            <button onclick="alert('JavaScript button works!')">Click me</button>
        `;
        
        rootElement.appendChild(testDiv);
        console.log('✅ Blue test screen created and added to DOM');
        
        // Show alert after a short delay
        setTimeout(() => {
            alert('🔵 JAVASCRIPT WORKING! Plain JS successfully modified the DOM.');
        }, 500);
    } else {
        console.error('❌ Root element not found!');
        alert('❌ ERROR: Root element not found in the DOM!');
    }
});

console.log('✅ Script loaded successfully');

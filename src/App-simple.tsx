import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue' }}>Stock Dashboard</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        borderRadius: '5px',
        marginTop: '10px'
      }}>
        <h2>Test Section</h2>
        <p>This is a test to verify the React app is mounting correctly.</p>
        <button style={{ 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App;
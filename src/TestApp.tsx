function TestApp() {
  console.log('TestApp rendering...');
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: '#ffffff',
      minHeight: '100vh',
      color: '#000000'
    }}>
      <h1 style={{ color: 'green', fontSize: '24px', marginBottom: '10px' }}>
        Test Page - React is Working!
      </h1>
      <p style={{ fontSize: '16px', marginBottom: '10px' }}>
        If you can see this, React is rendering properly.
      </p>
      <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        marginTop: '20px',
        border: '1px solid #ccc'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Debug Info:</h2>
        <p>Current time: {new Date().toLocaleString()}</p>
        <p>Environment: {import.meta.env.MODE}</p>
        <p>NODE_ENV: {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
}

export default TestApp;

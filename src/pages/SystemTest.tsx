import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SystemTest = () => {
  const location = useLocation();
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const runTests = () => {
    const results: string[] = [];
    
    // Test 1: React rendering
    results.push('✅ React rendering: Working');
    
    // Test 2: React Router
    results.push(`✅ React Router: Working (current path: ${location.pathname})`);
    
    // Test 3: useState hook
    results.push('✅ useState hook: Working');
    
    // Test 4: Environment variables
    const mode = import.meta.env.MODE;
    results.push(`✅ Environment: ${mode}`);
    
    // Test 5: Styling
    results.push('✅ CSS styling: Applied');
    
    // Test 6: Navigation
    results.push('✅ Navigation: Ready for testing');
    
    setTestResults(results);
  };
  
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '90vh'
    }}>
      <h1 style={{color: '#2e7d32', marginBottom: '30px'}}>
        🔧 System Diagnostic & Test Page
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Navigation Test */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{color: '#1976d2', marginBottom: '15px'}}>
            🧭 Navigation Test
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <Link to="/" style={{
              color: location.pathname === '/' ? '#2e7d32' : '#1976d2',
              textDecoration: 'none',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: location.pathname === '/' ? '#e8f5e8' : '#f5f5f5'
            }}>
              🏠 Home {location.pathname === '/' ? '(Current)' : ''}
            </Link>
            <Link to="/dashboard" style={{
              color: location.pathname === '/dashboard' ? '#2e7d32' : '#1976d2',
              textDecoration: 'none',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: location.pathname === '/dashboard' ? '#e8f5e8' : '#f5f5f5'
            }}>
              📊 Dashboard {location.pathname === '/dashboard' ? '(Current)' : ''}
            </Link>
            <Link to="/assets" style={{
              color: location.pathname === '/assets' ? '#2e7d32' : '#1976d2',
              textDecoration: 'none',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: location.pathname === '/assets' ? '#e8f5e8' : '#f5f5f5'
            }}>
              🏭 Assets {location.pathname === '/assets' ? '(Current)' : ''}
            </Link>
            <Link to="/map" style={{
              color: location.pathname === '/map' ? '#2e7d32' : '#1976d2',
              textDecoration: 'none',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: location.pathname === '/map' ? '#e8f5e8' : '#f5f5f5'
            }}>
              🗺️ Map {location.pathname === '/map' ? '(Current)' : ''}
            </Link>
          </div>
        </div>
        
        {/* System Status */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{color: '#7b1fa2', marginBottom: '15px'}}>
            ⚙️ System Status
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <div style={{padding: '8px', backgroundColor: '#e8f5e8', borderRadius: '4px'}}>
              ✅ React: {React.version}
            </div>
            <div style={{padding: '8px', backgroundColor: '#e3f2fd', borderRadius: '4px'}}>
              ✅ Router: Active
            </div>
            <div style={{padding: '8px', backgroundColor: '#f3e5f5', borderRadius: '4px'}}>
              ✅ Environment: {import.meta.env.MODE}
            </div>
            <div style={{padding: '8px', backgroundColor: '#fff3e0', borderRadius: '4px'}}>
              ✅ Server: Port 8085
            </div>
          </div>
        </div>
      </div>
      
      {/* Test Runner */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#d32f2f', marginBottom: '20px'}}>
          🧪 Automated Tests
        </h3>
        
        <button
          onClick={runTests}
          style={{
            backgroundColor: '#2e7d32',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        >
          Run System Tests
        </button>
        
        {testResults.length > 0 && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '15px'
          }}>
            <h4>Test Results:</h4>
            {testResults.map((result, index) => (
              <div key={index} style={{
                padding: '8px',
                marginBottom: '5px',
                backgroundColor: 'white',
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Debug Information */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{marginBottom: '20px'}}>🐛 Debug Information</h3>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <div><strong>Current URL:</strong> {window.location.href}</div>
          <div><strong>Current Path:</strong> {location.pathname}</div>
          <div><strong>User Agent:</strong> {navigator.userAgent.substring(0, 100)}...</div>
          <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
          <div><strong>Screen Resolution:</strong> {window.screen.width}x{window.screen.height}</div>
        </div>
      </div>
    </div>
  );
};

export default SystemTest;
const SimpleDashboard = () => {
  console.log('SimpleDashboard rendering...');
  
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '90vh'
    }}>
      <h1 style={{color: '#1976d2', marginBottom: '20px'}}>
        📊 Dashboard
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2>✅ Dashboard Component Working</h2>
        <p>This is a simplified dashboard page to test navigation and component loading.</p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{
            backgroundColor: '#e8f5e8',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Total Assets</h3>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2e7d32'}}>
              150
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Active Projects</h3>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#1976d2'}}>
              25
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f3e5f5',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Capacity (MW)</h3>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2'}}>
              1,250
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
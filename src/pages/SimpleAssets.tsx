const SimpleAssets = () => {
  console.log('SimpleAssets rendering...');
  
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '90vh'
    }}>
      <h1 style={{color: '#1976d2', marginBottom: '20px'}}>
        🏭 Asset Management
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2>✅ Assets Component Working</h2>
        <p>This is a simplified assets page to test navigation and component loading.</p>
        
        <div style={{marginTop: '20px'}}>
          <h3>Sample Assets:</h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '15px'
          }}>
            {[
              {name: 'Hydrogen Plant Alpha', type: 'Production', status: 'Operational'},
              {name: 'Storage Facility Beta', type: 'Storage', status: 'Under Construction'},
              {name: 'Pipeline Gamma', type: 'Transport', status: 'Planned'},
              {name: 'Wind Farm Delta', type: 'Renewable', status: 'Operational'}
            ].map((asset, index) => (
              <div key={index} style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{asset.name}</strong>
                  <div style={{fontSize: '14px', color: '#666'}}>{asset.type}</div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  backgroundColor: asset.status === 'Operational' ? '#e8f5e8' : '#fff3e0',
                  color: asset.status === 'Operational' ? '#2e7d32' : '#f57c00'
                }}>
                  {asset.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAssets;
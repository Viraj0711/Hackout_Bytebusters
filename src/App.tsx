import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SimpleHeader } from './components/Layout/SimpleHeader';

// Pages
import Landing from './pages/SimpleLanding';
import SafeDashboard from './pages/SafeDashboard';
import SimpleAssets from './pages/SimpleAssets';
import Map from './pages/Map';
import SafeAnalytics from './pages/SafeAnalytics';
import SafeOptimization from './pages/SafeOptimization';
import SafeSettings from './pages/SafeSettings';
import SafeAdmin from './pages/SafeAdmin';
import Profile from './pages/Profile';

function App() {
  try {
    
    return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <SimpleHeader />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<SafeDashboard />} />
              <Route path="/assets" element={<SimpleAssets />} />
              <Route path="/analytics" element={<SafeAnalytics />} />
              <Route path="/optimization" element={<SafeOptimization />} />
              <Route path="/map" element={<Map />} />
              <Route path="/settings" element={<SafeSettings />} />
              <Route path="/admin" element={<SafeAdmin />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffebee',
        color: '#c62828',
        minHeight: '100vh'
      }}>
        <h1>⚠️ App Component Error</h1>
        <p>Error in App component: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}

export default App;
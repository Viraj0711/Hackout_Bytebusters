import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SimpleHeader } from './components/Layout/SimpleHeader';
import { AuthProvider } from './context/AuthContext';

// Pages
import Landing from './pages/SimpleLanding';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SafeDashboard from './pages/SafeDashboard';
import SimpleAssets from './pages/SimpleAssets';
import Map from './pages/Map';
import MapTest from './pages/MapTest';
import SafeAnalytics from './pages/SafeAnalytics';
import EnhancedAnalytics from './pages/EnhancedAnalytics';
import ComprehensiveAnalytics from './pages/ComprehensiveAnalytics';
import SafeOptimization from './pages/SafeOptimization';
import OptimizationDashboard from './pages/OptimizationDashboard';
import RealTimeMonitoring from './pages/RealTimeMonitoring';
import SafeSettings from './pages/SafeSettings';
import EnhancedAdmin from './pages/EnhancedAdmin';
import EnhancedSettings from './pages/EnhancedSettings';
import Profile from './pages/Profile';

function App() {
  try {
    
    return (
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <SimpleHeader />
            <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<SafeDashboard />} />
              <Route path="/assets" element={<SimpleAssets />} />
              <Route path="/analytics" element={<SafeAnalytics />} />
              <Route path="/analytics-enhanced" element={<EnhancedAnalytics />} />
              <Route path="/analytics-comprehensive" element={<ComprehensiveAnalytics />} />
              <Route path="/optimization" element={<SafeOptimization />} />
              <Route path="/optimization-advanced" element={<OptimizationDashboard />} />
              <Route path="/monitoring" element={<RealTimeMonitoring />} />
              <Route path="/map" element={<Map />} />
              <Route path="/map-test" element={<MapTest />} />
              <Route path="/settings" element={<SafeSettings />} />
              <Route path="/settings-enhanced" element={<EnhancedSettings />} />
              <Route path="/admin" element={<EnhancedAdmin />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
      </AuthProvider>
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
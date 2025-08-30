import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Layout/Header';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Analytics from './pages/Analytics';
import Optimization from './pages/Optimization';
import Map from './pages/Map';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/optimization" element={<Optimization />} />
            <Route path="/map" element={<Map />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
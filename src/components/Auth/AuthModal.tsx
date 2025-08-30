import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User } from 'lucide-react';
import { User as UserType } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserType['role']>('analyst');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { email, password, passwordLength: password.length });
    
    setLoading(true);
    setError(null);

    try {
      console.log('Starting authentication process...');
      
      // Simple validation
      if (!email || !password) {
        console.log('Validation failed: missing email or password');
        throw new Error('Please enter both email and password');
      }

      if (!email.includes('@')) {
        console.log('Validation failed: invalid email format');
        throw new Error('Please enter a valid email address (must contain @)');
      }

      if (password.length < 6) {
        console.log('Validation failed: password too short');
        throw new Error('Password must be at least 6 characters long');
      }

      console.log('Validation passed, attempting authentication...');
      
      let authResult;
      
      if (isSignUp) {
        console.log('Attempting sign up...');
        authResult = await signUp(email, password, role);
      } else {
        console.log('Attempting sign in...');
        authResult = await signIn(email, password);
      }
      
      if (authResult.error) {
        console.log('Authentication failed with error:', authResult.error);
        // Since we're in demo mode and auth will create demo users, 
        // any error here means something is wrong with our demo setup
        throw new Error('Authentication failed. Please try again.');
      }
      
      console.log('Authentication successful, closing modal...');
      onClose();
      
      // Wait a moment for user state to update, then redirect based on role
      setTimeout(() => {
        // For demo mode, we can check the email to determine role-based redirect
        const isAdmin = email.toLowerCase().includes('admin') || 
                       ['admin@energymanager.com', 'admin@company.com', 'administrator@energymanager.com', 'viraj@admin.com', 'test@admin.com'].includes(email.toLowerCase());
        
        console.log('Redirecting user based on email:', email, 'isAdmin:', isAdmin);
        
        if (isAdmin) {
          console.log('Redirecting admin user to admin dashboard...');
          navigate('/admin');
        } else {
          console.log('Redirecting regular user to profile...');
          navigate('/profile');
        }
      }, 100);
      
      console.log('Navigation completed');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-xl p-8 w-full max-w-md mx-4 shadow-2xl transform transition-all relative z-[10000] max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: '28rem', zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking on modal content
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Demo Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-bold mb-2">🚀 Demo Mode - Quick Login</p>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Admin credentials:</strong></p>
              <p>• Email: <code className="bg-blue-100 px-1 rounded">admin@test.com</code></p>
              <p>• Password: <code className="bg-blue-100 px-1 rounded">password123</code></p>
              <p><strong>User credentials:</strong></p>
              <p>• Email: <code className="bg-blue-100 px-1 rounded">user@example.com</code></p>
              <p>• Password: <code className="bg-blue-100 px-1 rounded">password123</code></p>
              <p className="text-blue-600 mt-2"><em>Any email with @ and 6+ char password works!</em></p>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="demo@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="password123"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserType['role'])}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="analyst">Analyst</option>
                  <option value="planner">Planner</option>
                  <option value="energy_company">Energy Company</option>
                </select>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
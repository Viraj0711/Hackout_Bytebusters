import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../Auth/AuthModal';

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard' },
    { name: 'Assets', href: '/assets', current: location.pathname === '/assets' },
    { name: 'Analytics', href: '/analytics', current: location.pathname === '/analytics' },
    { name: 'Optimization', href: '/optimization', current: location.pathname === '/optimization' },
    { name: 'Map', href: '/map', current: location.pathname === '/map' },
  ];

  const isLandingPage = location.pathname === '/';

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <Link to="/" className="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors">
                  Green Hydrogen Platform
                </Link>
                <p className="text-sm text-gray-600">Infrastructure Optimization & Visualization</p>
              </div>
            </div>

            {/* Desktop Navigation - Hide on landing page */}
            {!isLandingPage && (
              <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.current
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Welcome, {user.full_name || user.email}
                  </span>
                  <Link
                    to="/settings"
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile menu button - Hide on landing page */}
              {!isLandingPage && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation - Hide on landing page */}
          {!isLandingPage && isMobileMenuOpen && (
            <div className="md:hidden mt-4 border-t border-gray-200 pt-4">
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      item.current
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
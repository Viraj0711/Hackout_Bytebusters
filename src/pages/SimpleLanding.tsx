import { Link } from 'react-router-dom';
import { 
  Zap, 
  BarChart3, 
  Map, 
  Settings, 
  Shield, 
  Cpu,
  ArrowRight,
  Users,
  Leaf,
  LogIn
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Green Hydrogen 
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Ecosystem
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered platform for optimizing hydrogen infrastructure, 
              managing assets, and accelerating the clean energy transition
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signin"
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link 
                to="/analytics"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-green-500 hover:text-green-600 transition-all duration-300"
              >
                View Demo
              </Link>
            </div>
            
            {/* Auth Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6 text-sm">
              <span className="text-gray-500">Already have an account?</span>
              <Link 
                to="/signin"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Sign In
              </Link>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <Link 
                to="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage and optimize your hydrogen infrastructure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dashboard Feature */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Dashboard</h3>
              <p className="text-gray-600 mb-6">
                Real-time monitoring of hydrogen assets, production metrics, and system performance
              </p>
              <Link 
                to="/dashboard" 
                className="text-green-600 font-semibold hover:text-green-700 flex items-center"
              >
                Explore Dashboard
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {/* Analytics Feature */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Analytics</h3>
              <p className="text-gray-600 mb-6">
                AI-powered insights, predictive analytics, and data-driven decision making tools
              </p>
              <Link 
                to="/analytics" 
                className="text-blue-600 font-semibold hover:text-blue-700 flex items-center"
              >
                View Analytics
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {/* Optimization Feature */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Optimization</h3>
              <p className="text-gray-600 mb-6">
                Intelligent site selection, route optimization, and capacity planning algorithms
              </p>
              <Link 
                to="/optimization" 
                className="text-purple-600 font-semibold hover:text-purple-700 flex items-center"
              >
                Optimize Now
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {/* Map Feature */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Map className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive Maps</h3>
              <p className="text-gray-600 mb-6">
                Geospatial visualization of infrastructure, real-time tracking, and location analysis
              </p>
              <Link 
                to="/map" 
                className="text-orange-600 font-semibold hover:text-orange-700 flex items-center"
              >
                View Maps
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {/* Security Feature */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enterprise Security</h3>
              <p className="text-gray-600 mb-6">
                Advanced security protocols, role-based access control, and audit logging
              </p>
              <Link 
                to="/admin" 
                className="text-red-600 font-semibold hover:text-red-700 flex items-center"
              >
                Security Center
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {/* Management Feature */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Asset Management</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive asset tracking, maintenance scheduling, and lifecycle management
              </p>
              <Link 
                to="/assets" 
                className="text-teal-600 font-semibold hover:text-teal-700 flex items-center"
              >
                Manage Assets
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-white mb-16">
            <h2 className="text-4xl font-bold mb-4">Powering the Future of Clean Energy</h2>
            <p className="text-xl opacity-90">Join the hydrogen revolution with our cutting-edge platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="opacity-90">Assets Managed</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="opacity-90">Countries Served</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="opacity-90">Uptime Guarantee</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="opacity-90">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <Leaf className="w-16 h-16 text-green-500 mx-auto mb-6" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Hydrogen Infrastructure?
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            Start optimizing your hydrogen ecosystem today with our comprehensive platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/dashboard"
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            
            <Link 
              to="/settings"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-green-500 hover:text-green-600 transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
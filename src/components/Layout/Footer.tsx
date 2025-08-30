import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Green Hydrogen Platform</h3>
                <p className="text-gray-400 text-sm">Infrastructure Optimization & Visualization</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The world's most comprehensive platform for visualizing, optimizing, and managing 
              green hydrogen infrastructure. Transform your renewable energy projects with 
              AI-powered insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/assets" className="text-gray-300 hover:text-white transition-colors">
                  Asset Management
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-300 hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/optimization" className="text-gray-300 hover:text-white transition-colors">
                  Optimization
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-300 hover:text-white transition-colors">
                  Interactive Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">contact@h2platform.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">New Delhi, India</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h5 className="font-semibold mb-3">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-green-500 text-sm"
                />
                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-lg transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Green Hydrogen Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Documentation
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
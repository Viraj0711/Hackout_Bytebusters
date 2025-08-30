import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  MapPin, 
  BarChart3, 
  Target, 
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Cpu,
  Users,
  TrendingUp,
  Battery,
  Factory,
  Wind,
  ChevronDown,
  Star,
  Play
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from '../components/Auth/AuthModal';

const Landing = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  const features = [
    {
      icon: MapPin,
      title: 'Interactive Mapping',
      description: 'Visualize hydrogen infrastructure on detailed geographic maps with real-time data overlays.',
      color: 'bg-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with KPIs, trends, and performance metrics for informed decision-making.',
      color: 'bg-green-500'
    },
    {
      icon: Target,
      title: 'AI-Powered Optimization',
      description: 'Intelligent site selection and route optimization using machine learning algorithms.',
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with role-based access control and data encryption.',
      color: 'bg-red-500'
    },
    {
      icon: Cpu,
      title: 'Real-time Processing',
      description: 'Live data processing and instant updates across all platform components.',
      color: 'bg-orange-500'
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Support for multi-regional deployments with localized compliance frameworks.',
      color: 'bg-teal-500'
    }
  ];

  const benefits = [
    'Reduce infrastructure development costs by up to 30%',
    'Optimize renewable energy integration and efficiency',
    'Accelerate project timelines with data-driven insights',
    'Ensure regulatory compliance across multiple jurisdictions',
    'Minimize environmental impact through smart planning',
    'Enable seamless collaboration across stakeholder teams'
  ];

  const stats = [
    { label: 'Infrastructure Projects', value: '500+', icon: Factory },
    { label: 'Countries Supported', value: '25+', icon: Globe },
    { label: 'Cost Savings', value: '₹1.2B+', icon: TrendingUp },
    { label: 'Active Users', value: '10,000+', icon: Users }
  ];

  const testimonials = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Chief Technology Officer, Green Energy Solutions',
      content: 'This platform has revolutionized our hydrogen infrastructure planning. The AI optimization features alone have saved us millions in development costs.',
      rating: 5
    },
    {
      name: 'Sarah Mitchell',
      role: 'Project Director, European H2 Initiative',
      content: 'The comprehensive analytics and real-time monitoring capabilities have made our multi-country projects much more manageable and efficient.',
      rating: 5
    },
    {
      name: 'Prof. Anand Sharma',
      role: 'Energy Policy Researcher, IIT Delhi',
      content: 'An invaluable tool for understanding the complex dynamics of hydrogen ecosystem development. The visualization capabilities are outstanding.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-green-600 p-4 rounded-2xl shadow-lg">
                <Zap className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
              Green Hydrogen
              <span className="block text-green-600">Ecosystem Platform</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              The world's most comprehensive platform for visualizing, optimizing, and managing 
              green hydrogen infrastructure. Transform your renewable energy projects with 
              AI-powered insights and real-time analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-3 shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-3 shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-3 transition-colors bg-white">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <stat.icon className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="block text-green-600">Hydrogen Infrastructure</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to plan, optimize, and manage green hydrogen projects 
              from conception to deployment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`${feature.color} p-4 rounded-xl w-fit mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                Transform Your
                <span className="block text-green-600">Hydrogen Projects</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join leading energy companies and research institutions using our platform 
                to accelerate the hydrogen economy transition.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="bg-green-100 p-1 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <Wind className="w-8 h-8 text-blue-500 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Renewable Integration</h4>
                  <p className="text-sm text-gray-600">Optimize wind and solar connectivity</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <Battery className="w-8 h-8 text-purple-500 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Storage Solutions</h4>
                  <p className="text-sm text-gray-600">Advanced storage planning tools</p>
                </div>
              </div>
              <div className="space-y-6 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <Factory className="w-8 h-8 text-green-500 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Production Plants</h4>
                  <p className="text-sm text-gray-600">Electrolysis facility optimization</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <TrendingUp className="w-8 h-8 text-orange-500 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Market Analysis</h4>
                  <p className="text-sm text-gray-600">Demand forecasting and pricing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600">
              See what experts are saying about our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build the Future of Energy?
          </h2>
          <p className="text-xl text-green-100 mb-12">
            Join thousands of professionals already using our platform to accelerate 
            the global transition to clean hydrogen energy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center space-x-3 shadow-lg transition-all duration-300"
              >
                <span>Access Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center space-x-3 shadow-lg transition-all duration-300"
              >
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            
            <Link
              to="/dashboard"
              className="border-2 border-white hover:bg-white hover:text-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
            >
              Explore Demo
            </Link>
          </div>
          
          <p className="text-green-100 mt-8 text-sm">
            No credit card required • 14-day free trial • Setup in under 5 minutes
          </p>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Landing;
import { 
  Battery, 
  Factory, 
  Fuel, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';

const SafeDashboard = () => {

  const quickStats = [
    {
      title: 'Total Assets',
      value: '247',
      change: '+12%',
      icon: Factory,
      color: 'bg-blue-500'
    },
    {
      title: 'H₂ Production',
      value: '1.2 GW',
      change: '+8%',
      icon: Fuel,
      color: 'bg-green-500'
    },
    {
      title: 'Storage Capacity',
      value: '450 TWh',
      change: '+15%',
      icon: Battery,
      color: 'bg-purple-500'
    },
    {
      title: 'Efficiency',
      value: '89.3%',
      change: '+2%',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      title: 'Maintenance Required',
      description: 'Gujarat Wind Farm - Scheduled maintenance due',
      type: 'warning',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'Production Milestone',
      description: 'Rajasthan Plant achieved 95% efficiency target',
      type: 'success',
      time: '5 hours ago'
    },
    {
      id: 3,
      title: 'New Asset Online',
      description: 'Delhi Distribution Hub now operational',
      type: 'info',
      time: '1 day ago'
    }
  ];

  const topAssets = [
    {
      name: 'Rajasthan Solar H₂ Plant',
      type: 'Production',
      status: 'Operational',
      efficiency: 94.2,
      location: 'Rajasthan, India'
    },
    {
      name: 'Gujarat Storage Facility',
      type: 'Storage',
      status: 'Operational',
      efficiency: 89.7,
      location: 'Gujarat, India'
    },
    {
      name: 'Mumbai Pipeline Network',
      type: 'Transport',
      status: 'Under Construction',
      efficiency: 85.1,
      location: 'Mumbai, India'
    },
    {
      name: 'Delhi Distribution Hub',
      type: 'Distribution',
      status: 'Operational',
      efficiency: 91.3,
      location: 'Delhi, India'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'under construction':
        return 'bg-yellow-100 text-yellow-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Green Hydrogen Ecosystem Overview and Performance Metrics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                Infrastructure Map
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map View</h4>
                <p className="text-gray-500 mb-4">
                  Visualize hydrogen infrastructure assets across regions
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-xs text-gray-600">Plants (12)</span>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-xs text-gray-600">Pipelines (8)</span>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-xs text-gray-600">Storage (5)</span>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-xs text-gray-600">Hubs (6)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Assets */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Performing Assets
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topAssets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{asset.name}</h4>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {asset.location}
                        </p>
                      </div>
                      <div className="text-center mx-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                          {asset.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{asset.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{asset.efficiency}%</p>
                        <p className="text-xs text-gray-500">Efficiency</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Alerts
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {alert.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {alert.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Add New Asset
                  </button>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Generate Report
                  </button>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                    Run Optimization
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                    View All Assets
                  </button>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  System Status
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Sync</span>
                    <span className="text-sm font-semibold text-green-600">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Status</span>
                    <span className="text-sm font-semibold text-green-600">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Update</span>
                    <span className="text-sm font-semibold text-gray-900">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="text-sm font-semibold text-gray-900">47</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeDashboard;
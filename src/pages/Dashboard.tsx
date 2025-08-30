import { StatsPanel } from '../components/Dashboard/StatsPanel';
import { MapView } from '../components/Map/MapView';
import { useAssets } from '../hooks/useAssets';
import { Asset } from '../types';
import { 
  Battery, 
  Factory, 
  Fuel, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { assets, loading } = useAssets();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleAssetSelect = (asset: Asset | null) => {
    // Handle asset selection
  };

  const handleMapClick = (lat: number, lng: number) => {
    // Handle map click
  };
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
      value: '450 MWh',
      change: '+15%',
      icon: Battery,
      color: 'bg-purple-500'
    },
    {
      title: 'Efficiency',
      value: '87.3%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      title: 'New Hydrogen Plant Online',
      description: 'Rajasthan Solar-H2 Plant started production',
      time: '2 hours ago',
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'warning',
      icon: AlertTriangle,
      title: 'Maintenance Required',
      description: 'Gujarat Storage Facility scheduled maintenance',
      time: '4 hours ago',
      color: 'text-yellow-600'
    },
    {
      id: 3,
      type: 'info',
      icon: Clock,
      title: 'Optimization Complete',
      description: 'Delhi-Mumbai pipeline route optimized',
      time: '6 hours ago',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Green Hydrogen Ecosystem Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time monitoring and analytics for hydrogen infrastructure
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map View */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Infrastructure Map
              </h2>
            </div>
            <div className="h-96">
              <MapView 
                assets={assets}
                selectedAsset={null}
                onAssetSelect={handleAssetSelect}
                onMapClick={handleMapClick}
              />
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activities
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`${activity.color} mt-1`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Panel */}
        <div className="mt-8">
          <StatsPanel assets={assets} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
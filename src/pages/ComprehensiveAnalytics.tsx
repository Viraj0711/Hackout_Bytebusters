import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Droplet, 
  Wind, 
  Thermometer,
  DollarSign,
  Leaf,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter
} from 'lucide-react';

const ComprehensiveAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Sample data for various charts
  const productionData = [
    { time: '00:00', production: 120, consumption: 95, efficiency: 88 },
    { time: '04:00', production: 100, consumption: 80, efficiency: 85 },
    { time: '08:00', production: 180, consumption: 140, efficiency: 92 },
    { time: '12:00', production: 220, consumption: 180, efficiency: 95 },
    { time: '16:00', production: 200, consumption: 160, efficiency: 90 },
    { time: '20:00', production: 160, consumption: 130, efficiency: 87 }
  ];

  const assetDistribution = [
    { name: 'Electrolyzers', value: 45, color: '#10b981' },
    { name: 'Storage Tanks', value: 25, color: '#3b82f6' },
    { name: 'Fuel Cells', value: 20, color: '#f59e0b' },
    { name: 'Distribution', value: 10, color: '#ef4444' }
  ];

  const carbonReduction = [
    { month: 'Jan', saved: 2400, target: 3000 },
    { month: 'Feb', saved: 2800, target: 3000 },
    { month: 'Mar', saved: 3200, target: 3000 },
    { month: 'Apr', saved: 2900, target: 3000 },
    { month: 'May', saved: 3400, target: 3000 },
    { month: 'Jun', saved: 3600, target: 3000 }
  ];

  const costAnalysis = [
    { category: 'Production', current: 45000, optimized: 38000 },
    { category: 'Storage', current: 28000, optimized: 24000 },
    { category: 'Distribution', current: 32000, optimized: 27000 },
    { category: 'Maintenance', current: 15000, optimized: 12000 }
  ];

  const realTimeMetrics = [
    { 
      label: 'Total Production', 
      value: '2,450 kg/h', 
      change: +12.5, 
      icon: Zap, 
      color: 'text-green-600',
      bgColor: 'bg-green-50' 
    },
    { 
      label: 'Energy Efficiency', 
      value: '92.3%', 
      change: +2.1, 
      icon: Activity, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50' 
    },
    { 
      label: 'Cost per kg', 
      value: '$3.45', 
      change: -8.2, 
      icon: DollarSign, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50' 
    },
    { 
      label: 'Carbon Saved', 
      value: '125 tons', 
      change: +15.3, 
      icon: Leaf, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50' 
    }
  ];

  const alertsData = [
    {
      id: '1',
      type: 'warning',
      message: 'Electrolyzer E-003 efficiency below threshold',
      time: '5 min ago',
      severity: 'medium'
    },
    {
      id: '2',
      type: 'info',
      message: 'Scheduled maintenance for storage tank T-012',
      time: '15 min ago',
      severity: 'low'
    },
    {
      id: '3',
      type: 'success',
      message: 'Production target exceeded by 15%',
      time: '1 hr ago',
      severity: 'low'
    }
  ];

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? TrendingUp : TrendingDown;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Clock;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'success': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprehensive Analytics</h1>
            <p className="text-gray-600">Real-time insights and performance metrics for your hydrogen ecosystem</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Metrics</option>
              <option value="production">Production</option>
              <option value="efficiency">Efficiency</option>
              <option value="cost">Cost</option>
              <option value="environmental">Environmental</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Real-time Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {realTimeMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const ChangeIcon = getChangeIcon(metric.change);
            
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${getChangeColor(metric.change)}`}>
                    <ChangeIcon className="w-4 h-4" />
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Production Trends */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Production & Efficiency Trends</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Activity className="w-4 h-4" />
                <span>Live Data</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="production" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Production (kg/h)"
                />
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Consumption (kg/h)"
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Efficiency (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Asset Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Asset Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {assetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Carbon Reduction Progress */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Carbon Reduction Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={carbonReduction}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="saved"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="CO₂ Saved (tons)"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Cost Optimization Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#ef4444" name="Current Cost ($)" />
                <Bar dataKey="optimized" fill="#10b981" name="Optimized Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Alerts */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">System Alerts</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {alertsData.map((alert) => {
                  const AlertIcon = getAlertIcon(alert.type);
                  return (
                    <div key={alert.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                      <div className={`p-2 rounded-lg ${getAlertColor(alert.type)}`}>
                        <AlertIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        alert.severity === 'high' ? 'text-red-600 bg-red-50' :
                        alert.severity === 'medium' ? 'text-yellow-600 bg-yellow-50' :
                        'text-green-600 bg-green-50'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">Avg Temperature</span>
                </div>
                <span className="text-sm font-medium text-gray-900">72.4°C</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wind className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Pressure</span>
                </div>
                <span className="text-sm font-medium text-gray-900">22.8 bar</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Droplet className="w-5 h-5 text-cyan-500" />
                  <span className="text-sm text-gray-600">Purity Level</span>
                </div>
                <span className="text-sm font-medium text-gray-900">99.97%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Uptime</span>
                </div>
                <span className="text-sm font-medium text-gray-900">99.2%</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Overall Health</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Excellent</span>
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

export default ComprehensiveAnalytics;
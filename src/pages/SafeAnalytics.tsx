import { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity,
  Factory,
  Battery,
  Fuel
} from 'lucide-react';

const SafeAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState('production');
  const [timeRange, setTimeRange] = useState('year');

  // Mock data that doesn't require external libraries
  const kpiCards = [
    {
      title: 'Total H₂ Production',
      value: '2.4 GW',
      change: '+12.5%',
      icon: Fuel,
      color: 'bg-green-500'
    },
    {
      title: 'Average Efficiency',
      value: '87.3%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: 'Storage Utilization',
      value: '74.2%',
      change: '+5.8%',
      icon: Battery,
      color: 'bg-purple-500'
    },
    {
      title: 'Carbon Savings',
      value: '1.2M tons',
      change: '+18.3%',
      icon: Factory,
      color: 'bg-green-600'
    }
  ];

  const chartData = [
    { name: 'Production Plants', count: 12, capacity: 450 },
    { name: 'Storage Facilities', count: 8, capacity: 320 },
    { name: 'Pipelines', count: 15, capacity: 280 },
    { name: 'Distribution Hubs', count: 6, capacity: 150 },
    { name: 'Renewable Sources', count: 20, capacity: 890 }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive insights into green hydrogen ecosystem performance
            </p>
          </div>
          <div className="flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="production">Production</option>
              <option value="efficiency">Efficiency</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-sm text-green-600">{kpi.change}</p>
                </div>
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simple Chart Visualization using CSS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Asset Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Infrastructure Distribution
              </h3>
            </div>
            <div className="space-y-4">
              {chartData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{item.name}</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 w-32">
                      <div 
                        className="h-3 rounded-full"
                        style={{ 
                          backgroundColor: COLORS[index],
                          width: `${Math.min((item.count / 25) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChartIcon className="w-5 h-5 mr-2 text-purple-500" />
                Project Status Overview
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">28</div>
                <div className="text-sm text-gray-600">Operational</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">15</div>
                <div className="text-sm text-gray-600">Construction</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <div className="text-sm text-gray-600">Planned</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">6</div>
                <div className="text-sm text-gray-600">Maintenance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Series Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Production Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Production Trend (Last 6 Months)
              </h3>
            </div>
            <div className="flex items-end space-x-2 h-40">
              {[120, 135, 148, 162, 178, 195].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-green-500 rounded-t w-full"
                    style={{ 
                      height: `${(value / 200) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                  </div>
                  <div className="text-xs font-semibold text-gray-700">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-500" />
                Efficiency Metrics
              </h3>
            </div>
            <div className="space-y-4">
              {[
                {label: 'Overall Efficiency', value: 87.3, color: 'bg-green-500'},
                {label: 'Energy Conversion', value: 92.1, color: 'bg-blue-500'},
                {label: 'Storage Efficiency', value: 84.7, color: 'bg-purple-500'},
                {label: 'Transport Efficiency', value: 89.4, color: 'bg-orange-500'}
              ].map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                      <div 
                        className={`h-2 rounded-full ${metric.color}`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-12">{metric.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Performance Table */}
        <div className="mt-8 bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Regional Performance Summary
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Production (GW)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rajasthan
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.2</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">89.3%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Optimal
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Gujarat
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.9</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">85.7%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Good
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tamil Nadu
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.7</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">82.1%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Good
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeAnalytics;
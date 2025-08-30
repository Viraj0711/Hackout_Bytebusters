import React from 'react';
import { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Zap, Leaf, Calendar, Download } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import { LoadingSpinner } from '../components/Layout/LoadingSpinner';

type TimeRange = '7d' | '30d' | '90d' | '1y';
type ViewType = 'overview' | 'production' | 'carbon' | 'costs' | 'utilization';

const EnhancedAnalytics: React.FC = () => {
  const {
    kpiCards,
    chartData,
    statusData,
    performanceMetrics,
    loading,
    refreshAnalytics,
    exportAnalytics,
    totalGrowth
  } = useAnalytics();

  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30d');
  const [selectedView, setSelectedView] = useState<ViewType>('overview');

  const timeRangeOptions = [
    { value: '7d' as TimeRange, label: 'Last 7 days' },
    { value: '30d' as TimeRange, label: 'Last 30 days' },
    { value: '90d' as TimeRange, label: 'Last 3 months' },
    { value: '1y' as TimeRange, label: 'Last year' }
  ];

  const viewOptions = [
    { value: 'overview' as ViewType, label: 'Overview', icon: BarChart3 },
    { value: 'production' as ViewType, label: 'Production', icon: Zap },
    { value: 'carbon' as ViewType, label: 'Carbon Impact', icon: Leaf },
    { value: 'costs' as ViewType, label: 'Cost Analysis', icon: TrendingUp },
    { value: 'utilization' as ViewType, label: 'Asset Utilization', icon: Activity }
  ];

  // Mock data for additional charts
  const productionTrendData = [
    { date: '2024-01', production: 45, capacity: 60 },
    { date: '2024-02', production: 52, capacity: 60 },
    { date: '2024-03', production: 48, capacity: 60 },
    { date: '2024-04', production: 58, capacity: 60 },
    { date: '2024-05', production: 55, capacity: 60 },
    { date: '2024-06', production: 61, capacity: 65 }
  ];

  const carbonImpactData = [
    { date: '2024-01', reduction: 120 },
    { date: '2024-02', reduction: 145 },
    { date: '2024-03', reduction: 138 },
    { date: '2024-04', reduction: 167 },
    { date: '2024-05', reduction: 156 },
    { date: '2024-06', reduction: 178 }
  ];

  const costData = [
    { date: '2024-01', operational: 85000, maintenance: 15000, revenue: 125000 },
    { date: '2024-02', operational: 92000, maintenance: 18000, revenue: 145000 },
    { date: '2024-03', operational: 88000, maintenance: 12000, revenue: 138000 },
    { date: '2024-04', operational: 95000, maintenance: 22000, revenue: 167000 },
    { date: '2024-05', operational: 91000, maintenance: 16000, revenue: 156000 },
    { date: '2024-06', operational: 98000, maintenance: 19000, revenue: 178000 }
  ];

  const utilizationData = [
    { asset: 'Plant Alpha', utilization: 85 },
    { asset: 'Plant Beta', utilization: 72 },
    { asset: 'Storage A', utilization: 91 },
    { asset: 'Storage B', utilization: 68 },
    { asset: 'Pipeline 1', utilization: 76 },
    { asset: 'Pipeline 2', utilization: 83 }
  ];

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatNumber = (value: number, unit?: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
    return unit ? `${formatted} ${unit}` : formatted;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const pieColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Comprehensive insights into your hydrogen ecosystem performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value as TimeRange)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {timeRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={refreshAnalytics}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Activity className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportAnalytics}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* View Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {viewOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedView(option.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedView === option.value
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Dashboard */}
        {selectedView === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatNumber(card.value, card.unit)}
                      </p>
                      <div className="flex items-center mt-2">
                        {getChangeIcon(card.trend)}
                        <span className={`ml-1 text-sm font-medium ${getChangeColor(card.trend)}`}>
                          {Math.abs(card.trend)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.bgColor}`}>
                      <span className={`text-xl ${card.textColor}`}>{card.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Production & Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Production Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={productionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="production" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Carbon Reduction Impact</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={carbonImpactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="reduction" stroke="#059669" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Asset Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Type Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="count"
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.name}: ${entry.count}`}
                    >
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Production View */}
        {selectedView === 'production' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hydrogen Production Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={productionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="production" fill="#10b981" name="Production (MWh)" />
                  <Bar dataKey="capacity" fill="#3b82f6" name="Capacity (MWh)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Carbon Impact View */}
        {selectedView === 'carbon' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Carbon Emission Reduction</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={carbonImpactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="reduction" stroke="#059669" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Cost Analysis View */}
        {selectedView === 'costs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Line type="monotone" dataKey="operational" stroke="#f59e0b" strokeWidth={2} name="Operational Costs" />
                  <Line type="monotone" dataKey="maintenance" stroke="#ef4444" strokeWidth={2} name="Maintenance Costs" />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Asset Utilization View */}
        {selectedView === 'utilization' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Utilization Rates</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={utilizationData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="asset" width={150} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="utilization" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAnalytics;
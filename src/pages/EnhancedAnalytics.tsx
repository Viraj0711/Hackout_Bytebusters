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
    regionData,
    performanceMetrics,
    totalProduction,
    carbonReduction,
    avgEfficiency,
    totalGrowth,
    loading,
    refreshAnalytics,
    exportAnalytics
  } = useAnalytics();

  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30d');
  const [selectedView, setSelectedView] = useState<ViewType>('overview');

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const viewOptions = [
    { value: 'overview', label: 'Overview', icon: BarChart3 },
    { value: 'production', label: 'Production', icon: Zap },
    { value: 'carbon', label: 'Carbon Impact', icon: Leaf },
    { value: 'costs', label: 'Cost Analysis', icon: TrendingUp },
    { value: 'utilization', label: 'Asset Utilization', icon: Activity }
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
                  onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {timeRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}\n                </select>
              </div>
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Activity className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportData}
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
                  onClick={() => setSelectedView(option.value as any)}
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
              {dashboardData.keyMetrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatNumber(metric.value, metric.unit)}
                      </p>
                      <div className="flex items-center mt-2">
                        {getChangeIcon(metric.change)}
                        <span className={`ml-1 text-sm font-medium ${getChangeColor(metric.change)}`}>
                          {Math.abs(metric.change)}% vs last period
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.bgColor}`}>
                      <span className={`text-xl ${metric.textColor}`}>{metric.icon}</span>
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
                  <AreaChart data={energyProductionData}>
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
                  <LineChart data={carbonReductionData}>
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
                      dataKey="value"
                      data={dashboardData.assetDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {dashboardData.assetDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{metric.name}</p>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatNumber(metric.value, metric.unit)}</p>
                        <p className={`text-sm ${getChangeColor(metric.change)}`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
                <BarChart data={energyProductionData}>
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
                <AreaChart data={carbonReductionData}>
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
                <LineChart data={costAnalysisData}>
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
                <BarChart data={assetUtilizationData} layout="horizontal">
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
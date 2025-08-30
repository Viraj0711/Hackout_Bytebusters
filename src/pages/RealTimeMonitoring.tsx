import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, Gauge, Wifi, WifiOff, Bell, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { LoadingSpinner } from '../components/Layout/LoadingSpinner';
import { useAssets } from '../hooks/useAssets';
import { notificationService } from '../services/notificationService';

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
  threshold: {
    warning: number;
    critical: number;
  };
}

interface SystemAlert {
  id: string;
  assetId: string;
  assetName: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  acknowledged: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AssetStatus {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  lastPing: Date;
  uptime: number;
  metrics: RealTimeMetric[];
}

const RealTimeMonitoring: React.FC = () => {
  const { assets, loading: assetsLoading } = useAssets();
  const [isConnected, _setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Mock real-time data
  const [assetStatuses, setAssetStatuses] = useState<AssetStatus[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [realTimeData, setRealTimeData] = useState<Array<{
    timestamp: string;
    temperature: number;
    pressure: number;
    flowRate: number;
    efficiency: number;
  }>>([]);

  // Initialize mock data
  useEffect(() => {
    const initializeData = () => {
      const mockStatuses: AssetStatus[] = assets.map(asset => ({
        id: asset.id,
        name: asset.name,
        type: asset.type,
        status: Math.random() > 0.1 ? 'online' : Math.random() > 0.5 ? 'maintenance' : 'error',
        lastPing: new Date(Date.now() - Math.random() * 60000),
        uptime: Math.random() * 100,
        metrics: [
          {
            id: `${asset.id}-temp`,
            name: 'Temperature',
            value: 45 + Math.random() * 30,
            unit: '°C',
            status: 'normal',
            trend: 'stable',
            lastUpdated: new Date(),
            threshold: { warning: 70, critical: 80 }
          },
          {
            id: `${asset.id}-pressure`,
            name: 'Pressure',
            value: 15 + Math.random() * 10,
            unit: 'bar',
            status: 'normal',
            trend: 'up',
            lastUpdated: new Date(),
            threshold: { warning: 23, critical: 25 }
          },
          {
            id: `${asset.id}-flow`,
            name: 'Flow Rate',
            value: 120 + Math.random() * 80,
            unit: 'L/min',
            status: 'normal',
            trend: 'down',
            lastUpdated: new Date(),
            threshold: { warning: 180, critical: 200 }
          }
        ]
      }));

      const mockAlerts: SystemAlert[] = [
        {
          id: '1',
          assetId: assets[0]?.id || '1',
          assetName: assets[0]?.name || 'Plant Alpha',
          type: 'warning',
          title: 'High Temperature Alert',
          description: 'Temperature approaching warning threshold',
          timestamp: new Date(Date.now() - 300000),
          acknowledged: false,
          severity: 'medium'
        },
        {
          id: '2',
          assetId: assets[1]?.id || '2',
          assetName: assets[1]?.name || 'Storage Beta',
          type: 'info',
          title: 'Maintenance Scheduled',
          description: 'Routine maintenance scheduled for tomorrow',
          timestamp: new Date(Date.now() - 600000),
          acknowledged: true,
          severity: 'low'
        }
      ];

      setAssetStatuses(mockStatuses);
      setSystemAlerts(mockAlerts);
    };

    if (assets.length > 0) {
      initializeData();
    }
  }, [assets]);

  // Generate real-time chart data
  useEffect(() => {
    const generateData = () => {
      const data = [];
      const points = timeRange === '1h' ? 60 : timeRange === '6h' ? 72 : timeRange === '24h' ? 144 : 168;
      
      for (let i = points; i >= 0; i--) {
        const timestamp = new Date(Date.now() - i * (timeRange === '1h' ? 60000 : timeRange === '6h' ? 300000 : timeRange === '24h' ? 600000 : 3600000));
        data.push({
          timestamp: timestamp.toLocaleTimeString(),
          temperature: 45 + Math.sin(i * 0.1) * 10 + Math.random() * 5,
          pressure: 18 + Math.cos(i * 0.05) * 3 + Math.random() * 2,
          flowRate: 150 + Math.sin(i * 0.2) * 20 + Math.random() * 10,
          efficiency: 85 + Math.sin(i * 0.15) * 10 + Math.random() * 5
        });
      }
      setRealTimeData(data);
    };

    generateData();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        generateData();
        setLastUpdate(new Date());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [timeRange, autoRefresh]);

  const getStatusColor = (status: AssetStatus['status']) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: AssetStatus['status']) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      case 'maintenance': return <Clock className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getMetricStatus = (metric: RealTimeMetric) => {
    if (metric.value >= metric.threshold.critical) return 'critical';
    if (metric.value >= metric.threshold.warning) return 'warning';
    return 'normal';
  };

  const acknowledgeAlert = (alertId: string) => {
    setSystemAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    notificationService.success('Alert acknowledged');
  };

  const refreshData = () => {
    setLastUpdate(new Date());
    notificationService.info('Data refreshed');
  };

  if (assetsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading monitoring dashboard..." />
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
              <h1 className="text-3xl font-bold text-gray-900">Real-Time Monitoring</h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Time Range:</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as '1h' | '6h' | '24h' | '7d')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="1h">Last Hour</option>
                  <option value="6h">Last 6 Hours</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                </select>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">Auto Refresh</span>
              </label>
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assets Online</p>
                  <p className="text-2xl font-bold text-green-600">
                    {assetStatuses.filter(a => a.status === 'online').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {systemAlerts.filter(a => !a.acknowledged).length}
                  </p>
                </div>
                <Bell className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
                  <p className="text-2xl font-bold text-blue-600">87.3%</p>
                </div>
                <Gauge className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Uptime</p>
                  <p className="text-2xl font-bold text-green-600">99.2%</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Real-Time Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={realTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} name="Efficiency %" />
                  <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} name="Temperature" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pressure & Flow Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={realTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={2} name="Pressure (bar)" />
                  <Line type="monotone" dataKey="flowRate" stroke="#8b5cf6" strokeWidth={2} name="Flow Rate (L/min)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset Status & Alerts */}
          <div className="space-y-6">
            {/* Asset Status List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Asset Status</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {assetStatuses.map((asset) => (
                  <div
                    key={asset.id}
                    className={`px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      selectedAsset === asset.id ? 'bg-green-50' : ''
                    }`}
                    onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{asset.name}</h4>
                        <p className="text-sm text-gray-600">{asset.type.replace(/_/g, ' ')}</p>
                      </div>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                        {getStatusIcon(asset.status)}
                        <span>{asset.status}</span>
                      </div>
                    </div>
                    
                    {selectedAsset === asset.id && (
                      <div className="mt-4 space-y-2">
                        <div className="text-xs text-gray-600">
                          Uptime: {asset.uptime.toFixed(1)}% | Last ping: {asset.lastPing.toLocaleTimeString()}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {asset.metrics.map((metric) => {
                            const status = getMetricStatus(metric);
                            return (
                              <div key={metric.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700">{metric.name}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">
                                    {metric.value.toFixed(1)} {metric.unit}
                                  </span>
                                  <span className={`w-2 h-2 rounded-full ${
                                    status === 'critical' ? 'bg-red-500' :
                                    status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {systemAlerts
                  .filter(alert => !alert.acknowledged)
                  .map((alert) => (
                    <div key={alert.id} className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              alert.type === 'error' ? 'bg-red-100 text-red-800' :
                              alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {alert.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {alert.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{alert.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                          <p className="text-xs text-gray-500">Asset: {alert.assetName}</p>
                        </div>
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="ml-2 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  ))}
                
                {systemAlerts.filter(alert => !alert.acknowledged).length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>No active alerts</p>
                    <p className="text-sm mt-1">All systems operating normally</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoring;
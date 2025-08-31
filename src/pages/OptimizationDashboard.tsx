import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Zap, Route, Target, TrendingUp, Calculator, Download, Play, Pause, RotateCcw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LoadingSpinner } from '../components/Layout/LoadingSpinner';
import { useAssets } from '../hooks/useAssets';
import { notificationService } from '../services/notificationService';

interface OptimizationScenario {
  id: string;
  name: string;
  description: string;
  type: 'cost' | 'efficiency' | 'carbon' | 'route' | 'capacity';
  status: 'draft' | 'running' | 'completed' | 'failed';
  progress: number;
  results?: {
    costSavings: number;
    efficiencyGain: number;
    carbonReduction: number;
    estimatedROI: number;
    implementationTime: number;
  };
  createdAt: Date;
  completedAt?: Date;
}

interface OptimizationResult {
  scenarios: OptimizationScenario[];
  recommendations: Array<{
    id: string;
    type: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    effort: string;
    estimatedSavings: number;
  }>;
  kpis: {
    totalCostSavings: number;
    efficiencyImprovement: number;
    carbonReductionPotential: number;
    averageROI: number;
  };
}

const OptimizationDashboard: React.FC = () => {
  const { loading: assetsLoading } = useAssets();
  const navigate = useNavigate();
  const [_loading, setLoading] = useState(false);
  const [_selectedScenario, setSelectedScenario] = useState<OptimizationScenario | null>(null);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'route' | 'capacity' | 'recommendations'>('scenarios');
  const [_optimizationResults, _setOptimizationResults] = useState<OptimizationResult | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  // Handler for implementing recommendations
  const handleImplementRecommendation = (title: string) => {
    notificationService.success(`Implementation plan created for: ${title}`);
    navigate('/dashboard');
  };

  // Handler for facility clicks on route map
  const handleFacilityClick = (facilityId: string, facilityName: string) => {
    setSelectedFacility(facilityId);
    notificationService.info(`Selected facility: ${facilityName}`);
  };
  const [isRunningOptimization, setIsRunningOptimization] = useState(false);

  // Mock optimization data
  const [scenarios, setScenarios] = useState<OptimizationScenario[]>([
    {
      id: '1',
      name: 'Cost Optimization Analysis',
      description: 'Optimize operational costs across all hydrogen production facilities',
      type: 'cost',
      status: 'completed',
      progress: 100,
      results: {
        costSavings: 2.4,
        efficiencyGain: 15.2,
        carbonReduction: 1850,
        estimatedROI: 23.5,
        implementationTime: 6
      },
      createdAt: new Date('2024-12-01'),
      completedAt: new Date('2024-12-15')
    },
    {
      id: '2',
      name: 'Route Efficiency Optimization',
      description: 'Optimize hydrogen distribution routes and pipeline utilization',
      type: 'route',
      status: 'running',
      progress: 65,
      createdAt: new Date('2024-12-20')
    },
    {
      id: '3',
      name: 'Production Capacity Planning',
      description: 'Analyze and optimize production capacity allocation',
      type: 'capacity',
      status: 'draft',
      progress: 0,
      createdAt: new Date('2024-12-25')
    }
  ]);

  const optimizationTypes = [
    {
      type: 'cost',
      title: 'Cost Optimization',
      description: 'Minimize operational and maintenance costs',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      type: 'efficiency',
      title: 'Efficiency Optimization',
      description: 'Maximize energy conversion and utilization rates',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      type: 'route',
      title: 'Route Optimization',
      description: 'Optimize distribution paths and logistics',
      icon: <Route className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      type: 'carbon',
      title: 'Carbon Optimization',
      description: 'Maximize carbon emission reductions',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-emerald-500'
    }
  ];

  const performanceData = [
    { month: 'Jan', baseline: 100, optimized: 115, efficiency: 85 },
    { month: 'Feb', baseline: 98, optimized: 118, efficiency: 87 },
    { month: 'Mar', baseline: 102, optimized: 122, efficiency: 89 },
    { month: 'Apr', baseline: 105, optimized: 128, efficiency: 91 },
    { month: 'May', baseline: 103, optimized: 125, efficiency: 88 },
    { month: 'Jun', baseline: 107, optimized: 132, efficiency: 93 }
  ];

  const routeOptimizationData = [
    { route: 'Plant A → Hub 1', current: 85, optimized: 92, savings: 8.2 },
    { route: 'Plant B → Hub 2', current: 78, optimized: 89, savings: 14.1 },
    { route: 'Hub 1 → Storage A', current: 91, optimized: 95, savings: 4.4 },
    { route: 'Hub 2 → Distribution', current: 73, optimized: 86, savings: 17.8 },
    { route: 'Storage → End Users', current: 82, optimized: 88, savings: 7.3 }
  ];

  const createNewScenario = () => {
    const newScenario: OptimizationScenario = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Optimization Scenario',
      description: 'Custom optimization analysis',
      type: 'cost',
      status: 'draft',
      progress: 0,
      createdAt: new Date()
    };
    setScenarios([...scenarios, newScenario]);
    setSelectedScenario(newScenario);
  };

  const runOptimization = async (scenario: OptimizationScenario) => {
    setIsRunningOptimization(true);
    setLoading(true);
    
    try {
      // Simulate optimization process
      const updatedScenario = { ...scenario, status: 'running' as const, progress: 0 };
      setScenarios(prev => prev.map(s => s.id === scenario.id ? updatedScenario : s));
      
      // Simulate progress updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setScenarios(prev => prev.map(s => 
          s.id === scenario.id ? { ...s, progress } : s
        ));
      }
      
      // Complete the optimization with results
      const completedScenario: OptimizationScenario = {
        ...updatedScenario,
        status: 'completed',
        progress: 100,
        results: {
          costSavings: Math.random() * 5 + 1,
          efficiencyGain: Math.random() * 20 + 5,
          carbonReduction: Math.random() * 2000 + 500,
          estimatedROI: Math.random() * 30 + 10,
          implementationTime: Math.floor(Math.random() * 12) + 3
        },
        completedAt: new Date()
      };
      
      setScenarios(prev => prev.map(s => s.id === scenario.id ? completedScenario : s));
      notificationService.success(`Optimization "${scenario.name}" completed successfully!`);
      
    } catch {
      notificationService.error('Optimization failed', 'Please try again or contact support');
    } finally {
      setIsRunningOptimization(false);
      setLoading(false);
    }
  };

  const getStatusColor = (status: OptimizationScenario['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value * 1000000);
  };

  if (assetsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading optimization dashboard..." />
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
              <h1 className="text-3xl font-bold text-gray-900">Optimization Center</h1>
              <p className="text-gray-600 mt-2">
                AI-powered optimization for maximum efficiency and cost savings
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={createNewScenario}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                <span>New Scenario</span>
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Results</span>
              </button>
            </div>
          </div>

          {/* Optimization Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {optimizationTypes.map((type) => (
              <div key={type.type} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center text-white mr-4`}>
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{type.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'scenarios', label: 'Scenarios', icon: Settings },
              { id: 'route', label: 'Route Analysis', icon: Route },
              { id: 'capacity', label: 'Capacity Planning', icon: Target },
              { id: 'recommendations', label: 'Recommendations', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'scenarios' | 'route' | 'capacity' | 'recommendations')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            {/* Scenarios List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Optimization Scenarios</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {scenarios.map((scenario) => (
                  <div key={scenario.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-sm font-medium text-gray-900">{scenario.name}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(scenario.status)}`}>
                            {scenario.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                        
                        {scenario.status === 'running' && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{scenario.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${scenario.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {scenario.results && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                            <div className="text-center">
                              <p className="text-xs text-gray-600">Cost Savings</p>
                              <p className="text-sm font-semibold text-green-600">
                                {formatCurrency(scenario.results.costSavings)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-600">Efficiency Gain</p>
                              <p className="text-sm font-semibold text-blue-600">
                                +{scenario.results.efficiencyGain.toFixed(1)}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-600">Carbon Reduction</p>
                              <p className="text-sm font-semibold text-emerald-600">
                                {scenario.results.carbonReduction.toLocaleString()} tons
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-600">ROI</p>
                              <p className="text-sm font-semibold text-purple-600">
                                {scenario.results.estimatedROI.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {scenario.status === 'draft' && (
                          <button
                            onClick={() => runOptimization(scenario)}
                            disabled={isRunningOptimization}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <Play className="w-4 h-4" />
                            <span>Run</span>
                          </button>
                        )}
                        {scenario.status === 'running' && (
                          <button className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            <Pause className="w-4 h-4" />
                            <span>Stop</span>
                          </button>
                        )}
                        {scenario.status === 'completed' && (
                          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <RotateCcw className="w-4 h-4" />
                            <span>Re-run</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Comparison Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="baseline" stroke="#6b7280" strokeWidth={2} name="Baseline" />
                  <Line type="monotone" dataKey="optimized" stroke="#10b981" strokeWidth={2} name="Optimized" />
                  <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2} name="Efficiency %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Route Analysis Tab */}
        {activeTab === 'route' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Optimization Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={routeOptimizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="route" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#6b7280" name="Current Efficiency %" />
                  <Bar dataKey="optimized" fill="#10b981" name="Optimized Efficiency %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Route Efficiency Improvements</h4>
                <div className="space-y-3">
                  {routeOptimizationData.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{route.route}</p>
                        <p className="text-sm text-gray-600">
                          {route.current}% → {route.optimized}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">+{route.savings}%</p>
                        <p className="text-xs text-gray-500">efficiency gain</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Route Map Visualization</h4>
                <div className="h-64 bg-gray-50 rounded-lg relative overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 800 256" className="absolute inset-0">
                    {/* Background grid */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Routes/Pipelines */}
                    <g stroke="#6b7280" strokeWidth="4" fill="none">
                      {/* Plant B to Hub 2 */}
                      <line x1="100" y1="80" x2="200" y2="80" />
                      {/* Hub 1 to Storage A */}
                      <line x1="300" y1="60" x2="450" y2="60" />
                      {/* Hub 2 to Distribution */}
                      <line x1="500" y1="80" x2="600" y2="80" />
                      {/* Storage to End Users */}
                      <line x1="650" y1="80" x2="750" y2="80" />
                      
                      {/* Vertical connections */}
                      <line x1="200" y1="80" x2="250" y2="60" />
                      <line x1="250" y1="60" x2="300" y2="60" />
                      <line x1="450" y1="60" x2="500" y2="80" />
                    </g>

                    {/* Optimized routes overlay */}
                    <g stroke="#10b981" strokeWidth="6" fill="none" opacity="0.7">
                      <line x1="100" y1="85" x2="200" y2="85" />
                      <line x1="300" y1="65" x2="450" y2="65" />
                      <line x1="500" y1="85" x2="600" y2="85" />
                      <line x1="650" y1="85" x2="750" y2="85" />
                      <line x1="200" y1="85" x2="250" y2="65" />
                      <line x1="250" y1="65" x2="300" y2="65" />
                      <line x1="450" y1="65" x2="500" y2="85" />
                    </g>

                    {/* Facilities */}
                    {[
                      { id: 'plant-b', x: 80, y: 80, type: 'production', label: 'Plant B', efficiency: 75, optimized: 89 },
                      { id: 'hub-1', x: 250, y: 60, type: 'hub', label: 'Hub 1', efficiency: 82, optimized: 96 },
                      { id: 'hub-2', x: 220, y: 80, type: 'hub', label: 'Hub 2', efficiency: 68, optimized: 82 },
                      { id: 'storage-a', x: 470, y: 60, type: 'storage', label: 'Storage A', efficiency: 85, optimized: 89 },
                      { id: 'distribution', x: 620, y: 80, type: 'distribution', label: 'Distribution', efficiency: 78, optimized: 95 },
                      { id: 'end-users', x: 770, y: 80, type: 'endpoint', label: 'End Users', efficiency: 88, optimized: 92 }
                    ].map((facility) => (
                      <g key={facility.id}>
                        {/* Facility background circle */}
                        <circle 
                          cx={facility.x} 
                          cy={facility.y} 
                          r="25" 
                          fill={
                            facility.type === 'production' ? '#ef4444' :
                            facility.type === 'hub' ? '#3b82f6' :
                            facility.type === 'storage' ? '#f59e0b' :
                            facility.type === 'distribution' ? '#8b5cf6' :
                            '#10b981'
                          }
                          stroke={selectedFacility === facility.id ? '#000' : 'none'}
                          strokeWidth={selectedFacility === facility.id ? '3' : '0'}
                          className="cursor-pointer hover:opacity-80 transition-all duration-200"
                          onClick={() => handleFacilityClick(facility.id, facility.label)}
                        />
                        
                        {/* Facility icon */}
                        <text 
                          x={facility.x} 
                          y={facility.y + 5} 
                          textAnchor="middle" 
                          className="fill-white text-sm font-bold pointer-events-none"
                        >
                          {facility.type === 'production' ? '🏭' :
                           facility.type === 'hub' ? '🔄' :
                           facility.type === 'storage' ? '🗃' :
                           facility.type === 'distribution' ? '📦' : '🏠'}
                        </text>
                        
                        {/* Label */}
                        <text 
                          x={facility.x} 
                          y={facility.y - 35} 
                          textAnchor="middle" 
                          className="fill-gray-700 text-xs font-semibold pointer-events-none"
                        >
                          {facility.label}
                        </text>
                        
                        {/* Efficiency indicator */}
                        <text 
                          x={facility.x} 
                          y={facility.y + 45} 
                          textAnchor="middle" 
                          className="fill-green-600 text-xs font-bold pointer-events-none"
                        >
                          +{(facility.optimized - facility.efficiency).toFixed(1)}%
                        </text>
                        
                        <text 
                          x={facility.x} 
                          y={facility.y + 58} 
                          textAnchor="middle" 
                          className="fill-gray-500 text-xs pointer-events-none"
                        >
                          efficiency gain
                        </text>
                      </g>
                    ))}

                    {/* Flow direction arrows */}
                    {[
                      { x: 150, y: 75, delay: '0s' }, 
                      { x: 375, y: 55, delay: '0.5s' }, 
                      { x: 550, y: 75, delay: '1s' }, 
                      { x: 700, y: 75, delay: '1.5s' }
                    ].map((arrow, index) => (
                      <g key={index}>
                        <polygon 
                          points={`${arrow.x},${arrow.y} ${arrow.x + 10},${arrow.y - 5} ${arrow.x + 10},${arrow.y + 5}`}
                          fill="#10b981"
                          className="animate-pulse"
                          style={{ animationDelay: arrow.delay }}
                        />
                        {/* Flow particles */}
                        <circle
                          cx={arrow.x - 20}
                          cy={arrow.y}
                          r="2"
                          fill="#10b981"
                          className="animate-ping"
                          style={{ animationDelay: arrow.delay }}
                        />
                      </g>
                    ))}
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-1 bg-gray-500"></div>
                        <span>Current Efficiency %</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-1 bg-green-500"></div>
                        <span>Optimized Efficiency %</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Facility Details Panel */}
                  {selectedFacility && (
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border max-w-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">Facility Details</h5>
                        <button 
                          onClick={() => setSelectedFacility(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                      {(() => {
                        const facility = [
                          { id: 'plant-b', label: 'Plant B', type: 'Production Plant', efficiency: 75, optimized: 89, capacity: '2,500 kg/day' },
                          { id: 'hub-1', label: 'Hub 1', type: 'Distribution Hub', efficiency: 82, optimized: 96, capacity: '1,800 kg/day' },
                          { id: 'hub-2', label: 'Hub 2', type: 'Distribution Hub', efficiency: 68, optimized: 82, capacity: '1,200 kg/day' },
                          { id: 'storage-a', label: 'Storage A', type: 'Storage Facility', efficiency: 85, optimized: 89, capacity: '5,000 kg' },
                          { id: 'distribution', label: 'Distribution', type: 'Distribution Center', efficiency: 78, optimized: 95, capacity: '3,000 kg/day' },
                          { id: 'end-users', label: 'End Users', type: 'Customer Endpoint', efficiency: 88, optimized: 92, capacity: '1,500 kg/day' }
                        ].find(f => f.id === selectedFacility);
                        
                        return facility ? (
                          <div className="text-sm space-y-2">
                            <div>
                              <span className="font-medium">{facility.label}</span>
                              <p className="text-gray-600 text-xs">{facility.type}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Current Efficiency:</span>
                                <span className="font-medium">{facility.efficiency}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Optimized Efficiency:</span>
                                <span className="font-medium text-green-600">{facility.optimized}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Improvement:</span>
                                <span className="font-bold text-green-600">+{(facility.optimized - facility.efficiency).toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Capacity:</span>
                                <span className="font-medium">{facility.capacity}</span>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Capacity Planning Tab */}
        {activeTab === 'capacity' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity Optimization</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
                  <div className="text-sm text-gray-600">Current Utilization</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                  <div className="text-sm text-gray-600">Optimized Target</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">+8.1%</div>
                  <div className="text-sm text-gray-600">Efficiency Gain</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Recommendations</h3>
              <div className="space-y-4">
                {[
                  {
                    priority: 'high' as const,
                    title: 'Upgrade Production Line B',
                    description: 'Install advanced electrolyzers to improve efficiency by 23%',
                    impact: 'High',
                    effort: 'Medium',
                    savings: 1.2
                  },
                  {
                    priority: 'medium' as const,
                    title: 'Optimize Pipeline Pressure',
                    description: 'Adjust pressure settings across distribution network',
                    impact: 'Medium',
                    effort: 'Low',
                    savings: 0.4
                  },
                  {
                    priority: 'low' as const,
                    title: 'Predictive Maintenance Schedule',
                    description: 'Implement AI-driven maintenance scheduling',
                    impact: 'Medium',
                    effort: 'High',
                    savings: 0.8
                  }
                ].map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {rec.priority} priority
                          </span>
                          <h4 className="font-medium text-gray-900">{rec.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Impact: {rec.impact}</span>
                          <span>Effort: {rec.effort}</span>
                          <span className="font-semibold text-green-600">
                            Savings: {formatCurrency(rec.savings)}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleImplementRecommendation(rec.title)}
                        className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Implement
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizationDashboard;
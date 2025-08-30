import React, { useState } from 'react';
import { Settings, Zap, Route, Target, TrendingUp, MapPin, Calculator, Download, Play, Pause, RotateCcw } from 'lucide-react';
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
  const [_loading, setLoading] = useState(false);
  const [_selectedScenario, setSelectedScenario] = useState<OptimizationScenario | null>(null);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'route' | 'capacity' | 'recommendations'>('scenarios');
  const [_optimizationResults, _setOptimizationResults] = useState<OptimizationResult | null>(null);
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
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive route map</p>
                    <p className="text-sm text-gray-500">Coming soon</p>
                  </div>
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
                      <button className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
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
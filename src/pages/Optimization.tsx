import { useState } from 'react';
import { OptimizationPanel } from '../components/Optimization/OptimizationPanel';
import { MapView } from '../components/Map/MapView';
import { useAssets } from '../hooks/useAssets';
import { Asset, OptimizationConstraints, Recommendation } from '../types';
import { 
  Settings, 
  Play, 
  Download, 
  RefreshCw, 
  Target,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Optimization = () => {
  const { assets, loading } = useAssets();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [constraints, setConstraints] = useState<OptimizationConstraints>({
    maxDistance: 100,
    minCapacity: 50,
    maxCost: 1000000000,
    preferredZones: [],
    renewableProximity: true,
    environmentalScore: 7,
    safetyRequirements: ['ISO_14001', 'OHSAS_18001'],
    demandProximity: true,
    existingInfrastructure: true,
    transportationCost: true
  });

  const handleAssetSelect = (asset: Asset | null) => {
    setSelectedAsset(asset);
  };

  const handleMapClick = (lat: number, lng: number) => {
    // Handle map click for potential new sites
    console.log('Map clicked at:', lat, lng);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    setTimeout(() => {
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          type: 'site_selection',
          title: 'Optimal Storage Site Location',
          description: 'Recommended location for hydrogen storage facility based on renewable proximity and demand analysis',
          confidence: 0.92,
          potential_savings: 15000000,
          implementation_timeline: '18 months',
          latitude: 28.7041,
          longitude: 77.1025,
          justification: 'Strategic location with excellent renewable energy access and proximity to major demand centers',
          requirements: ['Environmental clearance', 'Land acquisition', 'Grid connection'],
          score: 92,
          reasoning: 'Optimal location based on renewable energy proximity, demand centers, and infrastructure synergy',
          estimated_cost: 150,
          renewable_proximity: 5.2,
          demand_proximity: 12.8,
          environmental_impact: 8,
          regulatory_compliance: true,
          infrastructure_synergy: 85,
          risk_assessment: 'low',
          recommended_capacity: 50000,
          payback_period: 7,
          created_at: new Date().toISOString(),
          created_by: 'optimization_engine'
        },
        {
          id: '2',
          type: 'capacity_optimization',
          title: 'Increase Production Capacity',
          description: 'Upgrade existing hydrogen plant to meet growing demand efficiently',
          confidence: 0.87,
          potential_savings: 8500000,
          implementation_timeline: '12 months',
          latitude: 26.9124,
          longitude: 75.7873,
          justification: 'Current facility operating at peak efficiency with room for expansion',
          requirements: ['Equipment upgrade', 'Regulatory approval', 'Additional workforce'],
          score: 87,
          reasoning: 'Existing facility with proven track record and expansion potential',
          estimated_cost: 85,
          renewable_proximity: 8.5,
          demand_proximity: 6.2,
          environmental_impact: 7,
          regulatory_compliance: true,
          infrastructure_synergy: 95,
          risk_assessment: 'low',
          recommended_capacity: 75000,
          payback_period: 5,
          created_at: new Date().toISOString(),
          created_by: 'optimization_engine'
        },
        {
          id: '3',
          type: 'route_optimization',
          title: 'Pipeline Route Enhancement',
          description: 'Optimized pipeline route to reduce transportation costs and improve efficiency',
          confidence: 0.79,
          potential_savings: 12000000,
          implementation_timeline: '24 months',
          latitude: 19.0760,
          longitude: 72.8777,
          justification: 'Alternative route reduces distance by 23% while maintaining safety standards',
          requirements: ['Route survey', 'Environmental assessment', 'Construction permits'],
          score: 79,
          reasoning: 'Cost-effective route optimization with significant efficiency gains',
          estimated_cost: 120,
          renewable_proximity: 15.3,
          demand_proximity: 18.7,
          environmental_impact: 6,
          regulatory_compliance: true,
          infrastructure_synergy: 70,
          risk_assessment: 'medium',
          recommended_capacity: 30000,
          payback_period: 8,
          created_at: new Date().toISOString(),
          created_by: 'optimization_engine'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsOptimizing(false);
    }, 3000);
  };

  const handleExportResults = () => {
    const data = JSON.stringify(recommendations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'optimization_results.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading optimization tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Infrastructure Optimization</h1>
            <p className="text-gray-600 mt-2">
              AI-powered optimization for green hydrogen infrastructure planning
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Run Optimization</span>
                </>
              )}
            </button>
            {recommendations.length > 0 && (
              <button
                onClick={handleExportResults}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export Results</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Optimization Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-600" />
                Optimization Parameters
              </h3>
              <OptimizationPanel
                constraints={constraints}
                onConstraintsChange={setConstraints}
                onOptimize={handleOptimize}
                isOptimizing={isOptimizing}
              />
            </div>

            {/* Optimization Progress */}
            {isOptimizing && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Optimization Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Analyzing existing infrastructure</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Evaluating renewable energy sources</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                    <span className="text-sm text-gray-600">Computing optimal locations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-400">Generating recommendations</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map and Results */}
          <div className="lg:col-span-3">
            {/* Interactive Map */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-green-500" />
                  Optimization Map
                </h2>
              </div>
              <div className="h-96">
                <MapView
                  assets={assets}
                  selectedAsset={selectedAsset}
                  onAssetSelect={handleAssetSelect}
                  onMapClick={handleMapClick}
                />
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Optimization Recommendations ({recommendations.length})
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {rec.title || 'Untitled Recommendation'}
                            </h3>
                            <p className="text-gray-600 mb-4">{rec.description || 'No description available'}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-green-800">Confidence</p>
                                <p className="text-lg font-bold text-green-600">
                                  {((rec.confidence || 0) * 100).toFixed(1)}%
                                </p>
                              </div>
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-blue-800">Potential Savings</p>
                                <p className="text-lg font-bold text-blue-600">
                                  ₹{((rec.potential_savings || 0) / 10000000).toFixed(1)}Cr
                                </p>
                              </div>
                              <div className="bg-orange-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-orange-800">Timeline</p>
                                <p className="text-lg font-bold text-orange-600">
                                  {rec.implementation_timeline || 'TBD'}
                                </p>
                              </div>
                            </div>
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-2">Justification:</h4>
                              <p className="text-gray-600">{rec.justification || 'No justification provided'}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                              <div className="flex flex-wrap gap-2">
                                {(rec.requirements || []).map((req, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                                  >
                                    {req}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              (rec.confidence || 0) > 0.9 
                                ? 'bg-green-100 text-green-800'
                                : (rec.confidence || 0) > 0.8
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {(rec.confidence || 0) > 0.9 ? 'High Confidence' :
                               (rec.confidence || 0) > 0.8 ? 'Medium Confidence' : 'Low Confidence'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* No Recommendations Message */}
            {!isOptimizing && recommendations.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Optimization Results
                </h3>
                <p className="text-gray-600 mb-6">
                  Click "Run Optimization" to generate AI-powered recommendations for your green hydrogen infrastructure.
                </p>
                <button
                  onClick={handleOptimize}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Optimization</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Optimization;
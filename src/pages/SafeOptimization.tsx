import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Play, 
  Download, 
  RefreshCw, 
  Target,
  CheckCircle,
  Clock,
  MapPin,
  Zap
} from 'lucide-react';

const SafeOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationType, setOptimizationType] = useState('site_selection');

  const constraints = {
    maxDistance: 100,
    minCapacity: 50,
    maxCost: 1000000000,
    environmentalScore: 7,
    renewableProximity: true,
    demandProximity: true
  };

  const mockRecommendations = [
    {
      id: '1',
      type: 'Site Selection',
      title: 'Optimal Location for Hydrogen Plant',
      location: 'Rajasthan Industrial Zone',
      score: 94.2,
      savings: '₹15.2M',
      timeline: '18 months',
      coordinates: { lat: 27.0238, lng: 74.2179 }
    },
    {
      id: '2',
      type: 'Route Optimization',
      title: 'Efficient Pipeline Route',
      location: 'Gujarat-Maharashtra Corridor',
      score: 89.7,
      savings: '₹8.5M',
      timeline: '12 months',
      coordinates: { lat: 23.0225, lng: 72.5714 }
    },
    {
      id: '3',
      type: 'Capacity Optimization',
      title: 'Storage Facility Expansion',
      location: 'Delhi NCR Hub',
      score: 87.3,
      savings: '₹12.1M',
      timeline: '24 months',
      coordinates: { lat: 28.7041, lng: 77.1025 }
    }
  ];

  const handleOptimize = () => {
    setIsOptimizing(true);
    // Simulate optimization process
    setTimeout(() => {
      setIsOptimizing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Optimization</h1>
          <p className="text-gray-600 mt-2">
            Optimize hydrogen infrastructure placement, routing, and capacity using advanced algorithms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Optimization Type */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Optimization Type
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="optimization"
                    value="site_selection"
                    checked={optimizationType === 'site_selection'}
                    onChange={(e) => setOptimizationType(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-sm">Site Selection</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="optimization"
                    value="route_optimization"
                    checked={optimizationType === 'route_optimization'}
                    onChange={(e) => setOptimizationType(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-sm">Route Optimization</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="optimization"
                    value="capacity_planning"
                    checked={optimizationType === 'capacity_planning'}
                    onChange={(e) => setOptimizationType(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-sm">Capacity Planning</span>
                </label>
              </div>
            </div>

            {/* Constraints */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <SettingsIcon className="w-5 h-5 mr-2 text-gray-500" />
                Constraints
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Distance (km)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    defaultValue={constraints.maxDistance}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">{constraints.maxDistance} km</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Capacity (MW)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    defaultValue={constraints.minCapacity}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">{constraints.minCapacity} MW</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Environmental Score
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    defaultValue={constraints.environmentalScore}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">{constraints.environmentalScore}/10</div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={constraints.renewableProximity}
                      className="mr-2"
                    />
                    <span className="text-sm">Renewable Proximity</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={constraints.demandProximity}
                      className="mr-2"
                    />
                    <span className="text-sm">Demand Proximity</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Optimization
                    </>
                  )}
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </button>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                Optimization Map
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Interactive Optimization Map</h4>
                <p className="text-gray-500 mb-4">
                  Visualize optimization results and recommended locations
                </p>
                {isOptimizing && (
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="text-blue-600">Processing optimization...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Optimization Recommendations
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockRecommendations.map((rec) => (
                    <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                              {rec.type}
                            </span>
                            <span className="text-lg font-bold text-green-600">{rec.score}%</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                          <p className="text-sm text-gray-600 flex items-center mb-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            {rec.location}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                              Savings: {rec.savings}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1 text-blue-500" />
                              Timeline: {rec.timeline}
                            </span>
                          </div>
                        </div>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">94.2%</div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₹35.8M</div>
                  <div className="text-sm text-gray-600">Total Savings</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">18</div>
                  <div className="text-sm text-gray-600">Sites Analyzed</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">2.3s</div>
                  <div className="text-sm text-gray-600">Process Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeOptimization;
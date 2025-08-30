import React, { useState } from 'react';
import { Target, Loader, CheckCircle, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { OptimizationConstraints, Recommendation } from '../../types';

interface OptimizationPanelProps {
  onOptimize: (constraints: OptimizationConstraints) => Promise<void>;
  recommendations: Recommendation[];
  loading: boolean;
}

export function OptimizationPanel({ onOptimize, recommendations, loading }: OptimizationPanelProps) {
  const [constraints, setConstraints] = useState<OptimizationConstraints>({
    maxDistance: 50,
    minCapacity: 10,
    maxCost: 100,
    preferredZones: [],
    renewableProximity: true,
    environmentalScore: 7,
    safetyRequirements: ['A', 'B'],
    demandProximity: true,
    existingInfrastructure: true,
    transportationCost: true,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleOptimize = async () => {
    await onOptimize(constraints);
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Green Hydrogen Site Optimization</h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Optimization Controls */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Distance to Renewables (km)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={constraints.maxDistance}
                    onChange={(e) => setConstraints({ ...constraints, maxDistance: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-sm text-gray-600 mt-1">{constraints.maxDistance} km</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Hydrogen Production (tons/year)
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="50000"
                    step="100"
                    value={constraints.minCapacity}
                    onChange={(e) => setConstraints({ ...constraints, minCapacity: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-sm text-gray-600 mt-1">{constraints.minCapacity.toLocaleString()} tons/year</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Investment (Million USD)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="2000"
                    step="10"
                    value={constraints.maxCost}
                    onChange={(e) => setConstraints({ ...constraints, maxCost: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-sm text-gray-600 mt-1">${constraints.maxCost}M USD</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Environmental Score (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={constraints.environmentalScore}
                    onChange={(e) => setConstraints({ ...constraints, environmentalScore: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-sm text-gray-600 mt-1">{constraints.environmentalScore}/10</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="renewableProximity"
                      checked={constraints.renewableProximity}
                      onChange={(e) => setConstraints({ ...constraints, renewableProximity: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="renewableProximity" className="text-sm font-medium text-gray-700">
                      Prioritize renewable proximity
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="demandProximity"
                      checked={constraints.demandProximity}
                      onChange={(e) => setConstraints({ ...constraints, demandProximity: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="demandProximity" className="text-sm font-medium text-gray-700">
                      Consider demand centers
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="existingInfrastructure"
                      checked={constraints.existingInfrastructure}
                      onChange={(e) => setConstraints({ ...constraints, existingInfrastructure: e.target.checked })}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="existingInfrastructure" className="text-sm font-medium text-gray-700">
                      Leverage existing infrastructure
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="transportationCost"
                      checked={constraints.transportationCost}
                      onChange={(e) => setConstraints({ ...constraints, transportationCost: e.target.checked })}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="transportationCost" className="text-sm font-medium text-gray-700">
                      Include transportation analysis
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={handleOptimize}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing optimal sites...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Optimize Green Hydrogen Sites</span>
                  </>
                )}
              </button>
            </div>

            {/* Recommendations */}
            <div className="lg:col-span-1">
              {recommendations.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h4 className="text-md font-semibold text-gray-900">Optimization Results</h4>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {recommendations.slice(0, 10).map((rec, index) => (
                      <div key={rec.id} className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-gray-900">Site #{index + 1}</span>
                          </div>
                          <div className="text-sm font-semibold text-green-600">
                            Score: {rec.score.toFixed(1)}/100
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-2">
                          📍 {rec.latitude.toFixed(4)}, {rec.longitude.toFixed(4)}
                        </div>
                        
                        <div className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {rec.reasoning}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Investment:</span>
                            <span className="font-medium text-gray-800">${rec.estimated_cost.toFixed(0)}M</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Renewable Distance:</span>
                            <span className="font-medium text-gray-800">{rec.renewable_proximity.toFixed(1)} km</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Demand Distance:</span>
                            <span className="font-medium text-gray-800">{rec.demand_proximity.toFixed(1)} km</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Capacity:</span>
                            <span className="font-medium text-gray-800">{rec.recommended_capacity.toLocaleString()} tons/year</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Payback Period:</span>
                            <span className="font-medium text-gray-800">{rec.payback_period} years</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Risk Level:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(rec.risk_assessment)}`}>
                              {rec.risk_assessment.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Environmental Impact:</span>
                            <span className="font-medium text-gray-800">{rec.environmental_impact}/10</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!loading && recommendations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <p>Run optimization to see site recommendations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
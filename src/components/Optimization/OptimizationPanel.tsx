import React, { useState } from 'react';
import { Target, Loader, Zap } from 'lucide-react';
import { OptimizationConstraints } from '../../types';

interface OptimizationPanelProps {
  constraints: OptimizationConstraints;
  onConstraintsChange: React.Dispatch<React.SetStateAction<OptimizationConstraints>>;
  onOptimize: () => Promise<void>;
  isOptimizing: boolean;
}

export function OptimizationPanel({ constraints, onConstraintsChange, onOptimize, isOptimizing }: OptimizationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOptimize = async () => {
    await onOptimize();
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
                    onChange={(e) => onConstraintsChange({ ...constraints, maxDistance: parseInt(e.target.value) })}
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
                    onChange={(e) => onConstraintsChange({ ...constraints, minCapacity: parseInt(e.target.value) })}
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
                    onChange={(e) => onConstraintsChange({ ...constraints, maxCost: parseInt(e.target.value) })}
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
                    onChange={(e) => onConstraintsChange({ ...constraints, environmentalScore: parseInt(e.target.value) })}
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
                      onChange={(e) => onConstraintsChange({ ...constraints, renewableProximity: e.target.checked })}
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
                      onChange={(e) => onConstraintsChange({ ...constraints, demandProximity: e.target.checked })}
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
                      onChange={(e) => onConstraintsChange({ ...constraints, existingInfrastructure: e.target.checked })}
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
                      onChange={(e) => onConstraintsChange({ ...constraints, transportationCost: e.target.checked })}
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
                disabled={isOptimizing}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg"
              >
                {isOptimizing ? (
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
          </div>
        </div>
      )}
    </div>
  );
}
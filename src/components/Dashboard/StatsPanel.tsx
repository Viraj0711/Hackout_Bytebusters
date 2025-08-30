import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Asset } from '../../types';
import { Building, MapPin, Zap, TrendingUp, Factory, Battery, Truck, Users, Leaf } from 'lucide-react';

interface StatsPanelProps {
  assets: Asset[];
}

const COLORS = ['#059669', '#0ea5e9', '#8b5cf6', '#f97316', '#10b981', '#ef4444'];

export function StatsPanel({ assets }: StatsPanelProps) {
  // Enhanced analytics calculations for green hydrogen ecosystem
  const assetCounts = assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusCounts = assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const regionCounts = assets.reduce((acc, asset) => {
    if (asset.regulatory_zone) {
      acc[asset.regulatory_zone] = (acc[asset.regulatory_zone] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.entries(assetCounts).map(([type, count]) => ({
    name: type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()),
    value: count,
  }));

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()),
    count,
  }));

  const regionData = Object.entries(regionCounts).map(([region, count]) => ({
    name: region,
    count,
  }));

  // Green hydrogen specific calculations
  const totalHydrogenProduction = assets
    .filter(asset => asset.type === 'hydrogen_plant' && asset.annual_production)
    .reduce((sum, asset) => sum + (asset.annual_production || 0), 0);

  const totalRenewableCapacity = assets
    .filter(asset => asset.type === 'renewable_source' && asset.renewable_capacity)
    .reduce((sum, asset) => sum + (asset.renewable_capacity || 0), 0);

  const totalStorageCapacity = assets
    .filter(asset => asset.type === 'storage_facility' && asset.capacity)
    .reduce((sum, asset) => sum + (asset.capacity || 0), 0);

  const totalDemandForecast = assets
    .filter(asset => asset.type === 'demand_center' && asset.demand_forecast)
    .reduce((sum, asset) => sum + (asset.demand_forecast || 0), 0);

  const totalCost = assets
    .filter(asset => asset.cost_estimate)
    .reduce((sum, asset) => sum + (asset.cost_estimate || 0), 0);

  const averageEnvironmentalScore = assets
    .filter(asset => asset.environmental_impact_score)
    .reduce((sum, asset, _, arr) => sum + (asset.environmental_impact_score || 0) / arr.length, 0);

  // Calculate carbon reduction potential (rough estimate)
  const carbonReductionPotential = totalHydrogenProduction * 9.3; // kg CO2 saved per kg H2

  const getIconForType = (type: string) => {
    switch (type) {
      case 'hydrogen_plant': return Factory;
      case 'pipeline': return MapPin;
      case 'storage_facility': return Battery;
      case 'distribution_hub': return Truck;
      case 'renewable_source': return Zap;
      case 'demand_center': return Users;
      default: return Building;
    }
  };

  const getColorForType = (type: string) => {
    const colorMap: Record<string, string> = {
      'hydrogen_plant': 'text-green-600 bg-green-50',
      'pipeline': 'text-blue-600 bg-blue-50',
      'storage_facility': 'text-purple-600 bg-purple-50',
      'distribution_hub': 'text-orange-600 bg-orange-50',
      'renewable_source': 'text-emerald-600 bg-emerald-50',
      'demand_center': 'text-red-600 bg-red-50',
    };
    return colorMap[type] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Green Hydrogen Analytics</h2>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <Factory className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-700">{(totalHydrogenProduction / 1000).toFixed(1)}k</div>
                <div className="text-sm text-green-600">Tons H₂/Year Production</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-700">{totalRenewableCapacity.toFixed(0)}</div>
                <div className="text-sm text-blue-600">MW Renewable Capacity</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <Battery className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-700">{(totalStorageCapacity / 1000).toFixed(1)}k</div>
                <div className="text-sm text-purple-600">Tons Storage Capacity</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-700">{(totalDemandForecast / 1000).toFixed(1)}k</div>
                <div className="text-sm text-orange-600">Tons H₂/Year Demand</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-3">
              <Leaf className="w-8 h-8 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold text-emerald-700">{(carbonReductionPotential / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-emerald-600">Tons CO₂ Reduction/Year</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-700">${totalCost.toFixed(0)}M</div>
                <div className="text-sm text-gray-600">Total Investment</div>
              </div>
            </div>
          </div>
        </div>

        {/* Supply vs Demand */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply vs Demand Analysis</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">{(totalHydrogenProduction / 1000).toFixed(1)}k</div>
                <div className="text-sm text-gray-600">Supply (tons/year)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{(totalDemandForecast / 1000).toFixed(1)}k</div>
                <div className="text-sm text-gray-600">Demand (tons/year)</div>
              </div>
            </div>
            <div className="mt-4">
              <div className={`text-center font-semibold ${totalHydrogenProduction >= totalDemandForecast ? 'text-green-600' : 'text-red-600'}`}>
                {totalHydrogenProduction >= totalDemandForecast ? 'SUPPLY SURPLUS' : 'SUPPLY DEFICIT'}: {Math.abs((totalHydrogenProduction - totalDemandForecast) / 1000).toFixed(1)}k tons/year
              </div>
            </div>
          </div>
        </div>

        {/* Asset Type Distribution */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Overview */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution */}
        {regionData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Environmental Impact */}
        {averageEnvironmentalScore > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact</h3>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-800">Average Environmental Score</div>
                    <div className="text-sm text-green-600">Based on sustainability metrics</div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-700">{averageEnvironmentalScore.toFixed(1)}/10</div>
              </div>
            </div>
          </div>
        )}

        {/* Asset Type Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(assetCounts).map(([type, count]) => {
              const Icon = getIconForType(type);
              const colorClass = getColorForType(type);
              return (
                <div key={type} className={`flex items-center justify-between p-4 rounded-lg border ${colorClass}`}>
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6" />
                    <div>
                      <span className="font-medium text-gray-900 capitalize">
                        {type.replace(/_/g, ' ')}
                      </span>
                      <div className="text-xs text-gray-600 mt-1">
                        {type === 'hydrogen_plant' && `${(assets.filter(a => a.type === type).reduce((sum, a) => sum + (a.annual_production || 0), 0) / 1000).toFixed(1)}k tons/year`}
                        {type === 'renewable_source' && `${assets.filter(a => a.type === type).reduce((sum, a) => sum + (a.renewable_capacity || 0), 0).toFixed(0)} MW`}
                        {type === 'storage_facility' && `${(assets.filter(a => a.type === type).reduce((sum, a) => sum + (a.capacity || 0), 0) / 1000).toFixed(1)}k tons capacity`}
                        {type === 'demand_center' && `${(assets.filter(a => a.type === type).reduce((sum, a) => sum + (a.demand_forecast || 0), 0) / 1000).toFixed(1)}k tons/year demand`}
                        {(type === 'pipeline' || type === 'distribution_hub') && 'Infrastructure assets'}
                      </div>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
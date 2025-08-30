import React from 'react';
import { Search, Filter, MapPin, Activity, Building, Zap } from 'lucide-react';
import { FilterState } from '../../types';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const assetTypeOptions = [
  { value: 'plant', label: 'Hydrogen Plants', icon: Building },
  { value: 'pipeline', label: 'Pipelines', icon: MapPin },
  { value: 'storage', label: 'Storage Sites', icon: Activity },
  { value: 'distribution_hub', label: 'Distribution Hubs', icon: Zap },
  { value: 'renewable_source', label: 'Renewable Sources', icon: Zap },
];

const statusOptions = [
  { value: 'operational', label: 'Operational' },
  { value: 'planned', label: 'Planned' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'decommissioned', label: 'Decommissioned' },
];

const regionOptions = [
  { value: 'north', label: 'North Region' },
  { value: 'south', label: 'South Region' },
  { value: 'east', label: 'East Region' },
  { value: 'west', label: 'West Region' },
  { value: 'central', label: 'Central Region' },
];

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const handleAssetTypeToggle = (type: string) => {
    const newTypes = filters.assetTypes.includes(type)
      ? filters.assetTypes.filter(t => t !== type)
      : [...filters.assetTypes, type];
    
    onFiltersChange({ ...filters, assetTypes: newTypes });
  };

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleRegionToggle = (region: string) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter(r => r !== region)
      : [...filters.regions, region];
    
    onFiltersChange({ ...filters, regions: newRegions });
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search assets..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Asset Types</h3>
          <div className="space-y-2">
            {assetTypeOptions.map(({ value, label, icon: Icon }) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.assetTypes.includes(value)}
                  onChange={() => handleAssetTypeToggle(value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
          <div className="space-y-2">
            {statusOptions.map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(value)}
                  onChange={() => handleStatusToggle(value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Regulatory Zones</h3>
          <div className="space-y-2">
            {regionOptions.map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.regions.includes(value)}
                  onChange={() => handleRegionToggle(value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => onFiltersChange({ assetTypes: [], statuses: [], regions: [], search: '' })}
          className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
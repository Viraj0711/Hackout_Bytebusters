import { useState } from 'react';
import { MapView } from '../components/Map/MapView';
import { useAssets } from '../hooks/useAssets';
import { Asset } from '../types';
import { 
  Map as MapIcon, 
  Layers, 
  Search, 
  Filter, 
  Maximize2,
  Info,
  Navigation,
  Zap,
  Factory,
  Battery,
  Fuel
} from 'lucide-react';

const Map = () => {
  const { assets, loading } = useAssets();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [mapFilters, setMapFilters] = useState({
    showPlants: true,
    showStorage: true,
    showRenewable: true,
    showDemand: true,
    showPipelines: true,
    showHubs: true
  });
  const [searchLocation, setSearchLocation] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleAssetSelect = (asset: Asset | null) => {
    setSelectedAsset(asset);
  };

  const handleMapClick = (lat: number, lng: number) => {
    console.log('Map clicked at:', lat, lng);
    // Could be used for placing new assets
  };

  const filteredAssets = assets.filter(asset => {
    switch (asset.type) {
      case 'hydrogen_plant':
        return mapFilters.showPlants;
      case 'storage_facility':
        return mapFilters.showStorage;
      case 'renewable_source':
        return mapFilters.showRenewable;
      case 'demand_center':
        return mapFilters.showDemand;
      case 'pipeline':
        return mapFilters.showPipelines;
      case 'distribution_hub':
        return mapFilters.showHubs;
      default:
        return true;
    }
  });

  const assetTypeStats = filteredAssets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : ''} bg-gray-50`}>
      <div className={`${isFullscreen ? 'h-full' : 'min-h-screen'} flex flex-col`}>
        {/* Header */}
        <div className="px-6 py-4 bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <MapIcon className="w-6 h-6 mr-2 text-green-500" />
                  Global Hydrogen Infrastructure Map
                </h1>
                <p className="text-gray-600 text-sm">
                  Explore the worldwide green hydrogen ecosystem infrastructure
                </p>
              </div>
              
              {/* Search Location */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search global locations..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Left Sidebar - Asset Filters */}
          <div className={`${isFullscreen ? 'w-80' : 'w-72'} bg-white shadow-sm border-r border-gray-200 overflow-y-auto`}>
            <div className="p-6">
              {/* Layer Controls */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-blue-500" />
                  Map Layers
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mapFilters.showPlants}
                      onChange={(e) => setMapFilters(prev => ({ ...prev, showPlants: e.target.checked }))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <Factory className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Hydrogen Plants ({assetTypeStats.hydrogen_plant || 0})
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mapFilters.showStorage}
                      onChange={(e) => setMapFilters(prev => ({ ...prev, showStorage: e.target.checked }))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <Battery className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Storage Facilities ({assetTypeStats.storage_facility || 0})
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mapFilters.showRenewable}
                      onChange={(e) => setMapFilters(prev => ({ ...prev, showRenewable: e.target.checked }))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <Zap className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Renewable Sources ({assetTypeStats.renewable_source || 0})
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mapFilters.showDemand}
                      onChange={(e) => setMapFilters(prev => ({ ...prev, showDemand: e.target.checked }))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <Fuel className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Demand Centers ({assetTypeStats.demand_center || 0})
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mapFilters.showPipelines}
                      onChange={(e) => setMapFilters(prev => ({ ...prev, showPipelines: e.target.checked }))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <Navigation className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Pipelines ({assetTypeStats.pipeline || 0})
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mapFilters.showHubs}
                      onChange={(e) => setMapFilters(prev => ({ ...prev, showHubs: e.target.checked }))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <Filter className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Distribution Hubs ({assetTypeStats.distribution_hub || 0})
                    </span>
                  </label>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-800">Total Assets</p>
                    <p className="text-xl font-bold text-green-600">{filteredAssets.length}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-800">Operational</p>
                    <p className="text-xl font-bold text-blue-600">
                      {filteredAssets.filter(a => a.status === 'operational').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-800">Planned</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {filteredAssets.filter(a => a.status === 'planned').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Operational</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Planned</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Under Construction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span>Proposed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Map Area */}
          <div className="flex-1 relative">
            <MapView
              assets={filteredAssets}
              selectedAsset={selectedAsset}
              onAssetSelect={handleAssetSelect}
              onMapClick={handleMapClick}
            />
            
            {/* Selected Asset Info Panel */}
            {selectedAsset && (
              <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Info className="w-5 h-5 mr-2 text-blue-500" />
                      Asset Details
                    </h3>
                    <button
                      onClick={() => setSelectedAsset(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-gray-900">{selectedAsset.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Type</p>
                      <p className="text-gray-900 capitalize">
                        {selectedAsset.type.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedAsset.status === 'operational' 
                          ? 'bg-green-100 text-green-800'
                          : selectedAsset.status === 'planned'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedAsset.status === 'under_construction'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedAsset.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    {selectedAsset.capacity && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Capacity</p>
                        <p className="text-gray-900">
                          {selectedAsset.capacity} {selectedAsset.capacity_unit || 'MW'}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-600">Owner</p>
                      <p className="text-gray-900">{selectedAsset.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-gray-900 text-sm">
                        {selectedAsset.latitude.toFixed(4)}, {selectedAsset.longitude.toFixed(4)}
                      </p>
                    </div>
                    {selectedAsset.description && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Description</p>
                        <p className="text-gray-900 text-sm">{selectedAsset.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
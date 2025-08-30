import React from 'react';
import { Edit, Trash2, MapPin, Building, Activity, Zap } from 'lucide-react';
import { Asset } from '../../types';

interface AssetListProps {
  assets: Asset[];
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  onAssetSelect: (asset: Asset) => void;
}

const getAssetIcon = (type: Asset['type']) => {
  switch (type) {
    case 'plant': return Building;
    case 'pipeline': return MapPin;
    case 'storage': return Activity;
    case 'distribution_hub': return Zap;
    case 'renewable_source': return Zap;
    default: return Building;
  }
};

const getStatusColor = (status: Asset['status']) => {
  switch (status) {
    case 'operational': return 'bg-green-100 text-green-800';
    case 'planned': return 'bg-blue-100 text-blue-800';
    case 'under_construction': return 'bg-orange-100 text-orange-800';
    case 'decommissioned': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function AssetList({ assets, onEditAsset, onDeleteAsset, onAssetSelect }: AssetListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Infrastructure Assets</h3>
        <p className="text-sm text-gray-600 mt-1">{assets.length} assets found</p>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {assets.map((asset) => {
          const Icon = getAssetIcon(asset.type);
          
          return (
            <div key={asset.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon className="w-5 h-5 text-gray-600 mt-1" />
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => onAssetSelect(asset)}
                      className="text-left block w-full"
                    >
                      <h4 className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {asset.name}
                      </h4>
                    </button>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(asset.status)}`}>
                        {asset.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {asset.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{asset.owner}</p>
                    {asset.capacity && (
                      <p className="text-xs text-gray-500 mt-1">
                        {asset.capacity} {asset.capacity_unit}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onEditAsset(asset)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAsset(asset.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {assets.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No assets found</p>
            <p className="text-sm">Try adjusting your filters or add new assets to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
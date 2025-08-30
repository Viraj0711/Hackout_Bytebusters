import { useState } from 'react';
import { MapView } from '../components/Map/MapView';
import { useAssets } from '../hooks/useAssets';
import { Asset } from '../types';

const Map = () => {
  const { assets, loading } = useAssets();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleMapClick = (lat: number, lng: number) => {
    console.log('Map clicked at:', lat, lng);
    // Handle map click - maybe add new asset or clear selection
    setSelectedAsset(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <MapView 
        assets={assets}
        selectedAsset={selectedAsset}
        onAssetSelect={handleAssetSelect}
        onMapClick={handleMapClick}
      />
    </div>
  );
};

export default Map;
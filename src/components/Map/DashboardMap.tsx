import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Asset } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface DashboardMapProps {
  assets?: Asset[];
  height?: string;
}

const getAssetIcon = (type: Asset['type'], status: Asset['status']) => {
  const colors = {
    hydrogen_plant: '#059669',
    pipeline: '#0ea5e9',
    storage_facility: '#8b5cf6',
    distribution_hub: '#f97316',
    renewable_source: '#10b981',
    demand_center: '#ef4444',
    production: '#059669',      // Map to hydrogen_plant
    storage: '#8b5cf6',         // Map to storage_facility
    distribution: '#f97316',    // Map to distribution_hub
    transport: '#0ea5e9',       // Map to pipeline
  };

  const baseColor = colors[type] || '#6b7280';
  const opacity = status === 'operational' ? 1 : status === 'under_construction' ? 0.8 : 0.6;
  const size = 16;

  const getIconSymbol = (assetType: string) => {
    switch (assetType) {
      case 'hydrogen_plant':
      case 'production':
        return 'H₂';
      case 'pipeline':
      case 'transport':
        return '|';
      case 'storage_facility':
      case 'storage':
        return 'S';
      case 'distribution_hub':
      case 'distribution':
        return 'D';
      case 'renewable_source':
        return 'R';
      case 'demand_center':
        return '⚡';
      default:
        return '●';
    }
  };

  const iconHtml = `
    <div style="
      background-color: ${baseColor};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      opacity: ${opacity};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 8px;
      font-weight: bold;
    ">
      ${getIconSymbol(type)}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const DashboardMap: React.FC<DashboardMapProps> = ({ 
  assets = [], 
  height = '400px' 
}) => {
  // Sample assets for demonstration if none provided
  const sampleAssets: Asset[] = [
    {
      id: '1',
      name: 'Rajasthan Solar H₂ Plant',
      type: 'hydrogen_plant',
      status: 'operational',
      latitude: 27.0238,
      longitude: 74.2179,
      capacity: 500,
      annual_production: 1000,
      owner: 'Green Energy Corp',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: 'system'
    },
    {
      id: '2',
      name: 'Gujarat Storage Facility',
      type: 'storage_facility',
      status: 'operational',
      latitude: 23.0225,
      longitude: 72.5714,
      capacity: 800,
      annual_production: 0,
      owner: 'Storage Solutions Ltd',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: 'system'
    },
    {
      id: '3',
      name: 'Mumbai Pipeline Network',
      type: 'pipeline',
      status: 'under_construction',
      latitude: 19.0760,
      longitude: 72.8777,
      capacity: 300,
      annual_production: 0,
      owner: 'Pipeline Industries',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: 'system'
    },
    {
      id: '4',
      name: 'Delhi Distribution Hub',
      type: 'distribution_hub',
      status: 'operational',
      latitude: 28.7041,
      longitude: 77.1025,
      capacity: 200,
      annual_production: 0,
      owner: 'Distribution Network Co',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: 'system'
    },
    {
      id: '5',
      name: 'Chennai Renewable Source',
      type: 'renewable_source',
      status: 'operational',
      latitude: 13.0827,
      longitude: 80.2707,
      capacity: 600,
      annual_production: 1200,
      owner: 'Renewable Energy Ltd',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: 'system'
    },
    {
      id: '6',
      name: 'Pune Demand Center',
      type: 'demand_center',
      status: 'operational',
      latitude: 18.5204,
      longitude: 73.8567,
      capacity: 150,
      annual_production: 0,
      owner: 'Industrial Hub Corp',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: 'system'
    }
  ];

  const displayAssets = assets.length > 0 ? assets : sampleAssets;

  // Filter out assets without valid coordinates
  const validAssets = displayAssets.filter(asset => 
    asset.latitude && 
    asset.longitude && 
    !isNaN(asset.latitude) && 
    !isNaN(asset.longitude) &&
    asset.latitude >= -90 && 
    asset.latitude <= 90 &&
    asset.longitude >= -180 && 
    asset.longitude <= 180
  );

  return (
    <div style={{ height, width: '100%' }} className="relative rounded-lg overflow-hidden">
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {validAssets.map((asset) => (
          <Marker
            key={asset.id}
            position={[asset.latitude, asset.longitude]}
            icon={getAssetIcon(asset.type, asset.status)}
          >
            <Popup>
              <div className="p-2 min-w-48">
                <h3 className="font-semibold text-sm mb-2">{asset.name}</h3>
                <div className="space-y-1 text-xs">
                  <p><span className="font-medium">Type:</span> {asset.type.replace(/_/g, ' ')}</p>
                  <p><span className="font-medium">Status:</span> {asset.status.replace(/_/g, ' ')}</p>
                  <p><span className="font-medium">Owner:</span> {asset.owner}</p>
                  {asset.capacity && (
                    <p><span className="font-medium">Capacity:</span> {asset.capacity} MW</p>
                  )}
                  {asset.annual_production && asset.annual_production > 0 && (
                    <p><span className="font-medium">Production:</span> {asset.annual_production} MWh/year</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Asset Types</h4>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-gray-600">H₂ Plants</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Pipelines</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Storage</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Hubs</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600">Renewable</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Demand</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMap;
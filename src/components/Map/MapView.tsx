import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Asset } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  assets: Asset[];
  selectedAsset: Asset | null;
  onAssetSelect: (asset: Asset) => void;
  onMapClick: (lat: number, lng: number) => void;
}

const getAssetIcon = (type: Asset['type'], status: Asset['status'], subtype?: string) => {
  const colors = {
    hydrogen_plant: '#059669', // Green for hydrogen production
    pipeline: '#0ea5e9', // Blue for transport
    storage_facility: '#8b5cf6', // Purple for storage
    distribution_hub: '#f97316', // Orange for distribution
    renewable_source: '#10b981', // Emerald for renewables
    demand_center: '#ef4444', // Red for demand
  };

  const shapes = {
    hydrogen_plant: 'circle',
    pipeline: 'line',
    storage_facility: 'square',
    distribution_hub: 'diamond',
    renewable_source: 'triangle',
    demand_center: 'hexagon',
  };

  // Status-based styling
  const getStatusStyle = (status: Asset['status']) => {
    switch (status) {
      case 'operational':
        return { opacity: 1, size: 20, borderColor: '#22c55e' };
      case 'under_construction':
        return { opacity: 0.8, size: 18, borderColor: '#f59e0b' };
      case 'planned':
        return { opacity: 0.6, size: 16, borderColor: '#6b7280' };
      case 'proposed':
        return { opacity: 0.4, size: 14, borderColor: '#9ca3af' };
      default:
        return { opacity: 0.3, size: 12, borderColor: '#d1d5db' };
    }
  };

  const statusStyle = getStatusStyle(status);
  const baseColor = colors[type];
  const shape = shapes[type];
  
  let iconHtml = '';
  
  switch (shape) {
    case 'circle':
      iconHtml = `
        <div style="
          background-color: ${baseColor}; 
          opacity: ${statusStyle.opacity}; 
          width: ${statusStyle.size}px; 
          height: ${statusStyle.size}px; 
          border-radius: 50%; 
          border: 2px solid ${statusStyle.borderColor}; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: ${statusStyle.size * 0.4}px;
            font-weight: bold;
          ">H₂</div>
        </div>`;
      break;
    case 'square':
      iconHtml = `
        <div style="
          background-color: ${baseColor}; 
          opacity: ${statusStyle.opacity}; 
          width: ${statusStyle.size}px; 
          height: ${statusStyle.size}px; 
          border: 2px solid ${statusStyle.borderColor}; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: ${statusStyle.size * 0.3}px;
            font-weight: bold;
          ">S</div>
        </div>`;
      break;
    case 'diamond':
      iconHtml = `
        <div style="
          background-color: ${baseColor}; 
          opacity: ${statusStyle.opacity}; 
          width: ${statusStyle.size}px; 
          height: ${statusStyle.size}px; 
          border: 2px solid ${statusStyle.borderColor}; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3); 
          transform: rotate(45deg);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            color: white;
            font-size: ${statusStyle.size * 0.3}px;
            font-weight: bold;
          ">D</div>
        </div>`;
      break;
    case 'triangle': {
      const triangleColor = subtype === 'solar_farm' ? '#fbbf24' : baseColor;
      iconHtml = `
        <div style="
          width: 0; 
          height: 0; 
          border-left: ${statusStyle.size/2}px solid transparent; 
          border-right: ${statusStyle.size/2}px solid transparent; 
          border-bottom: ${statusStyle.size}px solid ${triangleColor}; 
          opacity: ${statusStyle.opacity}; 
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3)) drop-shadow(0 0 0 2px ${statusStyle.borderColor});
          position: relative;
        ">
          <div style="
            position: absolute;
            top: ${statusStyle.size * 0.6}px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: ${statusStyle.size * 0.25}px;
            font-weight: bold;
          ">${subtype === 'solar_farm' ? '☀' : '⚡'}</div>
        </div>`;
      break;
    }
    case 'hexagon':
      iconHtml = `
        <div style="
          background-color: ${baseColor}; 
          opacity: ${statusStyle.opacity}; 
          width: ${statusStyle.size}px; 
          height: ${statusStyle.size * 0.866}px; 
          position: relative; 
          border: 2px solid ${statusStyle.borderColor}; 
          clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: ${statusStyle.size * 0.3}px;
            font-weight: bold;
          ">⚙</div>
        </div>`;
      break;
    default:
      iconHtml = `
        <div style="
          background-color: ${baseColor}; 
          opacity: ${statusStyle.opacity}; 
          width: ${statusStyle.size}px; 
          height: ${statusStyle.size}px; 
          border-radius: 50%; 
          border: 2px solid ${statusStyle.borderColor}; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>`;
  }
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [statusStyle.size, statusStyle.size],
    iconAnchor: [statusStyle.size/2, statusStyle.size/2],
  });
};

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

export function MapView({ assets, selectedAsset, onAssetSelect, onMapClick }: MapViewProps) {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (selectedAsset && mapRef.current) {
      mapRef.current.setView([selectedAsset.latitude, selectedAsset.longitude], 12);
    }
  }, [selectedAsset]);

  // Calculate map center based on assets or default to global view
  const getMapCenter = (): [number, number] => {
    if (assets.length === 0) {
      return [20, 0]; // Global center view
    }
    
    // For global view, use world center
    return [20, 0]; // Slightly north of equator for better continent visibility
  };

  const mapCenter = getMapCenter();

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={mapCenter}
        zoom={2}
        minZoom={1}
        maxZoom={18}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={onMapClick} />

        {assets.map((asset) => (
          <Marker
            key={asset.id}
            position={[asset.latitude, asset.longitude]}
            icon={getAssetIcon(asset.type, asset.status, asset.subtype)}
            eventHandlers={{
              click: () => onAssetSelect(asset),
            }}
          >
            <Popup>
              <div className="p-2 max-w-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{asset.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Type:</span> 
                    <span className="text-gray-800 capitalize">{asset.type.replace(/_/g, ' ')}</span>
                  </div>
                  {asset.subtype && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Subtype:</span> 
                      <span className="text-gray-800 capitalize">{asset.subtype.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Status:</span> 
                    <span className={`capitalize px-2 py-1 rounded-full text-xs font-semibold ${
                      asset.status === 'operational' 
                        ? 'bg-green-100 text-green-800'
                        : asset.status === 'under_construction'
                        ? 'bg-orange-100 text-orange-800'
                        : asset.status === 'planned'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {asset.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Owner:</span> 
                    <span className="text-gray-800">{asset.owner}</span>
                  </div>
                  {asset.capacity && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Capacity:</span> 
                      <span className="text-gray-800">{asset.capacity} {asset.capacity_unit}</span>
                    </div>
                  )}
                  {asset.annual_production && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Annual Production:</span> 
                      <span className="text-gray-800">{asset.annual_production.toLocaleString()} kg/year</span>
                    </div>
                  )}
                  {asset.renewable_capacity && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Renewable Capacity:</span> 
                      <span className="text-gray-800">{asset.renewable_capacity} MW</span>
                    </div>
                  )}
                  {asset.demand_forecast && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Demand Forecast:</span> 
                      <span className="text-gray-800">{asset.demand_forecast.toLocaleString()} kg/year</span>
                    </div>
                  )}
                  {asset.environmental_impact_score && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Environmental Score:</span> 
                      <span className={`font-semibold ${
                        asset.environmental_impact_score >= 8 
                          ? 'text-green-600' 
                          : asset.environmental_impact_score >= 6 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                      }`}>
                        {asset.environmental_impact_score}/10
                      </span>
                    </div>
                  )}
                  {asset.safety_rating && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Safety Rating:</span> 
                      <span className={`font-bold ${
                        asset.safety_rating === 'A' 
                          ? 'text-green-600' 
                          : asset.safety_rating === 'B' 
                          ? 'text-blue-600' 
                          : asset.safety_rating === 'C'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {asset.safety_rating}
                      </span>
                    </div>
                  )}
                  {asset.description && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <span className="font-medium text-gray-600">Description:</span>
                      <p className="text-gray-800 text-xs mt-1">{asset.description}</p>
                    </div>
                  )}
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                    📍 {asset.latitude.toFixed(4)}, {asset.longitude.toFixed(4)}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

interface MapViewProps {
  assets: Asset[];
  selectedAsset: Asset | null;
  onAssetSelect: (asset: Asset) => void;
  onMapClick: (lat: number, lng: number) => void;
}

const getAssetIcon = (type: Asset['type'], status: Asset['status'], _subtype?: string) => {
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

  const opacity = status === 'operational' ? 1 : status === 'under_construction' ? 0.8 : 0.6;
  const size = status === 'operational' ? 20 : 16;
  
  const baseColor = colors[type];
  const shape = shapes[type];
  
  let iconHtml = '';
  
  switch (shape) {
    case 'circle':
      iconHtml = `<div style="background-color: ${baseColor}; opacity: ${opacity}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`;
      break;
    case 'square':
      iconHtml = `<div style="background-color: ${baseColor}; opacity: ${opacity}; width: ${size}px; height: ${size}px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`;
      break;
    case 'diamond':
      iconHtml = `<div style="background-color: ${baseColor}; opacity: ${opacity}; width: ${size}px; height: ${size}px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transform: rotate(45deg);"></div>`;
      break;
    case 'triangle':
      iconHtml = `<div style="width: 0; height: 0; border-left: ${size/2}px solid transparent; border-right: ${size/2}px solid transparent; border-bottom: ${size}px solid ${baseColor}; opacity: ${opacity}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></div>`;
      break;
    case 'hexagon':
      iconHtml = `<div style="background-color: ${baseColor}; opacity: ${opacity}; width: ${size}px; height: ${size*0.866}px; position: relative; border: 2px solid white; clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`;
      break;
    default:
      iconHtml = `<div style="background-color: ${baseColor}; opacity: ${opacity}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`;
  }
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
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
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (selectedAsset && mapRef.current) {
      mapRef.current.setView([selectedAsset.latitude, selectedAsset.longitude], 12);
    }
  }, [selectedAsset]);

  // Filter out assets without valid coordinates
  const validAssets = assets.filter(asset => 
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
    <div className="h-full w-full relative">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={6}
        className="h-full w-full"
        ref={mapRef}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        <MapClickHandler onMapClick={onMapClick} />

        {validAssets.map((asset) => (
          <Marker
            key={asset.id}
            position={[asset.latitude, asset.longitude]}
            icon={getAssetIcon(asset.type, asset.status, asset.subtype)}
            eventHandlers={{
              click: () => onAssetSelect(asset),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg mb-2">{asset.name}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Type:</span> {asset.type.replace(/_/g, ' ')}</p>
                  {asset.subtype && (
                    <p><span className="font-medium">Subtype:</span> {asset.subtype.replace(/_/g, ' ')}</p>
                  )}
                  <p><span className="font-medium">Status:</span> {asset.status.replace(/_/g, ' ')}</p>
                  <p><span className="font-medium">Owner:</span> {asset.owner}</p>
                  {asset.capacity && (
                    <p><span className="font-medium">Capacity:</span> {asset.capacity} {asset.capacity_unit}</p>
                  )}
                  {asset.annual_production && (
                    <p><span className="font-medium">Annual Production:</span> {asset.annual_production.toLocaleString()} kg/year</p>
                  )}
                  {asset.renewable_capacity && (
                    <p><span className="font-medium">Renewable Capacity:</span> {asset.renewable_capacity} MW</p>
                  )}
                  {asset.demand_forecast && (
                    <p><span className="font-medium">Demand Forecast:</span> {asset.demand_forecast.toLocaleString()} kg/year</p>
                  )}
                  {asset.environmental_impact_score && (
                    <p><span className="font-medium">Environmental Score:</span> {asset.environmental_impact_score}/10</p>
                  )}
                  {asset.safety_rating && (
                    <p><span className="font-medium">Safety Rating:</span> {asset.safety_rating}</p>
                  )}
                  {asset.description && (
                    <p><span className="font-medium">Description:</span> {asset.description}</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

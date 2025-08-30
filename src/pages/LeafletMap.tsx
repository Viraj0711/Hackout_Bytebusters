import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { 
  Map as MapIcon, 
  Layers, 
  Factory, 
  Battery, 
  Fuel,
  Search,
  Filter,
  Info,
  Plus,
  Minus,
  Locate
} from 'lucide-react';

// Fix for Leaflet default markers in bundled environments
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface HydrogenAsset {
  id: number;
  name: string;
  type: 'production' | 'storage' | 'distribution';
  location: { lat: number; lng: number };
  capacity: string;
  status: 'operational' | 'maintenance' | 'construction';
  efficiency?: string;
  production?: string;
  filled?: string;
  pressure?: string;
  throughput?: string;
  connections?: number;
  completion?: string;
  expectedOnline?: string;
}

// Custom marker icons for different asset types
const createCustomIcon = (type: string, status: string) => {
  const colors = {
    production: status === 'operational' ? '#10b981' : status === 'maintenance' ? '#f59e0b' : '#3b82f6',
    storage: status === 'operational' ? '#8b5cf6' : status === 'maintenance' ? '#f59e0b' : '#3b82f6',
    distribution: status === 'operational' ? '#f97316' : status === 'maintenance' ? '#f59e0b' : '#3b82f6'
  };

  const color = colors[type as keyof typeof colors] || '#6b7280';
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg);
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">
          ${type === 'production' ? '⚡' : type === 'storage' ? '🔋' : '⛽'}
        </div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25]
  });
};

// Map control component
const LeafletMap = () => {
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<HydrogenAsset | null>(null);
  const [mapView, setMapView] = useState('openstreetmap');
  const [map, setMap] = useState<L.Map | null>(null);

  // Mock data for hydrogen infrastructure with real coordinates
  const hydrogenAssets: HydrogenAsset[] = [
    {
      id: 1,
      name: 'Gujarat Green H2 Plant',
      type: 'production',
      location: { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
      capacity: '50 MW',
      status: 'operational',
      efficiency: '89%',
      production: '12.5 tons/day'
    },
    {
      id: 2,
      name: 'Rajasthan Solar H2 Facility',
      type: 'production',
      location: { lat: 27.0238, lng: 74.2179 }, // Jaipur
      capacity: '75 MW',
      status: 'operational',
      efficiency: '91%',
      production: '18.7 tons/day'
    },
    {
      id: 3,
      name: 'Mumbai Storage Hub',
      type: 'storage',
      location: { lat: 19.0760, lng: 72.8777 }, // Mumbai
      capacity: '100 MWh',
      status: 'operational',
      filled: '78%',
      pressure: '350 bar'
    },
    {
      id: 4,
      name: 'Delhi Distribution Center',
      type: 'distribution',
      location: { lat: 28.7041, lng: 77.1025 }, // Delhi
      capacity: '25 MW',
      status: 'maintenance',
      throughput: '8.2 tons/day',
      connections: 15
    },
    {
      id: 5,
      name: 'Chennai Coastal Plant',
      type: 'production',
      location: { lat: 13.0827, lng: 80.2707 }, // Chennai
      capacity: '60 MW',
      status: 'construction',
      completion: '65%',
      expectedOnline: 'Q2 2024'
    },
    {
      id: 6,
      name: 'Bangalore Tech Hub',
      type: 'distribution',
      location: { lat: 12.9716, lng: 77.5946 }, // Bangalore
      capacity: '30 MW',
      status: 'operational',
      throughput: '10.5 tons/day',
      connections: 22
    },
    {
      id: 7,
      name: 'Kolkata Industrial Complex',
      type: 'storage',
      location: { lat: 22.5726, lng: 88.3639 }, // Kolkata
      capacity: '85 MWh',
      status: 'operational',
      filled: '92%',
      pressure: '300 bar'
    },
    {
      id: 8,
      name: 'Hyderabad Innovation Center',
      type: 'production',
      location: { lat: 17.3850, lng: 78.4867 }, // Hyderabad
      capacity: '40 MW',
      status: 'construction',
      completion: '80%',
      expectedOnline: 'Q1 2024'
    }
  ];

  const layers = [
    { id: 'all', name: 'All Assets', icon: Layers },
    { id: 'production', name: 'Production', icon: Factory },
    { id: 'storage', name: 'Storage', icon: Battery },
    { id: 'distribution', name: 'Distribution', icon: Fuel }
  ];

  const getAssetIcon = (type: string) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case 'production':
        return <Factory {...iconProps} />;
      case 'storage':
        return <Battery {...iconProps} />;
      case 'distribution':
        return <Fuel {...iconProps} />;
      default:
        return <Factory {...iconProps} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'construction':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredAssets = selectedLayer === 'all' 
    ? hydrogenAssets 
    : hydrogenAssets.filter(asset => asset.type === selectedLayer);

  // Tile layer URLs
  const tileLayerUrls = {
    openstreetmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  const tileLayerUrl = tileLayerUrls[mapView as keyof typeof tileLayerUrls] || tileLayerUrls.openstreetmap;

  const handleZoomIn = () => {
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    if (map) map.zoomOut();
  };

  const handleReset = () => {
    if (map) map.setView([20.5937, 78.9629], 6);
  };

  const handleMarkerClick = (asset: HydrogenAsset) => {
    setSelectedAsset(asset);
    if (map) {
      map.setView([asset.location.lat, asset.location.lng], 10);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MapIcon className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Hydrogen Infrastructure Map - Leaflet</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for places..."
                className="px-3 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={mapView}
              onChange={(e) => setMapView(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="openstreetmap">Street Map</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Layer Controls */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              Map Layers
            </h3>
            <div className="space-y-2">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedLayer === layer.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <layer.icon className="w-4 h-4" />
                  <span>{layer.name}</span>
                  <span className="ml-auto text-sm bg-gray-200 px-2 py-1 rounded">
                    {layer.id === 'all' ? hydrogenAssets.length : hydrogenAssets.filter(a => a.type === layer.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Asset List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Assets ({filteredAssets.length})
              </h3>
              <div className="space-y-2">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => handleMarkerClick(asset)}
                    className={`p-3 border border-gray-200 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedAsset?.id === asset.id ? 'ring-2 ring-blue-500 border-blue-300' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getAssetIcon(asset.type)}
                        <span className="font-medium text-sm">{asset.name}</span>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(asset.status)}`}></div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Capacity: {asset.capacity}</div>
                      <div className="capitalize">Status: {asset.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leaflet Map Area */}
        <div className="flex-1 relative">
          <MapContainer
            center={[20.5937, 78.9629] as LatLngExpression}
            zoom={6}
            style={{ height: '100%', width: '100%', minHeight: '500px' }}
            ref={setMap}
          >
            <TileLayer
              url={tileLayerUrl}
              attribution={
                mapView === 'satellite' 
                  ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  : mapView === 'terrain'
                  ? 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
            />

            {/* Asset Markers */}
            {filteredAssets.map((asset) => (
              <Marker
                key={asset.id}
                position={[asset.location.lat, asset.location.lng] as LatLngExpression}
                icon={createCustomIcon(asset.type, asset.status)}
                eventHandlers={{
                  click: () => handleMarkerClick(asset)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-900 mb-2">{asset.name}</h3>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Type:</span> {asset.type}</div>
                      <div><span className="font-medium">Capacity:</span> {asset.capacity}</div>
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          asset.status === 'operational' ? 'bg-green-100 text-green-800' :
                          asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {asset.status}
                        </span>
                      </div>
                      {asset.efficiency && <div><span className="font-medium">Efficiency:</span> {asset.efficiency}</div>}
                      {asset.production && <div><span className="font-medium">Production:</span> {asset.production}</div>}
                      {asset.filled && <div><span className="font-medium">Filled:</span> {asset.filled}</div>}
                      {asset.pressure && <div><span className="font-medium">Pressure:</span> {asset.pressure}</div>}
                      {asset.throughput && <div><span className="font-medium">Throughput:</span> {asset.throughput}</div>}
                      {asset.connections && <div><span className="font-medium">Connections:</span> {asset.connections}</div>}
                      {asset.completion && <div><span className="font-medium">Completion:</span> {asset.completion}</div>}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Fixed Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
            {/* Zoom Controls */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-t-lg border-b border-gray-200 transition-colors"
                title="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-b-lg transition-colors"
                title="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Reset Location */}
            <button
              onClick={handleReset}
              className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              title="Reset to India view"
            >
              <Locate className="w-4 h-4" />
            </button>
          </div>

          {/* Map Info */}
          <div className="absolute bottom-4 left-4 bg-white rounded px-3 py-2 shadow-lg border border-gray-200 text-xs text-gray-600 z-[1000]">
            <div>{filteredAssets.length} assets visible</div>
            <div>Interactive Leaflet Map</div>
          </div>
        </div>

        {/* Selected Asset Details Panel */}
        {selectedAsset && (
          <div className="absolute top-4 left-96 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-[1001]">
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
                  <h4 className="font-medium text-gray-900">{selectedAsset.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{selectedAsset.type} Facility</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Capacity:</span>
                    <div className="font-medium">{selectedAsset.capacity}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <div className={`font-medium capitalize ${
                      selectedAsset.status === 'operational' ? 'text-green-600' :
                      selectedAsset.status === 'maintenance' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {selectedAsset.status}
                    </div>
                  </div>
                </div>

                {selectedAsset.type === 'production' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Efficiency:</span>
                      <div className="font-medium">{selectedAsset.efficiency}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Production:</span>
                      <div className="font-medium">{selectedAsset.production}</div>
                    </div>
                  </div>
                )}

                {selectedAsset.type === 'storage' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Filled:</span>
                      <div className="font-medium">{selectedAsset.filled}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Pressure:</span>
                      <div className="font-medium">{selectedAsset.pressure}</div>
                    </div>
                  </div>
                )}

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeafletMap;
import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  MapPin, 
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

const GoogleStyleMap = () => {
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<HydrogenAsset | null>(null);
  const [mapView, setMapView] = useState('satellite');
  const [zoomLevel, setZoomLevel] = useState(6);
  const [_mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock data for hydrogen infrastructure with real coordinates
  const hydrogenAssets: HydrogenAsset[] = [
    {
      id: 1,
      name: 'Gujarat Green H2 Plant',
      type: 'production' as const,
      location: { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
      capacity: '50 MW',
      status: 'operational' as const,
      efficiency: '89%',
      production: '12.5 tons/day'
    },
    {
      id: 2,
      name: 'Rajasthan Solar H2 Facility',
      type: 'production' as const,
      location: { lat: 27.0238, lng: 74.2179 }, // Jaipur
      capacity: '75 MW',
      status: 'operational' as const,
      efficiency: '91%',
      production: '18.7 tons/day'
    },
    {
      id: 3,
      name: 'Mumbai Storage Hub',
      type: 'storage' as const,
      location: { lat: 19.0760, lng: 72.8777 }, // Mumbai
      capacity: '100 MWh',
      status: 'operational' as const,
      filled: '78%',
      pressure: '350 bar'
    },
    {
      id: 4,
      name: 'Delhi Distribution Center',
      type: 'distribution' as const,
      location: { lat: 28.7041, lng: 77.1025 }, // Delhi
      capacity: '25 MW',
      status: 'maintenance' as const,
      throughput: '8.2 tons/day',
      connections: 15
    },
    {
      id: 5,
      name: 'Chennai Coastal Plant',
      type: 'production' as const,
      location: { lat: 13.0827, lng: 80.2707 }, // Chennai
      capacity: '60 MW',
      status: 'construction' as const,
      completion: '65%',
      expectedOnline: 'Q2 2024'
    },
    {
      id: 6,
      name: 'Bangalore Tech Hub',
      type: 'distribution' as const,
      location: { lat: 12.9716, lng: 77.5946 }, // Bangalore
      capacity: '30 MW',
      status: 'operational' as const,
      throughput: '10.5 tons/day',
      connections: 22
    },
    {
      id: 7,
      name: 'Kolkata Industrial Complex',
      type: 'storage' as const,
      location: { lat: 22.5726, lng: 88.3639 }, // Kolkata
      capacity: '85 MWh',
      status: 'operational' as const,
      filled: '92%',
      pressure: '300 bar'
    },
    {
      id: 8,
      name: 'Hyderabad Innovation Center',
      type: 'production' as const,
      location: { lat: 17.3850, lng: 78.4867 }, // Hyderabad
      capacity: '40 MW',
      status: 'construction' as const,
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
        return <MapPin {...iconProps} />;
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

  const getMarkerColor = (type: string, status: string) => {
    if (status === 'maintenance') return '#f59e0b';
    if (status === 'construction') return '#3b82f6';
    
    switch (type) {
      case 'production':
        return '#10b981';
      case 'storage':
        return '#8b5cf6';
      case 'distribution':
        return '#f97316';
      default:
        return '#6b7280';
    }
  };

  const filteredAssets = selectedLayer === 'all' 
    ? hydrogenAssets 
    : hydrogenAssets.filter(asset => asset.type === selectedLayer);

  // Convert lat/lng to pixel coordinates for the map display with zoom and offset
  const latLngToPixels = (lat: number, lng: number) => {
    const mapBounds = {
      north: 35,
      south: 8,
      east: 97,
      west: 68
    };
    
    // Base coordinates (0-100%)
    const baseX = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
    const baseY = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * 100;
    
    // Apply zoom scaling
    const zoomScale = Math.pow(2, zoomLevel - 6); // Base zoom level 6
    const scaledX = (baseX - 50) * zoomScale + 50;
    const scaledY = (baseY - 50) * zoomScale + 50;
    
    // Apply offset
    const finalX = scaledX + (mapOffset.x / (mapRef.current?.offsetWidth || 1000)) * 100;
    const finalY = scaledY + (mapOffset.y / (mapRef.current?.offsetHeight || 600)) * 100;
    
    return { x: finalX, y: finalY };
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  const handleMarkerClick = (asset: HydrogenAsset) => {
    setSelectedAsset(asset);
    setMapCenter(asset.location);
  };

  // Map interaction handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    setMapOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastMousePos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    setZoomLevel(prev => Math.max(1, Math.min(18, prev + delta)));
  }, []);

  // Add event listeners for global mouse events and touch events
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      setMapOffset(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      const moveAmount = 50;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setMapOffset(prev => ({ x: prev.x, y: prev.y + moveAmount }));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setMapOffset(prev => ({ x: prev.x, y: prev.y - moveAmount }));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setMapOffset(prev => ({ x: prev.x + moveAmount, y: prev.y }));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setMapOffset(prev => ({ x: prev.x - moveAmount, y: prev.y }));
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoomLevel(prev => Math.min(18, prev + 1));
          break;
        case '-':
        case '_':
          e.preventDefault();
          setZoomLevel(prev => Math.max(1, prev - 1));
          break;
        case 'Escape':
          setSelectedAsset(null);
          break;
      }
    };

    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      e.preventDefault();
      const deltaX = e.touches[0].clientX - lastMousePos.x;
      const deltaY = e.touches[0].clientY - lastMousePos.y;
      setMapOffset(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchEnd = () => setIsDragging(false);

    // Add global event listeners
    document.addEventListener('keydown', handleKeyDown);
    
    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    // Add touch listeners to the map element
    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      mapElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      mapElement.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      if (mapElement) {
        mapElement.removeEventListener('touchstart', handleTouchStart);
        mapElement.removeEventListener('touchmove', handleTouchMove);
        mapElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isDragging, lastMousePos]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MapIcon className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Google-Style Hydrogen Infrastructure Map</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for places..."
                className="px-3 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Simulate search functionality by moving to a random location
                    setMapOffset({ x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 });
                  }
                }}
              />
            </div>
            
            <select
              value={mapView}
              onChange={(e) => setMapView(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="roadmap">Roadmap</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
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

        {/* Google-Style Map Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Fixed UI Layer - Controls and overlays that don't move */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Google-style Map Controls - Fixed Position */}
            <div className="absolute bottom-6 right-6 flex flex-col space-y-2 pointer-events-auto">
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
              
              {/* My Location */}
              <button
                onClick={() => {
                  setMapOffset({ x: 0, y: 0 });
                  setZoomLevel(6);
                  setMapCenter({ lat: 20.5937, lng: 78.9629 });
                }}
                className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors pointer-events-auto"
                title="Reset to center"
              >
                <Locate className="w-4 h-4" />
              </button>
            </div>

            {/* Scale indicator and controls - Fixed Position */}
            <div className="absolute bottom-6 left-6 space-y-2 pointer-events-auto">
              <div className="bg-white rounded px-3 py-2 shadow-lg border border-gray-200 text-xs text-gray-600">
                <div>Zoom: {zoomLevel}/18</div>
                <div>{filteredAssets.length} assets visible</div>
                <div className="text-xs text-gray-400 mt-1">
                  {isDragging ? '🖱️ Dragging...' : '🖱️ Click & drag to pan'}
                </div>
              </div>
              
              {/* Navigation Help */}
              <div className="bg-white rounded px-3 py-2 shadow-lg border border-gray-200 text-xs text-gray-600">
                <div className="font-medium mb-1">Navigation:</div>
                <div>🖱️ Click & drag to pan</div>
                <div>🔍 Mouse wheel to zoom</div>
                <div>⌨️ Arrow keys or WASD</div>
                <div>⌨️ +/- to zoom</div>
                <div>⌨️ ESC to close info</div>
              </div>
              
              {/* Reset View Button */}
              <button
                onClick={() => {
                  setMapOffset({ x: 0, y: 0 });
                  setZoomLevel(6);
                  setMapCenter({ lat: 20.5937, lng: 78.9629 });
                }}
                className="w-full bg-white rounded px-3 py-2 shadow-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
              >
                🔄 Reset View
              </button>
            </div>

            {/* Google-style attribution - Fixed Position */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded pointer-events-auto">
              Map data ©2024 Green Hydrogen Platform
            </div>

            {/* Selected Asset Info Panel - Fixed Position */}
            {selectedAsset && (
              <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-30 pointer-events-auto">
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

          {/* Movable Map Content Layer */}
          <div 
            ref={mapRef}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-200 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              backgroundImage: mapView === 'satellite' 
                ? `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3CfeColorMatrix in='colorNoise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%234f7942' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E"), linear-gradient(135deg, #134e13 0%, #2d5a27 25%, #4a7c59 50%, #2d5a27 75%, #134e13 100%)`
                : mapView === 'terrain'
                ? 'linear-gradient(135deg, #f7f5f3 0%, #e8e2d4 25%, #d4c7b0 50%, #c7b299 75%, #b8a082 100%)'
                : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 25%, #dee2e6 50%, #ced4da 75%, #adb5bd 100%)',
              transform: `scale(${Math.pow(2, (zoomLevel - 6) * 0.2)}) translate(${mapOffset.x}px, ${mapOffset.y}px)`,
              transformOrigin: 'center center'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Google Maps Style Grid Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}></div>
            </div>

            {/* Simulated Roads and Geographic Features */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Major highways */}
              <path 
                d="M 100,300 Q 200,280 400,300 Q 600,320 800,300" 
                stroke={mapView === 'satellite' ? '#666' : '#fbbf24'} 
                strokeWidth="3" 
                fill="none" 
                opacity="0.7"
              />
              <path 
                d="M 300,100 Q 320,300 340,500 Q 360,700 380,900" 
                stroke={mapView === 'satellite' ? '#666' : '#fbbf24'} 
                strokeWidth="3" 
                fill="none" 
                opacity="0.7"
              />
              <path 
                d="M 500,50 Q 480,250 460,450 Q 440,650 420,850" 
                stroke={mapView === 'satellite' ? '#666' : '#fbbf24'} 
                strokeWidth="3" 
                fill="none" 
                opacity="0.7"
              />
              
              {/* Water bodies */}
              <ellipse cx="150" cy="400" rx="80" ry="40" fill="#60a5fa" opacity="0.6" />
              <ellipse cx="650" cy="200" rx="60" ry="30" fill="#60a5fa" opacity="0.6" />
              <path d="M 0,600 Q 200,580 400,600 Q 600,620 800,600 L 800,800 L 0,800 Z" fill="#60a5fa" opacity="0.4" />
              
              {/* Urban areas */}
              <circle cx="200" cy="250" r="40" fill={mapView === 'satellite' ? '#888' : '#e5e7eb'} opacity="0.5" />
              <circle cx="600" cy="350" r="35" fill={mapView === 'satellite' ? '#888' : '#e5e7eb'} opacity="0.5" />
              <circle cx="450" cy="500" r="30" fill={mapView === 'satellite' ? '#888' : '#e5e7eb'} opacity="0.5" />
            </svg>

            {/* Asset Markers */}
            {filteredAssets.map((asset) => {
              const position = latLngToPixels(asset.location.lat, asset.location.lng);
              const markerColor = getMarkerColor(asset.type, asset.status);
              
              return (
                <div
                  key={asset.id}
                  onClick={() => handleMarkerClick(asset)}
                  className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all hover:scale-110 z-10 ${
                    selectedAsset?.id === asset.id ? 'scale-125 z-20' : ''
                  }`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`
                  }}
                >
                  {/* Google-style marker pin */}
                  <div className="relative">
                    <svg width="32" height="40" viewBox="0 0 32 40" className="drop-shadow-lg">
                      <path
                        d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24c0-8.837-7.163-16-16-16z"
                        fill={markerColor}
                      />
                      <circle cx="16" cy="16" r="8" fill="white" />
                    </svg>
                    
                    {/* Icon inside marker */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                      <div style={{ color: markerColor }}>
                        {getAssetIcon(asset.type)}
                      </div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(asset.status)}`}></div>
                  </div>

                  {/* Info window */}
                  {selectedAsset?.id === asset.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-3 min-w-48 border">
                      <div className="text-sm font-semibold text-gray-900">{asset.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        <div>Type: {asset.type}</div>
                        <div>Capacity: {asset.capacity}</div>
                        <div className="capitalize">Status: {asset.status}</div>
                      </div>
                      {/* Info window arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleStyleMap;
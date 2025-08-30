import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapTest = () => {
  const [mapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Center of India

  // Test markers
  const testMarkers = [
    { id: 1, position: [28.6139, 77.2090], name: "Delhi H2 Plant", type: "Production" },
    { id: 2, position: [19.0760, 72.8777], name: "Mumbai Storage", type: "Storage" },
    { id: 3, position: [13.0827, 80.2707], name: "Chennai Hub", type: "Distribution" },
    { id: 4, position: [22.5726, 88.3639], name: "Kolkata Facility", type: "Storage" },
  ];

  return (
    <div className="h-screen bg-gray-100">
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Map Test - Hydrogen Infrastructure</h1>
        <p className="text-gray-600">Testing map rendering with sample markers</p>
      </div>
      
      <div className="h-full p-4">
        <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={6}
            className="h-full w-full"
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
            
            {testMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position as [number, number]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-lg">{marker.name}</h3>
                    <p className="text-sm text-gray-600">Type: {marker.type}</p>
                    <p className="text-sm text-gray-600">
                      Location: {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapTest;
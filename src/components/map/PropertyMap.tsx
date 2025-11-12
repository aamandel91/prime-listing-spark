import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PropertyMapProps {
  properties: Array<{
    id: string;
    title: string;
    price: number;
    address: string;
    city: string;
    state: string;
  }>;
}

const PropertyMap = ({ properties }: PropertyMapProps) => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Default center to Florida
  const center = { lat: 27.6648, lng: -81.5158 };

  // Generate coordinates around Florida for demo
  const getPropertyLocation = (index: number) => {
    const baseLatitude = 27.6648 + (Math.random() - 0.5) * 3;
    const baseLongitude = -81.5158 + (Math.random() - 0.5) * 3;
    return { lat: baseLatitude, lng: baseLongitude };
  };


  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={8}
        mapId="property-map"
        className="w-full h-full"
        gestureHandling="greedy"
      >
        {properties.map((property, index) => {
          const position = getPropertyLocation(index);
          const selectedProp = properties.find(p => p.id === selectedProperty);
          
          return (
            <div key={property.id}>
              <AdvancedMarker
                position={position}
                onClick={() => setSelectedProperty(property.id)}
              >
                <div className="bg-primary text-primary-foreground rounded-full px-3 py-1.5 text-xs font-bold border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  ${Math.round(property.price / 1000)}k
                </div>
              </AdvancedMarker>
              
              {selectedProperty === property.id && (
                <InfoWindow
                  position={position}
                  onCloseClick={() => setSelectedProperty(null)}
                >
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-sm mb-1">{property.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {property.address}, {property.city}
                    </p>
                    <p className="font-bold text-base" style={{ color: 'hsl(43, 96%, 56%)' }}>
                      ${property.price.toLocaleString()}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </div>
          );
        })}
      </Map>
    </APIProvider>
  );
};

export default PropertyMap;

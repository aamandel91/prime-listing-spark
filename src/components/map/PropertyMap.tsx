import { useState, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Loader2 } from 'lucide-react';
import { generatePropertyUrl } from '@/lib/propertyUrl';

interface PropertyMapProps {
  properties: Array<{
    id: string;
    title: string;
    price: number;
    address: string;
    city: string;
    state: string;
    beds?: number;
    baths?: number;
    sqft?: number;
    lat?: number;
    lng?: number;
    image?: string;
  }>;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const PropertyMap = ({ properties, center: customCenter, zoom = 10, className = "" }: PropertyMapProps) => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Calculate center from properties with valid coordinates
  const mapCenter = useMemo(() => {
    if (customCenter) return customCenter;
    
    const validProperties = properties.filter(p => p.lat && p.lng);
    if (validProperties.length === 0) {
      return { lat: 27.6648, lng: -81.5158 }; // Florida default
    }
    
    if (validProperties.length === 1) {
      return { lat: validProperties[0].lat!, lng: validProperties[0].lng! };
    }
    
    // Calculate average center for multiple properties
    const avgLat = validProperties.reduce((sum, p) => sum + p.lat!, 0) / validProperties.length;
    const avgLng = validProperties.reduce((sum, p) => sum + p.lng!, 0) / validProperties.length;
    return { lat: avgLat, lng: avgLng };
  }, [properties, customCenter]);

  // Calculate appropriate zoom level
  const mapZoom = useMemo(() => {
    if (zoom !== 10) return zoom;
    
    const validProperties = properties.filter(p => p.lat && p.lng);
    if (validProperties.length <= 1) return 14;
    
    // Calculate bounds to determine zoom
    const lats = validProperties.map(p => p.lat!);
    const lngs = validProperties.map(p => p.lng!);
    const latSpan = Math.max(...lats) - Math.min(...lats);
    const lngSpan = Math.max(...lngs) - Math.min(...lngs);
    const maxSpan = Math.max(latSpan, lngSpan);
    
    if (maxSpan < 0.01) return 14;
    if (maxSpan < 0.05) return 12;
    if (maxSpan < 0.1) return 11;
    if (maxSpan < 0.5) return 10;
    return 9;
  }, [properties, zoom]);

  if (!apiKey) {
    return (
      <div className={`flex items-center justify-center bg-muted/50 ${className}`}>
        <div className="text-center p-8 max-w-md">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Map Unavailable</h3>
          <p className="text-sm text-muted-foreground">
            Google Maps API key is not configured
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        center={mapCenter}
        zoom={mapZoom}
        mapId="property-map"
        className={`w-full h-full ${className}`}
        gestureHandling="greedy"
        disableDefaultUI={false}
        zoomControl={true}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={true}
      >
        {properties.map((property) => {
          // Skip properties without valid coordinates
          if (!property.lat || !property.lng) return null;
          
          const position = { lat: property.lat, lng: property.lng };
          const propertyUrl = generatePropertyUrl({
            address: property.address,
            city: property.city,
            state: property.state,
            zip: '', // zip not always available in map view
            mlsNumber: property.id
          });
          
          return (
            <div key={property.id}>
              <AdvancedMarker
                position={position}
                onClick={() => setSelectedProperty(property.id)}
              >
                <div 
                  className={`bg-primary text-primary-foreground rounded-full px-3 py-1.5 text-xs font-bold border-2 border-background shadow-lg cursor-pointer hover:scale-110 transition-all ${
                    selectedProperty === property.id ? 'scale-110 ring-2 ring-primary' : ''
                  }`}
                >
                  ${property.price >= 1000000 
                    ? `${(property.price / 1000000).toFixed(1)}M` 
                    : `${Math.round(property.price / 1000)}k`}
                </div>
              </AdvancedMarker>
              
              {selectedProperty === property.id && (
                <InfoWindow
                  position={position}
                  onCloseClick={() => setSelectedProperty(null)}
                >
                  <Link 
                    to={propertyUrl}
                    className="block w-[280px] hover:opacity-90 transition-opacity"
                  >
                    {property.image && (
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-t-lg mb-2"
                      />
                    )}
                    <div className="p-2">
                      <p className="font-bold text-lg mb-1 text-primary">
                        ${property.price.toLocaleString()}
                      </p>
                      <p className="text-sm font-medium mb-1 text-foreground">
                        {property.address}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {property.city}, {property.state}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {property.beds && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-3 w-3" /> {property.beds}
                          </span>
                        )}
                        {property.baths && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-3 w-3" /> {property.baths}
                          </span>
                        )}
                        {property.sqft && (
                          <span className="flex items-center gap-1">
                            <Square className="h-3 w-3" /> {property.sqft.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
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

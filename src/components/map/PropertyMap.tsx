import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenEntered, setTokenEntered] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !tokenEntered || !mapboxToken) return;

    try {
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-80.1918, 25.7617], // Miami, FL default
        zoom: 10,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add markers for properties (would use actual coordinates in production)
      properties.forEach((property, index) => {
        // In production, you'd geocode the addresses or have lat/lng in the data
        // For now, we'll place them in a grid around Miami
        const lng = -80.1918 + (Math.random() - 0.5) * 0.2;
        const lat = 25.7617 + (Math.random() - 0.5) * 0.2;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="p-2">
            <h3 class="font-bold">${property.title}</h3>
            <p class="text-sm">$${property.price.toLocaleString()}</p>
            <p class="text-xs text-gray-600">${property.address}</p>
          </div>`
        );

        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map.current!);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [properties, tokenEntered, mapboxToken]);

  if (!tokenEntered) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted p-8">
        <div className="max-w-md w-full space-y-4 bg-background p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground">
            To display the map, please enter your Mapbox public token. Get your token at{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
          </div>
          <button
            onClick={() => setTokenEntered(true)}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Load Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default PropertyMap;

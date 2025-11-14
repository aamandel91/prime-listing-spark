import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropertyMap from '@/components/map/PropertyMap';
import { MapPin } from 'lucide-react';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyLocationProps {
  property: NormalizedProperty;
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address Details */}
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Address</span>
            <span className="font-medium text-right">{property.address.full}</span>
          </div>
          {property.address.neighborhood && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Neighborhood</span>
              <span className="font-medium">{property.address.neighborhood}</span>
            </div>
          )}
          {property.address.county && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">County</span>
              <span className="font-medium">{property.address.county}</span>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="h-[300px] rounded-lg overflow-hidden border">
          <PropertyMap
            center={{
              lat: property.location.latitude,
              lng: property.location.longitude,
            }}
            properties={[{
              id: property.mlsNumber,
              title: property.address.street,
              price: property.price,
              address: property.address.street,
              city: property.address.city,
              state: property.address.state,
              beds: property.beds,
              baths: property.baths,
              sqft: property.sqft,
              lat: property.location.latitude,
              lng: property.location.longitude,
              image: property.images[0],
            }]}
            zoom={15}
          />
        </div>
      </CardContent>
    </Card>
  );
}

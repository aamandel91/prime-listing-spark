import PropertyMap from '@/components/map/PropertyMap';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyLocationProps {
  property: NormalizedProperty;
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  return (
    <section className="bg-white rounded-lg p-8 shadow-sm border mb-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">
        Location & Map
      </h2>

      {/* Map */}
      <div className="h-[500px] rounded-lg overflow-hidden border border-border mb-6 shadow-sm">
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

      {/* Address Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
          <span className="text-base font-medium text-muted-foreground">Full Address</span>
          <span className="text-base font-bold text-foreground text-right">{property.address.full}</span>
        </div>
        {property.address.neighborhood && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
            <span className="text-base font-medium text-muted-foreground">Neighborhood</span>
            <span className="text-base font-bold text-foreground">{property.address.neighborhood}</span>
          </div>
        )}
        {property.address.county && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
            <span className="text-base font-medium text-muted-foreground">County</span>
            <span className="text-base font-bold text-foreground">{property.address.county}</span>
          </div>
        )}
      </div>
    </section>
  );
}

import PropertyMap from '@/components/map/PropertyMap';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyLocationProps {
  property: NormalizedProperty;
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  return (
    <section className="py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
        Location & Map
      </h2>

      {/* Map */}
      <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200 mb-6">
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
      <div className="grid grid-cols-2 gap-x-12 gap-y-0">
        <div className="flex justify-between py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Full Address</span>
          <span className="text-sm font-semibold text-gray-900 text-right">{property.address.full}</span>
        </div>
        {property.address.neighborhood && (
          <div className="flex justify-between py-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Neighborhood</span>
            <span className="text-sm font-semibold text-gray-900">{property.address.neighborhood}</span>
          </div>
        )}
        {property.address.county && (
          <div className="flex justify-between py-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">County</span>
            <span className="text-sm font-semibold text-gray-900">{property.address.county}</span>
          </div>
        )}
      </div>
    </section>
  );
}

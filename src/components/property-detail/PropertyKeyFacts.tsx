import { Home, Calendar, Ruler, MapPin, DollarSign, Building, Hash, Bed, Bath } from 'lucide-react';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyKeyFactsProps {
  property: NormalizedProperty;
}

export function PropertyKeyFacts({ property }: PropertyKeyFactsProps) {
  // Helper to format values with fallback
  const formatValue = (value: any, formatter?: (v: any) => string): string => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return formatter ? formatter(value) : String(value);
  };

  const facts = [
    {
      icon: Hash,
      label: 'MLS Number',
      value: formatValue(property.mlsNumber),
    },
    {
      icon: Home,
      label: 'Property Type',
      value: formatValue(property.propertyType),
    },
    {
      icon: Calendar,
      label: 'Year Built',
      value: formatValue(property.yearBuilt),
    },
    {
      icon: Bed,
      label: 'Bedrooms',
      value: formatValue(property.beds),
    },
    {
      icon: Bath,
      label: 'Bathrooms',
      value: formatValue(property.baths),
    },
    {
      icon: Ruler,
      label: 'Living Space',
      value: formatValue(property.sqft, (v) => `${v.toLocaleString()} sqft`),
    },
    {
      icon: MapPin,
      label: 'Lot Size',
      value: formatValue(property.lotSize, (v) => `${v.toLocaleString()} sqft`),
    },
    {
      icon: DollarSign,
      label: 'Price per Sqft',
      value: formatValue(property.pricePerSqft, (v) => `$${v.toLocaleString()}`),
    },
    {
      icon: MapPin,
      label: 'County',
      value: formatValue(property.address.county),
    },
    {
      icon: DollarSign,
      label: 'HOA Fee',
      value: formatValue(property.hoa?.fees, (v) => `$${v}/month`),
    },
    {
      icon: Building,
      label: 'Parking Spaces',
      value: formatValue(property.features.parking?.spaces, (v) => `${v} spaces`),
    },
  ];

  return (
    <section className="bg-white rounded-lg p-8 shadow-sm border mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Property Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facts.map((fact, index) => {
          const Icon = fact.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 mb-0.5 uppercase tracking-wide">
                  {fact.label}
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {fact.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyKeyFactsProps {
  property: NormalizedProperty;
}

export function PropertyKeyFacts({ property }: PropertyKeyFactsProps) {
  const facts = [
    { label: 'MLS #', value: property.mlsNumber },
    { label: 'Property Type', value: property.propertyType },
    { label: 'Status', value: property.status },
    { label: 'Year Built', value: property.yearBuilt || 'N/A' },
    { label: 'Bedrooms', value: property.beds },
    { label: 'Bathrooms', value: property.baths },
    { label: 'Square Feet', value: property.sqft.toLocaleString() },
    { label: 'Lot Size', value: property.acres ? `${property.acres} acres` : property.lotSizeSqft ? `${property.lotSizeSqft.toLocaleString()} sqft` : 'N/A' },
    { label: 'Days on Market', value: property.daysOnMarket },
    { label: 'Price/Sqft', value: property.pricePerSqft ? `$${property.pricePerSqft}` : 'N/A' },
    { label: 'County', value: property.address.county || 'N/A' },
    { label: 'Neighborhood', value: property.address.neighborhood || 'N/A' },
  ];

  if (property.hoa?.fees) {
    facts.push({
      label: 'HOA Fees',
      value: `$${property.hoa.fees}${property.hoa.frequency ? ` / ${property.hoa.frequency}` : ''}`,
    });
  }

  if (property.taxes?.annualAmount) {
    facts.push({
      label: 'Annual Taxes',
      value: `$${property.taxes.annualAmount.toLocaleString()}`,
    });
  }

  return (
    <section className="py-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
        Property Details
      </h2>
      
      <div className="grid grid-cols-2 gap-x-12 gap-y-0">
        {facts.map((fact, index) => (
          <div 
            key={index}
            className="flex justify-between py-4 border-b border-gray-100"
          >
            <span className="text-sm font-medium text-gray-600">{fact.label}</span>
            <span className="text-sm font-semibold text-gray-900">{fact.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

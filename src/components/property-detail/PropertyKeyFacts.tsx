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
    <section className="bg-white rounded-lg p-8 shadow-sm border mb-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">
        Property Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facts.map((fact, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
          >
            <span className="text-base font-medium text-muted-foreground">{fact.label}</span>
            <span className="text-base font-bold text-foreground">{fact.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

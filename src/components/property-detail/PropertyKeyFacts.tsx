import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle>Property Facts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facts.map((fact, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
              <span className="text-muted-foreground font-medium">{fact.label}</span>
              <span className="font-semibold">{fact.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

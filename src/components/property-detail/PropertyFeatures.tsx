import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Home, Mountain, Zap, Car } from 'lucide-react';
import { useState } from 'react';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyFeaturesProps {
  property: NormalizedProperty;
}

export function PropertyFeatures({ property }: PropertyFeaturesProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    interior: true,
    exterior: true,
    utilities: false,
    parking: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderFeatureGrid = (features: Record<string, any>) => {
    const entries = Object.entries(features).filter(([_, value]) => value !== undefined && value !== null && value !== '');
    
    if (entries.length === 0) {
      return <p className="text-muted-foreground">No information available</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            <span className="font-medium">{String(value)}</span>
          </div>
        ))}
      </div>
    );
  };

  const sections = [
    {
      id: 'interior',
      title: 'Interior Features',
      icon: Home,
      features: property.features.interior,
    },
    {
      id: 'exterior',
      title: 'Exterior Features',
      icon: Mountain,
      features: property.features.exterior,
    },
    {
      id: 'utilities',
      title: 'Utilities',
      icon: Zap,
      features: property.features.utilities,
    },
    {
      id: 'parking',
      title: 'Parking',
      icon: Car,
      features: property.features.parking,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features & Amenities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Collapsible
              key={section.id}
              open={openSections[section.id]}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openSections[section.id] ? 'rotate-180' : ''
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                {renderFeatureGrid(section.features)}
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {/* HOA Section */}
        {property.hoa && (
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">HOA Information</h3>
              </div>
              <ChevronDown className="w-5 h-5 transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.hoa.fees && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">HOA Fees</span>
                    <span className="font-medium">${property.hoa.fees}</span>
                  </div>
                )}
                {property.hoa.frequency && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Frequency</span>
                    <span className="font-medium">{property.hoa.frequency}</span>
                  </div>
                )}
                {property.hoa.amenities && property.hoa.amenities.length > 0 && (
                  <div className="col-span-2 py-2">
                    <span className="text-muted-foreground block mb-2">Amenities</span>
                    <div className="flex flex-wrap gap-2">
                      {property.hoa.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}

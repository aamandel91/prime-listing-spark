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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mt-4">
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
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
    <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
      <div className="bg-muted/30 px-8 py-5 border-b">
        <h2 className="text-2xl font-bold">Features & Amenities</h2>
      </div>
      
      <div className="divide-y">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Collapsible
              key={section.id}
              open={openSections[section.id]}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger className="w-full px-8 py-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openSections[section.id] ? 'rotate-180' : ''
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-8 pb-6">
                {renderFeatureGrid(section.features)}
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {/* HOA Section */}
        {property.hoa && (
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="w-full px-8 py-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Home className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">HOA Information</h3>
              </div>
              <ChevronDown className="w-5 h-5 transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-8 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.hoa.fees && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">HOA Fees</span>
                    <span className="font-medium">${property.hoa.fees}</span>
                  </div>
                )}
                {property.hoa.frequency && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Payment Frequency</span>
                    <span className="font-medium">{property.hoa.frequency}</span>
                  </div>
                )}
                {property.hoa.amenities && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Amenities</span>
                    <span className="font-medium">{property.hoa.amenities}</span>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}

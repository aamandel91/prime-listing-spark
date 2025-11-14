import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Maximize, Trees, Calendar, Home } from 'lucide-react';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyPriceStatsProps {
  property: NormalizedProperty;
  onRequestInfo: () => void;
  onScheduleShowing: () => void;
}

export function PropertyPriceStats({
  property,
  onRequestInfo,
  onScheduleShowing,
}: PropertyPriceStatsProps) {
  const getStatusVariant = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('active')) return 'default';
    if (statusLower.includes('pending') || statusLower.includes('contract')) return 'secondary';
    if (statusLower.includes('sold') || statusLower.includes('closed')) return 'outline';
    return 'outline';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 border-b border-gray-200">
      {/* Price Row */}
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {property.priceFormatted}
          </div>
          {property.pricePerSqft && (
            <div className="text-lg text-gray-600">
              ${property.pricePerSqft}/sqft
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button size="lg" className="px-8 h-12" onClick={onRequestInfo}>
            Request Info
          </Button>
          <Button size="lg" variant="outline" className="px-8 h-12" onClick={onScheduleShowing}>
            Schedule Tour
          </Button>
        </div>
      </div>
      
      {/* Stats Row - Horizontal with dividers */}
      <div className="flex items-center gap-6 text-base flex-wrap">
        <div className="flex items-center gap-2">
          <Bed className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">{property.beds}</span>
          <span className="text-gray-600">Beds</span>
        </div>
        
        <div className="h-6 w-px bg-gray-300" />
        
        <div className="flex items-center gap-2">
          <Bath className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">{property.baths}</span>
          <span className="text-gray-600">Baths</span>
        </div>
        
        <div className="h-6 w-px bg-gray-300" />
        
        <div className="flex items-center gap-2">
          <Maximize className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">{property.sqft.toLocaleString()}</span>
          <span className="text-gray-600">Sqft</span>
        </div>
        
        {property.acres && (
          <>
            <div className="h-6 w-px bg-gray-300" />
            
            <div className="flex items-center gap-2">
              <Trees className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">{property.acres}</span>
              <span className="text-gray-600">Acres</span>
            </div>
          </>
        )}
        
        {property.yearBuilt && (
          <>
            <div className="h-6 w-px bg-gray-300" />
            
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">{property.yearBuilt}</span>
              <span className="text-gray-600">Built</span>
            </div>
          </>
        )}
        
        <div className="h-6 w-px bg-gray-300" />
        
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">{property.propertyType}</span>
        </div>
        
        <div className="h-6 w-px bg-gray-300" />
        
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(property.status)} className="text-sm">
            {property.status}
          </Badge>
          <span className="text-gray-600">{property.daysOnMarket} days on market</span>
        </div>
      </div>
    </div>
  );
}

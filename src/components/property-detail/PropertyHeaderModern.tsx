import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Bed, Bath, Maximize, Calendar, Home, TreePine } from 'lucide-react';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyHeaderModernProps {
  property: NormalizedProperty;
  onShare?: () => void;
  onToggleFavorite?: () => void;
  onRequestInfo?: () => void;
  onScheduleTour?: () => void;
  isFavorite?: boolean;
}

export function PropertyHeaderModern({
  property,
  onShare,
  onToggleFavorite,
  onRequestInfo,
  onScheduleTour,
  isFavorite = false,
}: PropertyHeaderModernProps) {
  const getStatusColor = () => {
    const status = property.status.toLowerCase();
    if (status.includes('active')) return 'bg-green-100 text-green-800 border-green-300';
    if (status.includes('pending')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (status.includes('sold')) return 'bg-gray-100 text-gray-800 border-gray-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status and Days on Market */}
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="outline" className={`${getStatusColor()} px-3 py-1 font-semibold`}>
            {property.status}
          </Badge>
          {property.daysOnMarket > 0 && (
            <span className="text-sm text-muted-foreground">
              {property.daysOnMarket} {property.daysOnMarket === 1 ? 'day' : 'days'} on market
            </span>
          )}
        </div>

        {/* Address */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {property.address.street}
          </h1>
          <p className="text-xl text-muted-foreground">
            {property.address.city}, {property.address.state} {property.address.zip}
          </p>
          {property.address.neighborhood && (
            <p className="text-base text-muted-foreground mt-1">
              {property.address.neighborhood}
            </p>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="text-4xl font-bold text-foreground">
            {property.priceFormatted}
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {onToggleFavorite && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={onToggleFavorite}
                className={isFavorite ? 'border-red-500 text-red-500' : ''}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                Save
              </Button>
            )}
            {onShare && (
              <Button variant="outline" size="lg" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
            {onRequestInfo && (
              <Button size="lg" onClick={onRequestInfo} className="bg-primary">
                Request Info
              </Button>
            )}
            {onScheduleTour && (
              <Button size="lg" onClick={onScheduleTour}>
                Schedule Tour
              </Button>
            )}
          </div>
        </div>

        {/* Key Stats */}
        <div className="flex flex-wrap items-center gap-6 text-base">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">{property.beds}</span>
            <span className="text-muted-foreground">Beds</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">{property.baths}</span>
            <span className="text-muted-foreground">Baths</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Maximize className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">{property.sqft.toLocaleString()}</span>
            <span className="text-muted-foreground">Sqft</span>
          </div>
          
          {property.yearBuilt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{property.yearBuilt}</span>
              <span className="text-muted-foreground">Built</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">{property.propertyType}</span>
          </div>
          
          {(property.acres || property.lotSizeSqft) && (
            <div className="flex items-center gap-2">
              <TreePine className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {property.acres ? `${property.acres} acres` : `${property.lotSizeSqft?.toLocaleString()} sqft lot`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Heart, MapPin, Bed, Bath, Maximize, Calendar, Home, Trees, Mail } from 'lucide-react';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyDetailHeaderProps {
  property: NormalizedProperty;
  onRequestInfo: () => void;
  onScheduleShowing: () => void;
  onShare?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export function PropertyDetailHeader({
  property,
  onRequestInfo,
  onScheduleShowing,
  onShare,
  onToggleFavorite,
  isFavorite = false,
}: PropertyDetailHeaderProps) {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('active')) return 'bg-green-500';
    if (statusLower.includes('pending') || statusLower.includes('contract')) return 'bg-blue-500';
    if (statusLower.includes('sold') || statusLower.includes('closed')) return 'bg-gray-500';
    return 'bg-gray-400';
  };

  return (
    <div className="bg-background border-b shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status & Days on Market */}
        <div className="flex items-center gap-4 mb-4">
          <Badge className={`${getStatusColor(property.status)} text-sm px-4 py-1.5`}>
            {property.status}
          </Badge>
          <span className="text-muted-foreground">
            {property.daysOnMarket} days on market
          </span>
        </div>
        
        {/* Address & Price Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {property.address.street}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {property.address.city}, {property.address.state} {property.address.zip}
            </p>
          </div>
          <div className="text-left lg:text-right">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-1">
              {property.priceFormatted}
            </div>
            {property.pricePerSqft && (
              <div className="text-base text-muted-foreground">
                ${property.pricePerSqft} per sqft
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Grid - Clean & Scannable */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6 pb-6 border-b">
          <div className="flex items-center gap-3">
            <Bed className="w-6 h-6 text-primary" />
            <div>
              <div className="text-2xl font-bold">{property.beds}</div>
              <div className="text-sm text-muted-foreground">Bedrooms</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Bath className="w-6 h-6 text-primary" />
            <div>
              <div className="text-2xl font-bold">{property.baths}</div>
              <div className="text-sm text-muted-foreground">Bathrooms</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Maximize className="w-6 h-6 text-primary" />
            <div>
              <div className="text-2xl font-bold">{property.sqft.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Sqft</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Trees className="w-6 h-6 text-primary" />
            <div>
              <div className="text-2xl font-bold">
                {property.acres ? `${property.acres}` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Acres</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <div>
              <div className="text-2xl font-bold">{property.yearBuilt || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Built</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6 text-primary" />
            <div>
              <div className="text-lg font-bold">{property.propertyType}</div>
              <div className="text-sm text-muted-foreground">Type</div>
            </div>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={onRequestInfo} className="flex-1 sm:flex-none px-8">
            <Mail className="w-5 h-5 mr-2" />
            Request Info
          </Button>
          <Button size="lg" variant="outline" onClick={onScheduleShowing} className="flex-1 sm:flex-none px-8">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Showing
          </Button>
          <div className="flex gap-2 ml-auto">
            <Button
              size="icon"
              variant="outline"
              onClick={onToggleFavorite}
              className={isFavorite ? 'text-red-500' : ''}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button size="icon" variant="outline" onClick={onShare}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

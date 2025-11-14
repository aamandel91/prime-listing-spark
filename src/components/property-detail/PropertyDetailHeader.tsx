import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Heart, MapPin, Bed, Bath, Square, Calendar, Home } from 'lucide-react';
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
    <div className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-6">
        {/* Address & Status */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`${getStatusColor(property.status)} text-white`}>
                {property.status}
              </Badge>
              {property.daysOnMarket > 0 && (
                <span className="text-sm text-muted-foreground">
                  {property.daysOnMarket} days on market
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{property.address.street}</h1>
            <p className="text-xl text-muted-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {property.address.city}, {property.address.state} {property.address.zip}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold text-primary mb-1">
              {property.priceFormatted}
            </div>
            {property.pricePerSqft && (
              <div className="text-sm text-muted-foreground">
                ${property.pricePerSqft}/sqft
              </div>
            )}
          </div>
        </div>

        {/* Key Stats */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg font-semibold">{property.beds}</span>
            <span className="text-muted-foreground">Beds</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg font-semibold">{property.baths}</span>
            <span className="text-muted-foreground">Baths</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Square className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg font-semibold">{property.sqft.toLocaleString()}</span>
            <span className="text-muted-foreground">Sqft</span>
          </div>
          
          {property.acres && (
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg font-semibold">{property.acres}</span>
              <span className="text-muted-foreground">Acres</span>
            </div>
          )}
          
          {property.yearBuilt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg font-semibold">{property.yearBuilt}</span>
              <span className="text-muted-foreground">Built</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg font-semibold">{property.propertyType}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={onRequestInfo} className="flex-1 sm:flex-none">
            Request Info
          </Button>
          <Button size="lg" variant="outline" onClick={onScheduleShowing} className="flex-1 sm:flex-none">
            Schedule Showing
          </Button>
          
          <div className="flex gap-2 ml-auto">
            {onToggleFavorite && (
              <Button
                size="icon"
                variant="outline"
                onClick={onToggleFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            )}
            {onShare && (
              <Button size="icon" variant="outline" onClick={onShare} aria-label="Share listing">
                <Share2 className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

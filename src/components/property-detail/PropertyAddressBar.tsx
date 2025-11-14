import { Button } from '@/components/ui/button';
import { Share2, Heart } from 'lucide-react';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyAddressBarProps {
  property: NormalizedProperty;
  onShare?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export function PropertyAddressBar({
  property,
  onShare,
  onToggleFavorite,
  isFavorite = false,
}: PropertyAddressBarProps) {
  return (
    <div className="bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {property.address.street}
          </h1>
          <p className="text-lg text-gray-600">
            {property.address.city}, {property.address.state} {property.address.zip}
          </p>
          {property.address.neighborhood && (
            <p className="text-sm text-gray-500 mt-1">
              {property.address.neighborhood}
            </p>
          )}
        </div>
        
        <div className="flex gap-3">
          {onShare && (
            <Button variant="outline" size="lg" onClick={onShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
          {onToggleFavorite && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onToggleFavorite}
              className={isFavorite ? 'text-red-500 border-red-500' : ''}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

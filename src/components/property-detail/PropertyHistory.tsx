import { Calendar, TrendingDown, TrendingUp, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyHistoryProps {
  property: NormalizedProperty;
}

interface HistoryEvent {
  date: string;
  type: 'listed' | 'price_change' | 'status_change' | 'sold';
  description: string;
  price?: number;
  icon: typeof Calendar;
  iconColor: string;
}

export function PropertyHistory({ property }: PropertyHistoryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Build history events from available property data
  const events: HistoryEvent[] = [];

  // Add listing date if available
  if (property.listDate) {
    events.push({
      date: property.listDate,
      type: 'listed',
      description: `Listed for ${formatPrice(property.price)}`,
      price: property.price,
      icon: Home,
      iconColor: 'text-blue-600',
    });
  }

  // Add price change if original price differs from current
  if (property.originalPrice && property.originalPrice !== property.price) {
    const priceChange = property.price - property.originalPrice;
    const isReduction = priceChange < 0;
    
    // Use current date as fallback for modification date
    const changeDate = property.listDate || new Date().toISOString();
    
    events.push({
      date: changeDate,
      type: 'price_change',
      description: `Price ${isReduction ? 'reduced' : 'increased'} to ${formatPrice(property.price)} (${isReduction ? '-' : '+'}${formatPrice(Math.abs(priceChange))})`,
      price: property.price,
      icon: isReduction ? TrendingDown : TrendingUp,
      iconColor: isReduction ? 'text-green-600' : 'text-red-600',
    });
  }

  // Sort events by date (most recent first)
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // If no events, don't render the section
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg p-8 shadow-sm border mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Property History</h2>
      
      <div className="space-y-6">
        {events.map((event, idx) => {
          const Icon = event.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-4 border-l-4 border-primary pl-6 pb-6 last:pb-0"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${event.iconColor}`} />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Badge variant="outline" className="capitalize">
                    {event.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatDate(event.date)}
                  </span>
                </div>
                <p className="text-base text-gray-900 font-medium">
                  {event.description}
                </p>
                {property.daysOnMarket !== undefined && idx === 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {property.daysOnMarket} days on market
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

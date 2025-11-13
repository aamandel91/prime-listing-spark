import { useRepliersMarketStats } from "@/hooks/useRepliersMarketStats";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, TrendingUp, Clock, DollarSign, Activity } from "lucide-react";

interface CityStatisticsProps {
  city?: string;
  state?: string;
  neighborhood?: string;
  title?: string;
}

export function CityStatistics({ 
  city, 
  state, 
  neighborhood,
  title = "Market Statistics"
}: CityStatisticsProps) {
  const { stats, loading, error } = useRepliersMarketStats({
    city,
    state,
    neighborhood,
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-12 w-12 rounded-full mb-3" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  const statisticsData = [
    {
      icon: Home,
      label: "Active Listings",
      value: stats.activeListings.toLocaleString(),
      description: "Properties on the market",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: DollarSign,
      label: "Median Price",
      value: formatPrice(stats.medianPrice30d),
      description: "Last 30 days",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-600/10",
      trend: stats.priceChange30d !== 0 ? {
        value: Math.abs(stats.priceChange30d),
        isPositive: stats.priceChange30d > 0,
      } : null,
    },
    {
      icon: Clock,
      label: "Avg. Days on Market",
      value: Math.round(stats.avgDaysOnMarket30d).toString(),
      description: "Last 30 days",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-600/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statisticsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className={`${stat.bgColor} ${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{stat.value}</p>
                      {stat.trend && (
                        <span className={`text-sm font-medium flex items-center gap-1 ${
                          stat.trend.isPositive 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          <TrendingUp className={`h-3 w-3 ${!stat.trend.isPositive && 'rotate-180'}`} />
                          {stat.trend.value.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {stats.newListings > 0 && (
        <div className="bg-accent/50 border border-accent rounded-lg p-4">
          <p className="text-sm">
            <span className="font-semibold text-accent-foreground">
              {stats.newListings} new listings
            </span>
            {" "}added in the last 7 days
          </p>
        </div>
      )}
    </div>
  );
}

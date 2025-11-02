import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Home, Calendar, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepliersMarketStats } from "@/hooks/useRepliersMarketStats";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MarketStat {
  label: string;
  value: string | number;
  change?: number;
  period: string;
}

interface MarketStatisticsProps {
  neighborhood?: string;
  city?: string;
  state?: string;
  propertyType?: string;
  className?: string;
}

export const MarketStatistics = ({ 
  neighborhood, 
  city, 
  state,
  propertyType,
  className = "" 
}: MarketStatisticsProps) => {
  const { stats, loading, error } = useRepliersMarketStats({
    city,
    state,
    neighborhood,
    propertyType,
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const marketStats: MarketStat[] = stats ? [
    { label: "Active Listings", value: stats.activeListings, period: "current" },
    { label: "New (Last Week)", value: stats.newListings, period: "last 7 days" },
    { label: "Avg Days on Market (30d)", value: stats.avgDaysOnMarket30d, period: "last month" },
    { label: "Avg Days on Market (90d)", value: stats.avgDaysOnMarket90d, period: "last quarter" },
    { label: "Avg Days on Market (1y)", value: stats.avgDaysOnMarket1y, period: "last year" },
    { label: "Properties Sold (30d)", value: stats.soldCount30d, period: "last month" },
    { label: "Properties Sold (90d)", value: stats.soldCount90d, period: "last quarter" },
    { label: "Properties Sold (1y)", value: stats.soldCount1y, period: "last year" },
    { 
      label: "Median Sales Price (30d)", 
      value: formatCurrency(stats.medianPrice30d), 
      change: stats.priceChange30d,
      period: "vs 90 days" 
    },
    { 
      label: "Median Sales Price (90d)", 
      value: formatCurrency(stats.medianPrice90d), 
      change: stats.priceChange90d,
      period: "vs 1 year" 
    },
    { 
      label: "Median Sales Price (1y)", 
      value: formatCurrency(stats.medianPrice1y),
      period: "last year" 
    },
  ] : [];

  const renderChangeIndicator = (change: number | undefined) => {
    if (change === undefined) return null;
    
    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    
    return (
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <Icon className="w-4 h-4" />
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(11)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          <CardTitle>Market Statistics</CardTitle>
        </div>
        <CardDescription>
          Real estate market data for {neighborhood ? `${neighborhood}, ` : ''}{city}{state ? `, ${state}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketStats.map((stat, index) => (
            <div key={index} className="p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                {renderChangeIndicator(stat.change)}
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.period}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-medium text-sm mb-1">Market Insights</p>
              <p className="text-sm text-muted-foreground">
                {stats.activeListings > 0 ? (
                  <>
                    The market currently has {stats.activeListings} active listing{stats.activeListings !== 1 ? 's' : ''}.
                    {stats.avgDaysOnMarket30d > 0 && ` Properties are selling in an average of ${stats.avgDaysOnMarket30d} days.`}
                    {stats.medianPrice30d > 0 && ` The median sale price is ${formatCurrency(stats.medianPrice30d)}.`}
                  </>
                ) : (
                  'No recent market activity data available for this area.'
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

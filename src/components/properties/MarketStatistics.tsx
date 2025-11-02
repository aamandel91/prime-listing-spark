import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Home, Calendar, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketStat {
  label: string;
  value: string | number;
  change?: number;
  period: string;
}

interface MarketStatisticsProps {
  neighborhood: string;
  city: string;
  loading?: boolean;
  className?: string;
}

export const MarketStatistics = ({ neighborhood, city, loading = false, className = "" }: MarketStatisticsProps) => {
  // Mock data - in production, this would come from an API
  const stats: MarketStat[] = [
    { label: "All Actives", value: 348, change: -14, period: "vs last week" },
    { label: "New (Last Week)", value: 32, change: -14, period: "vs previous" },
    { label: "Avg Days on Market (30d)", value: 38, change: -9.5, period: "vs last month" },
    { label: "Avg Days on Market (90d)", value: 42, change: 17, period: "vs last quarter" },
    { label: "Avg Days on Market (1y)", value: 39, change: 15, period: "vs last year" },
    { label: "Condos Sold (30d)", value: 42, change: -22, period: "vs last month" },
    { label: "Condos Sold (90d)", value: 151, change: 2.7, period: "vs last quarter" },
    { label: "Condos Sold (1y)", value: 568, change: 1.4, period: "vs last year" },
    { label: "Median Sales Price (30d)", value: "$608K", change: 5.7, period: "vs last month" },
    { label: "Median Sales Price (90d)", value: "$570K", change: -2.6, period: "vs last quarter" },
    { label: "Median Sales Price (1y)", value: "$585K", change: -9.9, period: "vs last year" },
  ];

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
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          <CardTitle>Market Statistics</CardTitle>
        </div>
        <CardDescription>
          Real estate market data for {neighborhood}, {city}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
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
                The market is showing moderate activity with {stats[0].value} active listings. 
                Average days on market have {stats[2].change && stats[2].change < 0 ? 'decreased' : 'increased'} 
                by {Math.abs(stats[2].change || 0)}% over the last 30 days.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

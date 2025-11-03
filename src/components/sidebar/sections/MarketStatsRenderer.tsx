import { MarketStatsSection } from "@/types/sidebarSections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRepliersMarketStats } from "@/hooks/useRepliersMarketStats";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Home, Calendar } from "lucide-react";

interface MarketStatsRendererProps {
  section: MarketStatsSection;
  context?: {
    city?: string;
    state?: string;
  };
}

export function MarketStatsRenderer({ section, context }: MarketStatsRendererProps) {
  const city = section.city || context?.city;
  const state = section.state || context?.state || 'FL';

  const { stats, loading } = useRepliersMarketStats({
    city: city || '',
    state: state
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{section.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const statItems = [];
  
  if (section.stats.includes('median_price') && stats?.medianPrice30d) {
    statItems.push({
      icon: TrendingUp,
      label: 'Median Price (30d)',
      value: `$${stats.medianPrice30d.toLocaleString()}`
    });
  }
  
  if (section.stats.includes('avg_days_on_market') && stats?.avgDaysOnMarket30d) {
    statItems.push({
      icon: Calendar,
      label: 'Avg. Days on Market',
      value: stats.avgDaysOnMarket30d.toString()
    });
  }
  
  if (section.stats.includes('total_listings') && stats?.activeListings) {
    statItems.push({
      icon: Home,
      label: 'Active Listings',
      value: stats.activeListings.toLocaleString()
    });
  }
  
  if (section.stats.includes('sold_last_month') && stats?.soldCount30d) {
    statItems.push({
      icon: TrendingDown,
      label: 'Sold Last 30 Days',
      value: stats.soldCount30d.toLocaleString()
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {statItems.map((stat, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
            <div className="flex items-center gap-2">
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <span className="font-semibold">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

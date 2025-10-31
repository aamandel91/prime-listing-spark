import { Building2, MapPin, Home, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useRepliers } from "@/hooks/useRepliers";

const Stats = () => {
  const [stats, setStats] = useState({
    activeListings: 0,
    citiesCount: 0,
    avgPrice: 0,
  });
  const [loading, setLoading] = useState(true);
  const { searchListings } = useRepliers();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Florida-wide stats
        const data = await searchListings({ state: 'FL', limit: 100 });
        const listings = data?.listings || data?.data || data || [];
        
        if (Array.isArray(listings) && listings.length > 0) {
          // Calculate stats from API data
          const cities = new Set(listings.map((l: any) => l.address?.city).filter(Boolean));
          const prices = listings.map((l: any) => l.listPrice || 0).filter(p => p > 0);
          const avgPrice = prices.length > 0 
            ? prices.reduce((a, b) => a + b, 0) / prices.length 
            : 0;
          
          setStats({
            activeListings: data?.count || listings.length,
            citiesCount: cities.size,
            avgPrice: Math.round(avgPrice),
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const displayStats = [
    { 
      icon: Building2, 
      value: loading ? "..." : `${stats.activeListings.toLocaleString()}+`, 
      label: "Active Listings" 
    },
    { 
      icon: MapPin, 
      value: loading ? "..." : `${stats.citiesCount}+`, 
      label: "Cities Covered" 
    },
    { 
      icon: Home, 
      value: loading ? "..." : `$${Math.round(stats.avgPrice / 1000)}K`, 
      label: "Average Price" 
    },
    { 
      icon: TrendingUp, 
      value: "98%", 
      label: "Client Satisfaction" 
    },
  ];

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-premium rounded-full mb-4 shadow-medium">
                <stat.icon className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

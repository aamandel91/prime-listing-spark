import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import { useRepliers } from "@/hooks/useRepliers";

interface CountyData {
  county_name: string;
  state: string;
  slug: string;
  description: string | null;
  hero_image_url: string | null;
  property_count?: number;
}

export default function Counties() {
  const [counties, setCounties] = useState<CountyData[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchListings } = useRepliers();

  useEffect(() => {
    fetchCounties();
  }, []);

  const fetchCounties = async () => {
    try {
      // Fetch all listings from Repliers API
      const repliersData = await searchListings({ limit: 10000 });
      
      // Extract unique counties from the API
      const countyMap = new Map<string, { county: string; state: string; count: number }>();
      
      repliersData.listings.forEach((listing) => {
        if (listing.CountyOrParish && listing.StateOrProvince) {
          const key = `${listing.CountyOrParish}-${listing.StateOrProvince}`;
          if (countyMap.has(key)) {
            const existing = countyMap.get(key)!;
            countyMap.set(key, { ...existing, count: existing.count + 1 });
          } else {
            countyMap.set(key, {
              county: listing.CountyOrParish,
              state: listing.StateOrProvince,
              count: 1
            });
          }
        }
      });

      // Fetch featured counties from database for custom content
      const { data: featuredCounties } = await supabase
        .from("featured_counties")
        .select("*");

      // Merge API counties with featured counties data
      const countiesArray: CountyData[] = Array.from(countyMap.values()).map(({ county, state, count }) => {
        const slug = county.toLowerCase().replace(/\s+/g, "-");
        const featured = featuredCounties?.find(
          (fc) => fc.county_name.toLowerCase() === county.toLowerCase() && fc.state === state
        );

        return {
          county_name: county,
          state: state,
          slug: featured?.slug || slug,
          description: featured?.description || `Explore ${count} properties available in ${county} County, ${state}.`,
          hero_image_url: featured?.hero_image_url || null,
          property_count: count
        };
      });

      // Sort by property count (most listings first) then alphabetically
      countiesArray.sort((a, b) => {
        if (b.property_count !== a.property_count) {
          return (b.property_count || 0) - (a.property_count || 0);
        }
        return a.county_name.localeCompare(b.county_name);
      });

      setCounties(countiesArray);
    } catch (error) {
      console.error("Error fetching counties:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Featured Counties | Texas Real Estate</title>
        <meta
          name="description"
          content="Explore our featured counties across Texas. Find your dream home in the perfect location."
        />
      </Helmet>

      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Explore Featured Counties
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover the best real estate opportunities in our carefully
                curated selection of Texas counties.
              </p>
            </div>
          </div>
        </section>

        {/* Counties Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : counties.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">
                  No counties available yet
                </h2>
                <p className="text-muted-foreground">
                  Check back soon for featured counties.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {counties.map((county) => (
                  <Link
                    key={`${county.county_name}-${county.state}`}
                    to={`/listings?county=${encodeURIComponent(county.county_name)}&state=${county.state}&status=A`}
                    className="group"
                  >
                    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      {county.hero_image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={county.hero_image_url}
                            alt={`${county.county_name}, ${county.state}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-2xl font-bold text-white">
                              {county.county_name}
                            </h3>
                            <p className="text-white/90 text-sm">
                              {county.state}
                            </p>
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6">
                        {!county.hero_image_url && (
                          <h3 className="text-2xl font-bold mb-2">
                            {county.county_name}, {county.state}
                          </h3>
                        )}
                        {county.description && (
                          <p className="text-muted-foreground line-clamp-3">
                            {county.description}
                          </p>
                        )}
                        <div className="mt-4 text-primary font-medium group-hover:underline">
                          Explore Properties →
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

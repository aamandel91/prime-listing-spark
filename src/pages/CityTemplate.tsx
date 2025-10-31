import { useParams, Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyMap from "@/components/map/PropertyMap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreadcrumbSEO } from "@/components/ui/breadcrumb-seo";
import { TrendingUp, Building2, School, DollarSign } from "lucide-react";
import { useRepliersListings } from "@/hooks/useRepliers";

// City data mapping
const CITY_DATA: Record<string, {
  name: string;
  state: string;
  description: string;
  stats: {
    medianPrice: string;
    activeListings: number;
    avgDaysOnMarket: number;
    schools: string;
  };
  neighborhoods: Array<{ name: string; slug: string; avgPrice: string }>;
  propertyTypes: Array<{ type: string; count: number }>;
  heroImage: string;
}> = {
  "fayetteville": {
    name: "Fayetteville",
    state: "NC",
    description: "Fayetteville is a thriving city in North Carolina, known for its military heritage with Fort Liberty nearby. The area offers diverse housing options from historic downtown properties to new suburban developments, excellent schools, growing job market, and affordable cost of living compared to other major NC cities.",
    stats: {
      medianPrice: "$245,000",
      activeListings: 456,
      avgDaysOnMarket: 32,
      schools: "7.8/10",
    },
    neighborhoods: [
      { name: "The Hills At Stonegate", slug: "the-hills-at-stonegate", avgPrice: "$385K" },
      { name: "Downtown Fayetteville", slug: "downtown-fayetteville", avgPrice: "$295K" },
      { name: "Hope Mills", slug: "hope-mills", avgPrice: "$265K" },
    ],
    propertyTypes: [
      { type: "Single Family", count: 298 },
      { type: "Condos", count: 87 },
      { type: "Townhomes", count: 45 },
      { type: "Multi-Family", count: 26 },
    ],
    heroImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=80"
  },
  "miami": {
    name: "Miami",
    state: "FL",
    description: "Miami is a vibrant coastal city known for its beautiful beaches, diverse culture, and thriving real estate market. From luxury waterfront condos to family-friendly suburban homes, Miami offers something for everyone with year-round sunshine, world-class dining, and excellent business opportunities.",
    stats: {
      medianPrice: "$565,000",
      activeListings: 1234,
      avgDaysOnMarket: 28,
      schools: "8.2/10",
    },
    neighborhoods: [
      { name: "Brickell", slug: "brickell", avgPrice: "$685K" },
      { name: "Coconut Grove", slug: "coconut-grove", avgPrice: "$895K" },
      { name: "Coral Gables", slug: "coral-gables", avgPrice: "$1.2M" },
    ],
    propertyTypes: [
      { type: "Condos", count: 567 },
      { type: "Single Family", count: 423 },
      { type: "Townhomes", count: 156 },
      { type: "Multi-Family", count: 88 },
    ],
    heroImage: "https://images.unsplash.com/photo-1506059612708-99d6c258160e?auto=format&fit=crop&w=2000&q=80"
  },
  "orlando": {
    name: "Orlando",
    state: "FL",
    description: "Orlando is Central Florida's entertainment capital, home to world-famous theme parks and a rapidly growing real estate market. The area offers excellent schools, diverse neighborhoods, strong job growth in tech and tourism, and a family-friendly atmosphere with endless recreational opportunities.",
    stats: {
      medianPrice: "$385,000",
      activeListings: 892,
      avgDaysOnMarket: 35,
      schools: "8.0/10",
    },
    neighborhoods: [
      { name: "Winter Park", slug: "winter-park", avgPrice: "$595K" },
      { name: "Lake Nona", slug: "lake-nona", avgPrice: "$485K" },
      { name: "Dr. Phillips", slug: "dr-phillips", avgPrice: "$525K" },
    ],
    propertyTypes: [
      { type: "Single Family", count: 512 },
      { type: "Condos", count: 234 },
      { type: "Townhomes", count: 98 },
      { type: "Multi-Family", count: 48 },
    ],
    heroImage: "https://images.unsplash.com/photo-1527813972756-2890161e8c27?auto=format&fit=crop&w=2000&q=80"
  },
  "tampa": {
    name: "Tampa",
    state: "FL",
    description: "Tampa combines urban sophistication with coastal charm on Florida's Gulf Coast. The city offers a booming real estate market with waterfront properties, historic neighborhoods, modern downtown condos, excellent restaurants, cultural attractions, and some of Florida's best beaches nearby.",
    stats: {
      medianPrice: "$425,000",
      activeListings: 678,
      avgDaysOnMarket: 30,
      schools: "7.9/10",
    },
    neighborhoods: [
      { name: "Hyde Park", slug: "hyde-park", avgPrice: "$685K" },
      { name: "South Tampa", slug: "south-tampa", avgPrice: "$595K" },
      { name: "Westshore", slug: "westshore", avgPrice: "$425K" },
    ],
    propertyTypes: [
      { type: "Single Family", count: 387 },
      { type: "Condos", count: 189 },
      { type: "Townhomes", count: 76 },
      { type: "Multi-Family", count: 26 },
    ],
    heroImage: "https://images.unsplash.com/photo-1590674899475-c0535ed7d44b?auto=format&fit=crop&w=2000&q=80"
  },
};

const CityTemplate = () => {
  const { citySlug, filter } = useParams();
  
  // Get city data based on slug
  const cityData = useMemo(() => {
    const slug = (citySlug || "").toLowerCase();
    return CITY_DATA[slug] || CITY_DATA["fayetteville"]; // Default to Fayetteville
  }, [citySlug]);

  // Fetch properties from Repliers API
  const { listings: apiListings, loading, error } = useRepliersListings({
    city: cityData.name,
    state: cityData.state,
    limit: 50,
  });

  // Transform API data to match our component format
  const featuredProperties = useMemo(() => {
    if (!apiListings) return [];
    
    return apiListings.map((listing: any) => ({
      id: listing.id || listing.mlsNumber || Math.random().toString(),
      title: listing.propertyType || "Property",
      price: listing.price || 0,
      beds: listing.bedrooms || 0,
      baths: listing.bathrooms || 0,
      sqft: listing.sqft || listing.squareFeet || 0,
      image: listing.images?.[0] || listing.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      address: listing.address || "",
      city: listing.city || cityData.name,
      state: listing.state || cityData.state,
      zipCode: listing.zipCode || listing.zip || "",
      mlsNumber: listing.mlsNumber || "",
      status: listing.status === "Under Contract" ? "under-contract" as const : 
              listing.status === "Open House" ? "open-house" as const : null,
      isHotProperty: false,
    }));
  }, [apiListings, cityData]);

  // SEO Content
  const filterText = filter ? ` - ${filter.replace(/-/g, ' ')}` : '';
  const pageTitle = `${cityData.name} Real Estate & Homes for Sale${filterText} | ${cityData.state}`;
  const pageDescription = `Find homes for sale in ${cityData.name}, ${cityData.state}${filterText}. Browse ${cityData.stats.activeListings} active listings with a median price of ${cityData.stats.medianPrice}. ${cityData.description.substring(0, 100)}...`;
  const pageUrl = `${window.location.origin}/${citySlug?.toLowerCase() || 'fayetteville'}${filter ? `/${filter}` : ''}`;

  // Structured data for Place/City
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": `${cityData.name}, ${cityData.state}`,
    "description": cityData.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityData.name,
      "addressRegion": cityData.state,
      "addressCountry": "US"
    }
  };

  // Structured data for ItemList of properties
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": featuredProperties.map((property, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": property.title,
        "description": `${property.beds} bed, ${property.baths} bath home in ${cityData.name}`,
        "offers": {
          "@type": "Offer",
          "price": property.price,
          "priceCurrency": "USD"
        }
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={cityData.heroImage} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={cityData.heroImage} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(placeSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>
      </Helmet>
      
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumbs */}
          <BreadcrumbSEO 
            items={[
              { label: cityData.name, href: `/${citySlug?.toLowerCase() || 'fayetteville'}` }
            ]} 
          />

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Real Estate in {cityData.name}, {cityData.state}{filter && ` - ${filter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
            </h1>
            <p className="text-muted-foreground">
              {cityData.stats.activeListings} properties available
            </p>
          </div>

          {/* Main Content: Map and Properties Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Map - Hidden on mobile */}
            <div className="hidden lg:block sticky top-4 h-[calc(100vh-120px)]">
              <PropertyMap properties={featuredProperties} />
            </div>

            {/* Properties Grid */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    {...property}
                  />
                ))}
              </div>

              {/* View All Button */}
              <div className="flex justify-center pt-4">
                <Link to={`/listings?city=${encodeURIComponent(cityData.name)}`}>
                  <Button size="lg">View All Listings</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Neighborhood Details Section */}
          <Card className="p-8 mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              About {cityData.name}
            </h2>
            <p className="text-foreground text-lg leading-relaxed mb-6">
              {cityData.description}
            </p>

            {/* City Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center p-4 bg-secondary rounded-lg">
                <DollarSign className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-xl font-bold text-primary mb-1">
                  {cityData.stats.medianPrice}
                </div>
                <div className="text-sm text-muted-foreground">Median Price</div>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <Building2 className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-xl font-bold text-primary mb-1">
                  {cityData.stats.activeListings}
                </div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-xl font-bold text-primary mb-1">
                  {cityData.stats.avgDaysOnMarket}
                </div>
                <div className="text-sm text-muted-foreground">Avg Days on Market</div>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <School className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-xl font-bold text-primary mb-1">
                  {cityData.stats.schools}
                </div>
                <div className="text-sm text-muted-foreground">School Rating</div>
              </div>
            </div>
          </Card>

          {/* Neighborhoods and Property Types */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Neighborhoods */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Popular Neighborhoods
              </h2>
              <div className="space-y-4">
                {cityData.neighborhoods.map((neighborhood) => (
                  <Link
                    key={neighborhood.slug}
                    to={`/${citySlug?.toLowerCase() || 'fayetteville'}/${neighborhood.slug}`}
                    className="flex justify-between items-center p-4 bg-secondary rounded-lg hover:bg-secondary/70 transition-colors block"
                  >
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <div className="font-semibold text-foreground">
                          {neighborhood.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Avg Price: {neighborhood.avgPrice}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <span>Explore</span>
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Property Types */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Property Types Available
              </h2>
              <div className="space-y-4">
                {cityData.propertyTypes.map((type) => (
                  <Link
                    key={type.type}
                    to={`/${citySlug?.toLowerCase() || 'fayetteville'}/${type.type.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex justify-between items-center p-4 bg-secondary rounded-lg hover:bg-secondary/70 transition-colors"
                  >
                    <span className="font-medium text-foreground">{type.type}</span>
                    <span className="text-accent font-bold">{type.count} listings</span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CityTemplate;

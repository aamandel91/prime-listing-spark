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

// City data mapping - Using Texas cities since Repliers API shows Texas data
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
  "kyle": {
    name: "Kyle",
    state: "TX",
    description: "Kyle is a thriving city in Central Texas, known for its rapid growth and family-friendly atmosphere. Located just south of Austin, Kyle offers diverse housing options from modern new construction to established neighborhoods, excellent schools, growing job market, and affordable cost of living with easy access to Austin's amenities.",
    stats: {
      medianPrice: "$425,000",
      activeListings: 287,
      avgDaysOnMarket: 28,
      schools: "8.1/10",
    },
    neighborhoods: [
      { name: "6 Creeks", slug: "6-creeks", avgPrice: "$525K" },
      { name: "Plum Creek", slug: "plum-creek", avgPrice: "$395K" },
      { name: "Steeplechase", slug: "steeplechase", avgPrice: "$445K" },
    ],
    propertyTypes: [
      { type: "Single Family", count: 198 },
      { type: "Townhomes", count: 54 },
      { type: "Condos", count: 35 },
    ],
    heroImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=80"
  },
  "austin": {
    name: "Austin",
    state: "TX",
    description: "Austin is Texas's vibrant capital city, known for its thriving tech scene, live music culture, and outdoor lifestyle. The real estate market offers everything from downtown high-rises to suburban family homes, historic bungalows in central neighborhoods, and new developments in growing suburbs.",
    stats: {
      medianPrice: "$565,000",
      activeListings: 1842,
      avgDaysOnMarket: 32,
      schools: "7.9/10",
    },
    neighborhoods: [
      { name: "Downtown", slug: "downtown", avgPrice: "$685K" },
      { name: "South Congress", slug: "south-congress", avgPrice: "$795K" },
      { name: "Cedar Park", slug: "cedar-park", avgPrice: "$485K" },
    ],
    propertyTypes: [
      { type: "Single Family", count: 892 },
      { type: "Condos", count: 567 },
      { type: "Townhomes", count: 283 },
      { type: "Multi-Family", count: 100 },
    ],
    heroImage: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=2000&q=80"
  },
  "san-antonio": {
    name: "San Antonio",
    state: "TX",
    description: "San Antonio combines rich history with modern growth, offering affordable living in Texas's second-largest city. The real estate market features diverse neighborhoods from historic downtown areas to sprawling suburban developments, with a strong military presence near multiple bases.",
    stats: {
      medianPrice: "$285,000",
      activeListings: 1234,
      avgDaysOnMarket: 35,
      schools: "7.5/10",
    },
    neighborhoods: [
      { name: "Alamo Heights", slug: "alamo-heights", avgPrice: "$595K" },
      { name: "Stone Oak", slug: "stone-oak", avgPrice: "$425K" },
      { name: "Dominion", slug: "dominion", avgPrice: "$685K" },
    ],
    propertyTypes: [
      { type: "Single Family", count: 756 },
      { type: "Condos", count: 298 },
      { type: "Townhomes", count: 123 },
      { type: "Multi-Family", count: 57 },
    ],
    heroImage: "https://images.unsplash.com/photo-1590674899475-c0535ed7d44b?auto=format&fit=crop&w=2000&q=80"
  },
};

const CityTemplate = () => {
  const { citySlug, filter } = useParams();
  
  // Get city data based on slug
  const cityData = useMemo(() => {
    const slug = (citySlug || "").toLowerCase();
    return CITY_DATA[slug] || CITY_DATA["kyle"]; // Default to Kyle, TX
  }, [citySlug]);

  // Fetch properties from Repliers API
  const { listings: apiListings, loading, error } = useRepliersListings({
    city: cityData.name,
    state: cityData.state,
    status: 'Active',
    limit: 50,
  });

  // Transform API data to match our component format
  const featuredProperties = useMemo(() => {
    if (!apiListings || !Array.isArray(apiListings)) return [];
    
    return apiListings.map((listing: any) => {
      // Build full address
      const addressParts = [
        listing.address?.streetNumber,
        listing.address?.streetName,
        listing.address?.streetSuffix
      ].filter(Boolean).join(' ');

      return {
        id: listing.mlsNumber || Math.random().toString(),
        title: addressParts || "Property",
        price: listing.listPrice || 0,
        avm: listing.avm?.value || 0,
        beds: listing.details?.numBedrooms || 0,
        baths: listing.details?.numBathrooms || 0,
        sqft: parseInt(listing.details?.sqft || "0"),
        image: listing.images?.[0] 
          ? `https://api.repliers.io/images/${listing.images[0]}`
          : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        address: addressParts,
        city: listing.address?.city || cityData.name,
        state: listing.address?.state || cityData.state,
        zipCode: listing.address?.zip || "",
        mlsNumber: listing.mlsNumber || "",
        status: listing.openHouse && listing.openHouse.length > 0 ? "open-house" as const : null,
        isHotProperty: false,
      };
    });
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

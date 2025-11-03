import { useParams, useSearchParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyMap from "@/components/map/PropertyMap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreadcrumbSEO } from "@/components/ui/breadcrumb-seo";
import { useRepliersListings } from "@/hooks/useRepliers";
import { ArrowRight, Home, MapPin } from "lucide-react";

const PROPERTY_TYPES: Record<string, { name: string; description: string; mlsTypes: string[] }> = {
  "single-family-homes": {
    name: "Single Family Homes",
    description: "Detached single-family residences perfect for families",
    mlsTypes: ["House/Single Family", "Single Family Residence"]
  },
  "condos": {
    name: "Condos",
    description: "Modern condominium living with amenities",
    mlsTypes: ["Condo", "Condominium"]
  },
  "townhomes": {
    name: "Townhomes",
    description: "Multi-level townhouses with private entrances",
    mlsTypes: ["Townhouse", "Townhome"]
  },
  "land": {
    name: "Land",
    description: "Residential and commercial land opportunities",
    mlsTypes: ["Land", "Lots/Land"]
  },
  "multi-family": {
    name: "Multi-Family",
    description: "Duplexes, triplexes, and apartment buildings",
    mlsTypes: ["Multi Family", "Multifamily"]
  }
};

export default function CityPropertyType() {
  const { citySlug, propertyType } = useParams<{ citySlug: string; propertyType: string }>();
  const [searchParams] = useSearchParams();

  const propertyTypeData = propertyType ? PROPERTY_TYPES[propertyType] : null;

  const { listings, loading: isLoading } = useRepliersListings({
    city: citySlug?.replace(/-/g, " ") || "",
    state: "FL",
    propertyType: propertyTypeData?.mlsTypes || [],
    status: searchParams.get("status") || "A",
    limit: 24
  });

  const cityName = useMemo(() => {
    return citySlug
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [citySlug]);

  const featuredProperties = useMemo(() => {
    return listings.map((listing: any) => ({
      id: listing.mlsNumber || listing.ListingKey || listing.ListingId,
      title: `${listing.details?.numBedrooms || listing.BedroomsTotal || 0} Bed ${listing.details?.numBathrooms || listing.BathroomsTotalInteger || 0} Bath ${propertyTypeData?.name}`,
      address: listing.address?.fullAddress || listing.UnparsedAddress || "",
      city: listing.address?.city || listing.City || cityName || "",
      state: listing.address?.state || listing.StateOrProvince || "FL",
      price: listing.listPrice || listing.ListPrice || 0,
      beds: listing.details?.numBedrooms || listing.BedroomsTotal || 0,
      baths: listing.details?.numBathrooms || listing.BathroomsTotalInteger || 0,
      sqft: Number(listing.details?.sqft || listing.LivingArea || 0),
      image: listing.images?.[0] || listing.Media?.[0]?.MediaURL || "/placeholder.svg",
      mlsNumber: listing.mlsNumber || listing.ListingKey || listing.ListingId,
      propertyType: listing.details?.propertyType || listing.PropertyType || propertyTypeData?.name,
      status: listing.standardStatus || listing.StandardStatus || "Active",
      listingData: listing,
    }));
  }, [listings, cityName, propertyTypeData]);

  if (!propertyTypeData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto py-12">
          <h1 className="text-3xl font-bold mb-4">Property Type Not Found</h1>
          <p>The requested property type does not exist.</p>
          <Button asChild className="mt-4">
            <Link to="/">Go Home</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const pageTitle = `${propertyTypeData.name} for Sale in ${cityName}, Florida`;
  const pageDescription = `Browse ${featuredProperties.length}+ ${propertyTypeData.name.toLowerCase()} for sale in ${cityName}, FL. ${propertyTypeData.description}. View photos, prices, and details.`;
  const canonicalUrl = `https://yourdomain.com/cities/${citySlug}/${propertyType}`;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cities", href: "/cities" },
    { label: cityName || "", href: `/cities/${citySlug}` },
    { label: propertyTypeData.name, href: `/cities/${citySlug}/${propertyType}` }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "description": pageDescription,
    "numberOfItems": featuredProperties.length,
    "itemListElement": featuredProperties.slice(0, 10).map((property, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SingleFamilyResidence",
        "name": property.title,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": property.address,
          "addressLocality": property.city,
          "addressRegion": property.state,
          "addressCountry": "US"
        },
        "offers": {
          "@type": "Offer",
          "price": property.price,
          "priceCurrency": "USD"
        }
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-8">
          <BreadcrumbSEO items={breadcrumbItems} />

          <div className="mt-6 mb-8">
            <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
              <Home className="h-8 w-8 text-primary" />
              {propertyTypeData.name} in {cityName}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              {propertyTypeData.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{featuredProperties.length} properties available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-96 animate-pulse bg-muted" />
                  ))}
                </div>
              ) : featuredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
                  <p className="text-muted-foreground mb-4">
                    There are currently no {propertyTypeData.name.toLowerCase()} available in {cityName}.
                  </p>
                  <Button asChild>
                    <Link to={`/cities/${citySlug}`}>View All Properties</Link>
                  </Button>
                </Card>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-24">
                <PropertyMap properties={featuredProperties} />
              </div>
            </div>
          </div>

          {featuredProperties.length > 0 && (
            <div className="text-center">
              <Button asChild size="lg">
                <Link to={`/listings?city=${citySlug}&type=${propertyTypeData.mlsTypes[0]}`}>
                  View All {propertyTypeData.name} in {cityName}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">About {propertyTypeData.name} in {cityName}</h2>
              <p className="text-muted-foreground mb-4">
                {cityName} offers a diverse selection of {propertyTypeData.name.toLowerCase()} that cater to various lifestyles and budgets. 
                Whether you're a first-time homebuyer, investor, or looking to upgrade, you'll find excellent opportunities in this vibrant Florida city.
              </p>
              <p className="text-muted-foreground">
                {propertyTypeData.description} The local real estate market provides competitive pricing and 
                desirable neighborhoods with easy access to amenities, schools, and entertainment.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Other Property Types in {cityName}</h2>
              <div className="space-y-3">
                {Object.entries(PROPERTY_TYPES)
                  .filter(([slug]) => slug !== propertyType)
                  .map(([slug, data]) => (
                    <Link
                      key={slug}
                      to={`/cities/${citySlug}/${slug}`}
                      className="block p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{data.name}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

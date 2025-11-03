import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyMap from "@/components/map/PropertyMap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreadcrumbSEO } from "@/components/ui/breadcrumb-seo";
import { useRepliersListings } from "@/hooks/useRepliers";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Home, TrendingUp, DollarSign } from "lucide-react";

export default function ZipCodePage() {
  const { zipcode } = useParams<{ zipcode: string }>();
  const [zipData, setZipData] = useState<any>(null);
  
  const { listings, loading: isLoading } = useRepliersListings({
    zip: zipcode,
    status: "A",
    limit: 24
  });

  useEffect(() => {
    const fetchZipData = async () => {
      if (!zipcode) return;
      
      const { data } = await supabase
        .from("featured_zipcodes")
        .select("*")
        .eq("zipcode", zipcode)
        .eq("featured", true)
        .maybeSingle();
      
      setZipData(data);
    };
    
    fetchZipData();
  }, [zipcode]);

  const featuredProperties = useMemo(() => {
    return listings.map((listing: any) => ({
      id: listing.mlsNumber || listing.ListingKey,
      title: `${listing.details?.numBedrooms || 0} Bed ${listing.details?.numBathrooms || 0} Bath Home`,
      address: listing.address?.fullAddress || listing.UnparsedAddress || "",
      city: listing.address?.city || listing.City || "",
      state: listing.address?.state || listing.StateOrProvince || "FL",
      price: listing.listPrice || listing.ListPrice || 0,
      beds: listing.details?.numBedrooms || listing.BedroomsTotal || 0,
      baths: listing.details?.numBathrooms || listing.BathroomsTotalInteger || 0,
      sqft: Number(listing.details?.sqft || listing.LivingArea || 0),
      image: listing.images?.[0] || listing.Media?.[0]?.MediaURL || "/placeholder.svg",
      mlsNumber: listing.mlsNumber || listing.ListingKey,
      status: listing.standardStatus || listing.StandardStatus || "Active",
    }));
  }, [listings]);

  const pageTitle = `Homes for Sale in ${zipcode}${zipData?.city ? `, ${zipData.city}` : ''} | ${zipData?.state || 'FL'}`;
  const pageDescription = `Browse ${featuredProperties.length}+ homes for sale in ZIP code ${zipcode}${zipData?.city ? ` (${zipData.city}, ${zipData.state})` : ''}. ${zipData?.property_count ? `${zipData.property_count} total properties available.` : ''} View photos, prices, and property details.`;
  const canonicalUrl = `https://yourdomain.com/zip/${zipcode}`;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "ZIP Codes", href: "/zipcodes" },
    { label: zipcode || "", href: `/zip/${zipcode}` }
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
          "postalCode": zipcode,
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
        <meta property="og:url" content={canonicalUrl} />
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
              <MapPin className="h-8 w-8 text-primary" />
              Homes for Sale in {zipcode}
            </h1>
            {zipData?.city && (
              <p className="text-xl text-muted-foreground mb-4">
                {zipData.city}, {zipData.state}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>{zipData?.property_count || featuredProperties.length} properties</span>
              </div>
              {zipData?.avg_price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Avg Price: ${zipData.avg_price.toLocaleString()}</span>
                </div>
              )}
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
                    There are currently no active listings in {zipcode}.
                  </p>
                  <Button asChild>
                    <Link to="/listings">View All Listings</Link>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">About ZIP Code {zipcode}</h2>
              <p className="text-muted-foreground mb-4">
                {zipData?.description || `Discover homes for sale in ${zipcode}. This area offers diverse housing options from single-family homes to condos and townhouses.`}
              </p>
              {zipData?.city && (
                <p className="text-muted-foreground">
                  Located in {zipData.city}, {zipData.state}, this ZIP code provides easy access to local amenities, 
                  schools, shopping, and entertainment. Browse available properties to find your perfect home.
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Market Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-sm font-medium">Total Properties</span>
                  <span className="text-lg font-bold">{zipData?.property_count || featuredProperties.length}</span>
                </div>
                {zipData?.avg_price && (
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <span className="text-sm font-medium">Average Price</span>
                    <span className="text-lg font-bold">${zipData.avg_price.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-sm font-medium">State</span>
                  <span className="text-lg font-bold">{zipData?.state || 'FL'}</span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

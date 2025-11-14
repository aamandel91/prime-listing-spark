import { useParams, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useTrafficSource } from "@/hooks/useTrafficSource";
import { useRecentlyViewedProperties } from "@/hooks/useRecentlyViewedProperties";
import { useRepliersListing } from "@/hooks/useRepliers";
import { normalizeProperty } from "@/lib/propertyMapper";
import { extractMlsFromOldUrl } from "@/lib/propertyUrl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BreadcrumbSEO } from "@/components/ui/breadcrumb-seo";
import { toast } from "sonner";
import {
  PropertyPhotoGallery,
  PropertyDescription,
  PropertyKeyFacts,
  PropertyFeaturesClean,
  PropertyLocation,
  PropertyContactForm,
  PropertyAddressBar,
  PropertyPriceStats,
} from "@/components/property-detail";
import { PropertyHistory } from "@/components/properties/PropertyHistory";
import { SimilarProperties } from "@/components/properties/SimilarProperties";
import { CommunityListings } from "@/components/properties/CommunityListings";
import { RelatedPages } from "@/components/properties/RelatedPages";
import { PropertyPrevNext } from "@/components/properties/PropertyPrevNext";
import { PropertyNavigation } from "@/components/properties/PropertyNavigation";
import { NearbyPlaces } from "@/components/properties/NearbyPlaces";
import { MarketStatistics } from "@/components/properties/MarketStatistics";

export default function PropertyDetail() {
  const { id, propertySlug } = useParams();
  const location = useLocation();
  
  // Parse the URL to get MLS number
  let mlsNumber = id;
  if (!id && propertySlug) {
    const cleanedSlug = propertySlug.replace(/^\/|\/$/g, '');
    const endMatch = cleanedSlug.match(/(?:^|-)(?:MLS)?([A-Z0-9]{6,})$/i);
    if (endMatch) {
      mlsNumber = endMatch[1];
    } else {
      mlsNumber = "";
    }
  } else if (!id && !propertySlug) {
    mlsNumber = extractMlsFromOldUrl(location.pathname) || "";
  }

  // Track traffic source
  useTrafficSource();
  
  // State
  const [isFavorite, setIsFavorite] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Fetch listing data
  const { listing, loading, error, retry } = useRepliersListing(mlsNumber || '');
  
  // Track recently viewed
  const { addRecentlyViewed } = useRecentlyViewedProperties();
  
  // Normalize property data
  const property = useMemo(() => 
    listing ? normalizeProperty(listing) : null,
    [listing]
  );

  // Check authentication
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Track property view and check if favorited
  useEffect(() => {
    if (!property || !user) return;

    // Add to recently viewed
    addRecentlyViewed({
      id: property.mlsNumber,
      mlsNumber: property.mlsNumber,
      title: property.address.street,
      address: property.address.full,
      city: property.address.city,
      state: property.address.state,
      zipCode: property.address.zip,
      price: property.price,
      beds: property.beds,
      baths: property.baths,
      sqft: property.sqft,
      image: property.images[0],
    });

    // Check if property is favorited
    const checkFavorite = async () => {
      const { data } = await supabase
        .from('favorite_properties')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_mls', property.mlsNumber)
        .maybeSingle();
      
      setIsFavorite(!!data);
    };
    
    checkFavorite();
  }, [property, user, addRecentlyViewed]);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in to save properties');
      return;
    }

    if (!property) return;

    try {
      if (isFavorite) {
        await supabase
          .from('favorite_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_mls', property.mlsNumber);
        
        setIsFavorite(false);
        toast.success('Property removed from favorites');
      } else {
        await supabase
          .from('favorite_properties')
          .insert([{
            user_id: user.id,
            property_mls: property.mlsNumber,
            property_data: listing as any,
            initial_price: property.price,
            current_price: property.price,
          }]);
        
        setIsFavorite(true);
        toast.success('Property saved to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  }, [user, property, isFavorite, listing]);

  // Handle share
  const handleShare = useCallback(async () => {
    if (!property) return;

    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.address.street,
          text: `Check out this property: ${property.address.full} - ${property.priceFormatted}`,
          url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  }, [property]);

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading property details...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Error Loading Property</h2>
            <p className="text-muted-foreground mb-6">
              We encountered an error loading this property. Please try again.
            </p>
            <div className="space-x-4">
              <Button onClick={retry}>Try Again</Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Not found state
  if (!property) {
    return <Navigate to="/404" replace />;
  }

  // Generate SEO schema
  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    name: property.address.street,
    description: property.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address.street,
      addressLocality: property.address.city,
      addressRegion: property.address.state,
      postalCode: property.address.zip,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.location.latitude,
      longitude: property.location.longitude,
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "USD",
    },
    numberOfRooms: property.beds,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.sqft,
      unitCode: "FTK",
    },
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: property.address.city, href: `/city/${property.address.city.toLowerCase()}` },
    { label: property.address.street, href: "#" },
  ];

  const navigationSections = [
    { id: 'overview', label: 'Overview' },
    { id: 'description', label: 'Description' },
    { id: 'features', label: 'Features' },
    { id: 'location', label: 'Location' },
    { id: 'similar', label: 'Similar Properties' },
  ];

  return (
    <>
      <Helmet>
        <title>{property.address.street}, {property.address.city}, {property.address.state} - {property.priceFormatted}</title>
        <meta name="description" content={`${property.beds} bed, ${property.baths} bath ${property.propertyType} in ${property.address.city}, ${property.address.state}. ${property.sqft} sqft. Listed at ${property.priceFormatted}. ${property.description.substring(0, 150)}...`} />
        <meta property="og:title" content={`${property.address.street} - ${property.priceFormatted}`} />
        <meta property="og:description" content={property.description.substring(0, 200)} />
        <meta property="og:image" content={property.images[0]} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">
          {JSON.stringify(propertySchema)}
        </script>
      </Helmet>

      <Navbar />

      {/* Photo Gallery - Full Width at Top */}
      <PropertyPhotoGallery images={property.images} address={property.address.full} />

      {/* Address Bar - Below Gallery */}
      <PropertyAddressBar
        property={property}
        onShare={handleShare}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
      />

      {/* Price & Stats Section - Horizontal Layout */}
      <PropertyPriceStats
        property={property}
        onRequestInfo={() => setIsContactDialogOpen(true)}
        onScheduleShowing={() => setIsContactDialogOpen(true)}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-0">
        {/* Breadcrumbs */}
        <div className="py-6">
          <BreadcrumbSEO items={breadcrumbItems} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-0">
            {/* Description */}
            <div id="description">
              <PropertyDescription description={property.description} />
            </div>

            {/* Key Facts */}
            <div id="overview">
              <PropertyKeyFacts property={property} />
            </div>

            {/* Features */}
            <div id="features">
              <PropertyFeaturesClean property={property} />
            </div>

            {/* Market Statistics */}
            <div className="py-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
                Market Statistics
              </h2>
              <MarketStatistics
                city={property.address.city}
                state={property.address.state}
                propertyType={property.propertyType}
              />
            </div>

            {/* Nearby Places */}
            <div className="py-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
                Nearby Amenities
              </h2>
              <NearbyPlaces
                latitude={property.location.latitude}
                longitude={property.location.longitude}
              />
            </div>

            {/* Location & Map */}
            <div id="location">
              <PropertyLocation property={property} />
            </div>
          </div>

          {/* Right Column - Sidebar (1/3) - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <PropertyContactForm property={property} />
            </div>
          </div>
        </div>

        {/* Full Width Sections Below */}
        <div className="mt-16 space-y-12">
          {/* Community Listings */}
          {property.address.city && (
            <div className="py-8 border-t-2 border-gray-200">
              <CommunityListings
                city={property.address.city}
                state={property.address.state}
                currentMlsNumber={property.mlsNumber}
              />
            </div>
          )}

          {/* Similar Properties */}
          <div id="similar" className="py-8 border-t-2 border-gray-200">
            <SimilarProperties currentProperty={listing} />
          </div>

          {/* Related Pages */}
          <div className="py-8 border-t-2 border-gray-200">
            <RelatedPages
              city={property.address.city}
              state={property.address.state}
            />
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact About This Property</DialogTitle>
          </DialogHeader>
          <PropertyContactForm property={property} />
        </DialogContent>
      </Dialog>
    </>
  );
}

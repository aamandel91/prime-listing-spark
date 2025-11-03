import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import CTASection from "@/components/home/CTASection";
import PropertyTypes from "@/components/home/PropertyTypes";
import PopularSearches from "@/components/home/PopularSearches";
import ExploreListings from "@/components/home/ExploreListings";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Stats from "@/components/home/Stats";
import RecentBlogs from "@/components/home/RecentBlogs";
import FloridaResourceSection from "@/components/home/FloridaResourceSection";

const Index = () => {
  // Structured data for Organization and WebSite
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "FloridaHomeFinder",
    "description": "Florida's premier real estate search platform for homes, condos, and properties",
    "url": window.location.origin,
    "logo": `${window.location.origin}/favicon.ico`,
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "FL",
      "addressCountry": "US"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FloridaHomeFinder",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/listings?location={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Florida Homes & Real Estate for Sale | FloridaHomeFinder.com</title>
        <meta 
          name="description" 
          content="Search Florida homes, condos, and properties for sale. Browse MLS listings updated every 15 minutes across Miami, Tampa, Orlando, Jacksonville & all Florida metros. Your #1 Florida real estate resource." 
        />
        <link rel="canonical" href={window.location.origin} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Florida Homes & Real Estate for Sale | FloridaHomeFinder.com" />
        <meta property="og:description" content="Search Florida homes, condos, and properties for sale. Your #1 Florida real estate resource." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Florida Homes & Real Estate for Sale | FloridaHomeFinder.com" />
        <meta name="twitter:description" content="Search Florida homes, condos, and properties for sale. Your #1 Florida real estate resource." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>

      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Stats />
        <FeaturedProperties />
        <CTASection />
        <PropertyTypes />
        <PopularSearches />
        <ExploreListings />
        <RecentBlogs />
        <FloridaResourceSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

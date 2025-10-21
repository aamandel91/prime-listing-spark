import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import CTASection from "@/components/home/CTASection";
import PropertyTypes from "@/components/home/PropertyTypes";
import PopularSearches from "@/components/home/PopularSearches";
import ExploreListings from "@/components/home/ExploreListings";
import RecentBlogs from "@/components/home/RecentBlogs";
import FloridaResourceSection from "@/components/home/FloridaResourceSection";

const Index = () => {
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
      </Helmet>

      <Navbar />
      
      <main className="flex-1">
        <Hero />
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

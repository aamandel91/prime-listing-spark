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

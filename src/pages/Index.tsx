import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import CTASection from "@/components/home/CTASection";
import ExploreListings from "@/components/home/ExploreListings";
import FeaturedProperties from "@/components/home/FeaturedProperties";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <CTASection />
        <ExploreListings />
        <FeaturedProperties />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import FeaturedProperties from "@/components/home/FeaturedProperties";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Stats />
        <FeaturedProperties />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

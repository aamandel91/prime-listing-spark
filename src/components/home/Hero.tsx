import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury modern home exterior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-up">
          Find Your Dream Home
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Discover the perfect property from thousands of listings across premier locations
        </p>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-large p-2 flex flex-col md:flex-row gap-2 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Enter city, neighborhood, or ZIP code"
              className="pl-10 h-12 border-0 focus-visible:ring-0"
            />
          </div>
          <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            <Search className="w-5 h-5 mr-2" />
            Search Properties
          </Button>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
            Single Family Homes
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
            Condos
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
            Townhomes
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
            Multi-Family
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

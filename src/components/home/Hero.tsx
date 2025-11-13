import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimpleSearchBar from "@/components/search/SimpleSearchBar";
import OptimizedImage from "@/components/OptimizedImage";

const Hero = () => {
  const [activeTab, setActiveTab] = useState("buying");

  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85"
          alt="Luxury modern home exterior"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority={true}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-5xl mx-auto mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-black/30 backdrop-blur-sm border-0 h-auto p-1 gap-1">
            <TabsTrigger 
              value="buying" 
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-white py-3 px-4"
            >
              Buying
            </TabsTrigger>
            <TabsTrigger 
              value="selling" 
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-white py-3 px-4"
            >
              Selling
            </TabsTrigger>
            <TabsTrigger 
              value="estimate" 
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-white py-3 px-4"
            >
              Home Estimate
            </TabsTrigger>
            <TabsTrigger 
              value="preapproved" 
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-white py-3 px-4"
            >
              Get Pre-Approved
            </TabsTrigger>
            <TabsTrigger 
              value="instantoffer" 
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-white py-3 px-4"
            >
              Instant Offer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buying" className="mt-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-up">
                Find Your Dream Home
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Enter Your Price Range & Location Below
              </p>

              {/* Search Form */}
              <div className="max-w-5xl mx-auto animate-fade-up">
                <SimpleSearchBar />
              </div>

              {/* Instant Cash Offer - Standalone */}
              <div className="text-center mt-8">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground h-14 px-12 text-lg font-semibold"
                >
                  Get an Instant Cash Offer
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="selling" className="mt-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Ready to Sell Your Home?
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Get a free market analysis and discover your home's value
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-12 text-lg">
              Get Started
            </Button>
          </TabsContent>

          <TabsContent value="estimate" className="mt-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              What's Your Home Worth?
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Get a free, accurate home estimate in minutes
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-12 text-lg">
              Find Out Now
            </Button>
          </TabsContent>

          <TabsContent value="preapproved" className="mt-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Get Pre-Approved Today
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Connect with lenders who can offer competitive mortgage rates
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-12 text-lg">
              Start Application
            </Button>
          </TabsContent>

          <TabsContent value="instantoffer" className="mt-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Get an Instant Cash Offer
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Your terms and schedule, without the hassle
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-12 text-lg">
              Get Started
            </Button>
          </TabsContent>

        </Tabs>
      </div>
    </section>
  );
};

export default Hero;

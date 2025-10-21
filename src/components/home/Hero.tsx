import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Hero = () => {
  const [activeTab, setActiveTab] = useState("buying");

  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury modern home exterior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-black/30 backdrop-blur-sm border-0 h-auto p-1 gap-1">
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
              <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-large p-4 animate-fade-up">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Enter Location, Zip, Address or MLS #"
                      className="pl-10 h-12 border-0 focus-visible:ring-1"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="md:w-40 h-12">
                      <SelectValue placeholder="Min Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Min</SelectItem>
                      <SelectItem value="100000">$100,000</SelectItem>
                      <SelectItem value="250000">$250,000</SelectItem>
                      <SelectItem value="500000">$500,000</SelectItem>
                      <SelectItem value="750000">$750,000</SelectItem>
                      <SelectItem value="1000000">$1,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="md:w-40 h-12">
                      <SelectValue placeholder="Max Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="250000">$250,000</SelectItem>
                      <SelectItem value="500000">$500,000</SelectItem>
                      <SelectItem value="750000">$750,000</SelectItem>
                      <SelectItem value="1000000">$1,000,000</SelectItem>
                      <SelectItem value="2000000">$2,000,000</SelectItem>
                      <SelectItem value="0">No Max</SelectItem>
                    </SelectContent>
                  </Select>
                  <Link to="/listings">
                    <Button className="h-12 w-full md:w-auto px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                      <Search className="w-5 h-5 mr-2" />
                      Search Homes
                    </Button>
                  </Link>
                </div>
                <Button variant="link" className="text-primary hover:text-primary/80 mt-4">
                  Search Properties Near Me
                </Button>
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

        </Tabs>
      </div>
    </section>
  );
};

export default Hero;

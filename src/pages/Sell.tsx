import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Home, Handshake, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const Sell = () => {
  const [address, setAddress] = useState("");
  const { toast } = useToast();

  const handleGetOffer = () => {
    if (!address.trim()) {
      toast({
        variant: "destructive",
        title: "Address Required",
        description: "Please enter your home address",
        duration: 3000,
      });
      return;
    }

    toast({
      title: "Request Received",
      description: "We'll contact you shortly with your cash offer!",
      duration: 4000,
    });
    setAddress("");
  };

  const benefits = [
    {
      icon: Award,
      title: "#1 Real Estate Firm",
      description: "in Florida",
    },
    {
      icon: Home,
      title: "67,500 Lifetime",
      description: "Clients Served",
    },
    {
      icon: Handshake,
      title: "Over 30 Years",
      description: "of Experience",
    },
    {
      icon: TrendingUp,
      title: "Over $3.2B",
      description: "in 20k+ Total Sales",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Sell Your Home | Get a Cash Offer Today | FloridaHomeFinder.com</title>
        <meta
          name="description"
          content="Get your strongest cash offer today. Sell your Florida home fast with our guaranteed offer program. Over 30 years of experience."
        />
      </Helmet>

      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-background via-background to-muted py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Left Content */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    Get your strongest{" "}
                    <span className="text-primary">cash offer today.</span>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    No repairs, no showings, no hassle. Get a guaranteed cash offer for your home in as little as 24 hours.
                  </p>
                </div>

                {/* Address Input */}
                <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl shadow-elegant border border-border space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter your home address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleGetOffer();
                      }
                    }}
                    className="h-14 text-base"
                  />
                  <Button
                    onClick={handleGetOffer}
                    size="lg"
                    className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
                  >
                    Get my offer
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>No obligation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Fair cash offers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Close on your timeline</span>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative lg:block">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Home className="w-32 h-32 text-primary/30" />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Work With Us Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Why Work With <span className="text-primary">FloridaHomeFinder?</span>
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="text-center space-y-4 p-6 rounded-2xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mx-auto">
                      <benefit.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  How It Works
                </h2>
                <p className="text-lg text-muted-foreground">
                  Get your cash offer in three simple steps
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                    1
                  </div>
                  <h3 className="text-xl font-semibold">Submit Your Info</h3>
                  <p className="text-muted-foreground">
                    Tell us about your property with a quick form
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">Get Your Offer</h3>
                  <p className="text-muted-foreground">
                    Receive a fair cash offer within 24 hours
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">Close On Your Terms</h3>
                  <p className="text-muted-foreground">
                    Choose your closing date and get paid
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to sell your home?
              </h2>
              <p className="text-lg text-muted-foreground">
                Get started today and receive your cash offer within 24 hours
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-semibold"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Get My Cash Offer
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base font-semibold"
                  onClick={() => window.location.href = "/contact"}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;

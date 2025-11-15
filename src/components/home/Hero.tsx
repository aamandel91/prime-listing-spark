import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SimpleSearchBar from "@/components/search/SimpleSearchBar";
import OptimizedImage from "@/components/OptimizedImage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const estimateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number is required").max(20),
  address: z.string().trim().min(5, "Property address is required").max(500),
});

const preApprovalSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number is required").max(20),
  loanAmount: z.string().trim().min(1, "Desired loan amount is required"),
  employment: z.string().trim().min(1, "Employment status is required").max(200),
});

const instantOfferSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number is required").max(20),
  address: z.string().trim().min(5, "Property address is required").max(500),
});

const Hero = () => {
  const [activeTab, setActiveTab] = useState("buying");
  const [showEstimateDialog, setShowEstimateDialog] = useState(false);
  const [showPreApprovalDialog, setShowPreApprovalDialog] = useState(false);
  const [showInstantOfferDialog, setShowInstantOfferDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
            <Button 
              size="lg" 
              onClick={() => navigate('/sell')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-12 text-lg"
            >
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
            <Button 
              size="lg" 
              onClick={() => setShowEstimateDialog(true)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-12 text-lg"
            >
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
            <Button 
              size="lg" 
              onClick={() => setShowPreApprovalDialog(true)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-12 text-lg"
            >
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
            <Button 
              size="lg" 
              onClick={() => setShowInstantOfferDialog(true)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-12 text-lg"
            >
              Get Started
            </Button>
          </TabsContent>

        </Tabs>
      </div>

      {/* Home Estimate Dialog */}
      <Dialog open={showEstimateDialog} onOpenChange={setShowEstimateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Your Home Estimate</DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll provide you with a free home valuation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            const formData = new FormData(e.currentTarget);
            const data = {
              name: formData.get('name') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
              address: formData.get('address') as string,
            };
            
            try {
              estimateSchema.parse(data);
              const { error } = await supabase.from('tour_requests').insert({
                visitor_name: data.name,
                visitor_email: data.email,
                visitor_phone: data.phone,
                property_address: data.address,
                property_mls: 'ESTIMATE-REQUEST',
                tour_type: 'estimate',
                tour_date: new Date().toISOString(),
                comments: 'Home estimate request from Hero section',
              });
              
              if (error) throw error;
              
              toast({
                title: "Request Submitted!",
                description: "We'll contact you shortly with your home estimate.",
              });
              setShowEstimateDialog(false);
              e.currentTarget.reset();
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message || "Failed to submit request. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsSubmitting(false);
            }
          }} className="space-y-4">
            <div>
              <Label htmlFor="estimate-name">Name</Label>
              <Input id="estimate-name" name="name" required />
            </div>
            <div>
              <Label htmlFor="estimate-email">Email</Label>
              <Input id="estimate-email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="estimate-phone">Phone</Label>
              <Input id="estimate-phone" name="phone" type="tel" required />
            </div>
            <div>
              <Label htmlFor="estimate-address">Property Address</Label>
              <Input id="estimate-address" name="address" required />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Get My Estimate"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Pre-Approval Dialog */}
      <Dialog open={showPreApprovalDialog} onOpenChange={setShowPreApprovalDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Pre-Approved</DialogTitle>
            <DialogDescription>
              Complete this form to start your mortgage pre-approval process.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            const formData = new FormData(e.currentTarget);
            const data = {
              name: formData.get('name') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
              loanAmount: formData.get('loanAmount') as string,
              employment: formData.get('employment') as string,
            };
            
            try {
              preApprovalSchema.parse(data);
              const { error } = await supabase.from('tour_requests').insert({
                visitor_name: data.name,
                visitor_email: data.email,
                visitor_phone: data.phone,
                property_address: 'Pre-Approval Request',
                property_mls: 'PRE-APPROVAL',
                tour_type: 'preapproval',
                tour_date: new Date().toISOString(),
                comments: `Loan Amount: ${data.loanAmount}, Employment: ${data.employment}`,
              });
              
              if (error) throw error;
              
              toast({
                title: "Application Submitted!",
                description: "A lender will contact you soon to discuss your pre-approval.",
              });
              setShowPreApprovalDialog(false);
              e.currentTarget.reset();
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message || "Failed to submit application. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsSubmitting(false);
            }
          }} className="space-y-4">
            <div>
              <Label htmlFor="preapproval-name">Name</Label>
              <Input id="preapproval-name" name="name" required />
            </div>
            <div>
              <Label htmlFor="preapproval-email">Email</Label>
              <Input id="preapproval-email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="preapproval-phone">Phone</Label>
              <Input id="preapproval-phone" name="phone" type="tel" required />
            </div>
            <div>
              <Label htmlFor="preapproval-loan">Desired Loan Amount</Label>
              <Input id="preapproval-loan" name="loanAmount" placeholder="e.g. $350,000" required />
            </div>
            <div>
              <Label htmlFor="preapproval-employment">Employment Status</Label>
              <Input id="preapproval-employment" name="employment" placeholder="e.g. Full-time employed" required />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Instant Offer Dialog */}
      <Dialog open={showInstantOfferDialog} onOpenChange={setShowInstantOfferDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get an Instant Cash Offer</DialogTitle>
            <DialogDescription>
              Provide your property details and we'll get you a cash offer quickly.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            const formData = new FormData(e.currentTarget);
            const data = {
              name: formData.get('name') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
              address: formData.get('address') as string,
            };
            
            try {
              instantOfferSchema.parse(data);
              const { error } = await supabase.from('tour_requests').insert({
                visitor_name: data.name,
                visitor_email: data.email,
                visitor_phone: data.phone,
                property_address: data.address,
                property_mls: 'INSTANT-OFFER',
                tour_type: 'instant_offer',
                tour_date: new Date().toISOString(),
                comments: 'Instant cash offer request from Hero section',
              });
              
              if (error) throw error;
              
              toast({
                title: "Request Received!",
                description: "We'll prepare your instant cash offer and contact you shortly.",
              });
              setShowInstantOfferDialog(false);
              e.currentTarget.reset();
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message || "Failed to submit request. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsSubmitting(false);
            }
          }} className="space-y-4">
            <div>
              <Label htmlFor="offer-name">Name</Label>
              <Input id="offer-name" name="name" required />
            </div>
            <div>
              <Label htmlFor="offer-email">Email</Label>
              <Input id="offer-email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="offer-phone">Phone</Label>
              <Input id="offer-phone" name="phone" type="tel" required />
            </div>
            <div>
              <Label htmlFor="offer-address">Property Address</Label>
              <Input id="offer-address" name="address" required />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Get Cash Offer"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hero;

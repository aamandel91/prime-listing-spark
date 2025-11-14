import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useFollowUpBoss } from "@/hooks/useFollowUpBoss";
import { useLeadDeduplication } from "@/hooks/useLeadDeduplication";
import { useAgentSubdomain } from "@/hooks/useAgentSubdomain";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { AuthGate } from "@/components/auth/AuthGate";

const openHouseSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  buyerTimeline: z.enum(["1m", "3m", "6m", "1year+", "not-sure"]),
  workingWithAgent: z.boolean(),
});

type OpenHouseFormData = z.infer<typeof openHouseSchema>;

interface OpenHouseSignInProps {
  propertyId: string;
  propertyAddress: string;
  propertyPrice: number;
  propertyImage?: string;
  propertyBeds?: number;
  propertyBaths?: number;
  propertySqft?: number;
}

export default function OpenHouseSignIn({
  propertyId,
  propertyAddress,
  propertyPrice,
  propertyImage,
  propertyBeds,
  propertyBaths,
  propertySqft,
}: OpenHouseSignInProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackPropertyView } = useFollowUpBoss();
  const { createOrUpdateLeadStatus } = useLeadDeduplication();
  const { agentId } = useAgentSubdomain();
  
  const [formData, setFormData] = useState<OpenHouseFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    buyerTimeline: "not-sure",
    workingWithAgent: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof OpenHouseFormData, string>>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form
    const validation = openHouseSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof OpenHouseFormData, string>> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof OpenHouseFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from("open_house_leads")
        .insert({
          property_mls: propertyId,
          property_address: propertyAddress,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          buyer_timeline: formData.buyerTimeline,
          working_with_agent: formData.workingWithAgent,
          page_url: window.location.href,
          page_referrer: document.referrer,
        });

      if (dbError) throw dbError;

      // Create or update lead status for deduplication tracking with agent assignment
      await createOrUpdateLeadStatus(
        formData.email,
        `${formData.firstName} ${formData.lastName}`,
        formData.phone,
        "open_house",
        propertyId,
        agentId || undefined
      );

      // Send to Follow Up Boss
      await trackPropertyView(
        {
          id: propertyId,
          address: propertyAddress,
          city: propertyAddress.split(',')[1]?.trim() || "",
          state: propertyAddress.split(',')[2]?.trim().split(' ')[0] || "",
          zip: propertyAddress.split(',')[2]?.trim().split(' ')[1] || "",
          mlsNumber: propertyId,
          price: propertyPrice,
          beds: propertyBeds || 0,
          baths: propertyBaths || 0,
          sqft: propertySqft || 0,
        },
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          emails: [{ value: formData.email }],
          phones: [{ value: formData.phone }],
        }
      );

      toast({
        title: "Thank you for signing in!",
        description: "We've received your information and will be in touch soon.",
      });

      // Redirect to property detail page after 2 seconds
      setTimeout(() => {
        navigate(`/home/${propertyId}/openhouse`);
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting open house sign-in:", error);
      toast({
        title: "Error",
        description: "Failed to submit sign-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGate 
      title="Sign in to access Open House"
      description="Create an account to sign in to the open house and connect with agents"
      blur={false}
    >
      <div className="min-h-screen bg-background">
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        {/* Property Header */}
        <div className="relative bg-gradient-to-b from-black/80 to-black/60 text-white">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              {propertyAddress}
            </h1>
            
            <div className="flex justify-center gap-8 md:gap-16 mt-6 mb-8">
              {propertyBeds && (
                <div className="text-center">
                  <div className="text-sm text-white/70">Beds</div>
                  <div className="text-3xl font-bold">{propertyBeds}</div>
                </div>
              )}
              {propertyBaths && (
                <div className="text-center">
                  <div className="text-sm text-white/70">Baths</div>
                  <div className="text-3xl font-bold">{propertyBaths}</div>
                </div>
              )}
              {propertySqft && (
                <div className="text-center">
                  <div className="text-sm text-white/70">Sq.Ft.</div>
                  <div className="text-3xl font-bold">{propertySqft.toLocaleString()}</div>
                </div>
              )}
            </div>

            {propertyImage && (
              <div className="flex justify-center mb-4">
                <div className="relative w-full max-w-md">
                  <img 
                    src={propertyImage} 
                    alt={propertyAddress}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-lg shadow-xl">
                    <div className="text-3xl font-bold">{formatPrice(propertyPrice)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sign-In Form */}
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold mb-2">Open House</h2>
            <p className="text-xl text-muted-foreground">Sign-In Sheet</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-base">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-2 h-12"
                  required
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-base">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-2 h-12"
                  required
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2 h-12"
                required
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-base">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(201) 555-0123"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-2 h-12"
                required
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label className="text-base">How soon are you looking to buy?</Label>
              <div className="flex flex-wrap gap-3 mt-3">
                {[
                  { value: "1m", label: "1 m" },
                  { value: "3m", label: "3 m" },
                  { value: "6m", label: "6 m" },
                  { value: "1year+", label: "1 year +" },
                  { value: "not-sure", label: "Not Sure" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, buyerTimeline: option.value as any })}
                    className={`px-6 py-3 rounded-full border-2 transition-colors ${
                      formData.buyerTimeline === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <Label htmlFor="workingWithAgent" className="text-base">
                Are you working with an agent?
              </Label>
              <button
                type="button"
                id="workingWithAgent"
                onClick={() => setFormData({ ...formData, workingWithAgent: !formData.workingWithAgent })}
                className={`relative inline-flex h-12 w-20 items-center rounded-full transition-colors ${
                  formData.workingWithAgent ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                    formData.workingWithAgent ? "translate-x-9" : "translate-x-1"
                  }`}
                />
                <span
                  className={`absolute inset-0 flex items-center justify-end pr-3 text-sm font-medium text-white ${
                    formData.workingWithAgent ? "opacity-100" : "opacity-0"
                  }`}
                >
                  YES
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-start pl-3 text-sm font-medium ${
                    formData.workingWithAgent ? "opacity-0" : "opacity-100"
                  }`}
                >
                  NO
                </span>
              </button>
            </div>

            <div className="text-xs text-muted-foreground space-y-3 py-4">
              <p>
                By proceeding, you expressly consent to receive texts at the number you provided, 
                including marketing, from eXp Realty about real estate related matters, but not as 
                a condition of purchase. Message frequency varies. You can text Help for help and 
                Stop to cancel. You also agree to our Terms of Service and to our Privacy Policy 
                regarding the information relating to you. Message and data rates may apply.
              </p>
              <p>
                Additionally, <strong>you expressly</strong> consent to receiving calls at the number 
                you provided, including marketing by auto-dialer, pre-recorded or artificial voice, 
                and email, from eXp Realty about real estate related matters, but not as a condition 
                of purchase. This consent applies even if you are on a corporate, state or national 
                Do Not Call list. Messages may be processed by an automated system.
              </p>
              <p>
                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
      </div>
    </AuthGate>
  );
}
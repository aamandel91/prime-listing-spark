import { SellerToolModule } from "@/types/contentModules";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface SellerToolRendererProps {
  module: SellerToolModule;
}

const sellerLeadSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20),
  address: z.string().min(1).max(500),
});

export function SellerToolRenderer({ module }: SellerToolRendererProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = sellerLeadSchema.parse(formData);
      setIsSubmitting(true);

      await supabase.from("tour_requests").insert({
        property_mls: "SELLER_LEAD",
        property_address: validated.address,
        visitor_name: validated.name,
        visitor_email: validated.email,
        visitor_phone: validated.phone,
        tour_type: "seller_inquiry",
        comments: `Seller inquiry for: ${validated.address}`,
        tour_date: new Date().toISOString(),
      });

      toast({
        title: "Thank you!",
        description: "We'll contact you soon with a property valuation.",
      });

      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="module-seller-tool max-w-2xl mx-auto">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <Card>
        <CardContent className="pt-6">
          <p className="mb-6 text-muted-foreground">
            Get a free home valuation and learn how much your property is worth.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="seller_name">Your Name *</Label>
              <Input
                id="seller_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="seller_email">Email *</Label>
              <Input
                id="seller_email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="seller_phone">Phone *</Label>
              <Input
                id="seller_phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="seller_address">Property Address *</Label>
              <Input
                id="seller_address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St, City, State ZIP"
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Get Free Home Valuation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

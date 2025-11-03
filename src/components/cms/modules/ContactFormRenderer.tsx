import { ContactFormModule } from "@/types/contentModules";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface ContactFormRendererProps {
  module: ContactFormModule;
}

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email").max(255),
  phone: z.string().max(20).optional(),
  message: z.string().min(1, "Message is required").max(1000),
});

export function ContactFormRenderer({ module }: ContactFormRendererProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = contactSchema.parse(formData);
      setIsSubmitting(true);

      // Store in tour_requests as a general contact
      await supabase.from("tour_requests").insert({
        property_mls: "CONTACT_FORM",
        property_address: "General Contact",
        visitor_name: validated.name,
        visitor_email: validated.email,
        visitor_phone: validated.phone || null,
        tour_type: "contact",
        comments: validated.message,
        tour_date: new Date().toISOString(),
      });

      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="module-contact-form max-w-2xl mx-auto">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {module.fields.includes("name") && (
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
        )}
        {module.fields.includes("email") && (
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        )}
        {module.fields.includes("phone") && (
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        )}
        {module.fields.includes("message") && (
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              required
            />
          </div>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : module.submitText || "Submit"}
        </Button>
      </form>
    </div>
  );
}

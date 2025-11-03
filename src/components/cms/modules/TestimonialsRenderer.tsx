import { TestimonialsModule } from "@/types/contentModules";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialsRendererProps {
  module: TestimonialsModule;
}

export function TestimonialsRenderer({ module }: TestimonialsRendererProps) {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      let query = supabase.from("testimonials").select("*").eq("published", true);
      
      if (module.featured) {
        query = query.eq("featured", true);
      }
      
      query = query.order("sort_order").limit(module.limit || 6);
      
      const { data } = await query;
      setTestimonials(data || []);
    };

    fetchTestimonials();
  }, [module.featured, module.limit]);

  return (
    <div className="module-testimonials">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="pt-6">
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
              )}
              <p className="mb-4 italic">"{testimonial.content}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold">{testimonial.client_name}</p>
                {testimonial.client_role && (
                  <p className="text-sm text-muted-foreground">{testimonial.client_role}</p>
                )}
                {testimonial.property_address && (
                  <p className="text-sm text-muted-foreground">{testimonial.property_address}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { ContactDetailsModule } from "@/types/contentModules";
import { Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContactDetailsRendererProps {
  module: ContactDetailsModule;
}

export default function ContactDetailsRenderer({ module }: ContactDetailsRendererProps) {
  return (
    <div className="module-contact-details">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {module.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a href={`tel:${module.phone}`} className="hover:underline">
                  {module.phone}
                </a>
              </div>
            )}
            {module.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href={`mailto:${module.email}`} className="hover:underline">
                  {module.email}
                </a>
              </div>
            )}
            {module.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <address className="not-italic">{module.address}</address>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

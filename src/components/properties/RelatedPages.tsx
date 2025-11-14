import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface RelatedPagesProps {
  city: string;
  state: string;
  className?: string;
}

export const RelatedPages = ({ city, state, className = "" }: RelatedPagesProps) => {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  
  const links = [
    { label: `${city}'s Newest Listings`, href: `/listings?city=${city}&state=${state}&sort=newest` },
    { label: `${city} Real Estate`, href: `/${citySlug}` },
    { label: `${city} Homes for Sale`, href: `/listings?city=${city}&state=${state}&propertyType=Residential` },
    { label: `${city} Condos`, href: `/listings?city=${city}&state=${state}&propertyType=Condominium` },
    { label: `${city} Waterfront Homes`, href: `/listings?city=${city}&state=${state}&waterfront=true` },
    // Note: "Sold" status removed - API only supports Active (A) and Under Contract (U)
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Similar Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
            >
              <span className="text-sm font-medium group-hover:text-primary">
                {link.label}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

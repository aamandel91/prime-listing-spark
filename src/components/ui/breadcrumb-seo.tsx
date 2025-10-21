import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSEO = ({ items }: BreadcrumbProps) => {
  const allItems = [{ label: "Home", href: "/" }, ...items];
  
  // Generate JSON-LD structured data for breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `${window.location.origin}${item.href}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
              )}
              {index === allItems.length - 1 ? (
                <span className="font-medium text-foreground">{item.label}</span>
              ) : (
                <Link
                  to={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {index === 0 ? (
                    <Home className="w-4 h-4" />
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

import { LinksModule } from "@/types/contentModules";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

interface LinksRendererProps {
  module: LinksModule;
}

export function LinksRenderer({ module }: LinksRendererProps) {
  const isExternalLink = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  return (
    <div className="module-links">
      {(module.title || module.label) && (
        <h2 className="text-3xl font-bold mb-6">{module.title || module.label}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {module.links.map((link, index) => (
          isExternalLink(link.url) ? (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <span className="font-medium">{link.text}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ) : (
            <Link
              key={index}
              to={link.url}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <span className="font-medium">{link.text}</span>
            </Link>
          )
        ))}
      </div>
    </div>
  );
}

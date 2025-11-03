import { QuickLinksSection } from "@/types/sidebarSections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronRight, ExternalLink } from "lucide-react";

interface QuickLinksRendererProps {
  section: QuickLinksSection;
}

export function QuickLinksRenderer({ section }: QuickLinksRendererProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {section.links.map((link, index) => {
          const isExternal = link.url.startsWith('http');
          const content = (
            <div className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors">
              <span>{link.label}</span>
              {isExternal ? (
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          );

          if (isExternal) {
            return (
              <a
                key={index}
                href={link.url}
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                className="block"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={index} to={link.url} className="block">
              {content}
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

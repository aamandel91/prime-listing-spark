import { SearchWidgetSection } from "@/types/sidebarSections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedSearchBar } from "@/components/search/EnhancedSearchBar";

interface SearchWidgetRendererProps {
  section: SearchWidgetSection;
  context?: {
    city?: string;
    state?: string;
  };
}

export function SearchWidgetRenderer({ section, context }: SearchWidgetRendererProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{section.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedSearchBar />
      </CardContent>
    </Card>
  );
}

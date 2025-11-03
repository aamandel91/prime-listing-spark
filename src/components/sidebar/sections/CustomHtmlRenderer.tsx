import { CustomHtmlSection } from "@/types/sidebarSections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomHtmlRendererProps {
  section: CustomHtmlSection;
}

export function CustomHtmlRenderer({ section }: CustomHtmlRendererProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{section.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: section.html }} />
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

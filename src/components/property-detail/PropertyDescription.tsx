

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
      <div className="bg-muted/30 px-8 py-5 border-b">
        <h2 className="text-2xl font-bold">About This Property</h2>
      </div>
      <div className="p-8">
        <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      </div>
    </div>
  );
}

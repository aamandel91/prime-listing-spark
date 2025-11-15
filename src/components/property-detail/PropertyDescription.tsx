

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg p-8 shadow-sm border mb-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">
        About This Home
      </h2>
      <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
        {description}
      </p>
    </section>
  );
}

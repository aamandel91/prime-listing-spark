

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <section className="py-6">
      <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
        About This Home
      </h2>
      <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
        {description}
      </p>
    </section>
  );
}

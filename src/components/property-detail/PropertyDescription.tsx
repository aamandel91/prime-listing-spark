import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const CHARACTER_LIMIT = 500;

  if (!description) {
    return null;
  }

  const needsTruncation = description.length > CHARACTER_LIMIT;
  const displayText = needsTruncation && !isExpanded 
    ? description.slice(0, CHARACTER_LIMIT) + '...' 
    : description;

  return (
    <section className="bg-white rounded-lg p-8 shadow-sm border mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        About This Home
      </h2>
      <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
        {displayText}
      </p>
      {needsTruncation && (
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-primary hover:text-primary/80"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </Button>
      )}
    </section>
  );
}

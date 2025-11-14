import { CheckCircle } from 'lucide-react';
import type { NormalizedProperty } from '@/lib/propertyMapper';

interface PropertyFeaturesCleanProps {
  property: NormalizedProperty;
}

export function PropertyFeaturesClean({ property }: PropertyFeaturesCleanProps) {
  const formatFeatureLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').trim();
  };

  const getFeaturesList = (features: Record<string, any>): string[] => {
    return Object.entries(features)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        const label = formatFeatureLabel(key);
        if (typeof value === 'boolean') {
          return label;
        }
        return `${label}: ${String(value)}`;
      });
  };

  const interiorFeatures = getFeaturesList(property.features.interior);
  const exteriorFeatures = getFeaturesList(property.features.exterior);
  const utilitiesFeatures = getFeaturesList(property.features.utilities);
  const parkingFeatures = getFeaturesList(property.features.parking);

  return (
    <>
      {/* Interior Features */}
      {interiorFeatures.length > 0 && (
        <section className="py-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
            Interior Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interiorFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-base text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Exterior Features */}
      {exteriorFeatures.length > 0 && (
        <section className="py-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
            Exterior Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exteriorFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-base text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Utilities */}
      {utilitiesFeatures.length > 0 && (
        <section className="py-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
            Utilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {utilitiesFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-base text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Parking */}
      {parkingFeatures.length > 0 && (
        <section className="py-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
            Parking & Garage
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parkingFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-base text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* HOA Information */}
      {property.hoa && property.hoa.fees && (
        <section className="py-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
            HOA Information
          </h2>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-0">
            {property.hoa.fees && (
              <div className="flex justify-between py-4 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">HOA Fees</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${property.hoa.fees}{property.hoa.frequency ? ` / ${property.hoa.frequency}` : ''}
                </span>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

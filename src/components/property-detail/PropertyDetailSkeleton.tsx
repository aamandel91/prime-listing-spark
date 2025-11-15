import Navbar from '@/components/layout/Navbar';
import { Skeleton } from '@/components/ui/skeleton';

export function PropertyDetailSkeleton() {
  return (
    <>
      <Navbar />
      
      {/* Photo Gallery Skeleton */}
      <div className="w-full h-[700px] bg-gray-200 animate-pulse" />
      
      {/* Header Skeleton */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-10 w-96 mb-3" />
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <Skeleton className="h-8 w-48 mb-6" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-3/4 mb-3" />
            </div>
            
            {/* Key Facts */}
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Features */}
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </div>
            
            {/* Map */}
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <Skeleton className="h-8 w-48 mb-6" />
              <Skeleton className="h-[500px] w-full rounded-lg" />
            </div>
          </div>
          
          {/* Right Column (1/3) - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg p-6 shadow-lg border">
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

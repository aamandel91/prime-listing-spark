import { lazy, Suspense } from "react";
import { ContentPageModule } from "@/types/contentModules";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load all module renderers using dynamic imports
// Each module will be code-split into its own chunk automatically
const LazyContentModule = lazy(() => import("./modules/ContentModuleRenderer"));
const LazySavedSearchListings = lazy(() => import("./modules/SavedSearchListingsRenderer"));
const LazySavedSearchTable = lazy(() => import("./modules/SavedSearchTableRenderer"));
const LazyStatistics = lazy(() => import("./modules/StatisticsRenderer"));
const LazyLinks = lazy(() => import("./modules/LinksRenderer"));
const LazyContactForm = lazy(() => import("./modules/ContactFormRenderer"));
const LazyTestimonials = lazy(() => import("./modules/TestimonialsRenderer"));
const LazyBlogPosts = lazy(() => import("./modules/BlogPostsRenderer"));
const LazyVideosGrid = lazy(() => import("./modules/VideosGridRenderer"));
const LazySingleVideo = lazy(() => import("./modules/SingleVideoRenderer"));
const LazyContactDetails = lazy(() => import("./modules/ContactDetailsRenderer"));
const LazyTeamMembers = lazy(() => import("./modules/TeamMembersRenderer"));
const LazyMortgageCalculator = lazy(() => import("./modules/MortgageCalculatorRenderer"));
const LazySellerTool = lazy(() => import("./modules/SellerToolRenderer"));

interface ModuleRendererProps {
  module: ContentPageModule;
}

// Loading skeleton that matches module dimensions to prevent layout shift
function ModuleLoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function ModuleRenderer({ module }: ModuleRendererProps) {
  // Wrap each module in Suspense to prevent blocking the entire page
  // This allows progressive rendering - show content as it loads
  
  const renderModule = () => {
    switch (module.type) {
      case "content":
        return <LazyContentModule module={module} />;
      case "saved_search_listings":
        return <LazySavedSearchListings module={module} />;
      case "saved_search_table":
        return <LazySavedSearchTable module={module} />;
      case "statistics":
        return <LazyStatistics module={module} />;
      case "links":
        return <LazyLinks module={module} />;
      case "contact_form":
        return <LazyContactForm module={module} />;
      case "testimonials":
        return <LazyTestimonials module={module} />;
      case "blog_posts":
        return <LazyBlogPosts module={module} />;
      case "videos_grid":
        return <LazyVideosGrid module={module} />;
      case "single_video":
        return <LazySingleVideo module={module} />;
      case "contact_details":
        return <LazyContactDetails module={module} />;
      case "team_members":
        return <LazyTeamMembers module={module} />;
      case "mortgage_calculator":
        return <LazyMortgageCalculator module={module} />;
      case "seller_tool":
        return <LazySellerTool module={module} />;
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={<ModuleLoadingSkeleton />}>
      {renderModule()}
    </Suspense>
  );
}
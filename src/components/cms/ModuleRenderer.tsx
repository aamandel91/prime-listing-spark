import { lazy, Suspense } from "react";
import { ContentPageModule } from "@/types/contentModules";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load all module renderers to split them into separate chunks
// This ensures only the modules actually used on a page are downloaded
const ContentModuleRenderer = lazy(() => import("./modules/ContentModuleRenderer").then(m => ({ default: m.ContentModuleRenderer })));
const SavedSearchListingsRenderer = lazy(() => import("./modules/SavedSearchListingsRenderer").then(m => ({ default: m.SavedSearchListingsRenderer })));
const SavedSearchTableRenderer = lazy(() => import("./modules/SavedSearchTableRenderer").then(m => ({ default: m.SavedSearchTableRenderer })));
const StatisticsRenderer = lazy(() => import("./modules/StatisticsRenderer").then(m => ({ default: m.StatisticsRenderer })));
const LinksRenderer = lazy(() => import("./modules/LinksRenderer").then(m => ({ default: m.LinksRenderer })));
const ContactFormRenderer = lazy(() => import("./modules/ContactFormRenderer").then(m => ({ default: m.ContactFormRenderer })));
const TestimonialsRenderer = lazy(() => import("./modules/TestimonialsRenderer").then(m => ({ default: m.TestimonialsRenderer })));
const BlogPostsRenderer = lazy(() => import("./modules/BlogPostsRenderer").then(m => ({ default: m.BlogPostsRenderer })));
const VideosGridRenderer = lazy(() => import("./modules/VideosGridRenderer").then(m => ({ default: m.VideosGridRenderer })));
const SingleVideoRenderer = lazy(() => import("./modules/SingleVideoRenderer").then(m => ({ default: m.SingleVideoRenderer })));
const ContactDetailsRenderer = lazy(() => import("./modules/ContactDetailsRenderer").then(m => ({ default: m.ContactDetailsRenderer })));
const TeamMembersRenderer = lazy(() => import("./modules/TeamMembersRenderer").then(m => ({ default: m.TeamMembersRenderer })));
const MortgageCalculatorRenderer = lazy(() => import("./modules/MortgageCalculatorRenderer").then(m => ({ default: m.MortgageCalculatorRenderer })));
const SellerToolRenderer = lazy(() => import("./modules/SellerToolRenderer").then(m => ({ default: m.SellerToolRenderer })));

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
        return <ContentModuleRenderer module={module} />;
      case "saved_search_listings":
        return <SavedSearchListingsRenderer module={module} />;
      case "saved_search_table":
        return <SavedSearchTableRenderer module={module} />;
      case "statistics":
        return <StatisticsRenderer module={module} />;
      case "links":
        return <LinksRenderer module={module} />;
      case "contact_form":
        return <ContactFormRenderer module={module} />;
      case "testimonials":
        return <TestimonialsRenderer module={module} />;
      case "blog_posts":
        return <BlogPostsRenderer module={module} />;
      case "videos_grid":
        return <VideosGridRenderer module={module} />;
      case "single_video":
        return <SingleVideoRenderer module={module} />;
      case "contact_details":
        return <ContactDetailsRenderer module={module} />;
      case "team_members":
        return <TeamMembersRenderer module={module} />;
      case "mortgage_calculator":
        return <MortgageCalculatorRenderer module={module} />;
      case "seller_tool":
        return <SellerToolRenderer module={module} />;
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
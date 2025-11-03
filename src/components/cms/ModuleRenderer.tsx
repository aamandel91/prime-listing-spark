import { ContentPageModule } from "@/types/contentModules";
import { ContentModuleRenderer } from "./modules/ContentModuleRenderer";
import { SavedSearchListingsRenderer } from "./modules/SavedSearchListingsRenderer";
import { SavedSearchTableRenderer } from "./modules/SavedSearchTableRenderer";
import { StatisticsRenderer } from "./modules/StatisticsRenderer";
import { LinksRenderer } from "./modules/LinksRenderer";
import { ContactFormRenderer } from "./modules/ContactFormRenderer";
import { TestimonialsRenderer } from "./modules/TestimonialsRenderer";
import { BlogPostsRenderer } from "./modules/BlogPostsRenderer";
import { VideosGridRenderer } from "./modules/VideosGridRenderer";
import { SingleVideoRenderer } from "./modules/SingleVideoRenderer";
import { ContactDetailsRenderer } from "./modules/ContactDetailsRenderer";
import { TeamMembersRenderer } from "./modules/TeamMembersRenderer";
import { MortgageCalculatorRenderer } from "./modules/MortgageCalculatorRenderer";
import { SellerToolRenderer } from "./modules/SellerToolRenderer";

interface ModuleRendererProps {
  module: ContentPageModule;
}

export function ModuleRenderer({ module }: ModuleRendererProps) {
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
}

import { SidebarSection } from "@/types/sidebarSections";
import { QuickLinksRenderer } from "./sections/QuickLinksRenderer";
import { FeaturedPropertiesRenderer } from "./sections/FeaturedPropertiesRenderer";
import { NeighborhoodsRenderer } from "./sections/NeighborhoodsRenderer";
import { ContactFormRenderer } from "./sections/ContactFormRenderer";
import { MarketStatsRenderer } from "./sections/MarketStatsRenderer";
import { CustomHtmlRenderer } from "./sections/CustomHtmlRenderer";
import { SearchWidgetRenderer } from "./sections/SearchWidgetRenderer";
import { RecentListingsRenderer } from "./sections/RecentListingsRenderer";

interface SidebarRendererProps {
  sections: SidebarSection[];
  context?: {
    city?: string;
    state?: string;
    propertyType?: string;
  };
}

export function SidebarRenderer({ sections, context }: SidebarRendererProps) {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {sortedSections.map((section) => {
        switch (section.type) {
          case "quick_links":
            return <QuickLinksRenderer key={section.id} section={section} />;
          case "featured_properties":
            return <FeaturedPropertiesRenderer key={section.id} section={section} context={context} />;
          case "neighborhoods":
            return <NeighborhoodsRenderer key={section.id} section={section} context={context} />;
          case "contact_form":
            return <ContactFormRenderer key={section.id} section={section} />;
          case "market_stats":
            return <MarketStatsRenderer key={section.id} section={section} context={context} />;
          case "custom_html":
            return <CustomHtmlRenderer key={section.id} section={section} />;
          case "search_widget":
            return <SearchWidgetRenderer key={section.id} section={section} context={context} />;
          case "recent_listings":
            return <RecentListingsRenderer key={section.id} section={section} context={context} />;
          default:
            return null;
        }
      })}
    </aside>
  );
}

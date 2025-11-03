export type SidebarSectionType =
  | "quick_links"
  | "featured_properties"
  | "neighborhoods"
  | "contact_form"
  | "market_stats"
  | "custom_html"
  | "search_widget"
  | "recent_listings";

export interface BaseSidebarSection {
  id: string;
  type: SidebarSectionType;
  title: string;
  order: number;
}

export interface QuickLinksSection extends BaseSidebarSection {
  type: "quick_links";
  links: Array<{
    label: string;
    url: string;
    openInNewTab?: boolean;
  }>;
}

export interface FeaturedPropertiesSection extends BaseSidebarSection {
  type: "featured_properties";
  limit: number;
  searchCriteria?: any;
  displayType: "cards" | "list";
}

export interface NeighborhoodsSection extends BaseSidebarSection {
  type: "neighborhoods";
  city?: string;
  state?: string;
  limit: number;
  showImages?: boolean;
}

export interface ContactFormSection extends BaseSidebarSection {
  type: "contact_form";
  formTitle?: string;
  submitButtonText?: string;
  fields: Array<"name" | "email" | "phone" | "message">;
}

export interface MarketStatsSection extends BaseSidebarSection {
  type: "market_stats";
  city?: string;
  state?: string;
  stats: Array<"median_price" | "avg_days_on_market" | "total_listings" | "sold_last_month">;
}

export interface CustomHtmlSection extends BaseSidebarSection {
  type: "custom_html";
  html: string;
}

export interface SearchWidgetSection extends BaseSidebarSection {
  type: "search_widget";
  defaultCity?: string;
  defaultState?: string;
}

export interface RecentListingsSection extends BaseSidebarSection {
  type: "recent_listings";
  limit: number;
  city?: string;
  state?: string;
}

export type SidebarSection =
  | QuickLinksSection
  | FeaturedPropertiesSection
  | NeighborhoodsSection
  | ContactFormSection
  | MarketStatsSection
  | CustomHtmlSection
  | SearchWidgetSection
  | RecentListingsSection;

export interface SidebarTemplate {
  id: string;
  name: string;
  description?: string;
  sections: SidebarSection[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

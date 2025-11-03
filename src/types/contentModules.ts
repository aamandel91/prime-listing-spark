export type ModuleType =
  | "content"
  | "saved_search_listings"
  | "saved_search_table"
  | "statistics"
  | "links"
  | "contact_form"
  | "testimonials"
  | "blog_posts"
  | "videos_grid"
  | "single_video"
  | "contact_details"
  | "team_members"
  | "mortgage_calculator"
  | "seller_tool";

export interface BaseModule {
  id: string;
  type: ModuleType;
  title?: string;
}

export interface ContentModule extends BaseModule {
  type: "content";
  content: string;
}

export interface SavedSearchListingsModule extends BaseModule {
  type: "saved_search_listings";
  searchId?: string;
  searchCriteria?: any;
  displayType: "grid" | "list";
  limit?: number;
}

export interface SavedSearchTableModule extends BaseModule {
  type: "saved_search_table";
  searchId?: string;
  searchCriteria?: any;
  limit?: number;
}

export interface StatisticsModule extends BaseModule {
  type: "statistics";
  stats: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
}

export interface LinksModule extends BaseModule {
  type: "links";
  label?: string;
  links: Array<{
    text: string;
    url: string;
  }>;
}

export interface ContactFormModule extends BaseModule {
  type: "contact_form";
  fields: string[];
  submitText?: string;
}

export interface TestimonialsModule extends BaseModule {
  type: "testimonials";
  featured?: boolean;
  limit?: number;
}

export interface BlogPostsModule extends BaseModule {
  type: "blog_posts";
  category?: string;
  tag?: string;
  limit?: number;
}

export interface VideosGridModule extends BaseModule {
  type: "videos_grid";
  category?: string;
  featured?: boolean;
  limit?: number;
}

export interface SingleVideoModule extends BaseModule {
  type: "single_video";
  videoId?: string;
  videoUrl?: string;
}

export interface ContactDetailsModule extends BaseModule {
  type: "contact_details";
  phone?: string;
  email?: string;
  address?: string;
}

export interface TeamMembersModule extends BaseModule {
  type: "team_members";
  featured?: boolean;
  limit?: number;
}

export interface MortgageCalculatorModule extends BaseModule {
  type: "mortgage_calculator";
}

export interface SellerToolModule extends BaseModule {
  type: "seller_tool";
}

export type ContentPageModule =
  | ContentModule
  | SavedSearchListingsModule
  | SavedSearchTableModule
  | StatisticsModule
  | LinksModule
  | ContactFormModule
  | TestimonialsModule
  | BlogPostsModule
  | VideosGridModule
  | SingleVideoModule
  | ContactDetailsModule
  | TeamMembersModule
  | MortgageCalculatorModule
  | SellerToolModule;

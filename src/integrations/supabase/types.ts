export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          active: boolean | null
          bio: string | null
          created_at: string
          email: string
          featured: boolean | null
          full_name: string
          id: string
          languages: string[] | null
          license_number: string
          phone: string | null
          profile_image_url: string | null
          social_links: Json | null
          sort_order: number | null
          specialties: string[] | null
          subdomain: string | null
          updated_at: string
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          active?: boolean | null
          bio?: string | null
          created_at?: string
          email: string
          featured?: boolean | null
          full_name: string
          id?: string
          languages?: string[] | null
          license_number: string
          phone?: string | null
          profile_image_url?: string | null
          social_links?: Json | null
          sort_order?: number | null
          specialties?: string[] | null
          subdomain?: string | null
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          active?: boolean | null
          bio?: string | null
          created_at?: string
          email?: string
          featured?: boolean | null
          full_name?: string
          id?: string
          languages?: string[] | null
          license_number?: string
          phone?: string | null
          profile_image_url?: string | null
          social_links?: Json | null
          sort_order?: number | null
          specialties?: string[] | null
          subdomain?: string | null
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      analytics_summary: {
        Row: {
          created_at: string
          date: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value?: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
        }
        Relationships: []
      }
      blog_migration_jobs: {
        Row: {
          blog_url: string
          completed_at: string | null
          created_at: string
          error_count: number | null
          error_details: Json | null
          error_message: string | null
          id: string
          imported_blogs: Json | null
          imported_count: number | null
          status: string
          total_pages: number | null
          user_id: string
        }
        Insert: {
          blog_url: string
          completed_at?: string | null
          created_at?: string
          error_count?: number | null
          error_details?: Json | null
          error_message?: string | null
          id?: string
          imported_blogs?: Json | null
          imported_count?: number | null
          status?: string
          total_pages?: number | null
          user_id: string
        }
        Update: {
          blog_url?: string
          completed_at?: string | null
          created_at?: string
          error_count?: number | null
          error_details?: Json | null
          error_message?: string | null
          id?: string
          imported_blogs?: Json | null
          imported_count?: number | null
          status?: string
          total_pages?: number | null
          user_id?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      competitor_analyses: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          result: Json | null
          status: string
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          result?: Json | null
          status?: string
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          result?: Json | null
          status?: string
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      content_pages: {
        Row: {
          content: string
          created_at: string
          default_image: string | null
          display_sidebar: boolean | null
          featured_image: string | null
          full_width: boolean | null
          hide_breadcrumbs: boolean | null
          hide_footer: boolean | null
          hide_header: boolean | null
          id: string
          include_in_nav: boolean | null
          is_template: boolean | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          modules: Json | null
          open_in: string | null
          page_overview: string | null
          page_priority: number | null
          page_type: string | null
          parent_id: string | null
          published: boolean | null
          robots_indexing: string | null
          sidebar_config: Json | null
          slug: string
          sort_order: number | null
          specific_sidebar: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          default_image?: string | null
          display_sidebar?: boolean | null
          featured_image?: string | null
          full_width?: boolean | null
          hide_breadcrumbs?: boolean | null
          hide_footer?: boolean | null
          hide_header?: boolean | null
          id?: string
          include_in_nav?: boolean | null
          is_template?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          modules?: Json | null
          open_in?: string | null
          page_overview?: string | null
          page_priority?: number | null
          page_type?: string | null
          parent_id?: string | null
          published?: boolean | null
          robots_indexing?: string | null
          sidebar_config?: Json | null
          slug: string
          sort_order?: number | null
          specific_sidebar?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          default_image?: string | null
          display_sidebar?: boolean | null
          featured_image?: string | null
          full_width?: boolean | null
          hide_breadcrumbs?: boolean | null
          hide_footer?: boolean | null
          hide_header?: boolean | null
          id?: string
          include_in_nav?: boolean | null
          is_template?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          modules?: Json | null
          open_in?: string | null
          page_overview?: string | null
          page_priority?: number | null
          page_type?: string | null
          parent_id?: string | null
          published?: boolean | null
          robots_indexing?: string | null
          sidebar_config?: Json | null
          slug?: string
          sort_order?: number | null
          specific_sidebar?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      email_notifications: {
        Row: {
          created_at: string
          error_message: string | null
          html_content: string
          id: string
          retry_count: number | null
          sent_at: string | null
          status: string
          subject: string
          template_data: Json | null
          template_name: string | null
          to_email: string
          to_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          html_content: string
          id?: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          subject: string
          template_data?: Json | null
          template_name?: string | null
          to_email: string
          to_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          html_content?: string
          id?: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          subject?: string
          template_data?: Json | null
          template_name?: string | null
          to_email?: string
          to_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      favorite_properties: {
        Row: {
          created_at: string | null
          current_price: number | null
          id: string
          initial_price: number | null
          price_drop_alert: boolean | null
          property_data: Json
          property_mls: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_price?: number | null
          id?: string
          initial_price?: number | null
          price_drop_alert?: boolean | null
          property_data: Json
          property_mls: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_price?: number | null
          id?: string
          initial_price?: number | null
          price_drop_alert?: boolean | null
          property_data?: Json
          property_mls?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      featured_cities: {
        Row: {
          city_name: string
          created_at: string
          custom_content: Json | null
          description: string | null
          featured: boolean
          hero_image_url: string | null
          id: string
          slug: string
          sort_order: number | null
          state: string
          updated_at: string
        }
        Insert: {
          city_name: string
          created_at?: string
          custom_content?: Json | null
          description?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          slug: string
          sort_order?: number | null
          state: string
          updated_at?: string
        }
        Update: {
          city_name?: string
          created_at?: string
          custom_content?: Json | null
          description?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          slug?: string
          sort_order?: number | null
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      featured_counties: {
        Row: {
          county_name: string
          created_at: string
          custom_content: Json | null
          description: string | null
          featured: boolean
          hero_image_url: string | null
          id: string
          slug: string
          sort_order: number | null
          state: string
          updated_at: string
        }
        Insert: {
          county_name: string
          created_at?: string
          custom_content?: Json | null
          description?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          slug: string
          sort_order?: number | null
          state: string
          updated_at?: string
        }
        Update: {
          county_name?: string
          created_at?: string
          custom_content?: Json | null
          description?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          slug?: string
          sort_order?: number | null
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      featured_neighborhoods: {
        Row: {
          avg_price: number | null
          city: string | null
          county: string | null
          created_at: string
          custom_content: Json | null
          description: string | null
          featured: boolean
          hero_image_url: string | null
          id: string
          name: string
          property_count: number | null
          slug: string
          sort_order: number | null
          state: string
          updated_at: string
          zipcode: string | null
        }
        Insert: {
          avg_price?: number | null
          city?: string | null
          county?: string | null
          created_at?: string
          custom_content?: Json | null
          description?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          name: string
          property_count?: number | null
          slug: string
          sort_order?: number | null
          state?: string
          updated_at?: string
          zipcode?: string | null
        }
        Update: {
          avg_price?: number | null
          city?: string | null
          county?: string | null
          created_at?: string
          custom_content?: Json | null
          description?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          name?: string
          property_count?: number | null
          slug?: string
          sort_order?: number | null
          state?: string
          updated_at?: string
          zipcode?: string | null
        }
        Relationships: []
      }
      featured_zipcodes: {
        Row: {
          avg_price: number | null
          city: string | null
          county: string | null
          created_at: string
          custom_content: Json | null
          description: string | null
          featured: boolean
          id: string
          property_count: number | null
          sort_order: number | null
          state: string
          updated_at: string
          zipcode: string
        }
        Insert: {
          avg_price?: number | null
          city?: string | null
          county?: string | null
          created_at?: string
          custom_content?: Json | null
          description?: string | null
          featured?: boolean
          id?: string
          property_count?: number | null
          sort_order?: number | null
          state?: string
          updated_at?: string
          zipcode: string
        }
        Update: {
          avg_price?: number | null
          city?: string | null
          county?: string | null
          created_at?: string
          custom_content?: Json | null
          description?: string | null
          featured?: boolean
          id?: string
          property_count?: number | null
          sort_order?: number | null
          state?: string
          updated_at?: string
          zipcode?: string
        }
        Relationships: []
      }
      global_site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hidden_properties: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          activity_content: string | null
          activity_type: string
          created_at: string
          created_by: string | null
          id: string
          lead_email: string
          lead_name: string | null
          metadata: Json | null
          new_status: Database["public"]["Enums"]["lead_status"] | null
          old_status: Database["public"]["Enums"]["lead_status"] | null
        }
        Insert: {
          activity_content?: string | null
          activity_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          lead_email: string
          lead_name?: string | null
          metadata?: Json | null
          new_status?: Database["public"]["Enums"]["lead_status"] | null
          old_status?: Database["public"]["Enums"]["lead_status"] | null
        }
        Update: {
          activity_content?: string | null
          activity_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          lead_email?: string
          lead_name?: string | null
          metadata?: Json | null
          new_status?: Database["public"]["Enums"]["lead_status"] | null
          old_status?: Database["public"]["Enums"]["lead_status"] | null
        }
        Relationships: []
      }
      lead_statuses: {
        Row: {
          assigned_agent: string | null
          conversion_date: string | null
          created_at: string
          first_contact_date: string | null
          id: string
          last_contact_date: string | null
          lead_email: string
          lead_name: string | null
          lead_phone: string | null
          notes: string | null
          source: string | null
          source_property_mls: string | null
          status: Database["public"]["Enums"]["lead_status"]
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          assigned_agent?: string | null
          conversion_date?: string | null
          created_at?: string
          first_contact_date?: string | null
          id?: string
          last_contact_date?: string | null
          lead_email: string
          lead_name?: string | null
          lead_phone?: string | null
          notes?: string | null
          source?: string | null
          source_property_mls?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          assigned_agent?: string | null
          conversion_date?: string | null
          created_at?: string
          first_contact_date?: string | null
          id?: string
          last_contact_date?: string | null
          lead_email?: string
          lead_name?: string | null
          lead_phone?: string | null
          notes?: string | null
          source?: string | null
          source_property_mls?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_lead_statuses_agent"
            columns: ["assigned_agent"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_enhancements: {
        Row: {
          created_at: string
          documents: Json | null
          floor_plans: Json | null
          id: string
          office_id: string
          property_mls: string
          updated_at: string
          video_embeds: Json | null
        }
        Insert: {
          created_at?: string
          documents?: Json | null
          floor_plans?: Json | null
          id?: string
          office_id: string
          property_mls: string
          updated_at?: string
          video_embeds?: Json | null
        }
        Update: {
          created_at?: string
          documents?: Json | null
          floor_plans?: Json | null
          id?: string
          office_id?: string
          property_mls?: string
          updated_at?: string
          video_embeds?: Json | null
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          css_classes: string | null
          dropdown_items: Json | null
          icon: string | null
          id: string
          is_visible: boolean
          label: string
          order_index: number
          parent_id: string | null
          position: string
          target: string | null
          type: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          css_classes?: string | null
          dropdown_items?: Json | null
          icon?: string | null
          id?: string
          is_visible?: boolean
          label: string
          order_index?: number
          parent_id?: string | null
          position: string
          target?: string | null
          type: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          css_classes?: string | null
          dropdown_items?: Json | null
          icon?: string | null
          id?: string
          is_visible?: boolean
          label?: string
          order_index?: number
          parent_id?: string | null
          position?: string
          target?: string | null
          type?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhood_subscriptions: {
        Row: {
          city: string
          created_at: string
          id: string
          neighborhood_name: string
          state: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          neighborhood_name: string
          state: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          neighborhood_name?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          channel: string
          content: string
          id: string
          metadata: Json | null
          notification_type: string
          sent_at: string | null
          status: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          channel: string
          content: string
          id?: string
          metadata?: Json | null
          notification_type: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          channel?: string
          content?: string
          id?: string
          metadata?: Json | null
          notification_type?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: []
      }
      open_house_leads: {
        Row: {
          buyer_timeline: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          page_referrer: string | null
          page_url: string | null
          phone: string
          property_address: string
          property_mls: string
          working_with_agent: boolean
        }
        Insert: {
          buyer_timeline: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          page_referrer?: string | null
          page_url?: string | null
          phone: string
          property_address: string
          property_mls: string
          working_with_agent?: boolean
        }
        Update: {
          buyer_timeline?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          page_referrer?: string | null
          page_url?: string | null
          phone?: string
          property_address?: string
          property_mls?: string
          working_with_agent?: boolean
        }
        Relationships: []
      }
      page_search_criteria: {
        Row: {
          agent_id: string | null
          area: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          county: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          latitude: number | null
          longitude: number | null
          max_acres: number | null
          max_lot_size_sqft: number | null
          max_price: number | null
          max_sqft: number | null
          max_year_built: number | null
          min_acres: number | null
          min_bathrooms: number | null
          min_bedrooms: number | null
          min_garage_spaces: number | null
          min_lot_size_sqft: number | null
          min_parking_spaces: number | null
          min_price: number | null
          min_sqft: number | null
          min_year_built: number | null
          name: string
          neighborhood: string | null
          office_id: string | null
          page_id: string | null
          polygon: Json | null
          pool: boolean | null
          property_class: string | null
          property_type: string[] | null
          radius: number | null
          sort_by: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          waterfront: boolean | null
          zip: string | null
        }
        Insert: {
          agent_id?: string | null
          area?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          county?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          max_acres?: number | null
          max_lot_size_sqft?: number | null
          max_price?: number | null
          max_sqft?: number | null
          max_year_built?: number | null
          min_acres?: number | null
          min_bathrooms?: number | null
          min_bedrooms?: number | null
          min_garage_spaces?: number | null
          min_lot_size_sqft?: number | null
          min_parking_spaces?: number | null
          min_price?: number | null
          min_sqft?: number | null
          min_year_built?: number | null
          name: string
          neighborhood?: string | null
          office_id?: string | null
          page_id?: string | null
          polygon?: Json | null
          pool?: boolean | null
          property_class?: string | null
          property_type?: string[] | null
          radius?: number | null
          sort_by?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          waterfront?: boolean | null
          zip?: string | null
        }
        Update: {
          agent_id?: string | null
          area?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          county?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          max_acres?: number | null
          max_lot_size_sqft?: number | null
          max_price?: number | null
          max_sqft?: number | null
          max_year_built?: number | null
          min_acres?: number | null
          min_bathrooms?: number | null
          min_bedrooms?: number | null
          min_garage_spaces?: number | null
          min_lot_size_sqft?: number | null
          min_parking_spaces?: number | null
          min_price?: number | null
          min_sqft?: number | null
          min_year_built?: number | null
          name?: string
          neighborhood?: string | null
          office_id?: string | null
          page_id?: string | null
          polygon?: Json | null
          pool?: boolean | null
          property_class?: string | null
          property_type?: string[] | null
          radius?: number | null
          sort_by?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          waterfront?: boolean | null
          zip?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          page_key: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: Json
          created_at?: string | null
          id?: string
          page_key: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          page_key?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          logo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      property_detail_layout: {
        Row: {
          created_at: string
          default_open: boolean
          display_order: number
          id: string
          is_collapsible: boolean
          is_enabled: boolean
          section_component: string
          section_id: string
          section_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_open?: boolean
          display_order?: number
          id?: string
          is_collapsible?: boolean
          is_enabled?: boolean
          section_component: string
          section_id: string
          section_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_open?: boolean
          display_order?: number
          id?: string
          is_collapsible?: boolean
          is_enabled?: boolean
          section_component?: string
          section_id?: string
          section_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_views: {
        Row: {
          created_at: string
          id: string
          property_address: string | null
          property_mls: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          view_duration_seconds: number | null
          visitor_email: string | null
          visitor_ip: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          property_address?: string | null
          property_mls: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          view_duration_seconds?: number | null
          visitor_email?: string | null
          visitor_ip?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          property_address?: string | null
          property_mls?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          view_duration_seconds?: number | null
          visitor_email?: string | null
          visitor_ip?: string | null
        }
        Relationships: []
      }
      saved_properties: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          is_active: boolean | null
          last_notified_at: string | null
          name: string
          notification_frequency: string | null
          search_criteria: Json
          sms_notifications: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          is_active?: boolean | null
          last_notified_at?: string | null
          name: string
          notification_frequency?: string | null
          search_criteria: Json
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          is_active?: boolean | null
          last_notified_at?: string | null
          name?: string
          notification_frequency?: string | null
          search_criteria?: Json
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      sidebar_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          sections: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          sections?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          sections?: Json
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          agent_id: string | null
          client_name: string
          client_role: string | null
          content: string
          created_at: string
          featured: boolean | null
          id: string
          property_address: string | null
          published: boolean | null
          rating: number | null
          sort_order: number | null
        }
        Insert: {
          agent_id?: string | null
          client_name: string
          client_role?: string | null
          content: string
          created_at?: string
          featured?: boolean | null
          id?: string
          property_address?: string | null
          published?: boolean | null
          rating?: number | null
          sort_order?: number | null
        }
        Update: {
          agent_id?: string | null
          client_name?: string
          client_role?: string | null
          content?: string
          created_at?: string
          featured?: boolean | null
          id?: string
          property_address?: string | null
          published?: boolean | null
          rating?: number | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_requests: {
        Row: {
          comments: string | null
          created_at: string | null
          id: string
          property_address: string
          property_mls: string
          status: string | null
          tour_date: string
          tour_type: string
          updated_at: string | null
          visitor_email: string
          visitor_name: string
          visitor_phone: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          id?: string
          property_address: string
          property_mls: string
          status?: string | null
          tour_date: string
          tour_type: string
          updated_at?: string | null
          visitor_email: string
          visitor_name: string
          visitor_phone?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          id?: string
          property_address?: string
          property_mls?: string
          status?: string | null
          tour_date?: string
          tour_type?: string
          updated_at?: string | null
          visitor_email?: string
          visitor_name?: string
          visitor_phone?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          published: boolean | null
          sort_order: number | null
          thumbnail_url: string | null
          title: string
          video_type: string | null
          video_url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title: string
          video_type?: string | null
          video_url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title?: string
          video_type?: string | null
          video_url?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer" | "agent"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "nurturing"
        | "converted"
        | "lost"
        | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer", "agent"],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "nurturing",
        "converted",
        "lost",
        "archived",
      ],
    },
  },
} as const

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
        Relationships: []
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
      app_role: "admin" | "editor" | "viewer"
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
      app_role: ["admin", "editor", "viewer"],
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

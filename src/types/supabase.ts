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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          branding: Json
          created_at: string
          id: number
          maintenance_mode: boolean
          page_content: Json
          page_images: Json
          promo_banner: Json
          seo_settings: Json
          updated_at: string
        }
        Insert: {
          branding?: Json
          created_at?: string
          id?: number
          maintenance_mode?: boolean
          page_content?: Json
          page_images?: Json
          promo_banner?: Json
          seo_settings?: Json
          updated_at?: string
        }
        Update: {
          branding?: Json
          created_at?: string
          id?: number
          maintenance_mode?: boolean
          page_content?: Json
          page_images?: Json
          promo_banner?: Json
          seo_settings?: Json
          updated_at?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          id: string
          is_active: boolean
          stripe_coupon_id: string | null
          stripe_promotion_code_id: string | null
          updated_at: string
          usage_limit: number | null
          used_count: number
          valid_from: string
          valid_until: string | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          id?: string
          is_active?: boolean
          stripe_coupon_id?: string | null
          stripe_promotion_code_id?: string | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          valid_from?: string
          valid_until?: string | null
          value?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          id?: string
          is_active?: boolean
          stripe_coupon_id?: string | null
          stripe_promotion_code_id?: string | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          valid_from?: string
          valid_until?: string | null
          value?: number
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          created_at: string
          id: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          body_html?: string
          created_at?: string
          id?: string
          name: string
          subject?: string
          updated_at?: string
        }
        Update: {
          body_html?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      material_score_cache: {
        Row: {
          created_at: string
          diagnosis_result: string | null
          id: string
          material_key: string
          original_material: string
          sustainability_score: number
        }
        Insert: {
          created_at?: string
          diagnosis_result?: string | null
          id?: string
          material_key: string
          original_material: string
          sustainability_score: number
        }
        Update: {
          created_at?: string
          diagnosis_result?: string | null
          id?: string
          material_key?: string
          original_material?: string
          sustainability_score?: number
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_at_purchase: number
          product_id: string | null
          quantity: number
          selected_size: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_at_purchase: number
          product_id?: string | null
          quantity?: number
          selected_size: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_at_purchase?: number
          product_id?: string | null
          quantity?: number
          selected_size?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          causale: string | null
          created_at: string
          guest_email: string | null
          id: string
          legacy_stripe_session_id: string | null
          metadata: Json | null
          payment_id: string | null
          payment_method: string | null
          return_label_url: string | null
          return_status: string | null
          shipping_address: Json | null
          shippo_label_url: string | null
          shippo_rate_id: string | null
          shippo_shipment_id: string | null
          status: string
          total_amount: number
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          causale?: string | null
          created_at?: string
          guest_email?: string | null
          id?: string
          legacy_stripe_session_id?: string | null
          metadata?: Json | null
          payment_id?: string | null
          payment_method?: string | null
          return_label_url?: string | null
          return_status?: string | null
          shipping_address?: Json | null
          shippo_label_url?: string | null
          shippo_rate_id?: string | null
          shippo_shipment_id?: string | null
          status?: string
          total_amount?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          causale?: string | null
          created_at?: string
          guest_email?: string | null
          id?: string
          legacy_stripe_session_id?: string | null
          metadata?: Json | null
          payment_id?: string | null
          payment_method?: string | null
          return_label_url?: string | null
          return_status?: string | null
          shipping_address?: Json | null
          shippo_label_url?: string | null
          shippo_rate_id?: string | null
          shippo_shipment_id?: string | null
          status?: string
          total_amount?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          collection_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          fabric_details: string | null
          id: string
          images: string[]
          is_active: boolean
          is_new_arrival: boolean
          name: string
          price: number
          sale_price: number | null
          shipping_info: string | null
          sizes: string[] | null
          status: string
          stock: number
          stripe_payment_link: string | null
        }
        Insert: {
          category: string
          collection_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          fabric_details?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          is_new_arrival?: boolean
          name: string
          price: number
          sale_price?: number | null
          shipping_info?: string | null
          sizes?: string[] | null
          status?: string
          stock?: number
          stripe_payment_link?: string | null
        }
        Update: {
          category?: string
          collection_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          fabric_details?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          is_new_arrival?: boolean
          name?: string
          price?: number
          sale_price?: number | null
          shipping_info?: string | null
          sizes?: string[] | null
          status?: string
          stock?: number
          stripe_payment_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          newsletter_opt_in: boolean
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          newsletter_opt_in?: boolean
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          newsletter_opt_in?: boolean
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_name: string
          id: string
          is_approved: boolean
          product_id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_name: string
          id?: string
          is_approved?: boolean
          product_id: string
          rating: number
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          is_approved?: boolean
          product_id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      scanner_requests: {
        Row: {
          brand: string | null
          created_at: string
          diagnosis_result: Json | null
          garment_type: string | null
          id: string
          image_url: string | null
          input_type: string
          material: string | null
          sustainability_score: number | null
          text_content: string | null
          user_id: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string
          diagnosis_result?: Json | null
          garment_type?: string | null
          id?: string
          image_url?: string | null
          input_type?: string
          material?: string | null
          sustainability_score?: number | null
          text_content?: string | null
          user_id?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string
          diagnosis_result?: Json | null
          garment_type?: string | null
          id?: string
          image_url?: string | null
          input_type?: string
          material?: string | null
          sustainability_score?: number | null
          text_content?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_analytics: {
        Row: {
          created_at: string
          event_type: string | null
          id: string
          page_path: string
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          event_type?: string | null
          id?: string
          page_path: string
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string | null
          id?: string
          page_path?: string
          visitor_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          name: string | null
          phone: string | null
          source: string | null
          status: string | null
          token: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          token?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          token?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const

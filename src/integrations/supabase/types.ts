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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      funding_campaigns: {
        Row: {
          cover_url: string | null
          created_at: string
          deadline: string | null
          description: string | null
          goal_amount: number
          group_id: string
          id: string
          production_id: string | null
          purpose: string | null
          raised_amount: number
          status: Database["public"]["Enums"]["campaign_status"]
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          goal_amount?: number
          group_id: string
          id?: string
          production_id?: string | null
          purpose?: string | null
          raised_amount?: number
          status?: Database["public"]["Enums"]["campaign_status"]
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          goal_amount?: number
          group_id?: string
          id?: string
          production_id?: string | null
          purpose?: string | null
          raised_amount?: number
          status?: Database["public"]["Enums"]["campaign_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funding_campaigns_production_id_fkey"
            columns: ["production_id"]
            isOneToOne: false
            referencedRelation: "productions"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_contributions: {
        Row: {
          amount: number
          campaign_id: string
          created_at: string
          id: string
          is_anonymous: boolean
          message: string | null
          user_id: string
        }
        Insert: {
          amount: number
          campaign_id: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          campaign_id?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "funding_contributions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "funding_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      productions: {
        Row: {
          archive_price: number | null
          cast_list: Json | null
          created_at: string
          crew_list: Json | null
          description: string | null
          duration_min: number | null
          genre: string | null
          group_id: string
          id: string
          is_published: boolean
          language: string | null
          livestream_price: number | null
          max_seats: number | null
          poster_url: string | null
          seats_sold: number
          show_date: string | null
          show_time: string | null
          slug: string
          status: Database["public"]["Enums"]["production_status"]
          ticket_price: number | null
          title: string
          updated_at: string
          venue: string | null
          youtube_url: string | null
        }
        Insert: {
          archive_price?: number | null
          cast_list?: Json | null
          created_at?: string
          crew_list?: Json | null
          description?: string | null
          duration_min?: number | null
          genre?: string | null
          group_id: string
          id?: string
          is_published?: boolean
          language?: string | null
          livestream_price?: number | null
          max_seats?: number | null
          poster_url?: string | null
          seats_sold?: number
          show_date?: string | null
          show_time?: string | null
          slug: string
          status?: Database["public"]["Enums"]["production_status"]
          ticket_price?: number | null
          title: string
          updated_at?: string
          venue?: string | null
          youtube_url?: string | null
        }
        Update: {
          archive_price?: number | null
          cast_list?: Json | null
          created_at?: string
          crew_list?: Json | null
          description?: string | null
          duration_min?: number | null
          genre?: string | null
          group_id?: string
          id?: string
          is_published?: boolean
          language?: string | null
          livestream_price?: number | null
          max_seats?: number | null
          poster_url?: string | null
          seats_sold?: number
          show_date?: string | null
          show_time?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["production_status"]
          ticket_price?: number | null
          title?: string
          updated_at?: string
          venue?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          organization_name: string | null
          organization_type:
            | Database["public"]["Enums"]["organization_type"]
            | null
          phone: string | null
          primary_role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["account_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          organization_name?: string | null
          organization_type?:
            | Database["public"]["Enums"]["organization_type"]
            | null
          phone?: string | null
          primary_role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          organization_name?: string | null
          organization_type?:
            | Database["public"]["Enums"]["organization_type"]
            | null
          phone?: string | null
          primary_role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
        }
        Relationships: []
      }
      review_replies: {
        Row: {
          comment: string
          created_at: string
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          target_id: string
          target_type: Database["public"]["Enums"]["review_target"]
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          target_id: string
          target_type: Database["public"]["Enums"]["review_target"]
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          target_id?: string
          target_type?: Database["public"]["Enums"]["review_target"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          booking_code: string
          created_at: string
          id: string
          production_id: string
          seat_count: number
          status: Database["public"]["Enums"]["ticket_status"]
          total_price: number
          unit_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_code: string
          created_at?: string
          id?: string
          production_id: string
          seat_count?: number
          status?: Database["public"]["Enums"]["ticket_status"]
          total_price?: number
          unit_price?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_code?: string
          created_at?: string
          id?: string
          production_id?: string
          seat_count?: number
          status?: Database["public"]["Enums"]["ticket_status"]
          total_price?: number
          unit_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_production_id_fkey"
            columns: ["production_id"]
            isOneToOne: false
            referencedRelation: "productions"
            referencedColumns: ["id"]
          },
        ]
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
      account_status: "active" | "pending" | "suspended"
      app_role:
        | "admin"
        | "theatre_group"
        | "theatre_artist"
        | "audience"
        | "organization"
      campaign_status: "active" | "completed" | "closed"
      notification_type:
        | "application"
        | "approval"
        | "booking"
        | "funding"
        | "meetup"
        | "training"
        | "collaboration"
        | "sponsorship"
        | "review"
        | "system"
      organization_type:
        | "corporate"
        | "university"
        | "tourism_board"
        | "film_ott"
      production_status:
        | "draft"
        | "upcoming"
        | "live"
        | "completed"
        | "archived"
        | "cancelled"
      review_target: "production" | "group" | "training"
      ticket_status: "confirmed" | "cancelled" | "used"
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
      account_status: ["active", "pending", "suspended"],
      app_role: [
        "admin",
        "theatre_group",
        "theatre_artist",
        "audience",
        "organization",
      ],
      campaign_status: ["active", "completed", "closed"],
      notification_type: [
        "application",
        "approval",
        "booking",
        "funding",
        "meetup",
        "training",
        "collaboration",
        "sponsorship",
        "review",
        "system",
      ],
      organization_type: [
        "corporate",
        "university",
        "tourism_board",
        "film_ott",
      ],
      production_status: [
        "draft",
        "upcoming",
        "live",
        "completed",
        "archived",
        "cancelled",
      ],
      review_target: ["production", "group", "training"],
      ticket_status: ["confirmed", "cancelled", "used"],
    },
  },
} as const

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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      calls: {
        Row: {
          callee_id: string
          caller_id: string
          created_at: string
          ended_at: string | null
          id: string
          status: string
        }
        Insert: {
          callee_id: string
          caller_id: string
          created_at?: string
          ended_at?: string | null
          id?: string
          status?: string
        }
        Update: {
          callee_id?: string
          caller_id?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          status?: string
        }
        Relationships: []
      }
      collaborations: {
        Row: {
          collaborator_id: string
          created_at: string
          end_date: string | null
          id: string
          requester_id: string
          start_date: string | null
          status: string
          terms: string[] | null
          updated_at: string
        }
        Insert: {
          collaborator_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          requester_id: string
          start_date?: string | null
          status: string
          terms?: string[] | null
          updated_at?: string
        }
        Update: {
          collaborator_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          requester_id?: string
          start_date?: string | null
          status?: string
          terms?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          participant_1_id: string
          participant_2_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_1_id: string
          participant_2_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_1_id?: string
          participant_2_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_center_comments: {
        Row: {
          comment: string
          created_at: string
          file_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          file_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          file_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_center_comments_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "data_center_files"
            referencedColumns: ["id"]
          },
        ]
      }
      data_center_files: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          name: string
          updated_at: string
          uploader_id: string
          views: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          name: string
          updated_at?: string
          uploader_id: string
          views?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          name?: string
          updated_at?: string
          uploader_id?: string
          views?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          career_description: string | null
          collaboration_count: number | null
          college: string | null
          country: string | null
          created_at: string
          department: string | null
          email: string | null
          experience: string | null
          favorite: string[] | null
          first_name: string | null
          gender: string | null
          google_scholar_url: string | null
          highest_degree: string | null
          id: string
          institution: string | null
          is_online: boolean | null
          keywords: string[] | null
          last_name: string | null
          last_seen: string | null
          linkedin_url: string | null
          phone: string | null
          postcode: string | null
          primary_research_area: string | null
          rating: number | null
          research_roles: string[] | null
          researchgate_url: string | null
          secondary_research_area: string | null
          specialization_keywords: string[] | null
          state_city: string | null
          updated_at: string
          user_id_number: string | null
          username: string | null
          what_i_have: string[] | null
          what_i_need: string[] | null
        }
        Insert: {
          avatar_url?: string | null
          career_description?: string | null
          collaboration_count?: number | null
          college?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          experience?: string | null
          favorite?: string[] | null
          first_name?: string | null
          gender?: string | null
          google_scholar_url?: string | null
          highest_degree?: string | null
          id: string
          institution?: string | null
          is_online?: boolean | null
          keywords?: string[] | null
          last_name?: string | null
          last_seen?: string | null
          linkedin_url?: string | null
          phone?: string | null
          postcode?: string | null
          primary_research_area?: string | null
          rating?: number | null
          research_roles?: string[] | null
          researchgate_url?: string | null
          secondary_research_area?: string | null
          specialization_keywords?: string[] | null
          state_city?: string | null
          updated_at?: string
          user_id_number?: string | null
          username?: string | null
          what_i_have?: string[] | null
          what_i_need?: string[] | null
        }
        Update: {
          avatar_url?: string | null
          career_description?: string | null
          collaboration_count?: number | null
          college?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          experience?: string | null
          favorite?: string[] | null
          first_name?: string | null
          gender?: string | null
          google_scholar_url?: string | null
          highest_degree?: string | null
          id?: string
          institution?: string | null
          is_online?: boolean | null
          keywords?: string[] | null
          last_name?: string | null
          last_seen?: string | null
          linkedin_url?: string | null
          phone?: string | null
          postcode?: string | null
          primary_research_area?: string | null
          rating?: number | null
          research_roles?: string[] | null
          researchgate_url?: string | null
          secondary_research_area?: string | null
          specialization_keywords?: string[] | null
          state_city?: string | null
          updated_at?: string
          user_id_number?: string | null
          username?: string | null
          what_i_have?: string[] | null
          what_i_need?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_match_score: {
        Args: { user1_id: string; user2_id: string }
        Returns: number
      }
      increment_file_views: {
        Args: { file_id: string }
        Returns: undefined
      }
      mark_user_offline: {
        Args: { user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

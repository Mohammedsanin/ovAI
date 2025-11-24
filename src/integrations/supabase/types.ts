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
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          created_at: string
          doctor_name: string | null
          id: string
          notes: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          created_at?: string
          doctor_name?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          created_at?: string
          doctor_name?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cravings: {
        Row: {
          craving_item: string
          created_at: string
          date: string
          id: string
          user_id: string
        }
        Insert: {
          craving_item: string
          created_at?: string
          date?: string
          id?: string
          user_id: string
        }
        Update: {
          craving_item?: string
          created_at?: string
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      cycle_entries: {
        Row: {
          created_at: string
          cycle_day: number
          id: string
          period_end: string | null
          period_start: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          cycle_day: number
          id?: string
          period_end?: string | null
          period_start?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          cycle_day?: number
          id?: string
          period_end?: string | null
          period_start?: string | null
          user_id?: string
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string
          discussion_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          discussion_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          discussion_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          content: string
          created_at: string
          doctor_response: string | null
          group_name: string | null
          id: string
          is_answered: boolean | null
          likes: number | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          doctor_response?: string | null
          group_name?: string | null
          id?: string
          is_answered?: boolean | null
          likes?: number | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          doctor_response?: string | null
          group_name?: string | null
          id?: string
          is_answered?: boolean | null
          likes?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          date: string
          id: string
          mood: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          date?: string
          id?: string
          mood?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          date?: string
          id?: string
          mood?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number | null
          created_at: string
          date: string
          id: string
          meal_name: string
          meal_type: string
          protein: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          created_at?: string
          date?: string
          id?: string
          meal_name: string
          meal_type: string
          protein?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          created_at?: string
          date?: string
          id?: string
          meal_name?: string
          meal_type?: string
          protein?: number | null
          user_id?: string
        }
        Relationships: []
      }
      medications: {
        Row: {
          active: boolean | null
          created_at: string
          dosage: string | null
          frequency: string | null
          id: string
          medication_name: string
          start_date: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          dosage?: string | null
          frequency?: string | null
          id?: string
          medication_name: string
          start_date?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          dosage?: string | null
          frequency?: string | null
          id?: string
          medication_name?: string
          start_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          created_at: string
          date: string
          energy_level: string | null
          id: string
          mood: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          energy_level?: string | null
          id?: string
          mood: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          energy_level?: string | null
          id?: string
          mood?: string
          user_id?: string
        }
        Relationships: []
      }
      period_symptoms: {
        Row: {
          created_at: string
          date: string
          id: string
          notes: string | null
          severity: number | null
          symptom_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          severity?: number | null
          symptom_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          severity?: number | null
          symptom_type?: string
          user_id?: string
        }
        Relationships: []
      }
      pregnancy_data: {
        Row: {
          created_at: string
          current_week: number | null
          due_date: string | null
          id: string
          kick_count: number | null
          last_updated: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_week?: number | null
          due_date?: string | null
          id?: string
          kick_count?: number | null
          last_updated?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_week?: number | null
          due_date?: string | null
          id?: string
          kick_count?: number | null
          last_updated?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          specialty: string | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          specialty?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          specialty?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
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
          role?: Database["public"]["Enums"]["app_role"]
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
      water_intake: {
        Row: {
          created_at: string
          cups_consumed: number
          date: string
          id: string
          target_cups: number
          user_id: string
        }
        Insert: {
          created_at?: string
          cups_consumed?: number
          date?: string
          id?: string
          target_cups?: number
          user_id: string
        }
        Update: {
          created_at?: string
          cups_consumed?: number
          date?: string
          id?: string
          target_cups?: number
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          calories_burned: number | null
          created_at: string
          date: string
          duration: number
          id: string
          intensity: string | null
          user_id: string
          workout_name: string
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string
          date?: string
          duration: number
          id?: string
          intensity?: string | null
          user_id: string
          workout_name: string
        }
        Update: {
          calories_burned?: number | null
          created_at?: string
          date?: string
          duration?: number
          id?: string
          intensity?: string | null
          user_id?: string
          workout_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "doctor" | "user"
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
      app_role: ["admin", "doctor", "user"],
    },
  },
} as const

import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallback values for development
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if both values are present
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Database = {
  public: {
    Tables: {
      imported_files: {
        Row: {
          id: string;
          name: string;
          type: string;
          size: string;
          uri: string;
          date_imported: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          size: string;
          uri: string;
          date_imported: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          size?: string;
          uri?: string;
          date_imported?: string;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
};
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pwnhbpdxyszhibliyyqh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bmhicGR4eXN6aGlibGl5eXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDAzNjQsImV4cCI6MjA2NzYxNjM2NH0.DjLWAQHJ_nRoBzMMyXKzr8inKV-M_ZcCI_XEYaB8vJk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
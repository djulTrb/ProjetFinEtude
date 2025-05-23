import { createClient } from "@supabase/supabase-js";

// Replace these with your Supabase project URL and anon key
const supabaseUrl = "https://your-supabase-project-url.supabase.co";
const supabaseAnonKey = "your-supabase-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

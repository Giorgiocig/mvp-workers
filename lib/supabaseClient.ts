// ONLY FRONTEND (cookie-based, compatible with Server Components)
import { createBrowserClient } from "@supabase/ssr";

const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createBrowserSupabaseClient() {
  return createBrowserClient(publicSupabaseUrl, publicSupabaseAnonKey);
}

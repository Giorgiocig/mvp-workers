"use server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { User } from "./auth";

export async function getAllWorkers(): Promise<User[]> {
  const supabase = await createSupabaseServerClient();

  const { data: workers } = await supabase
    .from("users")
    .select("id, name, role")
    .eq("role", "worker")
    .order("name");

  return (workers as User[]) || [];
}

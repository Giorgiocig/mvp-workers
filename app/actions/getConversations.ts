
"use server"

import { Conversation } from "@/lib/utilities/interfaces";
import { requireAuth } from "./requireAuth";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function getConversations(): Promise<Conversation[]> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }

  return data as Conversation[];
}
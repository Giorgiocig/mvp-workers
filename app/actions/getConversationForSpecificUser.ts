"use server"
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Conversation } from "@/lib/utilities/interfaces";
import { requireAuth } from "./requireAuth";

export async function getWorkerConversations(
  workerId: string,
): Promise<Conversation[]> {
  await requireAuth(); 
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", workerId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching worker conversations:", error);
    return [];
  }

  return data as Conversation[];
}
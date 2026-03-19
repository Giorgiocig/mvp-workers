"use server"
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Conversation } from "@/lib/utilities/interfaces";
import { requireAuth } from "./requireAuth";

export async function getConversation(
  conversationId: string,
): Promise<Conversation | null> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }

  return data as Conversation;
}

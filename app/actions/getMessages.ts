"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { requireAuth } from "./requireAuth";
import { Message } from "@/lib/utilities/interfaces";

export async function getMessages(conversationId: string): Promise<Message[]> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  // Verify user owns this conversation
  const { data: conversation } = await supabase
    .from("conversations")
    .select("user_id")
    .eq("id", conversationId)
    .single();

  if (!conversation || conversation.user_id !== user.id) {
    // Manager can view all conversations
    if (user.role !== "manager") {
      return [];
    }
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data as Message[];
}
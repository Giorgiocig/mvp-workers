"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { requireAuth } from "./requireAuth";

export async function clearMessages(
  conversationId: string,
): Promise<{ success: boolean; error?: string }> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  // Verify user owns this conversation
  const { data: conversation } = await supabase
    .from("conversations")
    .select("user_id")
    .eq("id", conversationId)
    .single();

  if (!conversation || conversation.user_id !== user.id) {
    return { success: false, error: "Conversazione non trovata" };
  }

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("conversation_id", conversationId);

  if (error) {
    console.error("Error clearing messages:", error);
    return { success: false, error: "Errore durante la cancellazione" };
  }

  return { success: true };
}
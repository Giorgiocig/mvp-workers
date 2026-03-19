"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { requireAuth } from "./requireAuth";
import { Message } from "@/lib/utilities/interfaces";

export async function addMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
): Promise<{ success: boolean; message?: Message; error?: string }> {
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

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding message:", error);
    return { success: false, error: "Errore durante l'invio del messaggio" };
  }

  // Update conversation updated_at
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return { success: true, message: data as Message };
}
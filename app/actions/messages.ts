"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { requireAuth } from "./requireAuth";

export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

/**
 * Get all messages for a conversation
 */
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

/**
 * Add a message to a conversation
 */
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

/**
 * Delete all messages in a conversation (for reset)
 */
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

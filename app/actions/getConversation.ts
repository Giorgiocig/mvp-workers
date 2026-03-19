"use server"
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Conversation } from "@/lib/utilities/interfaces";
import { requireAuth } from "./requireAuth";
import { conversationRepository } from "@/lib/repositories/conversationRepository";

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  const user = await requireAuth();
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation || conversation.user_id !== user.id) return null;
  return conversation;
}

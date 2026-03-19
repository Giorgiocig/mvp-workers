"use server";

import { requireAuth } from "./requireAuth";
import { conversationRepository } from "@/lib/repositories/conversationRepository";
import { messageRepository } from "@/lib/repositories/messageRepository";

export async function clearMessages(conversationId: string) {
  const user = await requireAuth();

  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation || conversation.user_id !== user.id) {
    return { success: false, error: "Conversazione non trovata" };
  }

  try {
    await messageRepository.deleteByConversationId(conversationId);
    return { success: true };
  } catch (e) {
    return { success: false, error: "Errore durante la cancellazione" };
  }
}
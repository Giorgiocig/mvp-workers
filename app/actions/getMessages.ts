"use server";

import { requireAuth } from "./requireAuth";
import { conversationRepository } from "@/lib/repositories/conversationRepository";
import { messageRepository } from "@/lib/repositories/messageRepository";

export async function getMessages(conversationId: string) {
  const user = await requireAuth();

  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation) return [];
  if (conversation.user_id !== user.id && user.role !== "manager") return [];

  return messageRepository.findByConversationId(conversationId);
}
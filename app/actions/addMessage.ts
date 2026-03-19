"use server";

import { requireAuth } from "./requireAuth";
import { Message } from "@/lib/utilities/interfaces";
import { conversationRepository } from "@/lib/repositories/conversationRepository";
import { messageRepository } from "@/lib/repositories/messageRepository";

export async function addMessage(
  conversationId: string,
  role: "user" | "assistant",
  parts: any[]
): Promise<{ success: boolean; message?: Message; error?: string }> {
  const user = await requireAuth();

  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation || conversation.user_id !== user.id) {
    return { success: false, error: "Conversation not found" };
  }

  try {
    const message = await messageRepository.create(conversationId, role, parts);
    return { success: true, message };
  } catch (e) {
    return { success: false, error: "Error while sending the message" };
  }
}
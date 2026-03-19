"use server"

import { conversationRepository } from "@/lib/repositories/conversationRepository";
import { requireAuth } from "./requireAuth";


export async function getWorkerConversations(workerId: string) {
  await requireAuth();
  return conversationRepository.findByUserId(workerId);
}

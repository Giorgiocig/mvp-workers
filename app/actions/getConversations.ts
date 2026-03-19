
"use server"

import { Conversation } from "@/lib/utilities/interfaces";
import { requireAuth } from "./requireAuth";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { conversationRepository } from "@/lib/repositories/conversationRepository";

export async function getConversations() {
  const user = await requireAuth();
  return conversationRepository.findByUserId(user.id);
}

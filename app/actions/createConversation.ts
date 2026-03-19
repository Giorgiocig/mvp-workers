"use server"
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { requireAuth } from "./requireAuth";
import { revalidatePath } from "next/cache";
import { conversationRepository } from "@/lib/repositories/conversationRepository";

export async function createConversation(title = "Nuova Conversazione") {
  const user = await requireAuth();
  try {
    const conversation = await conversationRepository.create(user.id, title);
    revalidatePath(`/worker/${user.id}`);
    return { success: true, conversationId: conversation.id };
  } catch (e) {
    return { success: false, error: "Errore durante la creazione" };
  }
}
"use server"
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { requireAuth } from "./requireAuth";
import { conversationRepository } from "@/lib/repositories/conversationRepository";

export async function updateConversationTitle(id: string, title: string) {
  const user = await requireAuth();
  try {
    await conversationRepository.updateTitle(id, title);
    revalidatePath(`/worker/${user.id}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: "Error while updating the title" };
  }
}
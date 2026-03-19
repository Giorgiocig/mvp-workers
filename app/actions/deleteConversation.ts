"use server"
import { requireAuth } from "./requireAuth";
import { revalidatePath } from "next/cache";
import { conversationRepository } from "@/lib/repositories/conversationRepository";

export async function deleteConversation(id: string) {
  const user = await requireAuth();
  try {
    await conversationRepository.delete(id);
    revalidatePath(`/worker/${user.id}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: "Error while deleting the conversation" };
  }
}
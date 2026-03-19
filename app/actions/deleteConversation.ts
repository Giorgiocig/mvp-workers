"use server"
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { requireAuth } from "./requireAuth";
import { revalidatePath } from "next/cache";
export async function deleteConversation(
  conversationId: string,
): Promise<{ success: boolean; error?: string }> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting conversation:", error);
    return { success: false, error: "Errore durante l'eliminazione" };
  }

  revalidatePath(`/worker/${user.id}`);

  return { success: true };
}
"use server"
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { requireAuth } from "./requireAuth";

export async function updateConversationTitle(
  conversationId: string,
  title: string,
): Promise<{ success: boolean; error?: string }> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating conversation:", error);
    return { success: false, error: "Errore durante l'aggiornamento" };
  }

  revalidatePath(`/worker/${user.id}`);

  return { success: true };
}
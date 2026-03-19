"use server"
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { requireAuth } from "./requireAuth";
import { revalidatePath } from "next/cache";

export async function createConversation(
  title?: string,
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      title: title || "Nuova Conversazione",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    return {
      success: false,
      error: "Errore durante la creazione della conversazione",
    };
  }

  revalidatePath(`/worker/${user.id}`);

  return { success: true, conversationId: data.id };
}
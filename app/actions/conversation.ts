"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

import { revalidatePath } from "next/cache";
import { requireAuth } from "./requireAuth";
import { Conversation } from "@/lib/utilities/interfaces";


/**
 * Get all conversations for current user
 */
/* export async function getConversations(): Promise<Conversation[]> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }

  return data as Conversation[];
} */

/**
 * Get a single conversation by ID
 */
/* export async function getConversation(
  conversationId: string,
): Promise<Conversation | null> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }

  return data as Conversation;
} */

/**
 * Create a new conversation
 */
/* export async function createConversation(
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
} */

/**
 * Update conversation title
 */
/* export async function updateConversationTitle(
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
} */

/**
 * Delete a conversation
 */
/* export async function deleteConversation(
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
} */

/**
 * Get all conversations for a specific worker (for manager view)
 */
/* export async function getWorkerConversations(
  workerId: string,
): Promise<Conversation[]> {
  await requireAuth(); // Manager auth check will be in the page component
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", workerId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching worker conversations:", error);
    return [];
  }

  return data as Conversation[];
} */

/**
 * Get all workers (for manager view)
 */
/* export async function getWorkers(): Promise<{ id: string; name: string }[]> {
  const user = await requireAuth();
  if (user.role !== "manager") return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name")
    .eq("role", "worker");

  if (error) {
    console.error("Error fetching workers:", error);
    return [];
  }

  return data;
} */

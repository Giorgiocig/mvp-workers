import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Message } from "../utilities/interfaces";


export const messageRepository = {
  async findByConversationId(conversationId: string): Promise<Message[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data as Message[];
  },

  async create(
    conversationId: string,
    role: "user" | "assistant",
    parts: any[]
  ): Promise<Message> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, role, parts })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Message;
  },

  async deleteByConversationId(conversationId: string): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("conversation_id", conversationId);

    if (error) throw new Error(error.message);
  },
};
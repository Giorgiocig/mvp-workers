import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Conversation } from "../utilities/interfaces";


export const conversationRepository = {
  async findByUserId(userId: string): Promise<Conversation[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Conversation[];
  },

  async findById(id: string): Promise<Conversation | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data as Conversation;
  },

  async create(userId: string, title: string): Promise<Conversation> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: userId, title })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Conversation;
  },

  async updateTitle(id: string, title: string): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("conversations")
      .update({ title })
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  async delete(id: string): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  },
};
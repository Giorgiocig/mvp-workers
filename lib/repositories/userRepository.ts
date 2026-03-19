import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { User } from "../utilities/interfaces";


export const userRepository = {
  async findById(id: string): Promise<User | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("id", id)
      .single();

    if (error) return null;
    return data as User;
  },

  async findAllWorkers(): Promise<User[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("role", "worker");

    if (error) throw new Error(error.message);
    return data as User[];
  },

  async findByName(name: string): Promise<User | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("name", name)
      .eq("role", "worker")
      .single();
  
    if (error) return null;
    return data as User;
  },
};
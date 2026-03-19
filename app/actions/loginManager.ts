"use server";
import { userRepository } from "@/lib/repositories/userRepository";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function loginManager(password: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: "admin@admin.com",
    password,
  });

  if (error) {
    return { success: false, error: "Invalid password" };
  }
  const userData=await userRepository.findById(data.user.id)

  if (!userData || userData.role !== "manager") {
    await supabase.auth.signOut();
    return { success: false, error: "User not authorized" };
  }

  return { success: true };
}

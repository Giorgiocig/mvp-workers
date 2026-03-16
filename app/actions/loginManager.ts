"use server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function loginManager(password: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: "admin@admin.com",
    password,
  });

  if (error) {
    return { success: false, error: "Password non valida" };
  }

  // Get user role from database
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (!userData || userData.role !== "manager") {
    await supabase.auth.signOut();
    return { success: false, error: "Utente non autorizzato" };
  }

  return { success: true };
}

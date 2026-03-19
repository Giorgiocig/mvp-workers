"use server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createSupabaseServerClient();
  const cookieStore = await cookies();

  // Clear worker session cookie
  cookieStore.delete("user_session");

  // Sign out from Supabase Auth (for manager)
  await supabase.auth.signOut();

  redirect("/login");
}

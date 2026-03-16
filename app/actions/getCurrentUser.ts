"use server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";
import { User } from "./auth";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const cookieStore = await cookies();

  // Check worker session first
  const workerSession = cookieStore.get("user_session")?.value;
  if (workerSession) {
    try {
      const session = JSON.parse(workerSession);
      console.log("[DEBUG] Worker session found:", session);

      // Validate session has required fields
      if (session.userId && session.name && session.role) {
        return {
          id: session.userId,
          name: session.name,
          role: session.role,
        } as User;
      }
    } catch (error) {
      console.error("[DEBUG] Failed to parse worker session:", error);
    }
  }

  // Check Supabase Auth (for manager)
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) {
    console.log("[DEBUG] No auth user found");
    return null;
  }

  console.log("[DEBUG] Auth user found:", authUser.id);

  const { data: user } = await supabase
    .from("users")
    .select("id, name, role")
    .eq("id", authUser.id)
    .single();

  console.log("[DEBUG] User from DB:", user);

  return user as User | null;
}

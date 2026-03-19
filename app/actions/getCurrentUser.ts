"use server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { User } from "@/lib/utilities/interfaces";
import { cookies } from "next/headers";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const cookieStore = await cookies();

  // Check worker session first
  const workerSession = cookieStore.get("user_session")?.value;
  if (workerSession) {
    try {
      const session = JSON.parse(workerSession)
      // Validate session has required fields
      if (session.userId && session.name && session.role) {
        return {
          id: session.userId,
          name: session.name,
          role: session.role,
        } as User;
      }
    } catch (error) {
      console.error("Failed to parse worker session:", error);
    }
  }

  // Check Supabase Auth (for manager)
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) {
    return null;
  }

  const { data: user } = await supabase
    .from("users")
    .select("id, name, role")
    .eq("id", authUser.id)
    .single();

  return user as User | null;
}

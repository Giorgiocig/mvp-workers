"use server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

export async function loginWorker(name: string) {
  const supabase = await createSupabaseServerClient();

  // Fetch worker from database
  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, role")
    .eq("name", name)
    .eq("role", "worker")
    .single();

  if (error || !user) {
    return { success: false, error: "Worker non trovato" };
  }

  // Store session in cookie (simple session management)
  const cookieStore = await cookies();
  const sessionData = {
    userId: user.id,
    name: user.name,
    role: user.role,
  };

  cookieStore.set("user_session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  return { success: true, workerId: user.id };
}

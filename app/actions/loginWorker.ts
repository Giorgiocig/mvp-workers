"use server";

import { userRepository } from "@/lib/repositories/userRepository";
import { cookies } from "next/headers";

export async function loginWorker(name: string) {
  const user = await userRepository.findByName(name);

  if (!user) {
    return { success: false, error: "Worker non trovato" };
  }

  const cookieStore = await cookies();
  cookieStore.set("user_session", JSON.stringify({
    userId: user.id,
    name: user.name,
    role: user.role,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return { success: true, workerId: user.id };
}
"use server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./getCurrentUser";
import { User } from "./auth";

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

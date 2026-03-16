"use server";
import { requireAuth } from "./requireAuth";
import { User } from "./auth";
import { redirect } from "next/navigation";

export async function requireManager(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "manager") {
    redirect("/worker");
  }
  return user;
}

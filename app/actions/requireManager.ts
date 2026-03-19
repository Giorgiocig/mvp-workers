"use server";

import { User } from "@/lib/utilities/interfaces";
import { requireAuth } from "./requireAuth";

import { redirect } from "next/navigation";

export async function requireManager(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "manager") {
    redirect("/worker");
  }
  return user;
}

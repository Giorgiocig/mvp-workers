"use server";
import { getCurrentUser } from "./getCurrentUser";

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

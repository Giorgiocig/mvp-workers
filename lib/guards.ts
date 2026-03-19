import { requireAuth } from "@/app/actions/requireAuth";
import { redirect } from "next/navigation";

export async function requireManager() {
  const user = await requireAuth();
  if (user.role !== "manager") redirect(`/worker/${user.id}`);
  return user;
}

export async function requireWorker() {
  const user = await requireAuth();
  if (user.role === "manager") redirect("/manager");
  return user;
}
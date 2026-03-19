import { requireAuth } from "@/app/actions/requireAuth";
import { redirect } from "next/navigation";
import ManagerDashboard from "@/app/components/ManagerDashboard";

export default async function ManagerPage() {
  const user = await requireAuth();
  if (user.role !== "manager") redirect(`/worker/${user.id}`);

  return <ManagerDashboard />;
}

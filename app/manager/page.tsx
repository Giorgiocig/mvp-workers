import { requireAuth } from "@/app/actions/requireAuth";
import { redirect } from "next/navigation";
import ManagerDashboard from "@/app/components/ManagerDashboard";
import { requireManager } from "@/lib/guards";

export default async function ManagerPage() {
  await requireManager();

  return <ManagerDashboard />;
}

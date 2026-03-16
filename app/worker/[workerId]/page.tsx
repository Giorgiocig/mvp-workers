import { redirect } from "next/navigation";

import WorkerDashboard from "@/app/components/WorkerDashboard";
import { requireAuth } from "@/app/actions/requireAuth";

export default async function WorkerPersonalPage({
  params,
}: {
  params: Promise<{ workerId: string }>;
}) {
  const user = await requireAuth();
  const { workerId } = await params;

  // Verify worker can only access their own page
  if (user.role !== "worker" || user.id !== workerId) {
    if (user.role === "manager") {
      redirect("/manager");
    } else {
      redirect(`/worker/${user.id}`);
    }
  }

  return <WorkerDashboard user={user} />;
}

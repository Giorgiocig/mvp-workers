import { redirect } from "next/navigation";

import WorkerDashboard from "@/app/components/WorkerDashboard";
import { requireWorker } from "@/lib/guards";

export default async function WorkerPersonalPage({
  params,
}: {
  params: Promise<{ workerId: string }>;
}) {
  const user = await requireWorker();
  const { workerId } = await params;
  if (user.id !== workerId) redirect(`/worker/${user.id}`);

  return <WorkerDashboard user={user} />;
}

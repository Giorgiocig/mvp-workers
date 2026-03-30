import { redirect } from "next/navigation";

import { requireWorker } from "@/lib/guards";
import WorkerPageClient from "./page-client";

export default async function WorkerPersonalPage({
  params,
}: {
  params: Promise<{ workerId: string }>;
}) {
  const user = await requireWorker();
  const { workerId } = await params;
  if (user.id !== workerId) redirect(`/worker/${user.id}`);

  return <WorkerPageClient user={user} />;
}

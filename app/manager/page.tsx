import { requireManager } from "@/lib/guards";
import ManagerPageClient from "./page-client";

export default async function ManagerPage() {
  await requireManager();

  return <ManagerPageClient />;
}

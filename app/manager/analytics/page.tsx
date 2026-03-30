import { requireManager } from "@/lib/guards";
import AnalyticsPageClient from "./page-client";

export default async function AnalyticsPage() {
  await requireManager();
  return <AnalyticsPageClient />;
}

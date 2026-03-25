import { requireAuth } from "@/app/actions/requireAuth";
import { redirect } from "next/navigation";
import ManagerDashboard from "@/app/components/ManagerDashboard";
import { requireManager } from "@/lib/guards";
import Link from "next/link";

export default async function ManagerPage() {
  await requireManager();

  return (
    <>
      <Link
        href="/manager/analytics"
        className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
      >
        API analytics
      </Link>
      <ManagerDashboard />
    </>
  );
}

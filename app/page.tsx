import { redirect } from "next/navigation";
import { getCurrentUser } from "./actions/getCurrentUser";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Redirect to appropriate dashboard
  if (user.role === "manager") {
    redirect("/manager");
  } else {
    redirect("/worker");
  }
}

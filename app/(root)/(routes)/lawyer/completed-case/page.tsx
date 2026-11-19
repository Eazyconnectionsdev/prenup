import { redirect } from "next/navigation";

// Completed cases now live on Archived Cases ("Recently Completed" until archived).
export default function LawyerCompletedCasesPage() {
  redirect("/lawyer/archived");
}

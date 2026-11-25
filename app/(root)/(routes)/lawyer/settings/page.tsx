import { redirect } from "next/navigation";

// Settings were removed from the lawyer portal; the profile page holds the lawyer's details.
export default function LawyerSettingsPage() {
  redirect("/lawyer/lawyer-profile");
}

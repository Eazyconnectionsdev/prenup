"use client";

import Link from "next/link";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";

// Status message shown at the top of all the joint information forms
export function JointStatusBanner({ isReviewPage = false }: { isReviewPage?: boolean }) {
  const joint = useJointSectionStatus();

  const box = (tone: string, text: React.ReactNode) => (
    <div className={`mb-6 rounded-lg px-4 py-3 text-sm font-medium ${tone}`}>{text}</div>
  );
  // Approving, disapproving and sending the approval request all happen on the
  // Final Review & Confirmation page.
  const reviewLink = !isReviewPage && (
    <>
      {" "}
      <Link
        href="/dashboard/final-review-confirmation"
        className="underline underline-offset-2"
      >
        Go to Final Review
      </Link>
    </>
  );

  if (!joint.ready) return null;
  if (joint.locked) {
    return box("bg-emerald-50 text-emerald-700", "Both parties have approved. This section is now locked.");
  }
  if (joint.iAmWaitingForReview) {
    return box(
      "bg-amber-50 text-amber-700",
      "Approval request sent. Waiting for your partner to review and approve.",
    );
  }
  if (joint.isMyTurnToApprove) {
    return box(
      "bg-indigo-50 text-indigo-700",
      <>
        Your partner has asked you to approve the joint information. Please review Joint Assets,
        Joint Income, Joint Liabilities and the Matrimonial Agreement, then approve or make changes
        on the Final Review page.
        {reviewLink}
      </>,
    );
  }
  if (joint.iDisapproved) {
    return box(
      "bg-red-50 text-red-600",
      <>
        You sent this back to your partner. Update the joint forms, then send the approval request
        again from the Final Review page.
        {reviewLink}
      </>,
    );
  }
  if (joint.isWaitingOnPartner) {
    return box(
      "bg-slate-50 text-slate-600",
      joint.partnerDisapproved
        ? "Your partner sent this section back and is updating it now. Waiting for them to send it again."
        : "The case owner is completing the joint information. You will be asked to review it once they send you an approval request.",
    );
  }
  return null;
}

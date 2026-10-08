"use client";

import Link from "next/link";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";

// Status message shown at the top of all three joint information forms
export function JointStatusBanner({ isReviewPage = false }: { isReviewPage?: boolean }) {
  const joint = useJointSectionStatus();

  const box = (tone: string, text: React.ReactNode) => (
    <div className={`mb-6 rounded-lg px-4 py-3 text-sm font-medium ${tone}`}>{text}</div>
  );
  const reviewLink = !isReviewPage && (
    <>
      {" "}
      <Link href="/dashboard/joint-liabilities-debts" className="underline underline-offset-2">
        Go to Joint Liabilities
      </Link>
    </>
  );

  if (!joint.ready) return null;
  if (joint.locked) {
    return box("bg-emerald-50 text-emerald-700", "Both parties have approved. This section is now locked.");
  }
  if (joint.iAmWaitingForReview) {
    return box("bg-amber-50 text-amber-700", "Submitted. Waiting for your partner to review and approve.");
  }
  if (joint.isMyTurnToApprove) {
    return box(
      "bg-indigo-50 text-indigo-700",
      <>
        Your partner has submitted the joint information. Please review Joint Assets, Joint Income
        and Joint Liabilities, then approve or disapprove{isReviewPage ? " below." : " on the Joint Liabilities page."}
        {reviewLink}
      </>,
    );
  }
  if (joint.iDisapproved) {
    return box(
      "bg-red-50 text-red-600",
      <>
        You disapproved this section. Update the joint forms and resubmit from the Joint Liabilities
        page for your partner&apos;s approval.{reviewLink}
      </>,
    );
  }
  if (joint.isWaitingOnPartner) {
    return box(
      "bg-slate-50 text-slate-600",
      joint.partnerDisapproved
        ? "Your partner disapproved this section and is updating it now. Waiting for their resubmission."
        : "The case owner is completing the joint information. You can review it once all three joint forms have been submitted.",
    );
  }
  return null;
}

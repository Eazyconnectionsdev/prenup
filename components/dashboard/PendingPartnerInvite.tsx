"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  getPendingInvite,
  type PendingInvite,
} from "@/store/asyncThunk/authThunk";

// Someone has invited this account's email to their case. Shown to a client
// who signed up on their own rather than through the emailed link, so the
// invitation is not missed (and they don't start a separate case by mistake).
export default function PendingPartnerInvite() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [invite, setInvite] = useState<PendingInvite | null>(null);

  const eligible = user?.role === "end_user" && user?.endUserType === "user1";

  useEffect(() => {
    if (!eligible) return;
    let active = true;
    dispatch(getPendingInvite())
      .unwrap()
      .then((res) => {
        if (active) setInvite(res);
      })
      .catch(() => {
        // The banner is a convenience; the dashboard works without it.
      });
    return () => {
      active = false;
    };
  }, [eligible, user?._id, dispatch]);

  if (!eligible || !invite) return null;

  const inviter =
    [invite.inviterFirstName, invite.inviterLastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Your partner";

  return (
    <div
      role="status"
      className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#C7C5FF] bg-[#F1F0FF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="text-sm text-[#1E1B3C]">
        <p className="font-semibold">{inviter} has invited you to their case.</p>
        <p className="mt-0.5 text-[#6B6B80]">
          Accept to join as the second applicant. You won&apos;t need a separate
          case of your own.
        </p>
      </div>
      <button
        type="button"
        onClick={() =>
          router.push(`/accept-invite?caseId=${encodeURIComponent(invite.caseId)}`)
        }
        className="flex-shrink-0 rounded-lg bg-[#6D28D9] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5B21B6]"
      >
        Review invitation
      </button>
    </div>
  );
}

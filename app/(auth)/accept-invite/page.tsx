"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import AuthHeader from "@/components/auth/AuthHeader";
import FormAlert from "@/components/auth/FormAlert";
import type { AppDispatch, RootState } from "@/store/store";
import {
  acceptInviteExisting,
  getFreshProfile,
  getInvitePreview,
  type InvitePreview,
} from "@/store/asyncThunk/authThunk";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { snoozePendingInvite } from "@/lib/inviteSnooze";

// A signed-in client with an existing account accepts a partner invitation.
// The account is linked to the inviter's case: no new account and no new Case
// ID. A case of their own is only ever set aside (never deleted or merged),
// and only after they confirm; one holding real data or a payment is left for
// our team to review.
export default function AcceptInvitePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [params, setParams] = useState<{ caseId: string; token: string } | null>(null);
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [held, setHeld] = useState<string | null>(null);

  // Read off the address bar rather than useSearchParams, which would need a
  // Suspense boundary around the page.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setParams({ caseId: q.get("caseId") ?? "", token: q.get("token") ?? "" });
  }, []);

  const load = useCallback(async () => {
    if (!params) return;
    if (!params.caseId) {
      setError("This invitation link is not valid.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await dispatch(
        getInvitePreview({ caseId: params.caseId, token: params.token }),
      ).unwrap();
      setPreview(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "This invitation is no longer available."));
    } finally {
      setLoading(false);
    }
  }, [params, dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const inviterName =
    [preview?.inviter.firstName, preview?.inviter.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Your partner";

  const needsConfirm =
    preview?.ownCase === "DRAFT" || preview?.ownCase === "APPROVED";
  const needsReview = preview?.ownCase === "NEEDS_RESOLUTION";
  const reviewRequested = Boolean(held) || Boolean(preview?.resolutionRequested);

  const handleAccept = async () => {
    if (!params) return;
    setSubmitting(true);
    try {
      const result = await dispatch(
        acceptInviteExisting({
          caseId: params.caseId,
          token: params.token,
          confirmSetAsideOwnCase: needsConfirm && confirmed,
        }),
      ).unwrap();

      if (result.resolutionRequired) {
        setHeld(result.message ?? "Our team will review this and contact you.");
        return;
      }

      // The account is now the secondary applicant on their partner's case.
      await dispatch(getFreshProfile());
      toast.success("You have joined your partner's case");
      router.replace("/dashboard");
    } catch (err) {
      if ((err as { code?: string } | null)?.code === "CONFIRM_SET_ASIDE_OWN_CASE") {
        // The server wants consent we did not ask for; re-read and ask.
        await load();
        toast.info("Please confirm before continuing.");
        return;
      }
      toast.error(getErrorMessage(err, "Unable to accept the invitation."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AuthHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-[520px]">
          {loading && (
            <p className="text-center text-sm text-[#7A7A7A]">
              Loading your invitation...
            </p>
          )}

          {!loading && error && (
            <div className="space-y-4 text-center">
              <h1 className="text-[24px] font-medium text-[#495060]">
                Invitation unavailable
              </h1>
              <FormAlert message={error} />
              <Link
                href="/dashboard"
                onClick={snoozePendingInvite}
                className="inline-block text-[13px] text-[#6a69ff] hover:underline"
              >
                Go to your dashboard
              </Link>
            </div>
          )}

          {!loading && !error && preview && (
            <div className="space-y-5">
              <div className="text-center">
                <h1 className="text-[24px] sm:text-[28px] font-medium text-[#495060]">
                  Accept your partner&apos;s invitation
                </h1>
                <p className="mt-2 text-[14px] text-[#7A7A7A]">
                  <strong>{inviterName}</strong> has invited you to prepare an
                  agreement together
                  {preview.caseNumber ? (
                    <>
                      {" "}
                      on case{" "}
                      <span className="font-mono font-semibold text-[#1E1B3C]">
                        {preview.caseNumber}
                      </span>
                    </>
                  ) : null}
                  .
                </p>
              </div>

              <div className="rounded border border-[#E7E7F2] bg-[#F9F9FD] px-4 py-3 text-[13px] leading-relaxed text-[#495060]">
                You are signed in as <strong>{user?.email}</strong>. Accepting
                links this account to their case as the second applicant. No new
                account and no new Case ID is created.
                {!preview.emailMatchesInvite && (
                  <p className="mt-2 text-[12px] text-[#7A7A7A]">
                    This invitation was sent to a different email address than
                    the one you are signed in with.
                  </p>
                )}
              </div>

              {needsConfirm && (
                <div className="space-y-3 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
                  <p>
                    {preview.ownCase === "APPROVED"
                      ? "Our team has reviewed the case you already have and cleared this link. "
                      : "You have an unused case of your own"}
                    {preview.ownCases.length > 0 && (
                      <>
                        {" "}
                        (
                        {preview.ownCases
                          .map((c) => c.caseNumber ?? "no Case ID")
                          .join(", ")}
                        )
                      </>
                    )}
                    . To join your partner&apos;s case it will be set aside. It
                    is <strong>not deleted</strong>, and its Case ID will never
                    be used again.
                  </p>
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      I understand, and want to set my own case aside and join
                      my partner&apos;s case instead.
                    </span>
                  </label>
                </div>
              )}

              {needsReview && (
                <div className="space-y-2 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
                  <p>
                    You already have a case with information or a payment on it
                    {preview.ownCases.length > 0 && (
                      <>
                        {" "}
                        (
                        {preview.ownCases
                          .filter((c) => c.meaningful)
                          .map((c) => c.caseNumber ?? "no Case ID")
                          .join(", ")}
                        )
                      </>
                    )}
                    . We never merge or delete cases automatically, so a member
                    of our team needs to review this before you can be linked.
                  </p>
                  {reviewRequested && (
                    <p className="font-semibold">
                      {held ??
                        "We have asked our team to review this. Nothing has been changed, and we will contact you."}
                    </p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleAccept}
                disabled={
                  submitting ||
                  (needsConfirm && !confirmed) ||
                  (needsReview && reviewRequested)
                }
                className="w-full rounded bg-[#6a69ff] px-6 py-2.5 text-[14px] text-white transition-colors hover:bg-[#5958e6] disabled:cursor-not-allowed disabled:bg-[#6a69ff]/50"
              >
                {submitting
                  ? "Please wait..."
                  : needsReview
                    ? "Ask our team to review"
                    : "Accept invitation"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    // Stop the dashboard steering them back here this session.
                    snoozePendingInvite();
                    router.push("/dashboard");
                  }}
                  className="text-[12px] text-[#7A7A7A] hover:underline"
                >
                  Not now
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AlertTriangle, UserMinus } from "lucide-react";

import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "@/lib/getErrorMessage";

type Conflict = {
  open: boolean;
  reasons?: string[];
  outcome?: "APPROVED" | "REJECTED" | null;
  existingCase?: {
    _id: string;
    caseNumber: string | null;
    workflowStatus: string;
    paymentCompleted: boolean;
  } | null;
};

type InviteView = {
  status: string;
  invitee?: { email?: string };
  conflict?: Conflict | null;
};

type Props = {
  caseId: string;
  // The loaded case; `invitedUser` is the linked partner, if any.
  caseData: any;
  // Called after the link changes so the page can reload the case.
  onChanged?: () => void;
};

// Case Manager / Admin controls for the partner link on a case:
//  - remove a partner who has joined, so the owner can invite again (the
//    partner's account is kept, only the link is cut);
//  - decide a link that was held because the invited person already has a
//    case with data or a payment (nothing is merged or deleted either way).
export default function PartnerLinkPanel({ caseId, caseData, onChanged }: Props) {
  const [invite, setInvite] = useState<InviteView | null>(null);
  const [confirming, setConfirming] = useState<"remove" | "approve" | "reject" | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const partner = caseData?.invitedUser;
  const partnerName =
    [partner?.firstName, partner?.lastName].filter(Boolean).join(" ").trim() ||
    partner?.email ||
    "the partner";

  const loadInvite = useCallback(async () => {
    try {
      const { data } = await Axios.get(`/cases/${caseId}/invite`);
      setInvite(data?.invite ?? null);
    } catch {
      // The panel is optional; the case page works without it.
      setInvite(null);
    }
  }, [caseId]);

  useEffect(() => {
    loadInvite();
  }, [loadInvite, partner?._id]);

  const conflict = invite?.conflict?.open ? invite.conflict : null;
  if (!partner?._id && !conflict) return null;

  const close = () => {
    setConfirming(null);
    setNote("");
  };

  const run = async (action: "remove" | "approve" | "reject") => {
    setBusy(true);
    try {
      if (action === "remove") {
        await Axios.delete(`/cases/${caseId}/partner`, {
          data: { reason: note.trim() || undefined },
        });
        toast.success("Partner removed. The case owner can invite a partner again.");
      } else {
        await Axios.post(`/cases/${caseId}/invite/resolve`, {
          action: action === "approve" ? "APPROVE" : "REJECT",
          note: note.trim() || undefined,
        });
        toast.success(
          action === "approve"
            ? "Link approved. The invited person can now confirm and join."
            : "Link rejected and the invitation withdrawn.",
        );
      }
      close();
      await loadInvite();
      onChanged?.();
    } catch (err: any) {
      toast.error(getErrorMessage(err?.response?.data, "That didn't work. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-6 space-y-3">
      {conflict && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="min-w-0 flex-1 space-y-2">
              <p className="font-semibold">Partner link needs a decision</p>
              <p>
                The invited person ({invite?.invitee?.email}) already has their own case
                {conflict.existingCase?.caseNumber ? (
                  <>
                    {" "}
                    <span className="font-mono font-semibold">
                      {conflict.existingCase.caseNumber}
                    </span>
                  </>
                ) : null}{" "}
                holding data or a payment. Nothing has been merged, deleted or
                linked.
              </p>
              {!!conflict.reasons?.length && (
                <ul className="list-disc pl-5 text-xs">
                  {conflict.reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              )}
              <p className="text-xs">
                <strong>Approve</strong> lets them confirm and join; their own case
                is set aside, kept with all its data and Case ID.{" "}
                <strong>Reject</strong> withdraws this invitation.
              </p>

              {confirming === "approve" || confirming === "reject" ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={500}
                    placeholder="Note for the audit log (optional)"
                    className="w-full rounded border border-amber-300 bg-white px-3 py-2 text-xs text-slate-800"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(confirming)}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {busy
                        ? "Please wait..."
                        : confirming === "approve"
                          ? "Confirm: approve link"
                          : "Confirm: reject link"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={close}
                      className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setConfirming("approve")}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Approve link
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming("reject")}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    Reject link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {partner?._id && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">Secondary applicant</p>
              <p className="text-xs text-slate-500">
                {partnerName}
                {partner?.email && partner.email !== partnerName
                  ? ` (${partner.email})`
                  : ""}
              </p>
            </div>

            {confirming !== "remove" && (
              <button
                type="button"
                onClick={() => setConfirming("remove")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                <UserMinus className="h-3.5 w-3.5" />
                Remove partner
              </button>
            )}
          </div>

          {confirming === "remove" && (
            <div className="mt-4 space-y-2 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-900">
              <p>
                This unlinks <strong>{partnerName}</strong> from the case and clears
                the answers they entered (a backup snapshot is kept). Their
                account is <strong>not</strong> deleted, and the case owner can
                invite a partner again.
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
                placeholder="Reason (optional, recorded in the audit log)"
                className="w-full rounded border border-red-300 bg-white px-3 py-2 text-xs text-slate-800"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run("remove")}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {busy ? "Removing..." : "Yes, remove partner"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={close}
                  className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

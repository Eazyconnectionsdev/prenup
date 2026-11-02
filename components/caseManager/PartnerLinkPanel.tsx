"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AlertTriangle, UserMinus, UserX } from "lucide-react";

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

// The account behind the invited partner (staff only), and whether it may be deleted.
type InviteeAccount = {
  exists: boolean;
  joined: boolean;
  email: string;
  name: string | null;
  deletable: boolean;
  blockers: { code: string; message: string; reasons?: string[]; cases?: string[] }[];
};

type Action = "remove" | "approve" | "reject" | "delete-account";

type Props = {
  caseId: string;
  // The loaded case; `invitedUser` is the linked partner, if any.
  caseData: any;
  // Called after the link changes so the page can reload the case.
  onChanged?: () => void;
};

// Stages before the joint work starts: removing a partner here changes nothing else.
const EARLY_STAGES = ["NOT_PAID", "DRAFT"];

const prettyStage = (s?: string) => (s ? s.replace(/_/g, " ").toLowerCase() : "");

// Case Manager / Admin controls for the partner link on a case:
//  - remove a partner who has joined, so the owner can invite again (the
//    partner's account is kept, only the link is cut);
//  - delete the invited partner's account when it already exists and stops
//    them joining through the invitation, then email a fresh invitation;
//  - decide a link that was held because the invited person already has a
//    case with data or a payment (nothing is merged or deleted either way).
export default function PartnerLinkPanel({ caseId, caseData, onChanged }: Props) {
  const [invite, setInvite] = useState<InviteView | null>(null);
  const [account, setAccount] = useState<InviteeAccount | null>(null);
  const [confirming, setConfirming] = useState<Action | null>(null);
  const [note, setNote] = useState("");
  const [typedEmail, setTypedEmail] = useState("");
  const [resend, setResend] = useState(true);
  const [busy, setBusy] = useState(false);

  const partner = caseData?.invitedUser;
  const partnerName =
    [partner?.firstName, partner?.lastName].filter(Boolean).join(" ").trim() ||
    partner?.email ||
    "the partner";

  const stage: string | undefined = caseData?.workflowStatus;
  const lateStage = !!stage && !EARLY_STAGES.includes(stage);

  const loadInvite = useCallback(async () => {
    try {
      const { data } = await Axios.get(`/cases/${caseId}/invite`);
      setInvite(data?.invite ?? null);
      setAccount(data?.inviteeAccount ?? null);
    } catch {
      // The panel is optional; the case page works without it.
      setInvite(null);
      setAccount(null);
    }
  }, [caseId]);

  useEffect(() => {
    loadInvite();
  }, [loadInvite, partner?._id]);

  const conflict = invite?.conflict?.open ? invite.conflict : null;
  // A partner who has not joined yet but whose address already has an account.
  const pendingWithAccount = !partner?._id && !!account?.exists;
  if (!partner?._id && !conflict && !pendingWithAccount) return null;

  const close = () => {
    setConfirming(null);
    setNote("");
    setTypedEmail("");
    setResend(true);
  };

  const run = async (action: Action) => {
    setBusy(true);
    try {
      if (action === "remove") {
        const { data } = await Axios.delete(`/cases/${caseId}/partner`, {
          data: { reason: note.trim() || undefined },
        });
        toast.success(
          data?.returnedToDraft
            ? "Partner removed and the case returned to Draft. The case owner can invite a partner again."
            : "Partner removed. The case owner can invite a partner again.",
        );
      } else if (action === "delete-account") {
        const { data } = await Axios.delete(`/cases/${caseId}/invitee-account`, {
          data: {
            confirmEmail: typedEmail.trim(),
            reason: note.trim() || undefined,
            resendInvite: resend,
          },
        });
        if (data?.inviteError) {
          toast.warn(
            "Account deleted, but the fresh invitation could not be sent. The case owner can invite them again.",
          );
        } else {
          toast.success(
            data?.inviteSent
              ? `Account deleted. A fresh invitation was emailed to ${account?.email ?? "the partner"}.`
              : "Account deleted. The case owner can invite the partner again.",
          );
        }
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

  const accountLabel = account?.name ? `${account.name} (${account.email})` : account?.email;

  // The confirmation for deleting an account: shared by the "joined" and "pending" cards.
  const deleteAccountForm = account && (
    <div className="mt-4 space-y-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-900">
      <p>
        This <strong>deletes the account</strong> of <strong>{accountLabel}</strong>. They will no
        longer be able to sign in with it, and the email address is freed so they can register again
        through a new invitation link.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        {account.joined && (
          <li>
            They are unlinked from this case and the answers they entered are cleared (a backup
            snapshot is kept).
            {lateStage && " The case is also returned to Draft."}
          </li>
        )}
        <li>
          An unused draft case of their own is set aside, not deleted; its Case ID stays on record and
          is never reused.
        </li>
        <li>The account record is kept for the audit trail; it is deactivated, not erased.</li>
      </ul>

      <label className="block">
        <span className="mb-1 block font-semibold">
          Type <span className="font-mono">{account.email}</span> to confirm
        </span>
        <input
          type="text"
          value={typedEmail}
          onChange={(e) => setTypedEmail(e.target.value)}
          autoComplete="off"
          placeholder={account.email}
          className="w-full rounded border border-red-300 bg-white px-3 py-2 text-xs text-slate-800"
        />
      </label>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={500}
        placeholder="Reason (optional, recorded in the audit log)"
        className="w-full rounded border border-red-300 bg-white px-3 py-2 text-xs text-slate-800"
        rows={2}
      />

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={resend}
          onChange={(e) => setResend(e.target.checked)}
          className="mt-0.5 accent-red-600"
        />
        <span>
          <span className="font-semibold">Email a fresh invitation now.</span> They get a link to
          register and join this case.
        </span>
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy || typedEmail.trim().toLowerCase() !== account.email.toLowerCase()}
          onClick={() => run("delete-account")}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {busy ? "Deleting..." : "Yes, delete this account"}
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
  );

  // Why the account cannot be deleted from here, if it cannot.
  const blockerList = account && !account.deletable && (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
      <p className="font-semibold text-slate-900">This account can&apos;t be deleted from here</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        {account.blockers.map((b) => (
          <li key={b.code}>
            {b.message}
            {!!b.cases?.length && (
              <>
                {" "}
                Case <span className="font-mono">{b.cases.join(", ")}</span>.
              </>
            )}
            {!!b.reasons?.length && (
              <ul className="mt-0.5 list-[circle] pl-5 text-slate-500">
                {b.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

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

      {pendingWithAccount && account && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">Invited partner already has an account</p>
              <p className="text-xs text-slate-500">
                {accountLabel}. They have not joined this case yet. Their invitation asks them to
                sign in and accept. If they should register as a new person instead, delete the
                account and they will get a fresh registration link.
              </p>
            </div>

            {account.deletable && confirming !== "delete-account" && (
              <button
                type="button"
                onClick={() => setConfirming("delete-account")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                <UserX className="h-3.5 w-3.5" />
                Delete partner&apos;s account
              </button>
            )}
          </div>
          {blockerList}
          {confirming === "delete-account" && deleteAccountForm}
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

            {confirming !== "remove" && confirming !== "delete-account" && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming("remove")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                  Remove partner
                </button>
                {account?.deletable && (
                  <button
                    type="button"
                    onClick={() => setConfirming("delete-account")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    <UserX className="h-3.5 w-3.5" />
                    Delete partner&apos;s account
                  </button>
                )}
              </div>
            )}
          </div>

          {confirming !== "delete-account" && blockerList}

          {confirming === "remove" && (
            <div className="mt-4 space-y-2 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-900">
              <p>
                This unlinks <strong>{partnerName}</strong> from the case and clears
                the answers they entered (a backup snapshot is kept). Their
                account is <strong>not</strong> deleted, and the case owner can
                invite a partner again.
              </p>
              {lateStage && (
                <p className="rounded border border-red-300 bg-white/70 p-2">
                  <strong>This case is at the &ldquo;{prettyStage(stage)}&rdquo; stage.</strong> Removing
                  the partner returns it to <strong>Draft</strong>: the joint answers, approvals, locks
                  and lawyer assignments are cleared. The owner&apos;s own answers, the payment and the
                  Case ID are kept.
                </p>
              )}
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

          {confirming === "delete-account" && deleteAccountForm}
        </div>
      )}
    </div>
  );
}

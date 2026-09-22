"use client";

import React, { useState, useEffect } from "react";
import {
  YesNo,
  TreatmentFields,
  emptyTreatment,
  makeId,
  inputClasses,
  PartHeader,
  YesNoToggle,
  MatrixBox,
  RowItem,
  TreatmentSelect,
  Treatment,
  makeToggleHandler,
  updateRow,
  removeRow,
} from "@/components/Formprimitives";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Axios from "@/lib/ApiConfig";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { updateApproval, updateJointInformationStatus } from "@/store/slices/casesSlice";

const sharedTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

interface SharedDebtRow extends TreatmentFields {
  id: string;
  lenderName: string;
  liabilityType: string;
  outstandingBalance: string;
}

function makeSharedDebtRow(): SharedDebtRow {
  return {
    id: makeId("sdebt"),
    lenderName: "",
    liabilityType: "",
    outstandingBalance: "",
    ...emptyTreatment,
  };
}

interface SharedLiabilitiesFormProps {
  onContinue?: () => void;
}

export default function SharedLiabilitiesForm({
  onContinue,
}: SharedLiabilitiesFormProps = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const caseId = useSelector((state: RootState) => state.auth.caseId);
  const currentCase = useSelector((state: RootState) => state.cases);

  const myId: string | undefined = user?._id;

  const ownerId = currentCase?.owner?._id ? String(currentCase.owner._id) : null;
  const isOwner = !!myId && ownerId === myId;

  const jointStatus = currentCase?.status?.jointInformation ?? {
    submitted: false,
    submittedBy: null,
    locked: false,
  };
  const approval = currentCase?.approval ?? {
    user1Approved: false,
    user2Approved: false,
    disapprovedBy: null,
    disapprovalReason: null,
  };

  const submittedById = jointStatus.submittedBy ? String(jointStatus.submittedBy) : null;
  const hasBeenSubmittedBefore = submittedById !== null;

  const canEditForm =
    !jointStatus.locked &&
    !jointStatus.submitted &&
    (submittedById === null ? isOwner : submittedById === myId);

  const iAmWaitingForReview =
    !jointStatus.locked && jointStatus.submitted && submittedById === myId;

  const isMyTurnToApprove =
    !jointStatus.locked &&
    jointStatus.submitted &&
    submittedById !== myId &&
    hasBeenSubmittedBefore;

  const isWaitingOnPartnerToAct =
    !jointStatus.locked && !jointStatus.submitted && submittedById !== myId;

  const editingAfterMyOwnDisapproval =
    canEditForm &&
    (approval as any)?.disapprovedBy &&
    String((approval as any).disapprovedBy) === myId;

  const [hasSharedDebts, setHasSharedDebts] = useState<YesNo>("No");
  const [sharedDebts, setSharedDebts] = useState<SharedDebtRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDisapproving, setIsDisapproving] = useState(false);
  const [disapproveReason, setDisapproveReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const handleToggle = makeToggleHandler(
    setHasSharedDebts,
    setSharedDebts,
    makeSharedDebtRow,
  );

  useEffect(() => {
    const jointLiabilities = (currentCase?.jointInformation as any)?.jointLiabilitiesAndDebts;
    if (jointLiabilities) {
      setHasSharedDebts(jointLiabilities?.hasSharedDebts ?? "No");
      setSharedDebts(
        Array.isArray(jointLiabilities?.sharedDebts) ? jointLiabilities?.sharedDebts : [],
      );
    }
  }, [currentCase?.jointInformation]);

  const refreshCase = async () => {
    if (caseId) {
      await dispatch(getCasesDetails(caseId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setActionError(null);
    try {
      await Axios.post(
        `/cases/${caseId}/questionnaire/joint-liabilities-and-debts`,
        { hasSharedDebts, sharedDebts },
      );
      await refreshCase();
      onContinue?.();
    } catch (error) {
      console.error("Error saving shared liabilities:", error);
      setActionError("Something went wrong saving your changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    setActionError(null);
    try {
      await Axios.post(`/cases/${caseId}/approve`);
      
      await Axios.post(`/agreement/${caseId}/document/generate`); 
      dispatch(
        updateApproval(
          isOwner ? { user1Approved: true } : { user2Approved: true },
        ),
      );

      await refreshCase();
    } catch (error) {
      console.error("Error approving:", error);
      setActionError("Couldn't approve right now. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleDisapprove = async () => {
    setIsDisapproving(true);
    setActionError(null);
    try {
      await Axios.post(`/cases/${caseId}/reject`, { reason: disapproveReason });

      // Ball now sits with ME, the rejecter — I'm the one who edits next.
      dispatch(
        updateJointInformationStatus({
          submitted: false,
          submittedBy: myId ?? null,
        }),
      );
      dispatch(
        updateApproval({
          user1Approved: false,
          user2Approved: false,
          disapprovedBy: myId ?? null,
          disapprovalReason: disapproveReason || null,
        } as any),
      );

      setDisapproveReason("");
      await refreshCase();
    } catch (error) {
      console.error("Error disapproving:", error);
      setActionError("Couldn't disapprove right now. Please try again.");
    } finally {
      setIsDisapproving(false);
    }
  };

  if (!currentCase || currentCase.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-500">Loading your information...</p>
      </div>
    );
  }

  const formBody = (
    <>
      <PartHeader tooltip="Declare any liabilities that you and your partner hold jointly, including mortgages, loans, credit cards or other shared financial obligations.">
        Shared Financial Obligations
      </PartHeader>
      <div className="mb-4">
        <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
          Do you and your partner jointly hold any liabilities, including
          mortgages, loans, credit cards, finance agreements or other financial
          obligations?
        </label>
        <YesNoToggle name="has_shared_debts" value={hasSharedDebts} onChange={handleToggle} />
      </div>

      {hasSharedDebts === "Yes" && (
        <MatrixBox
          title="Shared Liabilities Register"
          onAdd={() => setSharedDebts((prev) => [...prev, makeSharedDebtRow()])}
          addLabel="Add Shared Liability"
        >
          {sharedDebts.map((row) => (
            <RowItem key={row.id} onDelete={() => removeRow(setSharedDebts, row.id)}>
              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr_1fr]">
                <input
                  type="text"
                  placeholder="Lender / Creditor Name"
                  value={row.lenderName}
                  onChange={(e) => updateRow(setSharedDebts, row.id, { lenderName: e.target.value })}
                  required
                  className={inputClasses}
                />
                <select
                  value={row.liabilityType}
                  onChange={(e) => updateRow(setSharedDebts, row.id, { liabilityType: e.target.value })}
                  required
                  className={inputClasses}
                >
                  <option value="">Type of Liability</option>
                  <option value="Mortgage">Mortgage</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Car Finance">Car Finance</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Student Loan">Student Loan</option>
                  <option value="Overdraft">Bank Overdraft</option>
                  <option value="Tax Liability">Tax Liability</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="number"
                  min={1}
                  placeholder="Outstanding Balance (£)"
                  value={row.outstandingBalance}
                  onChange={(e) => updateRow(setSharedDebts, row.id, { outstandingBalance: e.target.value })}
                  required
                  className={inputClasses}
                />
              </div>
              <TreatmentSelect
                id={row.id}
                fields={row}
                onChange={(f) => updateRow(setSharedDebts, row.id, f)}
                label="How should this liability be treated?"
                options={sharedTreatmentOptions}
              />
            </RowItem>
          ))}
        </MatrixBox>
      )}
    </>
  );

  const statusBanner = () => {
    if (jointStatus.locked) {
      return (
        <p className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Both parties have approved. This section is now locked.
        </p>
      );
    }

    if (iAmWaitingForReview) {
      return (
        <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Submitted. Waiting for your partner to review and approve.
        </p>
      );
    }

    if (editingAfterMyOwnDisapproval) {
      return (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          You disapproved this section. Update the details below and submit it for your partner's approval.
        </p>
      );
    }

    if (isWaitingOnPartnerToAct) {
      return (
        <p className="mb-6 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
          {jointStatus.submittedBy === null
            ? "Waiting for the case owner to submit this section."
            : "Your partner disapproved this section and is updating it now. Waiting for their resubmission."}
        </p>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-11 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Shared Liabilities & Outstanding Debts
          </h2>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
            Please declare any liabilities, loans or financial obligations that
            you and your partner hold jointly and specify how they should be
            treated under your prenuptial agreement.
          </p>

          {statusBanner()}
          {actionError && (
            <p className="mb-4 text-sm font-medium text-red-500">{actionError}</p>
          )}

          {canEditForm ? (
            <form onSubmit={handleSubmit} noValidate>
              {formBody}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 rounded-[10px] bg-indigo-600 px-10 py-3.5 font-semibold text-white shadow-[0_4px_12px_rgba(79,70,229,0.2)] transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : editingAfterMyOwnDisapproval ? "Resubmit" : "Submit"}
                </button>
              </div>
            </form>
          ) : (
            <fieldset disabled className="border-0 p-0 m-0">
              {formBody}
            </fieldset>
          )}

          {isMyTurnToApprove && (
            <div className="mt-8 flex flex-col items-end gap-3">
              <textarea
                value={disapproveReason}
                onChange={(e) => setDisapproveReason(e.target.value)}
                placeholder="Optional: let your partner know what to change"
                rows={2}
                className={`${inputClasses} w-full`}
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  disabled={isApproving || isDisapproving}
                  onClick={handleApprove}
                  className="rounded-[10px] bg-indigo-600 px-10 py-3.5 font-semibold text-white shadow-[0_4px_12px_rgba(79,70,229,0.2)] transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isApproving ? "Approving..." : "Approve"}
                </button>
                <button
                  type="button"
                  disabled={isApproving || isDisapproving}
                  onClick={handleDisapprove}
                  className="rounded-[10px] bg-red-600 px-10 py-3.5 font-semibold text-white shadow-[0_4px_12px_rgba(220,38,38,0.2)] transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isDisapproving ? "Disapproving..." : "Disapprove"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
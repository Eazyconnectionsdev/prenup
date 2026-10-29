"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CreditCard, Wallet } from "lucide-react";
import {
  emptyTreatment,
  makeId,
  inputClasses,
  FieldLabel,
  FormShell,
  SectionCard,
  SubmitBar,
  YesNoToggle,
  MatrixBox,
  RowItem,
  TreatmentSelect,
  makeToggleHandler,
  updateRow,
  removeRow,
} from "@/components/questionnaire/QuestionnaireUI";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Axios from "@/lib/ApiConfig";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/lib/api/http-error";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { updateApproval, updateJointInformationStatus } from "@/store/slices/casesSlice";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { JointStatusBanner } from "@/components/joint/JointStatusBanner";
import type { Treatment, YesNo } from "@/types/forms/form-primitives";
import type { SharedDebtRow, SharedLiabilitiesFormProps } from "@/types/dashboard/joint-liabilities-debts";

const sharedTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

function makeSharedDebtRow(): SharedDebtRow {
  return {
    id: makeId("sdebt"),
    lenderName: "",
    liabilityType: "",
    outstandingBalance: "",
    ...emptyTreatment,
  };
}

export default function SharedLiabilitiesForm({
  onContinue,
}: SharedLiabilitiesFormProps = {}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const caseId = useSelector((state: RootState) => state.auth.caseId);
  const currentCase = useSelector((state: RootState) => state.cases);

  // Review only starts once all three joint forms are submitted (see hook)
  const {
    myId,
    isOwner,
    canEdit: canEditForm,
    isMyTurnToApprove,
    iDisapproved: editingAfterMyOwnDisapproval,
  } = useJointSectionStatus();

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setActionError(null);
    try {
      await Axios.post(
        `/cases/${caseId}/questionnaire/joint-liabilities-and-debts`,
        { hasSharedDebts, sharedDebts },
      );
      await refreshCase();
      toast.success("Joint liabilities saved.");
      if (onContinue) {
        onContinue();
      } else {
        router.push("/dashboard/matrimonial-agreement");
      }
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
    } catch (error) {
      setActionError(getErrorMessage(error, "Couldn't approve right now. Please try again."));
      setIsApproving(false);
      return;
    }

    // The approval is saved at this point; a failed document generation must not
    // leave the Approve button on screen (a second approve would be rejected)
    dispatch(updateApproval(isOwner ? { user1Approved: true } : { user2Approved: true }));
    try {
      await Axios.post(`/agreement/${caseId}/document/generate`);
      toast.success("Approved. Your agreement draft has been generated.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Approved, but the agreement document couldn't be generated."),
      );
    } finally {
      await refreshCase();
      setIsApproving(false);
    }
  };

  const handleDisapprove = async () => {
    setIsDisapproving(true);
    setActionError(null);
    try {
      await Axios.post(`/cases/${caseId}/reject`, { reason: disapproveReason });

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
    <SectionCard
      title="Shared Financial Obligations"
      icon={<CreditCard className="h-5 w-5" />}
      colorIndex={0}
      tooltip="Declare any liabilities that you and your partner hold jointly, including mortgages, loans, credit cards, finance agreements, and other shared financial obligations."
    >
      <FieldLabel>
        Do you and your partner jointly hold any liabilities, including mortgages, loans, credit
        cards, finance agreements or other financial obligations?
      </FieldLabel>
      <YesNoToggle name="has_shared_debts" value={hasSharedDebts} onChange={handleToggle} />

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
    </SectionCard>
  );

  return (
    <FormShell
      title="Shared Liabilities & Outstanding Debts"
      stepLabel="Step 3 of 4"
      icon={<Wallet className="h-5 w-5" />}
      description="Please declare any liabilities, loans or financial obligations that you and your partner hold jointly and specify how they should be treated under your prenuptial agreement."
    >
      <JointStatusBanner isReviewPage />
      {actionError && <p className="mb-4 text-sm font-medium text-red-500">{actionError}</p>}

      {canEditForm ? (
        <form onSubmit={handleSubmit} noValidate>
          {formBody}
          <SubmitBar
            isSaving={isSubmitting}
            label="Next: Matrimonial Agreement & Review"
            withArrow
            backHref="/dashboard/joint-income-revenue"
          />
        </form>
      ) : (
        <div>
          <fieldset disabled className="m-0 min-w-0 border-0 p-0 space-y-6">
            {formBody}
          </fieldset>
          <div className="mt-8 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/80">
            <Link
              href="/dashboard"
              className="text-[13.5px] font-semibold text-[#5B4DF5] transition hover:text-[#4338CA] text-left cursor-pointer"
            >
              Save and exit
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/joint-income-revenue"
                className="inline-flex h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 text-[13.5px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <button
                type="button"
                onClick={() => router.push("/dashboard/matrimonial-agreement")}
                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-[#5B4DF5] hover:from-indigo-700 hover:to-[#4E3EEA] px-7 text-[13.5px] font-semibold text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#5B4DF5]/30 cursor-pointer"
              >
                Next: Matrimonial Agreement & Review →
              </button>
            </div>
          </div>
        </div>
      )}
    </FormShell>
  );
}
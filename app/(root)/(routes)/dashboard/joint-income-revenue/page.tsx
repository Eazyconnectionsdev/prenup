"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Banknote, TrendingUp } from "lucide-react";
import {
  emptyTreatment,
  makeId,
  inputClasses,
  fieldClassesFor,
  FieldLabel,
  FieldMessage,
  FormShell,
  SectionCard,
  SubmitBar,
  YesNoToggle,
  MatrixBox,
  RowItem,
  Tooltip,
  TreatmentSelect,
  makeToggleHandler,
  updateRow,
  removeRow,
} from "@/components/questionnaire/QuestionnaireUI";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "@/lib/api/http-error";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { useFormValidation } from "@/hooks/useFormValidation";
import { jointIncomeSchema } from "@/lib/validations/joint";
import { errorsUnder } from "@/lib/validations/formErrors";
import { JointStatusBanner } from "@/components/joint/JointStatusBanner";
import type { Treatment, TreatmentFields, YesNo } from "@/types/forms/form-primitives";
import type { SharedIncomeFormProps, SharedIncomeRow } from "@/types/dashboard/joint-income-revenue";

const sharedTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

const jointIncomeTreatmentTooltips = {
  select:
    "This records your current intentions. Your independent solicitors will review the proposed arrangements.",
  custom:
    "Describe any arrangement that cannot be reflected through equal sharing, contribution-based sharing, or percentage allocations.",
};

function makeSharedIncomeRow(): SharedIncomeRow {
  return { id: makeId("sinc"), description: "", source: "", annualIncome: "", ...emptyTreatment };
}

export default function SharedIncomeForm({ onContinue }: SharedIncomeFormProps = {}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const caseId = useSelector((state: RootState) => state.auth.caseId);
  // Read-only unless it's this user's turn to edit the joint section
  const { canEdit } = useJointSectionStatus();

  const [hasSharedIncome, setHasSharedIncome] = useState<YesNo>("No");
  const [sharedIncomeRows, setSharedIncomeRows] = useState<SharedIncomeRow[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { errors, validate, clearError, summary } = useFormValidation(jointIncomeSchema);

  const baseToggle = makeToggleHandler(setHasSharedIncome, setSharedIncomeRows, makeSharedIncomeRow);
  const handleToggle = (value: YesNo) => {
    clearError("hasSharedIncome");
    clearError("sharedIncomeRows");
    baseToggle(value);
  };

  /* ---- Where a row's fields live in the payload ---- */

  const rowPath = (id: string) =>
    `sharedIncomeRows.${sharedIncomeRows.findIndex((r) => r.id === id)}`;
  const fieldPath = (id: string, field: string) => `${rowPath(id)}.${field}`;
  const errorAt = (id: string, field: string) => errors[fieldPath(id, field)];

  // Edits clear their own message; a removal renumbers the rows after it, so
  // the whole list's messages go and the next submit re-states them.
  const editRow = (id: string, patch: Partial<SharedIncomeRow>) => {
    for (const field of Object.keys(patch)) clearError(fieldPath(id, field));
    updateRow(setSharedIncomeRows, id, patch);
  };
  const dropRow = (id: string) => {
    clearError("sharedIncomeRows");
    removeRow(setSharedIncomeRows, id);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      hasSharedIncome,
      sharedIncomeRows,
    };

    if (!validate(payload)) return;

    try {
      setIsSaving(true);
      await Axios.post(`/cases/${caseId}/questionnaire/joint-income-and-revenue`, payload);
      setSubmitted(true);
      toast.success("Joint income saved.");
      // Refresh so the sidebar tick turns green
      if (caseId) dispatch(getCasesDetails(caseId));
      if (onContinue) {
        onContinue();
      } else {
        router.push("/dashboard/joint-liabilities-debts");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't save joint income."));
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { data },
        } = await Axios.get(`/cases/${caseId}/section/jointInformation`);

        const jointIncome = data?.jointIncomeAndRevenue;
        if (!jointIncome) return;

        setHasSharedIncome(jointIncome.hasSharedIncome ?? "No");
        setSharedIncomeRows(
          Array.isArray(jointIncome.sharedIncomeRows) ? jointIncome.sharedIncomeRows : []
        );
      } catch (error) {
        console.error("Error fetching shared income:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (caseId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [caseId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-500">Loading your information...</p>
      </div>
    );
  }

  return (
    <FormShell
      title="Shared Income & Revenue"
      stepLabel="Step 2 of 4"
      icon={<Banknote className="h-5 w-5" />}
      description="Please declare any income that you and your partner receive jointly and how you would like that income to be treated under your prenuptial agreement."
    >
      <JointStatusBanner />

      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={!canEdit} className="m-0 min-w-0 border-0 p-0 space-y-6">
          <SectionCard
            title="Shared Income"
            icon={<TrendingUp className="h-5 w-5" />}
            colorIndex={0}
            tooltip="Include any income received jointly by both parties, regardless of whose bank account receives the payment."
          >
            <FieldLabel>
              Do you and your partner receive any income jointly, such as rental income, business
              income, dividends, trust distributions, royalties or investment income?
            </FieldLabel>
            <YesNoToggle name="has_shared_income" value={hasSharedIncome} onChange={handleToggle} />
            <FieldMessage
              error={errors.hasSharedIncome}
              path="hasSharedIncome"
              className="mt-2"
            />

            {hasSharedIncome === "Yes" && (
              <MatrixBox
                title="Shared Income Sources"
                onAdd={() => {
                  clearError("sharedIncomeRows");
                  setSharedIncomeRows((prev) => [...prev, makeSharedIncomeRow()]);
                }}
                addLabel="Add Shared Income Source"
                error={errors.sharedIncomeRows}
                path="sharedIncomeRows"
              >
                {sharedIncomeRows.map((row) => (
                  <RowItem key={row.id} onDelete={() => dropRow(row.id)}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3 items-start">
                      <div>
                        <div className="relative">
                        <input
                          type="text"
                          placeholder="Income Description (e.g. Rental Income, Dividends, Business Income)"
                          title="Examples include rental income, business profits, dividends, royalties, trust distributions, and investment income."
                          value={row.description}
                          onChange={(e) => editRow(row.id, { description: e.target.value })}
                          required
                          className={fieldClassesFor(
                            `${inputClasses} pr-9`,
                            errorAt(row.id, "description"),
                          )}
                        />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                          <Tooltip text="Examples include rental income, business profits, dividends, royalties, trust distributions, and investment income." />
                        </div>
                        </div>
                        <FieldMessage
                          error={errorAt(row.id, "description")}
                          path={fieldPath(row.id, "description")}
                        />
                      </div>
                      <div>
                      <input
                        type="text"
                        placeholder="Income Source (e.g. Company X, ABC Property Management, XYZ Trust)"
                        value={row.source}
                        onChange={(e) => editRow(row.id, { source: e.target.value })}
                        required
                        className={fieldClassesFor(inputClasses, errorAt(row.id, "source"))}
                      />
                      <FieldMessage
                        error={errorAt(row.id, "source")}
                        path={fieldPath(row.id, "source")}
                      />
                      </div>
                      <div>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Annual Income (£)"
                          title="Please provide the approximate annual amount received before any deductions. An estimate is acceptable."
                          value={row.annualIncome}
                          onChange={(e) => editRow(row.id, { annualIncome: e.target.value })}
                          required
                          className={fieldClassesFor(
                            `${inputClasses} pr-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`,
                            errorAt(row.id, "annualIncome"),
                          )}
                        />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                          <Tooltip text="Please provide the approximate annual amount received before any deductions. An estimate is acceptable." />
                        </div>
                      </div>
                      <FieldMessage
                        error={errorAt(row.id, "annualIncome")}
                        path={fieldPath(row.id, "annualIncome")}
                      />
                      </div>
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => editRow(row.id, f)}
                      label="How would you like this income to be treated under the agreement?"
                      options={sharedTreatmentOptions}
                      tooltips={jointIncomeTreatmentTooltips}
                      errors={errorsUnder(errors, rowPath(row.id))}
                      path={rowPath(row.id)}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}
          </SectionCard>
        </fieldset>

        {canEdit ? (
          <SubmitBar
            isSaving={isSaving}
            label="Save & continue"
            withArrow
            backHref="/dashboard/joint-assets"
            errorSummary={summary}
          />
        ) : (
          <div className="mt-8 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/80">
            <Link
              href="/dashboard"
              className="text-[13.5px] font-semibold text-[#5B4DF5] transition hover:text-[#4338CA] text-left cursor-pointer"
            >
              Save and exit
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/joint-assets"
                className="inline-flex h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 text-[13.5px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <Link
                href="/dashboard/joint-liabilities-debts"
                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-[#5B4DF5] hover:from-indigo-700 hover:to-[#4E3EEA] px-7 text-[13.5px] font-semibold text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#5B4DF5]/30 cursor-pointer"
              >
                Next: Shared Liabilities &amp; Debts →
              </Link>
            </div>
          </div>
        )}
      </form>

      {submitted && <p className="mt-4 text-right text-sm text-emerald-600">Saved. Ready for Section 4c.</p>}
    </FormShell>
  );
}
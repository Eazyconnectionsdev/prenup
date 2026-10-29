"use client";

import React, { useState } from "react";
import { Baby, History, PawPrint, Trash2, UsersRound } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import {
  FieldLabel,
  FormShell,
  LoadingState,
  Notice,
  RadioCard,
  SectionCard,
  SubmitBar,
  Tooltip,
  inputClasses,
  makeId,
} from "@/components/questionnaire/QuestionnaireUI";
import {
  PARENTAL_INTENTION_OPTIONS,
  PARENTAL_RELATIONSHIP_OPTIONS,
  PRIOR_MARRIAGE_OPTIONS,
  initialFamilyData,
} from "@/components/questionnaire/family";
import type { ChildRow, FamilyFormData, ParentalIntention, ParentalRelationship, PriorMarriageStatus, YesNoBlank } from "@/types/questionnaire/family";

function makeChildRow(): ChildRow {
  return { id: makeId("child"), fullName: "", dob: "", parentalRelationship: "" };
}

export default function FamilyDependentsForm() {
  const [formData, setFormData] = useState<FamilyFormData>(initialFamilyData);
  const [children, setChildren] = useState<ChildRow[]>([]);

  const { isLoading, isSaving, save, stepInfo } = useQuestionnaire({
    step: "family",
    onLoad: (section) => {
      const family = section.familyAndDependents;
      if (!family) return;
      const { children: fetchedChildren, ...rest } = family;
      setFormData((prev) => ({ ...prev, ...rest }));
      setChildren(Array.isArray(fetchedChildren) ? fetchedChildren : []);
    },
  });

  const isDivorced = formData.priorMarriageStatus === "Yes, previously divorced";

  const handlePriorMarriageChange = (value: PriorMarriageStatus) => {
    setFormData((prev) => ({
      ...prev,
      priorMarriageStatus: value,
      isLegallySeparated: value === "Yes, previously divorced" ? prev.isLegallySeparated : false,
    }));
  };

  const handleHasChildrenChange = (value: YesNoBlank) => {
    setFormData((prev) => ({ ...prev, hasLivingChildren: value }));
    if (value === "Yes") {
      setChildren((prev) => (prev.length === 0 ? [makeChildRow()] : prev));
    }
  };

  const updateChildRow = <K extends keyof ChildRow>(id: string, key: K, value: ChildRow[K]) => {
    setChildren((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    await save({
      priorMarriageStatus: formData.priorMarriageStatus,
      isLegallySeparated: formData.isLegallySeparated,
      hasLivingChildren: formData.hasLivingChildren,
      children,
      futureParentalIntentions: formData.futureParentalIntentions,
      hasFamilyPets: formData.hasFamilyPets,
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      title="Family & Dependents"
      stepLabel={`Step ${stepInfo.number} of ${stepInfo.total}`}
      icon={<UsersRound className="h-5 w-5" />}
      description="Tell us about any previous marriages or civil partnerships, your children, your future family plans, and any family pets you would like this agreement to cover."
    >
      <form onSubmit={handleSubmit} noValidate>
        <SectionCard
          title="Prior Marital History"
          icon={<History className="h-5 w-5" />}
          colorIndex={0}
          tooltip="Disclosing previous marriages is crucial because existing financial orders or maintenance obligations from a prior divorce can affect asset distribution limits in a new agreement."
        >
          <FieldLabel>
            Have you previously been married or in a civil partnership before this relationship?
          </FieldLabel>
          <p className="mb-4 text-[13px] text-slate-500 leading-relaxed">
            If your previous relationship was a civil partnership, please choose the equivalent
            option below.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PRIOR_MARRIAGE_OPTIONS.map((opt) => (
              <RadioCard
                key={opt.id}
                id={opt.id}
                name="prior_marriage_status"
                label={opt.value}
                checked={formData.priorMarriageStatus === opt.value}
                onChange={() => handlePriorMarriageChange(opt.value)}
              />
            ))}
          </div>

          {isDivorced && (
            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-[10px] border border-dashed border-slate-300 bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={formData.isLegallySeparated}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isLegallySeparated: e.target.checked }))
                }
                className="h-[18px] w-[18px] cursor-pointer accent-indigo-600"
              />
              <span className="text-[0.9rem] font-semibold text-slate-900">
                I am currently legally separated, and my divorce has not yet been finalised.
              </span>
            </label>
          )}

          {isDivorced && formData.isLegallySeparated && (
            <Notice tone="warning">
              <strong>Important timeline note:</strong> You can continue completing your
              questionnaire. However, your prenuptial agreement cannot usually be finalised until
              your previous divorce has been legally completed. Your independent solicitor will
              advise you on the appropriate timing.
            </Notice>
          )}
        </SectionCard>

        <SectionCard
          title="Current Children"
          icon={<Baby className="h-5 w-5" />}
          colorIndex={1}
          tooltip="All existing dependents must be declared. UK courts heavily scrutinize prenuptial agreements to ensure the needs and financial stability of any children are fully protected."
        >
          <FieldLabel>
            Do you have any children, including biological, adopted, or stepchildren, from this
            relationship or a previous relationship?
          </FieldLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["Yes", "No"] as const).map((opt) => (
              <RadioCard
                key={opt}
                id={`children_${opt}`}
                name="has_living_children"
                label={opt}
                checked={formData.hasLivingChildren === opt}
                onChange={() => handleHasChildrenChange(opt)}
              />
            ))}
          </div>

          {formData.hasLivingChildren === "Yes" && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-wide text-slate-500">
                <span>Children&apos;s details</span>
                <Tooltip text="Enter the legal first and last name of each child, date of birth, and your parental relationship." />
              </div>

              {children.map((child) => (
                <div
                  key={child.id}
                  className="mb-3 grid grid-cols-1 items-center gap-3.5 rounded-[10px] border border-slate-200 bg-white p-4 sm:grid-cols-[2fr_1.5fr_2fr_auto]"
                >
                  <input
                    type="text"
                    placeholder="Child's full name"
                    title="Enter the legal first and last name of the child."
                    value={child.fullName}
                    onChange={(e) => updateChildRow(child.id, "fullName", e.target.value)}
                    className={inputClasses}
                  />
                  <input
                    type="date"
                    title="Date of birth determines dependency status. Under UK family law, children under 18 (or older with special care needs) carry statutory priority rights."
                    value={child.dob}
                    onChange={(e) => updateChildRow(child.id, "dob", e.target.value)}
                    className={inputClasses}
                  />
                  <select
                    title="Specify the child's relational background."
                    value={child.parentalRelationship}
                    onChange={(e) =>
                      updateChildRow(
                        child.id,
                        "parentalRelationship",
                        e.target.value as ParentalRelationship,
                      )
                    }
                    className={inputClasses}
                  >
                    <option value="">Select parental relationship</option>
                    {PARENTAL_RELATIONSHIP_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setChildren((prev) => prev.filter((c) => c.id !== child.id))}
                    aria-label="Remove child"
                    className="flex h-9 w-9 items-center justify-center justify-self-start rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setChildren((prev) => [...prev, makeChildRow()])}
                className="flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-indigo-400 bg-white/60 px-6 py-3 font-semibold text-indigo-600 transition hover:border-solid hover:border-indigo-600 hover:bg-indigo-50"
              >
                + Add child
              </button>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title={<>Future Family Plans &amp; Pets</>}
          icon={<PawPrint className="h-5 w-5" />}
          colorIndex={2}
        >
          <div className="mb-6">
            <FieldLabel htmlFor="futureParentalIntentions" className="flex items-center justify-between gap-2">
              <span>
                Do you and your partner plan, or think you may decide in the future, to have or adopt
                children together?
              </span>
              <Tooltip text="Anticipating future children is a cornerstone of a robust prenup. If a child is born later and the agreement didn't account for it, a court is highly likely to set the agreement aside due to a change in circumstances." />
            </FieldLabel>
            <select
              id="futureParentalIntentions"
              value={formData.futureParentalIntentions}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  futureParentalIntentions: e.target.value as ParentalIntention,
                }))
              }
              className={inputClasses}
            >
              <option value="" disabled>
                Select an option...
              </option>
              {PARENTAL_INTENTION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel className="flex items-center justify-between gap-2">
              <span>
                Do you currently own, or expect to have, any pets whose ownership or care you would
                like to include in this agreement?
              </span>
              <Tooltip text="In UK law, pets are technically treated as personal property chattels. Specifying pet ownership and maintenance schedules upfront avoids bitter disputes over care costs and custody if a separation happens." />
            </FieldLabel>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["Yes", "No"] as const).map((opt) => (
                <RadioCard
                  key={opt}
                  id={`pets_${opt}`}
                  name="has_family_pets"
                  label={opt}
                  checked={formData.hasFamilyPets === opt}
                  onChange={() => setFormData((prev) => ({ ...prev, hasFamilyPets: opt }))}
                />
              ))}
            </div>
          </div>
        </SectionCard>

        <SubmitBar
          isSaving={isSaving}
          label="Save & continue"
          withArrow
          backHref={stepInfo.prevPath || "/dashboard/legal-declaration"}
        />
      </form>
    </FormShell>
  );
}

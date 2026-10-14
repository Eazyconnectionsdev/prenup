"use client";

import { useState } from "react";
import { Baby, History, PawPrint, UsersRound } from "lucide-react";
import { useQuestionnaire } from "@/components/questionnaire/useQuestionnaire";
import {
  FieldLabel,
  FormShell,
  LoadingState,
  RadioCard,
  SectionCard,
  inputClasses,
} from "@/components/questionnaire/QuestionnaireUI";
import {
  PARENTAL_INTENTION_OPTIONS,
  PARENTAL_RELATIONSHIP_OPTIONS,
  PRIOR_MARRIAGE_OPTIONS,
  initialFamilyData,
} from "@/components/questionnaire/family";
import type { ChildRow, FamilyFormData } from "@/types/questionnaire/family";

export default function PartnerFamilyDependentsView() {
  const [formData, setFormData] = useState<FamilyFormData>(initialFamilyData);
  const [children, setChildren] = useState<ChildRow[]>([]);

  const { isLoading } = useQuestionnaire({
    step: "family",
    source: "partner",
    onLoad: (section) => {
      const family = section.familyAndDependents;
      if (!family) return;
      const { children: fetchedChildren, ...rest } = family;
      setFormData((prev) => ({ ...prev, ...rest }));
      setChildren(Array.isArray(fetchedChildren) ? fetchedChildren : []);
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <FormShell
      readOnly
      title="Partner's Family & Dependents"
      icon={<UsersRound className="h-5 w-5" />}
      description="A read-only view of the family and dependents information your partner has provided."
    >
      <SectionCard title="Prior Marital History" icon={<History className="h-5 w-5" />}>
        <FieldLabel>Previously married or in a civil partnership before this relationship?</FieldLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PRIOR_MARRIAGE_OPTIONS.map((opt) => (
            <RadioCard
              key={opt.id}
              id={opt.id}
              name="prior_marriage_status"
              label={opt.value}
              checked={formData.priorMarriageStatus === opt.value}
              readOnly
            />
          ))}
        </div>

        {formData.priorMarriageStatus === "Yes, previously divorced" && (
          <div className="mt-4 flex items-center gap-3 rounded-[10px] border border-dashed border-slate-300 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={formData.isLegallySeparated}
              disabled
              className="h-[18px] w-[18px] accent-indigo-600"
            />
            <span className="text-[0.9rem] font-semibold text-slate-900">
              Currently legally separated, and the divorce has not yet been finalised.
            </span>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Current Children" icon={<Baby className="h-5 w-5" />}>
        <FieldLabel>
          Any children, including biological, adopted, or stepchildren, from this relationship or a
          previous relationship?
        </FieldLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(["Yes", "No"] as const).map((opt) => (
            <RadioCard
              key={opt}
              id={`children_${opt}`}
              name="has_living_children"
              label={opt}
              checked={formData.hasLivingChildren === opt}
              readOnly
            />
          ))}
        </div>

        {formData.hasLivingChildren === "Yes" && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
            <div className="mb-4 text-[0.8rem] font-bold uppercase tracking-wide text-slate-500">
              Children&apos;s details
            </div>
            {children.map((child) => (
              <div
                key={child.id}
                className="mb-3 grid grid-cols-1 items-center gap-3.5 rounded-[10px] border border-slate-200 bg-white p-4 sm:grid-cols-3"
              >
                <input
                  type="text"
                  placeholder="Child's full name"
                  value={child.fullName}
                  disabled
                  className={inputClasses}
                />
                <input type="date" value={child.dob} disabled className={inputClasses} />
                <select value={child.parentalRelationship} disabled className={inputClasses}>
                  <option value="">Parental relationship</option>
                  {PARENTAL_RELATIONSHIP_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title={<>Future Family Plans &amp; Pets</>}
        icon={<PawPrint className="h-5 w-5" />}
      >
        <div className="mb-6">
          <FieldLabel>Plans to have or adopt children together in the future?</FieldLabel>
          <select value={formData.futureParentalIntentions} disabled className={inputClasses}>
            <option value="">Not answered</option>
            {PARENTAL_INTENTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel>
            Any pets whose ownership or care should be included in this agreement?
          </FieldLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["Yes", "No"] as const).map((opt) => (
              <RadioCard
                key={opt}
                id={`pets_${opt}`}
                name="has_family_pets"
                label={opt}
                checked={formData.hasFamilyPets === opt}
                readOnly
              />
            ))}
          </div>
        </div>
      </SectionCard>
    </FormShell>
  );
}

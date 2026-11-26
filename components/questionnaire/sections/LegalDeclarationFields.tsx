"use client";

import React from "react";
import { ClipboardList, ShieldCheck } from "lucide-react";
import {
  CheckCard,
  FieldLabel,
  FieldMessage,
  NumberedQuestion,
  SectionTitle,
  YesNoToggle,
  cardTextareaClasses,
  fieldClassesFor,
  inputClasses,
} from "../QuestionnaireUI";
import {
  BACKGROUND_INTRO,
  DECLARATIONS,
  DECLARATIONS_INTRO,
  INTERNATIONAL_DETAIL_LABEL,
  INTERNATIONAL_QUESTION,
  INTERNATIONAL_TOOLTIP,
  LIVING_QUESTION,
  LIVING_TOOLTIP,
  OBJECTIVES_HINT,
  OBJECTIVES_QUESTION,
  OBJECTIVES_TOOLTIP,
  PREVIOUS_AGREEMENT_QUESTION,
  PREVIOUS_AGREEMENT_STATUSES,
  PREVIOUS_AGREEMENT_TOOLTIP,
  PREVIOUS_AGREEMENT_TYPES,
} from "../declarations";
import type { DeclarationsFormData } from "@/types/questionnaire/declarations";
import type { FormErrors } from "@/lib/validations/formErrors";

type Patch = Partial<DeclarationsFormData>;

/**
 * The Legal Declarations questions, used by the couple's own form and (read
 * only) by the view of the partner's answers.
 */
export function LegalDeclarationFields({
  data,
  onChange,
  readOnly,
  errors = {},
}: {
  data: DeclarationsFormData;
  /** Receives the fields that changed; omitted when read only. */
  onChange?: (patch: Patch) => void;
  readOnly?: boolean;
  errors?: FormErrors;
}) {
  const set = (patch: Patch) => onChange?.(patch);

  return (
    <>
      <SectionTitle icon={<ClipboardList className="h-5 w-5" />}>Background Questions</SectionTitle>
      <p className="-mt-2 mb-4 text-[13px] leading-relaxed text-slate-500">{BACKGROUND_INTRO}</p>

      <div className="space-y-5">
        <NumberedQuestion
          number={1}
          htmlFor="agreementObjectives"
          question={OBJECTIVES_QUESTION}
          tooltip={OBJECTIVES_TOOLTIP}
          error={errors.agreementObjectives}
        >
          <textarea
            id="agreementObjectives"
            name="agreementObjectives"
            rows={4}
            maxLength={1500}
            disabled={readOnly}
            placeholder="Enter your response..."
            value={data.agreementObjectives}
            onChange={(e) => set({ agreementObjectives: e.target.value })}
            className={fieldClassesFor(cardTextareaClasses, errors.agreementObjectives)}
          />
          {!readOnly && <p className="mt-1.5 text-[11.5px] text-slate-500">{OBJECTIVES_HINT}</p>}
        </NumberedQuestion>

        <NumberedQuestion
          number={2}
          htmlFor="livingSituationFuture"
          question={LIVING_QUESTION}
          tooltip={LIVING_TOOLTIP}
          error={errors.livingSituationFuture}
        >
          <textarea
            id="livingSituationFuture"
            name="livingSituationFuture"
            rows={4}
            maxLength={1500}
            disabled={readOnly}
            placeholder="Enter your response..."
            value={data.livingSituationFuture}
            onChange={(e) => set({ livingSituationFuture: e.target.value })}
            className={fieldClassesFor(cardTextareaClasses, errors.livingSituationFuture)}
          />
        </NumberedQuestion>

        <NumberedQuestion
          number={3}
          question={PREVIOUS_AGREEMENT_QUESTION}
          tooltip={PREVIOUS_AGREEMENT_TOOLTIP}
          error={errors.hasPreviousAgreement}
          path="hasPreviousAgreement"
        >
          <YesNoToggle
            name="hasPreviousAgreement"
            value={(data.hasPreviousAgreement as "Yes" | "No" | "") ?? ""}
            readOnly={readOnly}
            onChange={(v) =>
              set(
                v === "Yes"
                  ? { hasPreviousAgreement: v }
                  : {
                      hasPreviousAgreement: v,
                      previousAgreementType: "",
                      previousAgreementStatus: "",
                      previousAgreementSummary: "",
                    },
              )
            }
          />
          {data.hasPreviousAgreement === "Yes" && (
            <div className="space-y-3.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <FieldLabel htmlFor="previousAgreementType">Type of agreement or order</FieldLabel>
                <select
                  id="previousAgreementType"
                  disabled={readOnly}
                  value={data.previousAgreementType}
                  onChange={(e) => set({ previousAgreementType: e.target.value })}
                  className={fieldClassesFor(`${inputClasses} bg-white`, errors.previousAgreementType)}
                >
                  <option value="">Please select</option>
                  {PREVIOUS_AGREEMENT_TYPES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <FieldMessage error={errors.previousAgreementType} path="previousAgreementType" />
              </div>
              <div>
                <FieldLabel htmlFor="previousAgreementStatus">
                  Does it still apply or have ongoing effect?
                </FieldLabel>
                <select
                  id="previousAgreementStatus"
                  disabled={readOnly}
                  value={data.previousAgreementStatus}
                  onChange={(e) => set({ previousAgreementStatus: e.target.value })}
                  className={fieldClassesFor(`${inputClasses} bg-white`, errors.previousAgreementStatus)}
                >
                  <option value="">Please select</option>
                  {PREVIOUS_AGREEMENT_STATUSES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <FieldMessage error={errors.previousAgreementStatus} path="previousAgreementStatus" />
              </div>
              <div>
                <FieldLabel htmlFor="previousAgreementSummary">
                  Approximate date and brief summary
                </FieldLabel>
                <textarea
                  id="previousAgreementSummary"
                  rows={3}
                  maxLength={1500}
                  disabled={readOnly}
                  placeholder="Provide any details you know..."
                  value={data.previousAgreementSummary}
                  onChange={(e) => set({ previousAgreementSummary: e.target.value })}
                  className={cardTextareaClasses}
                />
              </div>
            </div>
          )}
        </NumberedQuestion>

        <NumberedQuestion
          number={4}
          question={INTERNATIONAL_QUESTION}
          tooltip={INTERNATIONAL_TOOLTIP}
          error={errors.hasInternationalConnections}
          path="hasInternationalConnections"
        >
          <YesNoToggle
            name="hasInternationalConnections"
            value={(data.hasInternationalConnections as "Yes" | "No" | "") ?? ""}
            readOnly={readOnly}
            onChange={(v) =>
              set(
                v === "Yes"
                  ? { hasInternationalConnections: v }
                  : { hasInternationalConnections: v, internationalSummary: "" },
              )
            }
          />
          {data.hasInternationalConnections === "Yes" && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <FieldLabel htmlFor="internationalSummary">{INTERNATIONAL_DETAIL_LABEL}</FieldLabel>
              <textarea
                id="internationalSummary"
                rows={3}
                maxLength={1500}
                disabled={readOnly}
                placeholder="Enter the relevant details..."
                value={data.internationalSummary}
                onChange={(e) => set({ internationalSummary: e.target.value })}
                className={fieldClassesFor(cardTextareaClasses, errors.internationalSummary)}
              />
              <FieldMessage error={errors.internationalSummary} path="internationalSummary" />
            </div>
          )}
        </NumberedQuestion>
      </div>

      <SectionTitle icon={<ShieldCheck className="h-5 w-5" />}>
        Declarations of Understanding
      </SectionTitle>
      <p className="-mt-2 mb-4 text-[13px] leading-relaxed text-slate-500">{DECLARATIONS_INTRO}</p>

      {DECLARATIONS.map((d, i) => (
        <CheckCard
          key={d.id}
          id={d.id}
          name={d.name}
          title={`${i + 1}. ${d.title}`}
          description={d.description}
          acknowledgement={d.acknowledgement}
          checked={Boolean(data[d.name])}
          readOnly={readOnly}
          onChange={(e) => set({ [d.name]: e.target.checked } as Patch)}
          error={errors[d.name]}
        />
      ))}
    </>
  );
}

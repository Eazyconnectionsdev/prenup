"use client";

import React from "react";
import { Baby, HeartHandshake, History, PawPrint, Trash2 } from "lucide-react";
import {
  FieldLabel,
  FieldMessage,
  Notice,
  RadioCard,
  SectionCard,
  Tooltip,
  cardTextareaClasses,
  fieldClassesFor,
  inputClasses,
} from "../QuestionnaireUI";
import {
  CHILDREN_QUESTION,
  CHILDREN_TOOLTIP,
  DEPENDANTS_DETAIL_LABEL,
  DEPENDANTS_QUESTION,
  DEPENDANTS_TOOLTIP,
  FUTURE_PLANS_QUESTION,
  FUTURE_PLANS_TOOLTIP,
  NOT_FINALISED_SITUATIONS,
  PARENTAL_INTENTION_OPTIONS,
  PARENTAL_RELATIONSHIP_OPTIONS,
  PETS_DETAIL_LABEL,
  PETS_QUESTION,
  PETS_TOOLTIP,
  PRIOR_QUESTION,
  PRIOR_SITUATION_OPTIONS,
  PRIOR_TOOLTIP,
  PRIOR_YES_NO,
  YES_NO_NOT_SURE,
  makeChildRow,
  makePriorRelationshipRow,
} from "../family";
import { errorsUnder, type FormErrors } from "@/lib/validations/formErrors";
import type {
  ChildRow,
  FamilyFormData,
  ParentalIntention,
  ParentalRelationship,
  PriorRelationshipRow,
  YesNoBlank,
  YesNoNotSure,
} from "@/types/questionnaire/family";

type Update = (updater: (prev: FamilyFormData) => FamilyFormData) => void;

function QuestionLabel({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) {
  return (
    <FieldLabel className="mb-3 flex items-start justify-between gap-2 text-[13.5px] font-bold leading-relaxed text-slate-900">
      <span>{children}</span>
      {tooltip && <Tooltip text={tooltip} />}
    </FieldLabel>
  );
}

function YesNoCards({
  name,
  value,
  options,
  onChange,
  readOnly,
}: {
  name: string;
  value: YesNoBlank;
  options?: { value: "Yes" | "No"; label: string }[];
  onChange: (v: "Yes" | "No") => void;
  readOnly?: boolean;
}) {
  const opts = options ?? [
    { value: "Yes" as const, label: "Yes" },
    { value: "No" as const, label: "No" },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {opts.map((opt) => (
        <RadioCard
          key={opt.value}
          id={`${name}_${opt.value}`}
          name={name}
          label={opt.label}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}

const subPanel = "mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5";
const whiteInput = `${inputClasses} bg-white`;

/**
 * The Family & Dependents questions, used by the couple's own form and (read
 * only) by the view of the partner's answers.
 */
export function FamilyFields({
  data,
  onChange,
  readOnly,
  errors = {},
  clearError,
}: {
  data: FamilyFormData;
  onChange?: Update;
  readOnly?: boolean;
  errors?: FormErrors;
  clearError?: (path: string) => void;
}) {
  const update: Update = (fn) => onChange?.(fn);
  const clear = (...paths: string[]) => paths.forEach((p) => clearError?.(p));

  /* Prior relationships */
  const setPrior = (v: "Yes" | "No") => {
    clear("hasPriorRelationship", "priorRelationships");
    update((prev) => ({
      ...prev,
      hasPriorRelationship: v,
      priorRelationships:
        v === "Yes"
          ? prev.priorRelationships.length
            ? prev.priorRelationships
            : [makePriorRelationshipRow()]
          : [],
    }));
  };
  const updatePrior = <K extends keyof PriorRelationshipRow>(
    index: number,
    key: K,
    value: PriorRelationshipRow[K],
  ) => {
    clear(`priorRelationships.${index}.${String(key)}`);
    update((prev) => ({
      ...prev,
      priorRelationships: prev.priorRelationships.map((r, i) =>
        i === index ? { ...r, [key]: value } : r,
      ),
    }));
  };

  /* Children */
  const setChildren = (v: "Yes" | "No") => {
    clear("hasLivingChildren", "children");
    update((prev) => ({
      ...prev,
      hasLivingChildren: v,
      children: v === "Yes" ? (prev.children.length ? prev.children : [makeChildRow()]) : [],
    }));
  };
  const updateChild = <K extends keyof ChildRow>(index: number, key: K, value: ChildRow[K]) => {
    clear(`children.${index}.${String(key)}`);
    update((prev) => ({
      ...prev,
      children: prev.children.map((c, i) => (i === index ? { ...c, [key]: value } : c)),
    }));
  };

  const notFinalised = data.priorRelationships.some((r) =>
    NOT_FINALISED_SITUATIONS.includes(r.situation),
  );

  return (
    <div className="space-y-6">
      {/* 1. Prior marital history */}
      <SectionCard title="Prior Marital History" icon={<History className="h-5 w-5" />} colorIndex={0}>
        <QuestionLabel tooltip={PRIOR_TOOLTIP}>{PRIOR_QUESTION}</QuestionLabel>
        <YesNoCards
          name="has_prior_relationship"
          value={data.hasPriorRelationship}
          options={PRIOR_YES_NO}
          onChange={setPrior}
          readOnly={readOnly}
        />
        <FieldMessage
          error={errors.hasPriorRelationship ?? errors.priorRelationships}
          path={errors.hasPriorRelationship ? "hasPriorRelationship" : "priorRelationships"}
          className="mt-2"
        />

        {data.hasPriorRelationship === "Yes" && (
          <div className={subPanel}>
            {data.priorRelationships.map((row, index) => {
              const rowErrors = errorsUnder(errors, `priorRelationships.${index}`);
              return (
                <div
                  key={row.id}
                  className={`mb-3 rounded-xl border bg-white p-4 ${
                    Object.keys(rowErrors).length ? "border-rose-300" : "border-slate-200"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-[12.5px] font-bold text-slate-900">
                      Previous relationship {index + 1}
                    </span>
                    {!readOnly && index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          clear("priorRelationships");
                          update((prev) => ({
                            ...prev,
                            priorRelationships: prev.priorRelationships.filter((r) => r.id !== row.id),
                          }));
                        }}
                        className="text-[11.5px] font-semibold text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <FieldLabel className="mb-1.5 block text-[12.5px] font-bold text-slate-800">
                        Please select the situation that applies
                      </FieldLabel>
                      <select
                        value={row.situation}
                        disabled={readOnly}
                        onChange={(e) => updatePrior(index, "situation", e.target.value)}
                        className={fieldClassesFor(whiteInput, rowErrors.situation)}
                      >
                        <option value="">Select an option...</option>
                        {PRIOR_SITUATION_OPTIONS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                      <FieldMessage
                        error={rowErrors.situation}
                        path={`priorRelationships.${index}.situation`}
                      />
                    </div>

                    <div>
                      <FieldLabel className="mb-1.5 block text-[12.5px] font-bold text-slate-800">
                        Briefly provide the approximate date and any relevant details
                      </FieldLabel>
                      <textarea
                        rows={2}
                        maxLength={1500}
                        disabled={readOnly}
                        value={row.details}
                        placeholder="Optional details..."
                        onChange={(e) => updatePrior(index, "details", e.target.value)}
                        className={cardTextareaClasses}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <div>
                        <FieldLabel className="mb-1.5 block text-[12.5px] font-bold text-slate-800">
                          Are there any financial orders or ongoing financial obligations from this
                          relationship?
                        </FieldLabel>
                        <select
                          value={row.financialObligations}
                          disabled={readOnly}
                          onChange={(e) =>
                            updatePrior(index, "financialObligations", e.target.value as YesNoNotSure)
                          }
                          className={whiteInput}
                        >
                          <option value="">Select an option...</option>
                          {YES_NO_NOT_SURE.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <FieldLabel className="mb-1.5 block text-[12.5px] font-bold text-slate-800">
                          Were there any children from this previous relationship?
                        </FieldLabel>
                        <select
                          value={row.childrenFromRelationship}
                          disabled={readOnly}
                          onChange={(e) =>
                            updatePrior(
                              index,
                              "childrenFromRelationship",
                              e.target.value as YesNoNotSure,
                            )
                          }
                          className={whiteInput}
                        >
                          <option value="">Select an option...</option>
                          {YES_NO_NOT_SURE.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {!readOnly && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    clear("priorRelationships");
                    update((prev) => ({
                      ...prev,
                      priorRelationships: [...prev.priorRelationships, makePriorRelationshipRow()],
                    }));
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-indigo-400 bg-white/60 px-6 py-3 text-[13px] font-semibold text-indigo-600 transition hover:border-solid hover:border-indigo-600 hover:bg-indigo-50"
                >
                  + Add another previous relationship
                </button>
                <p className="mt-2 text-[11.5px] text-slate-500">
                  You can add an entry for each previous marriage or civil partnership.
                </p>
              </>
            )}

            {notFinalised && (
              <Notice tone="warning">
                <strong>Important timeline note:</strong> You can continue completing your
                questionnaire. However, your prenuptial agreement cannot usually be finalised until
                your previous divorce or dissolution has been legally completed. Your independent
                solicitor will advise you on the appropriate timing.
              </Notice>
            )}
          </div>
        )}
      </SectionCard>

      {/* 2. Current children */}
      <SectionCard title="Current Children" icon={<Baby className="h-5 w-5" />} colorIndex={1}>
        <QuestionLabel tooltip={CHILDREN_TOOLTIP}>{CHILDREN_QUESTION}</QuestionLabel>
        <YesNoCards
          name="has_living_children"
          value={data.hasLivingChildren}
          onChange={setChildren}
          readOnly={readOnly}
        />
        <FieldMessage
          error={errors.hasLivingChildren ?? errors.children}
          path={errors.hasLivingChildren ? "hasLivingChildren" : "children"}
          className="mt-2"
        />

        {data.hasLivingChildren === "Yes" && (
          <div className={subPanel}>
            {data.children.map((child, index) => {
              const rowErrors = errorsUnder(errors, `children.${index}`);
              return (
                <div
                  key={child.id}
                  className={`mb-3 grid grid-cols-1 items-start gap-3.5 rounded-[10px] border bg-white p-4 sm:grid-cols-[2fr_1.5fr_2fr_auto] ${
                    Object.keys(rowErrors).length ? "border-rose-300" : "border-slate-200"
                  }`}
                >
                  <div>
                    <input
                      type="text"
                      aria-label="Child's full name"
                      placeholder="Child's full name"
                      disabled={readOnly}
                      value={child.fullName}
                      onChange={(e) => updateChild(index, "fullName", e.target.value)}
                      className={fieldClassesFor(inputClasses, rowErrors.fullName)}
                    />
                    <FieldMessage error={rowErrors.fullName} path={`children.${index}.fullName`} />
                  </div>
                  <div>
                    <input
                      type="date"
                      aria-label="Child's date of birth"
                      disabled={readOnly}
                      value={child.dob}
                      onChange={(e) => updateChild(index, "dob", e.target.value)}
                      className={fieldClassesFor(inputClasses, rowErrors.dob)}
                    />
                    <FieldMessage error={rowErrors.dob} path={`children.${index}.dob`} />
                  </div>
                  <div>
                    <select
                      aria-label="Parental relationship"
                      disabled={readOnly}
                      value={child.parentalRelationship}
                      onChange={(e) =>
                        updateChild(
                          index,
                          "parentalRelationship",
                          e.target.value as ParentalRelationship,
                        )
                      }
                      className={fieldClassesFor(inputClasses, rowErrors.parentalRelationship)}
                    >
                      <option value="">Select parental relationship</option>
                      {PARENTAL_RELATIONSHIP_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <FieldMessage
                      error={rowErrors.parentalRelationship}
                      path={`children.${index}.parentalRelationship`}
                    />
                  </div>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        clear("children");
                        update((prev) => ({
                          ...prev,
                          children: prev.children.filter((c) => c.id !== child.id),
                        }));
                      }}
                      aria-label="Remove child"
                      className="flex h-9 w-9 items-center justify-center justify-self-start rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-[18px] w-[18px]" />
                    </button>
                  )}
                </div>
              );
            })}

            {!readOnly && (
              <button
                type="button"
                onClick={() => {
                  clear("children");
                  update((prev) => ({ ...prev, children: [...prev.children, makeChildRow()] }));
                }}
                className="flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-indigo-400 bg-white/60 px-6 py-3 text-[13px] font-semibold text-indigo-600 transition hover:border-solid hover:border-indigo-600 hover:bg-indigo-50"
              >
                + Add child
              </button>
            )}
          </div>
        )}
      </SectionCard>

      {/* 3. Future family plans & pets */}
      <SectionCard
        title={<>Future Family Plans &amp; Pets</>}
        icon={<PawPrint className="h-5 w-5" />}
        colorIndex={2}
      >
        <div className="mb-6">
          <QuestionLabel tooltip={FUTURE_PLANS_TOOLTIP}>{FUTURE_PLANS_QUESTION}</QuestionLabel>
          <select
            id="futureParentalIntentions"
            disabled={readOnly}
            value={data.futureParentalIntentions}
            onChange={(e) => {
              clear("futureParentalIntentions");
              update((prev) => ({
                ...prev,
                futureParentalIntentions: e.target.value as ParentalIntention,
              }));
            }}
            className={fieldClassesFor(inputClasses, errors.futureParentalIntentions)}
          >
            <option value="">Select an option...</option>
            {PARENTAL_INTENTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <FieldMessage error={errors.futureParentalIntentions} path="futureParentalIntentions" />
        </div>

        <div>
          <QuestionLabel tooltip={PETS_TOOLTIP}>{PETS_QUESTION}</QuestionLabel>
          <YesNoCards
            name="has_family_pets"
            value={data.hasFamilyPets}
            readOnly={readOnly}
            onChange={(v) => {
              clear("hasFamilyPets", "petsDetails");
              update((prev) => ({
                ...prev,
                hasFamilyPets: v,
                petsDetails: v === "Yes" ? prev.petsDetails : "",
              }));
            }}
          />
          <FieldMessage error={errors.hasFamilyPets} path="hasFamilyPets" className="mt-2" />
          {data.hasFamilyPets === "Yes" && (
            <div className={subPanel}>
              <FieldLabel
                htmlFor="petsDetails"
                className="mb-1.5 block text-[12.5px] font-bold text-slate-800"
              >
                {PETS_DETAIL_LABEL}
              </FieldLabel>
              <textarea
                id="petsDetails"
                rows={3}
                maxLength={1500}
                disabled={readOnly}
                value={data.petsDetails}
                placeholder="For example, type of pet and your intended care arrangements..."
                onChange={(e) => {
                  clear("petsDetails");
                  update((prev) => ({ ...prev, petsDetails: e.target.value }));
                }}
                className={fieldClassesFor(cardTextareaClasses, errors.petsDetails)}
              />
              <FieldMessage error={errors.petsDetails} path="petsDetails" />
            </div>
          )}
        </div>
      </SectionCard>

      {/* 4. Other dependants */}
      <SectionCard
        title="Other Dependants"
        icon={<HeartHandshake className="h-5 w-5" />}
        colorIndex={3}
      >
        <QuestionLabel tooltip={DEPENDANTS_TOOLTIP}>{DEPENDANTS_QUESTION}</QuestionLabel>
        <YesNoCards
          name="has_other_dependants"
          value={data.hasOtherDependants}
          readOnly={readOnly}
          onChange={(v) => {
            clear("hasOtherDependants");
            update((prev) => ({
              ...prev,
              hasOtherDependants: v,
              dependantsDetails: v === "Yes" ? prev.dependantsDetails : "",
            }));
          }}
        />
        <FieldMessage error={errors.hasOtherDependants} path="hasOtherDependants" className="mt-2" />
        {data.hasOtherDependants === "Yes" && (
          <div className={subPanel}>
            <FieldLabel
              htmlFor="dependantsDetails"
              className="mb-1.5 block text-[12.5px] font-bold text-slate-800"
            >
              {DEPENDANTS_DETAIL_LABEL}
            </FieldLabel>
            <textarea
              id="dependantsDetails"
              rows={3}
              maxLength={1500}
              disabled={readOnly}
              value={data.dependantsDetails}
              placeholder="Optional details..."
              onChange={(e) => update((prev) => ({ ...prev, dependantsDetails: e.target.value }))}
              className={cardTextareaClasses}
            />
          </div>
        )}
      </SectionCard>
    </div>
  );
}

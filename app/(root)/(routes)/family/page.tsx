"use client"

import React, { useState, ChangeEvent, FormEvent } from "react";

type PriorMarriageStatus =
  | "No, never married"
  | "Yes, previously divorced"
  | "Yes, widowed"
  | "";

type YesNo = "Yes" | "No" | "";

type ParentalIntention = "Yes" | "No" | "Undecided" | "";

type ParentalRelationship =
  | "My child from a prior relationship"
  | "My partner's child from a prior relationship"
  | "Our mutual child (born or adopted within our relationship)"
  | "";

interface ChildRow {
  id: string;
  fullName: string;
  dob: string;
  parentalRelationship: ParentalRelationship;
}

interface FamilyFormData {
  priorMarriageStatus: PriorMarriageStatus;
  isLegallySeparated: boolean;
  hasLivingChildren: YesNo;
  futureParentalIntentions: ParentalIntention;
  hasFamilyPets: YesNo;
}

const initialFormData: FamilyFormData = {
  priorMarriageStatus: "",
  isLegallySeparated: false,
  hasLivingChildren: "",
  futureParentalIntentions: "",
  hasFamilyPets: "",
};

const steps = [
  { label: "1. Personal Information", status: "completed" as const },
  { label: "2. Family & Dependents", status: "active" as const },
  { label: "3. Finances", status: "upcoming" as const },
];

function makeChildRow(): ChildRow {
  return {
    id: `child_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    fullName: "",
    dob: "",
    parentalRelationship: "",
  };
}

interface RadioCardProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function RadioCard({ id, name, value, label, checked, onChange }: RadioCardProps) {
  return (
    <label
      htmlFor={id}
      className={`relative flex cursor-pointer items-center gap-3.5 rounded-[10px] border px-4 py-4 transition ${
        checked
          ? "border-indigo-600 bg-slate-50"
          : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
      }`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required
        className="sr-only"
      />
      <span
        className={`relative h-5 w-5 flex-shrink-0 rounded-full border-2 transition ${
          checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
        }`}
      >
        {checked && (
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        )}
      </span>
      <span className={`text-[0.925rem] font-semibold transition ${checked ? "text-indigo-600" : "text-slate-900"}`}>
        {label}
      </span>
    </label>
  );
}

export default function FamilyDependentsForm() {
  const [formData, setFormData] = useState<FamilyFormData>(initialFormData);
  const [children, setChildren] = useState<ChildRow[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const showSeparationCheckbox = formData.priorMarriageStatus === "Yes, previously divorced";
  const showSeparationWarning = showSeparationCheckbox && formData.isLegallySeparated;
  const showChildrenMatrix = formData.hasLivingChildren === "Yes";

  const handlePriorMarriageChange = (value: PriorMarriageStatus) => {
    setFormData((prev) => ({
      ...prev,
      priorMarriageStatus: value,
      isLegallySeparated: value === "Yes, previously divorced" ? prev.isLegallySeparated : false,
    }));
  };

  const handleHasChildrenChange = (value: YesNo) => {
    setFormData((prev) => ({ ...prev, hasLivingChildren: value }));
    if (value === "Yes") {
      setChildren((prev) => (prev.length === 0 ? [makeChildRow()] : prev));
    }
  };

  const addChildRow = () => {
    setChildren((prev) => [...prev, makeChildRow()]);
  };

  const removeChildRow = (id: string) => {
    setChildren((prev) => prev.filter((c) => c.id !== id));
  };

  const updateChildRow = <K extends keyof ChildRow>(id: string, key: K, value: ChildRow[K]) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.alert("Family & Dependents information saved successfully. Moving to Section 3: Finances.");
  };

  const inputClasses =
    "w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10";

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-16">
      <div className="mx-auto max-w-3xl">

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-12 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Family & Dependents
          </h2>
          <p className="mb-10 text-[0.95rem] text-slate-500">
            Tell us about your previous marriages or civil partnerships, your
            children, your future family plans, and any family pets you would
            like this agreement to cover.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* MODULE 1: PRIOR MARITAL HISTORY */}
            <div className="mb-6 border-b-2 border-slate-100 pb-2.5 text-[1.25rem] font-bold tracking-tight text-slate-900">
              Prior Marital History
            </div>
            <div className="mb-7">
              <label className="mb-2.5 block text-[0.95rem] font-semibold text-slate-800">
                Have you previously been married or in a civil partnership
                before this relationship?
              </label>
              <p className="-mt-1.5 mb-4 text-[0.85rem] italic text-slate-500">
                Note: If your previous relationship was a civil partnership
                rather than a marriage, please choose the equivalent option
                below.
              </p>

              <div className="mb-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <RadioCard
                  id="pm_never"
                  name="prior_marriage_status"
                  value="No, never married"
                  label="No, never married"
                  checked={formData.priorMarriageStatus === "No, never married"}
                  onChange={() => handlePriorMarriageChange("No, never married")}
                />
                <RadioCard
                  id="pm_divorced"
                  name="prior_marriage_status"
                  value="Yes, previously divorced"
                  label="Yes, previously divorced"
                  checked={formData.priorMarriageStatus === "Yes, previously divorced"}
                  onChange={() => handlePriorMarriageChange("Yes, previously divorced")}
                />
                <RadioCard
                  id="pm_widowed"
                  name="prior_marriage_status"
                  value="Yes, widowed"
                  label="Yes, widowed"
                  checked={formData.priorMarriageStatus === "Yes, widowed"}
                  onChange={() => handlePriorMarriageChange("Yes, widowed")}
                />
              </div>

              {showSeparationCheckbox && (
                <div className="mt-4 rounded-[10px] border border-dashed border-slate-300 bg-slate-50 p-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isLegallySeparated}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isLegallySeparated: e.target.checked }))
                      }
                      className="h-[18px] w-[18px] cursor-pointer"
                    />
                    <span className="text-[0.9rem] font-semibold text-slate-900">
                      I am currently legally separated, and my divorce has not
                      yet been finalised.
                    </span>
                  </label>
                </div>
              )}

              {showSeparationWarning && (
                <div className="mt-3.5 rounded-[10px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
                  <strong>⚠️ Important Timeline Note:</strong> You can
                  continue completing your questionnaire. However, your
                  prenuptial agreement cannot usually be finalised until your
                  previous divorce has been legally completed. Your
                  independent solicitor will advise you on the appropriate
                  timing.
                </div>
              )}
            </div>

            {/* MODULE 2: CURRENT CHILDREN STATUS */}
            <div className="mb-6 mt-12 border-b-2 border-slate-100 pb-2.5 text-[1.25rem] font-bold tracking-tight text-slate-900">
              Current Children Status
            </div>
            <div className="mb-7">
              <label className="mb-2.5 block text-[0.95rem] font-semibold text-slate-800">
                Do you have any children, including biological, adopted, or
                stepchildren, from this relationship or a previous
                relationship?
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <RadioCard
                  id="children_yes"
                  name="has_living_children"
                  value="Yes"
                  label="Yes"
                  checked={formData.hasLivingChildren === "Yes"}
                  onChange={() => handleHasChildrenChange("Yes")}
                />
                <RadioCard
                  id="children_no"
                  name="has_living_children"
                  value="No"
                  label="No"
                  checked={formData.hasLivingChildren === "No"}
                  onChange={() => handleHasChildrenChange("No")}
                />
              </div>
            </div>

            {/* DYNAMIC MODULE: CHILDREN'S DETAILS MATRIX */}
            {showChildrenMatrix && (
              <div className="mb-7 rounded-[10px] border border-slate-300 bg-slate-50 p-6">
                <div className="mb-4 text-[1.05rem] font-bold text-slate-900">
                  Children's Details
                </div>
                <div>
                  {children.map((child) => (
                    <div
                      key={child.id}
                      className="mb-3 grid grid-cols-1 items-center gap-3.5 rounded-[10px] border border-slate-300 bg-white p-4 sm:grid-cols-[2fr_1.5fr_2fr_auto]"
                    >
                      <input
                        type="text"
                        placeholder="Child's Full Name"
                        value={child.fullName}
                        onChange={(e) => updateChildRow(child.id, "fullName", e.target.value)}
                        required
                        className={inputClasses}
                      />
                      <input
                        type="date"
                        value={child.dob}
                        onChange={(e) => updateChildRow(child.id, "dob", e.target.value)}
                        required
                        className={inputClasses}
                      />
                      <select
                        value={child.parentalRelationship}
                        onChange={(e) =>
                          updateChildRow(
                            child.id,
                            "parentalRelationship",
                            e.target.value as ParentalRelationship
                          )
                        }
                        required
                        className={inputClasses}
                      >
                        <option value="">Select Parental Relationship</option>
                        <option value="My child from a prior relationship">
                          My child from a previous relationship
                        </option>
                        <option value="My partner's child from a prior relationship">
                          My partner's child from a previous relationship
                        </option>
                        <option value="Our mutual child (born or adopted within our relationship)">
                          Our child together (born or adopted during our relationship)
                        </option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeChildRow(child.id)}
                        aria-label="Remove child"
                        className="flex h-9 w-9 items-center justify-center justify-self-start rounded-full text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addChildRow}
                  className="flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-indigo-600 bg-transparent px-6 py-3 font-semibold text-indigo-600 transition hover:border-solid hover:bg-indigo-100"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Child
                </button>
              </div>
            )}

            {/* MODULE 3: FUTURE FAMILY PLANS & PETS */}
            <div className="mb-6 mt-12 border-b-2 border-slate-100 pb-2.5 text-[1.25rem] font-bold tracking-tight text-slate-900">
              Future Family Plans & Pets
            </div>

            <div className="mb-7">
              <label className="mb-2.5 block text-[0.95rem] font-semibold text-slate-800">
                Do you and your partner plan, or think you may decide in the
                future, to have or adopt children together?
              </label>
              <select
                value={formData.futureParentalIntentions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    futureParentalIntentions: e.target.value as ParentalIntention,
                  }))
                }
                required
                className={inputClasses}
              >
                <option value="" disabled>
                  Select an option...
                </option>
                <option value="Yes">Yes, we plan to have or adopt children together.</option>
                <option value="No">No, we do not plan to have children together.</option>
                <option value="Undecided">We are currently undecided about having children.</option>
              </select>
            </div>

            <div className="mb-7">
              <label className="mb-2.5 block text-[0.95rem] font-semibold text-slate-800">
                Do you currently own, or expect to have, any pets whose
                ownership or care you would like to include in this
                agreement?
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <RadioCard
                  id="pets_yes"
                  name="has_family_pets"
                  value="Yes"
                  label="Yes"
                  checked={formData.hasFamilyPets === "Yes"}
                  onChange={() => setFormData((prev) => ({ ...prev, hasFamilyPets: "Yes" }))}
                />
                <RadioCard
                  id="pets_no"
                  name="has_family_pets"
                  value="No"
                  label="No"
                  checked={formData.hasFamilyPets === "No"}
                  onChange={() => setFormData((prev) => ({ ...prev, hasFamilyPets: "No" }))}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-8 rounded-[10px] bg-indigo-600 px-10 py-4 font-semibold text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition hover:-translate-y-px hover:bg-indigo-700 hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] active:translate-y-px"
              >
                Save & Continue
              </button>
            </div>
          </form>

          {submitted && (
            <p className="mt-4 text-right text-sm text-emerald-600">
              Saved. Ready for the next module.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
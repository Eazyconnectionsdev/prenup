"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";

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

interface RadioCardViewProps {
  id: string;
  label: string;
  checked: boolean;
}

function RadioCardView({ id, label, checked }: RadioCardViewProps) {
  return (
    <div
      id={id}
      className={`relative flex items-center gap-3.5 rounded-[10px] border px-4 py-4 ${
        checked ? "border-indigo-600 bg-slate-50" : "border-slate-300 bg-slate-50"
      }`}
    >
      <span
        className={`relative h-5 w-5 flex-shrink-0 rounded-full border-2 ${
          checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
        }`}
      >
        {checked && (
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        )}
      </span>
      <span
        className={`text-[0.925rem] font-semibold ${checked ? "text-indigo-600" : "text-slate-900"}`}
      >
        {label}
      </span>
    </div>
  );
}

const inputClasses =
  "w-full rounded-[10px] border border-slate-300 bg-slate-50 px-4 py-3 text-[0.95rem] text-slate-900 disabled:cursor-not-allowed disabled:opacity-70";

export default function PartnerFamilyDependentsView() {
  const [formData, setFormData] = useState<FamilyFormData>(initialFormData);
  const [children, setChildren] = useState<ChildRow[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const caseId = useSelector((state: RootState) => state.auth.caseId);

  const [isLoading, setIsLoading] = useState(true);

  const showSeparationCheckbox =
    formData.priorMarriageStatus === "Yes, previously divorced";
  const showChildrenMatrix = formData.hasLivingChildren === "Yes";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: {
            data: { familyAndDependents },
          },
        } = await Axios.get(
          `/cases/${caseId}/section/${user.endUserType === "user1" ? "partnerInformation" : "myInformation"}`,
        );

        if (!familyAndDependents) return;

        const { children: fetchedChildren, ...rest } = familyAndDependents;

        setFormData((prev) => ({ ...prev, ...rest }));
        setChildren(Array.isArray(fetchedChildren) ? fetchedChildren : []);
      } catch (error) {
        console.error("Error fetching family & dependents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (caseId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [caseId, user?.endUserType]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-500">Loading your information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Main Card */}
        <div className="rounded-2xl bg-white p-12 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Family & Dependents
          </h2>
          <p className="mb-10 text-[0.95rem] text-slate-500">
            This is a read-only view of the family and dependents information your partner has provided.
          </p>

          <div>
            {/* MODULE 1: PRIOR MARITAL HISTORY */}
            <div className="mb-6 border-b-2 border-slate-100 pb-2.5 text-[1.25rem] font-bold tracking-tight text-slate-900">
              Prior Marital History
            </div>
            <div className="mb-7">
              <label className="mb-2.5 block text-[0.95rem] font-semibold text-slate-800">
                Have you previously been married or in a civil partnership
                before this relationship?
              </label>

              <div className="mb-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <RadioCardView
                  id="pm_never"
                  label="No, never married"
                  checked={formData.priorMarriageStatus === "No, never married"}
                />
                <RadioCardView
                  id="pm_divorced"
                  label="Yes, previously divorced"
                  checked={formData.priorMarriageStatus === "Yes, previously divorced"}
                />
                <RadioCardView
                  id="pm_widowed"
                  label="Yes, widowed"
                  checked={formData.priorMarriageStatus === "Yes, widowed"}
                />
              </div>

              {showSeparationCheckbox && (
                <div className="mt-4 rounded-[10px] border border-dashed border-slate-300 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isLegallySeparated}
                      disabled
                      className="h-[18px] w-[18px] disabled:cursor-not-allowed"
                    />
                    <span className="text-[0.9rem] font-semibold text-slate-900">
                      I am currently legally separated, and my divorce has not
                      yet been finalised.
                    </span>
                  </div>
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
                stepchildren, from this relationship or a previous relationship?
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <RadioCardView
                  id="children_yes"
                  label="Yes"
                  checked={formData.hasLivingChildren === "Yes"}
                />
                <RadioCardView
                  id="children_no"
                  label="No"
                  checked={formData.hasLivingChildren === "No"}
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
                      className="mb-3 grid grid-cols-1 items-center gap-3.5 rounded-[10px] border border-slate-300 bg-white p-4 sm:grid-cols-3"
                    >
                      <input
                        type="text"
                        placeholder="Child's Full Name"
                        value={child.fullName}
                        disabled
                        className={inputClasses}
                      />
                      <input
                        type="date"
                        value={child.dob}
                        disabled
                        className={inputClasses}
                      />
                      <select value={child.parentalRelationship} disabled className={inputClasses}>
                        <option value="">Select Parental Relationship</option>
                        <option value="My child from a prior relationship">
                          My child from a previous relationship
                        </option>
                        <option value="My partner's child from a prior relationship">
                          My partner's child from a previous relationship
                        </option>
                        <option value="Our mutual child (born or adopted within our relationship)">
                          Our child together (born or adopted during our
                          relationship)
                        </option>
                      </select>
                    </div>
                  ))}
                </div>
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
              <select value={formData.futureParentalIntentions} disabled className={inputClasses}>
                <option value="" disabled>
                  Select an option...
                </option>
                <option value="Yes">
                  Yes, we plan to have or adopt children together.
                </option>
                <option value="No">
                  No, we do not plan to have children together.
                </option>
                <option value="Undecided">
                  We are currently undecided about having children.
                </option>
              </select>
            </div>

            <div className="mb-7">
              <label className="mb-2.5 block text-[0.95rem] font-semibold text-slate-800">
                Do you currently own, or expect to have, any pets whose
                ownership or care you would like to include in this agreement?
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <RadioCardView id="pets_yes" label="Yes" checked={formData.hasFamilyPets === "Yes"} />
                <RadioCardView id="pets_no" label="No" checked={formData.hasFamilyPets === "No"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
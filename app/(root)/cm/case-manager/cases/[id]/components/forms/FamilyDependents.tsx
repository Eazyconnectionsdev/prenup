"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Child {
  id: string;
  fullName: string;
  dob: string;
  parentalRelationship: string;
}

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function FamilyDependents({
  data = {},
  isEditing,
  onChange,
}: Props) {
  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-600";

  const showSeparationCheckbox =
    data?.priorMarriageStatus === "Yes, previously divorced";

  const showSeparationWarning =
    showSeparationCheckbox && data?.isLegallySeparated;

  const showChildren =
    data?.hasLivingChildren === "Yes";

  const addChild = () => {
    const child: Child = {
      id: `child_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      fullName: "",
      dob: "",
      parentalRelationship: "",
    };

    onChange("children", [
      ...(data?.children || []),
      child,
    ]);
  };

  const removeChild = (id: string) => {
    onChange(
      "children",
      (data?.children || []).filter(
        (child: Child) => child.id !== id,
      ),
    );
  };

  const updateChild = (
    id: string,
    field: keyof Child,
    value: string,
  ) => {
    onChange(
      "children",
      (data?.children || []).map(
        (child: Child) =>
          child.id === id
            ? {
                ...child,
                value,
              }
            : child,
      ),
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Family & Dependents
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tell us about your previous marriages or civil
          partnerships, your children, your future family
          plans, and any family pets you would like this
          agreement to cover.
        </p>
      </div>

      {/* Prior Marital History */}

      <div>
        <h3 className="mb-4 border-b border-slate-200 pb-2 text-lg font-bold">
          Prior Marital History
        </h3>

        <label className="mb-2 block font-semibold">
          Have you previously been married or in a civil
          partnership before this relationship?
        </label>

        <p className="mb-3 text-sm italic text-slate-500">
          Note: If your previous relationship was a civil
          partnership rather than a marriage, please choose
          the equivalent option below.
        </p>

        <select
          value={data?.priorMarriageStatus || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange(
              "priorMarriageStatus",
              e.target.value,
            )
          }
          className={inputClass}
        >
          <option value="">
            Select Option
          </option>

          <option value="No, never married">
            No, never married
          </option>

          <option value="Yes, previously divorced">
            Yes, previously divorced
          </option>

          <option value="Yes, widowed">
            Yes, widowed
          </option>
        </select>

        {showSeparationCheckbox && (
          <div className="mt-4 rounded-lg border border-slate-300 bg-slate-50 p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  data?.isLegallySeparated || false
                }
                disabled={!isEditing}
                onChange={(e) =>
                  onChange(
                    "isLegallySeparated",
                    e.target.checked,
                  )
                }
              />

              <span className="font-medium">
                I am currently legally separated,
                and my divorce has not yet been
                finalised.
              </span>
            </label>
          </div>
        )}

        {showSeparationWarning && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            <strong>
              ⚠️ Important Timeline Note:
            </strong>{" "}
            You can continue completing your
            questionnaire. However, your
            prenuptial agreement cannot usually
            be finalised until your previous
            divorce has been legally completed.
            Your independent solicitor will
            advise you on the appropriate timing.
          </div>
        )}
      </div>

      {/* Current Children Status */}

      <div>
        <h3 className="mb-4 border-b border-slate-200 pb-2 text-lg font-bold">
          Current Children Status
        </h3>

        <label className="mb-2 block font-semibold">
          Do you have any children, including
          biological, adopted, or stepchildren,
          from this relationship or a previous
          relationship?
        </label>

        <select
          value={data?.hasLivingChildren || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange(
              "hasLivingChildren",
              e.target.value,
            )
          }
          className={inputClass}
        >
          <option value="">
            Select Option
          </option>

          <option value="Yes">
            Yes
          </option>

          <option value="No">
            No
          </option>
        </select>
      </div>

      {/* Children Details */}

      {showChildren && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">
              Children's Details
            </h3>

            {isEditing && (
              <button
                type="button"
                onClick={addChild}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-white"
              >
                <Plus size={14} />
                Add Child
              </button>
            )}
          </div>

          <div className="space-y-4">
            {(data?.children || []).map(
              (child: Child) => (
                <div
                  key={child.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <input
                      value={child.fullName}
                      disabled={!isEditing}
                      onChange={(e) =>
                        updateChild(
                          child.id,
                          "fullName",
                          e.target.value,
                        )
                      }
                      placeholder="Child's Full Name"
                      className={inputClass}
                    />

                    <input
                      type="date"
                      value={child.dob}
                      disabled={!isEditing}
                      onChange={(e) =>
                        updateChild(
                          child.id,
                          "dob",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    />

                    <select
                      value={
                        child.parentalRelationship
                      }
                      disabled={!isEditing}
                      onChange={(e) =>
                        updateChild(
                          child.id,
                          "parentalRelationship",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Select Parental Relationship
                      </option>

                      <option value="My child from a prior relationship">
                        My child from a previous
                        relationship
                      </option>

                      <option value="My partner's child from a prior relationship">
                        My partner's child from a
                        previous relationship
                      </option>

                      <option value="Our mutual child (born or adopted within our relationship)">
                        Our child together (born
                        or adopted during our
                        relationship)
                      </option>
                    </select>
                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        removeChild(child.id)
                      }
                      className="mt-3 flex items-center gap-2 text-red-600"
                    >
                      <Trash2 size={14} />
                      Remove Child
                    </button>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Future Family Plans */}

      <div>
        <h3 className="mb-4 border-b border-slate-200 pb-2 text-lg font-bold">
          Future Family Plans & Pets
        </h3>

        <label className="mb-2 block font-semibold">
          Do you and your partner plan, or think
          you may decide in the future, to have
          or adopt children together?
        </label>

        <select
          value={
            data?.futureParentalIntentions || ""
          }
          disabled={!isEditing}
          onChange={(e) =>
            onChange(
              "futureParentalIntentions",
              e.target.value,
            )
          }
          className={inputClass}
        >
          <option value="">
            Select an option...
          </option>

          <option value="Yes">
            Yes, we plan to have or adopt
            children together.
          </option>

          <option value="No">
            No, we do not plan to have children
            together.
          </option>

          <option value="Undecided">
            We are currently undecided about
            having children.
          </option>
        </select>
      </div>

      {/* Pets */}

      <div>
        <label className="mb-2 block font-semibold">
          Do you currently own, or expect to
          have, any pets whose ownership or care
          you would like to include in this
          agreement?
        </label>

        <select
          value={data?.hasFamilyPets || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange(
              "hasFamilyPets",
              e.target.value,
            )
          }
          className={inputClass}
        >
          <option value="">
            Select Option
          </option>

          <option value="Yes">
            Yes
          </option>

          <option value="No">
            No
          </option>
        </select>
      </div>
    </div>
  );
}
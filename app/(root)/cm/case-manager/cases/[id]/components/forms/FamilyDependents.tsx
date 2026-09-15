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
onChange
}: Props) {
  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";

  const addChild = () => {
    const child: Child = {
      id: `child_${Date.now()}`,
      fullName: "",
      dob: "",
      parentalRelationship: "",
    };

    onChange("children", [...(data?.children || []), child]);
  };

  const removeChild = (id: string) => {
    onChange(
      "children",
      (data?.children || []).filter(
        (child: Child) => child.id !== id
      )
    );
  };

  const updateChild = (
  id: string,
  field: string,
  value: string
) => {
  onChange(
    "children",
    (data.children || []).map((child: Child) =>
      child.id === id
        ? {
            ...child,
            value,
          }
        : child
    )
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
          Tell us about previous relationships,
          children, future family plans, and pets.
        </p>
      </div>

      {/* Previous Marriage */}

      <div>
        <label className="block mb-3 font-semibold">
          Have you previously been married or in a
          civil partnership?
        </label>

        <select
          value={data?.priorMarriageStatus || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange(
              "priorMarriageStatus",
              e.target.value
            )
          }
          className={inputClass}
        >
          <option value="">
            Select option
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
      </div>

      {/* Legally Separated */}

      <div>
        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={data?.isLegallySeparated || false}
            disabled={!isEditing}
            onChange={(e) =>
              onChange(
                "isLegallySeparated",
                e.target.checked
              )
            }
          />

          <span className="font-medium">
            I am legally separated
          </span>

        </label>
      </div>

      {/* Children */}

      <div>

        <label className="block mb-3 font-semibold">
          Do you have children?
        </label>

        <select
          value={data?.hasLivingChildren || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange(
              "hasLivingChildren",
              e.target.value
            )
          }
          className={inputClass}
        >
          <option value="">
            Select option
          </option>

          <option value="Yes">
            Yes
          </option>

          <option value="No">
            No
          </option>
        </select>
      </div>

      {/* Child Rows */}

      {data?.hasLivingChildren === "Yes" && (
        <div className="space-y-4">

          <div className="flex items-center justify-between">

            <h3 className="font-semibold">
              Children Details
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
                        e.target.value
                      )
                    }
                    placeholder="Child Name"
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
                        e.target.value
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
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Relationship
                    </option>

                    <option value="Our child">
                      Our child
                    </option>

                    <option value="My child from a prior relationship">
                      My child from a prior relationship
                    </option>

                    <option value="Stepchild">
                      Stepchild
                    </option>

                    <option value="Adopted">
                      Adopted Child
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
            )
          )}

        </div>
      )}

      {/* Future Family Plans */}

      <div>

        <label className="block mb-3 font-semibold">
          Do you plan to have or adopt children
          together?
        </label>

        <select
          value={
            data?.futureParentalIntentions || ""
          }
          disabled={!isEditing}
          onChange={(e) =>
            onChange(
              "futureParentalIntentions",
              e.target.value
            )
          }
          className={inputClass}
        >
          <option value="">
            Select option
          </option>

          <option value="Yes">
            Yes
          </option>

          <option value="No">
            No
          </option>

          <option value="Undecided">
            Undecided
          </option>
        </select>

      </div>

      {/* Pets */}

      <div>

        <label className="block mb-3 font-semibold">
          Do you have family pets?
        </label>

        <select
          value={data?.hasFamilyPets || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange(
              "hasFamilyPets",
              e.target.value
            )
          }
          className={inputClass}
        >
          <option value="">
            Select option
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
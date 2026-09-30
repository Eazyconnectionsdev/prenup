
"use client";

import React, { useEffect, useState } from "react";

import { Edit3, FilePlus2, RotateCcw } from "lucide-react";

import PersonalInformation from "./PersonalInformation";
import LegalDeclarations from "./LegalDeclarations";
import FamilyDependents from "./FamilyDependents";
import IndividualAssets from "./IndividualAssets";
import IncomeRevenue from "./IncomeRevenue";
import LiabilitiesDebts from "./LiabilitiesDebts";

import JointAssets from "./JointAssets";
import JointIncome from "./JointIncome";
import JointLiabilities from "./JointLiabilities";

interface Props {
  caseData: any;
  isCmEditing: boolean;
  setIsCmEditing: (value: boolean) => void;
  onSave: (payload: any) => Promise<void> | void;
  onCreateDocument?: (payload: any) => Promise<void> | void;
}

type ActiveParty = "user1" | "user2" | "joint";

type ActiveSection =
  | "personal"
  | "legal"
  | "family"
  | "assets"
  | "income"
  | "liabilities";

type ActiveJointSection =
  | "assets"
  | "income"
  | "liabilities";

export default function FormsDisclosuresTab({
  caseData,
  isCmEditing,
  setIsCmEditing,
  onSave,
  onCreateDocument,
}: Props) {
  const [activeParty, setActiveParty] =
    useState<ActiveParty>("user1");

  const [activeSection, setActiveSection] =
    useState<ActiveSection>("personal");

  const [activeJointSection, setActiveJointSection] =
    useState<ActiveJointSection>("assets");

  const [user1, setUser1] = useState<any>(null);

  const [user2, setUser2] = useState<any>(null);

  const [joint, setJoint] = useState<any>(null);

  const [snapshot, setSnapshot] = useState<any>(null);

  /*
   * Load data from caseData.
   *
   * Expected structure:
   *
   * caseData.myInformation
   * caseData.partnerInformation
   * caseData.jointInformation
   */
  useEffect(() => {
    if (!caseData) {
      return;
    }
console.log("========== FORMS CASE DATA ==========");
  console.log("FULL CASE:", caseData);
  console.log("MY INFORMATION:", caseData.myInformation);
  console.log("PARTNER INFORMATION:", caseData.partnerInformation);
  console.log("JOINT INFORMATION:", caseData.jointInformation);
  console.log("======================================");

    setUser1(
      structuredClone(caseData.myInformation || {})
    );

    setUser2(
      structuredClone(caseData.partnerInformation || {})
    );

    setJoint(
      structuredClone(caseData.jointInformation || {})
    );
  }, [caseData]);

  /*
   * Wait until all three data objects are loaded.
   */
  if (!user1 || !user2 || !joint) {
    return (
      <div className="p-8">
        Loading forms...
      </div>
    );
  }

  /*
   * Get the currently selected user.
   */
  const currentUser =
    activeParty === "user1" ? user1 : user2;

  /*
   * Get the setter for the currently selected user.
   */
  const setCurrentUser =
    activeParty === "user1"
      ? setUser1
      : setUser2;

  /*
   * Update an individual user's section.
   *
   * Example:
   *
   * updateSection(
   *   "personalInformation",
   *   "firstName",
   *   "John"
   * );
   *
   * Produces:
   *
   * {
   *   personalInformation: {
   *     firstName: "John"
   *   }
   * }
   */
  const updateSection = (
    section: string,
    field: string,
    value: any
  ) => {
    setCurrentUser((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));
  };

  /*
   * Update a joint section.
   *
   * Example:
   *
   * updateJointSection(
   *   "jointAssets",
   *   "livingArrangement",
   *   "OneOwner"
   * );
   */
  const updateJointSection = (
    section: string,
    field: string,
    value: any
  ) => {
    setJoint((previousJoint: any) => {
      return {
        ...previousJoint,
        [section]: {
          ...(previousJoint?.[section] || {}),
          [field]: value,
        },
      };
    });
  };

  /*
   * Enable CM editing.
   *
   * Before editing starts, keep a copy of
   * the current data so it can be restored.
   */
  const enableEditing = () => {
    setSnapshot(
      structuredClone({
        myInformation: user1,
        partnerInformation: user2,
        jointInformation: joint,
      })
    );

    setIsCmEditing(true);
  };

  /*
   * Revert all changes.
   */
  const revertChanges = () => {
    if (!snapshot) {
      return;
    }

    setUser1(
      structuredClone(snapshot.myInformation || {})
    );

    setUser2(
      structuredClone(snapshot.partnerInformation || {})
    );

    setJoint(
      structuredClone(snapshot.jointInformation || {})
    );

    setSnapshot(null);
    setIsCmEditing(false);
  };

  /*
   * Save all three parts of the questionnaire.
   */
  const submitAllForms = async () => {
    const payload = {
      myInformation: user1,
      partnerInformation: user2,
      jointInformation: joint,
    };

    try {
      await onSave(payload);

      if (onCreateDocument) {
        await onCreateDocument(payload);
      }

      setSnapshot(null);
      setIsCmEditing(false);
    } catch (error) {
      console.error(
        "Error submitting questionnaire:",
        error
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border rounded-xl p-4 flex justify-between items-center bg-amber-50">
        <div>
          <h2 className="font-bold text-lg">
            Submitted Questionnaire
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            Review and edit the submitted questionnaire.
          </p>
        </div>

        <button
          type="button"
          onClick={enableEditing}
          disabled={isCmEditing}
          className="border px-4 py-2 rounded-lg flex gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit3 size={16} />

          {isCmEditing
            ? "CM Edit Active"
            : "Enable CM Edit"}
        </button>
      </div>

      {/* =====================================================
          PARTY TABS
      ====================================================== */}

      <div className="grid grid-cols-3 gap-4">

        <button
          type="button"
          onClick={() => setActiveParty("user1")}
          className={`p-4 rounded-xl border transition ${activeParty === "user1"
              ? "bg-slate-900 text-white"
              : "bg-white hover:bg-gray-50"
            }`}
        >
          User 1
        </button>

        <button
          type="button"
          onClick={() => setActiveParty("user2")}
          className={`p-4 rounded-xl border transition ${activeParty === "user2"
              ? "bg-slate-900 text-white"
              : "bg-white hover:bg-gray-50"
            }`}
        >
          Partner
        </button>

        <button
          type="button"
          onClick={() => setActiveParty("joint")}
          className={`p-4 rounded-xl border transition ${activeParty === "joint"
              ? "bg-slate-900 text-white"
              : "bg-white hover:bg-gray-50"
            }`}
        >
          Joint
        </button>

      </div>

      {/* =====================================================
          INDIVIDUAL SECTION TABS
      ====================================================== */}

      {activeParty !== "joint" && (
        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() => setActiveSection("personal")}
            className={`px-4 py-2 rounded-lg border ${activeSection === "personal"
                ? "bg-slate-900 text-white"
                : "bg-white"
              }`}
          >
            Personal
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("legal")}
            className={`px-4 py-2 rounded-lg border ${activeSection === "legal"
                ? "bg-slate-900 text-white"
                : "bg-white"
              }`}
          >
            Legal
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("family")}
            className={`px-4 py-2 rounded-lg border ${activeSection === "family"
                ? "bg-slate-900 text-white"
                : "bg-white"
              }`}
          >
            Family
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("assets")}
            className={`px-4 py-2 rounded-lg border ${activeSection === "assets"
                ? "bg-slate-900 text-white"
                : "bg-white"
              }`}
          >
            Assets
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("income")}
            className={`px-4 py-2 rounded-lg border ${activeSection === "income"
                ? "bg-slate-900 text-white"
                : "bg-white"
              }`}
          >
            Income
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("liabilities")}
            className={`px-4 py-2 rounded-lg border ${activeSection === "liabilities"
                ? "bg-slate-900 text-white"
                : "bg-white"
              }`}
          >
            Liabilities
          </button>

        </div>
      )}

      {/* =====================================================
          JOINT SECTION TABS
      ====================================================== */}

      {activeParty === "joint" && (
        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() =>
              setActiveJointSection("assets")
            }
            className={`px-4 py-2 rounded-lg border ${activeJointSection === "assets"
                ? "bg-slate-900 text-white"
                : "bg-white"
              }`}
          >
            Joint Assets
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveJointSection("income")
            }
            className={`px-4 py-2 rounded-lg border ${activeJointSection === "income"
                ? "bg-slate-900 text-white"
                : "bg-white"
              }`}
          >
            Joint Income
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveJointSection("liabilities")
            }
            className={`px-4 py-2 rounded-lg border ${activeJointSection === "liabilities"
                ? "bg-slate-900 text-white"
                : "bg-white"
              }`}
          >
            Joint Liabilities
          </button>

        </div>
      )}

      {/* =====================================================
          FORM CONTENT
      ====================================================== */}

      <div className="border rounded-xl p-6">

        {/* ===================================================
            USER 1 / PARTNER
        ==================================================== */}

        {activeParty !== "joint" && (
          <>

            {/* PERSONAL INFORMATION */}

            {activeSection === "personal" && (
              <PersonalInformation
                data={
                  currentUser?.personalInformation || {}
                }
                isEditing={isCmEditing}
                onChange={(field, value) => {
                  updateSection(
                    "personalInformation",
                    field,
                    value
                  );
                }}
              />
            )}

            {/* LEGAL DECLARATIONS */}

            {activeSection === "legal" && (
              <LegalDeclarations
                data={
                  currentUser?.legalDeclaration || {}
                }
                isEditing={isCmEditing}
                onChange={(field, value) => {
                  updateSection(
                    "legalDeclaration",
                    field,
                    value
                  );
                }}
              />
            )}

            {/* FAMILY AND DEPENDENTS */}

            {activeSection === "family" && (
              <FamilyDependents
                data={
                  currentUser?.familyAndDependents || {}
                }
                isEditing={isCmEditing}
                onChange={(field, value) => {
                  updateSection(
                    "familyAndDependents",
                    field,
                    value
                  );
                }}
              />
            )}

            {/* INDIVIDUAL ASSETS */}

            {activeSection === "assets" && (
              <IndividualAssets
                data={
                  currentUser?.individualAssets || {}
                }
                isEditing={isCmEditing}
                onChange={(field, value) => {
                  updateSection(
                    "individualAssets",
                    field,
                    value
                  );
                }}
              />
            )}

            {/* INCOME AND REVENUE */}

            {activeSection === "income" && (
              <IncomeRevenue
                data={
                  currentUser?.incomeAndRevenue || {}
                }
                isEditing={isCmEditing}
                onChange={(field, value) => {
                  updateSection(
                    "incomeAndRevenue",
                    field,
                    value
                  );
                }}
              />
            )}

            {/* LIABILITIES AND DEBTS */}

            {activeSection === "liabilities" && (
              <LiabilitiesDebts
                data={
                  currentUser?.liabilitiesAndDebts || {}
                }
                isEditing={isCmEditing}
                onChange={(field, value) => {
                  updateSection(
                    "liabilitiesAndDebts",
                    field,
                    value
                  );
                }}
              />
            )}

          </>
        )}

        {/* ===================================================
            JOINT INFORMATION
        ==================================================== */}

        {activeParty === "joint" && (
          <>

            {/* JOINT ASSETS */}

            {activeJointSection === "assets" && (
              <JointAssets
                data={joint?.jointAssets || {}}
                isEditing={isCmEditing}
                onChange={(field, value) => {
                  updateJointSection(
                    "jointAssets",
                    field,
                    value
                  );
                }}
              />
            )}

            {/* JOINT INCOME */}

            {activeJointSection === "income" && (
              <JointIncome
                data={
                  joint?.jointIncomeAndRevenue || {}
                }
                isEditing={isCmEditing}
                onChange={(field, value) => {
                  updateJointSection(
                    "jointIncomeAndRevenue",
                    field,
                    value
                  );
                }}
              />
            )}

            {/* JOINT LIABILITIES */}

            {activeJointSection === "liabilities" && (
              <JointLiabilities
                data={
                  joint?.jointLiabilitiesAndDebts || {}
                }
                isEditing={isCmEditing}
                onChange={(field, value) => {
                  updateJointSection(
                    "jointLiabilitiesAndDebts",
                    field,
                    value
                  );
                }}
              />
            )}

          </>
        )}

      </div>

      {/* =====================================================
          SAVE / REVERT BUTTONS
      ====================================================== */}

      {isCmEditing && (
        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={revertChanges}
            className="border border-red-300 text-red-600 rounded-xl px-5 py-3 flex gap-2 items-center hover:bg-red-50"
          >
            <RotateCcw size={16} />

            Revert Changes
          </button>

          <button
            type="button"
            onClick={submitAllForms}
            className="bg-indigo-600 text-white rounded-xl px-5 py-3 flex gap-2 items-center hover:bg-indigo-700"
          >
            <FilePlus2 size={16} />

            Submit All Forms & Generate Document
          </button>

        </div>
      )}

    </div>
  );
}


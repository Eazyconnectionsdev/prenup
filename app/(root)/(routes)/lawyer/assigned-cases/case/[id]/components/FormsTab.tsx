
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Users,
  Home,
  DollarSign,
  CreditCard,
  Edit3,
  Lock,
  FileText,
  RotateCcw,
  Save,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import PersonalInformation from "./forms/PersonalInformation";
import LegalDeclarations from "./forms/LegalDeclarations";
import FamilyDependents from "./forms/FamilyDependents";
import IndividualAssets from "./forms/IndividualAssets";
import IncomeRevenue from "./forms/IncomeRevenue";
import LiabilitiesDebts from "./forms/LiabilitiesDebts";
import JointAssets from "./forms/JointAssets";
import JointIncome from "./forms/JointIncome";
import JointLiabilities from "./forms/JointLiabilities";

import Axios from "@/lib/ApiConfig";

interface Props {
  caseData: any;
  isCmEditing: boolean;
  setIsCmEditing: (value: boolean) => void;
}

/**
 * Maps the UI form/route name to the structure used by
 * the questionnaire API.
 */
const STEP_MAP = {
  "personal-information": {
    section: "myInformation",
    field: "personalInformation",
  },

  "legal-declaration": {
    section: "myInformation",
    field: "legalDeclaration",
  },

  "family-and-dependents": {
    section: "myInformation",
    field: "familyAndDependents",
  },

  "individual-assets": {
    section: "myInformation",
    field: "individualAssets",
  },

  "income-and-revenue": {
    section: "myInformation",
    field: "incomeAndRevenue",
  },

  "liabilities-and-debts": {
    section: "myInformation",
    field: "liabilitiesAndDebts",
  },

  "partner-personal-information": {
    section: "partnerInformation",
    field: "personalInformation",
  },

  "partner-legal-declaration": {
    section: "partnerInformation",
    field: "legalDeclaration",
  },

  "partner-family-and-dependents": {
    section: "partnerInformation",
    field: "familyAndDependents",
  },

  "partner-individual-assets": {
    section: "partnerInformation",
    field: "individualAssets",
  },

  "partner-income-and-revenue": {
    section: "partnerInformation",
    field: "incomeAndRevenue",
  },

  "partner-liabilities-and-debts": {
    section: "partnerInformation",
    field: "liabilitiesAndDebts",
  },

  "joint-assets": {
    section: "jointInformation",
    field: "jointAssets",
  },

  "joint-income-and-revenue": {
    section: "jointInformation",
    field: "jointIncomeAndRevenue",
  },

  "joint-liabilities-and-debts": {
    section: "jointInformation",
    field: "jointLiabilitiesAndDebts",
  },

  "solicitor-details": {
    section: "independentLegalAdvice",
    field: "solicitorDetails",
  },

  "lawyer-questionnaire": {
    section: "independentLegalAdvice",
    field: "lawyerQuestionnaire",
  },

  "review-and-sign": {
    section: "independentLegalAdvice",
    field: "reviewAndSign",
  },
} as const;

type StepKey = keyof typeof STEP_MAP;

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

export default function FormsViewTab({
  caseData,
  isCmEditing,
  setIsCmEditing,
}: Props) {
  const [activeParty, setActiveParty] =
    useState<ActiveParty>("user1");

  const [activeSection, setActiveSection] =
    useState<ActiveSection>("personal");

  const [activeJointSection, setActiveJointSection] =
    useState<ActiveJointSection>("assets");

  const [user1, setUser1] = useState<any>({});
  const [user2, setUser2] = useState<any>({});
  const [joint, setJoint] = useState<any>({});

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  /**
   * Load questionnaire information from caseData.
   */
  useEffect(() => {
    if (!caseData) return;

    setUser1(caseData.myInformation || {});
    setUser2(caseData.partnerInformation || {});
    setJoint(caseData.jointInformation || {});
  }, [caseData]);

  /**
   * Current user/partner data.
   */
  const currentUser =
    activeParty === "user1"
      ? user1
      : user2;

  /**
   * Setter for current user/partner.
   */
  const setCurrentUser =
    activeParty === "user1"
      ? setUser1
      : setUser2;

  /**
   * Update a field inside myInformation / partnerInformation.
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

    setSaved(false);
    setSaveError("");
  };

  /**
   * Update a field inside jointInformation.
   */
  const updateJointSection = (
    section: string,
    field: string,
    value: any
  ) => {
    setJoint((prev: any) => ({
      ...prev,

      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));

    setSaved(false);
    setSaveError("");
  };

  /**
   * Enable CM editing.
   *
   * Before editing starts we create a backup.
   */
  const enableCmEdit = async () => {
    try {
      if (!caseData?._id) {
        alert("Case ID is missing.");
        return;
      }

      await Axios.post(
        `/cases/${caseData._id}/create-case-backup`
      );

      setIsCmEditing(true);
    } catch (error) {
      console.error(
        "Failed to enable CM editing:",
        error
      );

      alert(
        "Unable to enable editing. Please try again."
      );
    }
  };

  /**
   * Revert all CM changes.
   */
  const revertChanges = async () => {
    try {
      if (!caseData?._id) {
        alert("Case ID is missing.");
        return;
      }

      await Axios.post(
        `/cases/${caseData._id}/revert-case-backup`
      );

      window.location.reload();
    } catch (error) {
      console.error(
        "Failed to revert changes:",
        error
      );

      alert(
        "Unable to revert changes. Please try again."
      );
    }
  };

  /**
   * Determine which questionnaire step is currently open.
   */
  const currentStep = useMemo<StepKey>(() => {
    if (activeParty === "user1") {
      const map: Record<
        ActiveSection,
        StepKey
      > = {
        personal: "personal-information",
        legal: "legal-declaration",
        family: "family-and-dependents",
        assets: "individual-assets",
        income: "income-and-revenue",
        liabilities: "liabilities-and-debts",
      };

      return map[activeSection];
    }

    if (activeParty === "user2") {
      const map: Record<
        ActiveSection,
        StepKey
      > = {
        personal: "partner-personal-information",
        legal: "partner-legal-declaration",
        family: "partner-family-and-dependents",
        assets: "partner-individual-assets",
        income: "partner-income-and-revenue",
        liabilities: "partner-liabilities-and-debts",
      };

      return map[activeSection];
    }

    const jointMap: Record<
      ActiveJointSection,
      StepKey
    > = {
      assets: "joint-assets",
      income: "joint-income-and-revenue",
      liabilities: "joint-liabilities-and-debts",
    };

    return jointMap[activeJointSection];
  }, [
    activeParty,
    activeSection,
    activeJointSection,
  ]);

  /**
   * Save the currently opened questionnaire form.
   *
   * Example:
   *
   * /cases/6a708700dbc9cc6d60a7458b/questionnaire/personal-information
   *
   * The API receives only the selected form's data.
   */
  const saveCurrentForm = async () => {
    if (!caseData?._id) {
      setSaveError("Case ID is missing.");
      return;
    }

    if (!currentStep) {
      setSaveError("Unable to determine the current form.");
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setSaveError("");

      const stepConfig = STEP_MAP[currentStep];

      /**
       * Get the actual form data from the currently
       * selected party.
       */
      let formData: any;

      if (activeParty === "joint") {
        formData =
          joint?.[stepConfig.field] || {};
      } else {
        formData =
          currentUser?.[stepConfig.field] || {};
      }

      /**
       * Endpoint:
       *
       * /cases/{caseId}/questionnaire/{step}
       */
      const endpoint =
        `/cases/${caseData._id}/questionnaire/${currentStep}`;

      console.log(
        "Saving questionnaire form:",
        {
          endpoint,
          step: currentStep,
          section: stepConfig.section,
          field: stepConfig.field,
          data: formData,
        }
      );

      /**
       * Save only this individual form.
       */
      await Axios.post(endpoint, formData);

      setSaved(true);

      /**
       * Hide success message after a few seconds.
       */
      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error: any) {
      console.error(
        "Failed to save questionnaire form:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save this form.";

      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Submit all changes and generate document.
   *
   * Individual forms should already have been saved
   * using Save Form before this action.
   */
  const submitChanges = async () => {
    try {
      if (!caseData?._id) {
        alert("Case ID is missing.");
        return;
      }

      await Axios.post(
        `/cases/${caseData._id}/questionnaire/generate-document`
      );

      setIsCmEditing(false);

      alert(
        "Document generated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to generate document:",
        error
      );

      alert(
        "Failed to generate document. Please try again."
      );
    }
  };

  /**
   * Current form title.
   */
  const currentFormTitle = useMemo(() => {
    const titles: Record<StepKey, string> = {
      "personal-information":
        "Personal Information",

      "legal-declaration":
        "Legal Declaration",

      "family-and-dependents":
        "Family & Dependents",

      "individual-assets":
        "Individual Assets",

      "income-and-revenue":
        "Income & Revenue",

      "liabilities-and-debts":
        "Liabilities & Debts",

      "partner-personal-information":
        "Partner Personal Information",

      "partner-legal-declaration":
        "Partner Legal Declaration",

      "partner-family-and-dependents":
        "Partner Family & Dependents",

      "partner-individual-assets":
        "Partner Individual Assets",

      "partner-income-and-revenue":
        "Partner Income & Revenue",

      "partner-liabilities-and-debts":
        "Partner Liabilities & Debts",

      "joint-assets":
        "Joint Assets",

      "joint-income-and-revenue":
        "Joint Income & Revenue",

      "joint-liabilities-and-debts":
        "Joint Liabilities & Debts",

      "solicitor-details":
        "Solicitor Details",

      "lawyer-questionnaire":
        "Lawyer Questionnaire",

      "review-and-sign":
        "Review & Sign",
    };

    return titles[currentStep];
  }, [currentStep]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* =====================================================
          TOP ACTION BAR
      ====================================================== */}

      <div className="border rounded-xl bg-amber-50 border-amber-300 p-4 flex justify-between items-center gap-4">

        <div className="flex items-center gap-2">
          <Lock size={16} />

          <div>
            <span className="font-semibold">
              Submitted Questionnaire
            </span>

            {isCmEditing && (
              <p className="text-xs text-slate-600 mt-1">
                CM editing mode is enabled.
              </p>
            )}
          </div>
        </div>

        {!isCmEditing ? (
          <button
            type="button"
            onClick={enableCmEdit}
            className="border border-slate-300 bg-white rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-slate-50"
          >
            <Edit3 size={16} />

            Enable CM Edit
          </button>
        ) : (
          <div className="flex gap-3">

            <button
              type="button"
              onClick={submitChanges}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FileText size={16} />

              Submit Changes & Create Document
            </button>

            <button
              type="button"
              onClick={revertChanges}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RotateCcw size={16} />

              Revert Changes
            </button>

          </div>
        )}
      </div>


      {/* =====================================================
          PARTY CARDS
      ====================================================== */}

      <div className="grid grid-cols-3 gap-4">

        <button
          type="button"
          onClick={() => {
            setActiveParty("user1");
            setSaved(false);
            setSaveError("");
          }}
          className={`border rounded-xl p-5 text-left transition ${
            activeParty === "user1"
              ? "bg-slate-900 text-white"
              : "bg-white hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <User size={18} />

            <h3 className="font-bold">
              User 1
            </h3>
          </div>

          <p className="text-sm opacity-80">
            Personal Forms
          </p>
        </button>


        <button
          type="button"
          onClick={() => {
            setActiveParty("user2");
            setSaved(false);
            setSaveError("");
          }}
          className={`border rounded-xl p-5 text-left transition ${
            activeParty === "user2"
              ? "bg-slate-900 text-white"
              : "bg-white hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <User size={18} />

            <h3 className="font-bold">
              Partner
            </h3>
          </div>

          <p className="text-sm opacity-80">
            Personal Forms
          </p>
        </button>


        <button
          type="button"
          onClick={() => {
            setActiveParty("joint");
            setSaved(false);
            setSaveError("");
          }}
          className={`border rounded-xl p-5 text-left transition ${
            activeParty === "joint"
              ? "bg-slate-900 text-white"
              : "bg-white hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} />

            <h3 className="font-bold">
              Joint
            </h3>
          </div>

          <p className="text-sm opacity-80">
            Shared Forms
          </p>
        </button>

      </div>


      {/* =====================================================
          USER / PARTNER NAVIGATION
      ====================================================== */}

      {activeParty !== "joint" && (
        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() => {
              setActiveSection("personal");
              setSaved(false);
              setSaveError("");
            }}
            className={`border rounded-lg px-4 py-2 flex items-center gap-2 ${
              activeSection === "personal"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            <User size={14} />
            Personal
          </button>


          <button
            type="button"
            onClick={() => {
              setActiveSection("legal");
              setSaved(false);
              setSaveError("");
            }}
            className={`border rounded-lg px-4 py-2 ${
              activeSection === "legal"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            Legal
          </button>


          <button
            type="button"
            onClick={() => {
              setActiveSection("family");
              setSaved(false);
              setSaveError("");
            }}
            className={`border rounded-lg px-4 py-2 flex items-center gap-2 ${
              activeSection === "family"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            <Users size={14} />
            Family
          </button>


          <button
            type="button"
            onClick={() => {
              setActiveSection("assets");
              setSaved(false);
              setSaveError("");
            }}
            className={`border rounded-lg px-4 py-2 flex items-center gap-2 ${
              activeSection === "assets"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            <Home size={14} />
            Assets
          </button>


          <button
            type="button"
            onClick={() => {
              setActiveSection("income");
              setSaved(false);
              setSaveError("");
            }}
            className={`border rounded-lg px-4 py-2 flex items-center gap-2 ${
              activeSection === "income"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            <DollarSign size={14} />
            Income
          </button>


          <button
            type="button"
            onClick={() => {
              setActiveSection("liabilities");
              setSaved(false);
              setSaveError("");
            }}
            className={`border rounded-lg px-4 py-2 flex items-center gap-2 ${
              activeSection === "liabilities"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            <CreditCard size={14} />
            Liabilities
          </button>

        </div>
      )}


      {/* =====================================================
          JOINT NAVIGATION
      ====================================================== */}

      {activeParty === "joint" && (
        <div className="flex gap-2">

          <button
            type="button"
            onClick={() => {
              setActiveJointSection("assets");
              setSaved(false);
              setSaveError("");
            }}
            className={`border rounded-lg px-4 py-2 ${
              activeJointSection === "assets"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            Joint Assets
          </button>


          <button
            type="button"
            onClick={() => {
              setActiveJointSection("income");
              setSaved(false);
              setSaveError("");
            }}
            className={`border rounded-lg px-4 py-2 ${
              activeJointSection === "income"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            Joint Income
          </button>


          <button
            type="button"
            onClick={() => {
              setActiveJointSection("liabilities");
              setSaved(false);
              setSaveError("");
            }}
            className={`border rounded-lg px-4 py-2 ${
              activeJointSection === "liabilities"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            Joint Liabilities
          </button>

        </div>
      )}


      {/* =====================================================
          CURRENT FORM
      ====================================================== */}

      <div className="border rounded-xl bg-white overflow-hidden">

        {/* FORM HEADER */}

        <div className="border-b bg-slate-50 px-6 py-4 flex items-center justify-between gap-4">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {currentFormTitle}
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Questionnaire step: {currentStep}
            </p>
          </div>


          {/* SAVE FORM BUTTON */}

          {isCmEditing && (
            <button
              type="button"
              onClick={saveCurrentForm}
              disabled={saving}
              className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-white transition ${
                saving
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />

                  Save Form
                </>
              )}
            </button>
          )}

        </div>


        {/* SAVE STATUS */}

        {saved && (
          <div className="mx-6 mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
            <CheckCircle2 size={16} />

            {currentFormTitle} saved successfully.
          </div>
        )}


        {saveError && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {saveError}
          </div>
        )}


        {/* FORM CONTENT */}

        <div className="p-6">

          {/* =================================================
              USER 1 / PARTNER FORMS
          ================================================== */}

          {activeParty !== "joint" && (
            <>

              {activeSection === "personal" && (
                <PersonalInformation
                  data={
                    currentUser?.personalInformation
                  }
                  isEditing={isCmEditing}
                  onChange={(field, value) =>
                    updateSection(
                      "personalInformation",
                      field,
                      value
                    )
                  }
                />
              )}


              {activeSection === "legal" && (
                <LegalDeclarations
                  data={
                    currentUser?.legalDeclaration
                  }
                  isEditing={isCmEditing}
                  onChange={(field, value) =>
                    updateSection(
                      "legalDeclaration",
                      field,
                      value
                    )
                  }
                />
              )}


              {activeSection === "family" && (
                <FamilyDependents
                  data={
                    currentUser?.familyAndDependents
                  }
                  isEditing={isCmEditing}
                  onChange={(field, value) =>
                    updateSection(
                      "familyAndDependents",
                      field,
                      value
                    )
                  }
                />
              )}


              {activeSection === "assets" && (
                <IndividualAssets
                  data={
                    currentUser?.individualAssets
                  }
                  isEditing={isCmEditing}
                  onChange={(field, value) =>
                    updateSection(
                      "individualAssets",
                      field,
                      value
                    )
                  }
                />
              )}


              {activeSection === "income" && (
                <IncomeRevenue
                  data={
                    currentUser?.incomeAndRevenue
                  }
                  isEditing={isCmEditing}
                  onChange={(field, value) =>
                    updateSection(
                      "incomeAndRevenue",
                      field,
                      value
                    )
                  }
                />
              )}


              {activeSection === "liabilities" && (
                <LiabilitiesDebts
                  data={
                    currentUser?.liabilitiesAndDebts
                  }
                  isEditing={isCmEditing}
                  onChange={(field, value) =>
                    updateSection(
                      "liabilitiesAndDebts",
                      field,
                      value
                    )
                  }
                />
              )}

            </>
          )}


          {/* =================================================
              JOINT FORMS
          ================================================== */}

          {activeParty === "joint" && (
            <>

              {activeJointSection === "assets" && (
                <JointAssets
                  data={joint?.jointAssets}
                  isEditing={isCmEditing}
                  onChange={(field, value) =>
                    updateJointSection(
                      "jointAssets",
                      field,
                      value
                    )
                  }
                />
              )}


              {activeJointSection === "income" && (
                <JointIncome
                  data={
                    joint?.jointIncomeAndRevenue
                  }
                  isEditing={isCmEditing}
                  onChange={(field, value) =>
                    updateJointSection(
                      "jointIncomeAndRevenue",
                      field,
                      value
                    )
                  }
                />
              )}


              {activeJointSection === "liabilities" && (
                <JointLiabilities
                  data={
                    joint?.jointLiabilitiesAndDebts
                  }
                  isEditing={isCmEditing}
                  onChange={(field, value) =>
                    updateJointSection(
                      "jointLiabilitiesAndDebts",
                      field,
                      value
                    )
                  }
                />
              )}

            </>
          )}

        </div>


        {/* =================================================
            BOTTOM SAVE BUTTON
        ================================================== */}

        {isCmEditing && (
          <div className="border-t bg-slate-50 px-6 py-4 flex justify-end">

            <button
              type="button"
              onClick={saveCurrentForm}
              disabled={saving}
              className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-white ${
                saving
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />

                  Save {currentFormTitle}
                </>
              )}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}


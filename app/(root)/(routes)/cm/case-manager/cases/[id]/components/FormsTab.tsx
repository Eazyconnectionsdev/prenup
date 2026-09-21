"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  User,
  Users,
  Home,
  DollarSign,
  CreditCard,
  Edit3,
  Unlock,
  Lock,
  Save,
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

interface Props {
  caseData: any;
  isCmEditing: boolean;
  setIsCmEditing: (
    value: boolean
  ) => void;
  onSave: (payload: any) => void;
}

export default function FormsViewTab({
  caseData,
  isCmEditing,
  setIsCmEditing,
  onSave,
}: Props) {
  const [activeParty, setActiveParty] =
    useState<
      "user1" | "user2" | "joint"
    >("user1");

  const [activeSection, setActiveSection] =
    useState<
      | "personal"
      | "legal"
      | "family"
      | "assets"
      | "income"
      | "liabilities"
    >("personal");

  const [activeJointSection, setActiveJointSection] =
    useState<
      | "assets"
      | "income"
      | "liabilities"
    >("assets");

  const [user1, setUser1] =
    useState<any>({});

  const [user2, setUser2] =
    useState<any>({});

  const [joint, setJoint] =
    useState<any>({});

  useEffect(() => {
    if (!caseData) return;

    setUser1(
      caseData.myInformation || {}
    );

    setUser2(
      caseData.partnerInformation ||
      {}
    );

    setJoint(
      caseData.jointInformation || {}
    );
  }, [caseData]);

  const currentUser =
    activeParty === "user1"
      ? user1
      : user2;

  const setCurrentUser =
    activeParty === "user1"
      ? setUser1
      : setUser2;

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
};

  const saveAll = () => {
    onSave({
      myInformation: user1,
      partnerInformation: user2,
      jointInformation: joint,
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* TOP BAR */}

      <div className="border rounded-xl bg-amber-50 border-amber-300 p-4 flex justify-between items-center">

        <div className="flex items-center gap-2">
          <Lock size={16} />
          <span>
            Submitted Questionnaire
          </span>
        </div>

        <button
          onClick={() =>
            setIsCmEditing(
              !isCmEditing
            )
          }
          className="border rounded-lg px-4 py-2 flex items-center gap-2"
        >
          {isCmEditing ? (
            <Unlock size={16} />
          ) : (
            <Edit3 size={16} />
          )}

          {isCmEditing
            ? "CM Edit Active"
            : "Enable CM Edit"}
        </button>

      </div>

      {/* PARTY CARDS */}

      <div className="grid grid-cols-3 gap-4">

        <button
          onClick={() =>
            setActiveParty(
              "user1"
            )
          }
          className={`border rounded-xl p-5 text-left ${activeParty === "user1"
              ? "bg-slate-900 text-white"
              : "bg-white"
            }`}
        >
          <h3 className="font-bold">
            User 1
          </h3>

          <p className="text-sm">
            Personal Forms
          </p>
        </button>

        <button
          onClick={() =>
            setActiveParty(
              "user2"
            )
          }
          className={`border rounded-xl p-5 text-left ${activeParty === "user2"
              ? "bg-slate-900 text-white"
              : "bg-white"
            }`}
        >
          <h3 className="font-bold">
            Partner
          </h3>

          <p className="text-sm">
            Personal Forms
          </p>
        </button>

        <button
          onClick={() =>
            setActiveParty(
              "joint"
            )
          }
          className={`border rounded-xl p-5 text-left ${activeParty === "joint"
              ? "bg-slate-900 text-white"
              : "bg-white"
            }`}
        >
          <h3 className="font-bold">
            Joint
          </h3>

          <p className="text-sm">
            Shared Forms
          </p>
        </button>

      </div>

      {/* USER NAV */}

      {activeParty !==
        "joint" && (
          <div className="flex flex-wrap gap-2">

            <button
              onClick={() =>
                setActiveSection(
                  "personal"
                )
              }
              className="border rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <User size={14} />
              Personal
            </button>

            <button
              onClick={() =>
                setActiveSection(
                  "legal"
                )
              }
              className="border rounded-lg px-4 py-2"
            >
              Legal
            </button>

            <button
              onClick={() =>
                setActiveSection(
                  "family"
                )
              }
              className="border rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <Users size={14} />
              Family
            </button>

            <button
              onClick={() =>
                setActiveSection(
                  "assets"
                )
              }
              className="border rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <Home size={14} />
              Assets
            </button>

            <button
              onClick={() =>
                setActiveSection(
                  "income"
                )
              }
              className="border rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <DollarSign size={14} />
              Income
            </button>

            <button
              onClick={() =>
                setActiveSection(
                  "liabilities"
                )
              }
              className="border rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <CreditCard size={14} />
              Liabilities
            </button>

          </div>
        )}

      {/* JOINT NAV */}

      {activeParty ===
        "joint" && (
          <div className="flex gap-2">

            <button
              onClick={() =>
                setActiveJointSection(
                  "assets"
                )
              }
              className="border rounded-lg px-4 py-2"
            >
              Joint Assets
            </button>

            <button
              onClick={() =>
                setActiveJointSection(
                  "income"
                )
              }
              className="border rounded-lg px-4 py-2"
            >
              Joint Income
            </button>

            <button
              onClick={() =>
                setActiveJointSection(
                  "liabilities"
                )
              }
              className="border rounded-lg px-4 py-2"
            >
              Joint Liabilities
            </button>

          </div>
        )}

      {/* CONTENT */}

      <div className="border rounded-xl p-6 bg-white">

        {activeParty !==
          "joint" && (
            <>
              {activeSection ===
                "personal" && (
                  <PersonalInformation
                    data={
                      currentUser.personalInformation
                    }
                    isEditing={
                      isCmEditing
                    }
                    onChange={(
                      field,
                      value
                    ) =>
                      updateSection(
                        "personalInformation",
                        field,
                        value
                      )
                    }
                  />
                )}

              {activeSection ===
                "legal" && (
                  <LegalDeclarations
                    data={
                      currentUser.legalDeclaration
                    }
                    isEditing={
                      isCmEditing
                    }
                    onChange={(
                      field,
                      value
                    ) =>
                      updateSection(
                        "legalDeclaration",
                        field,
                        value
                      )
                    }
                  />
                )}

              {activeSection ===
                "family" && (
                  <FamilyDependents
                    data={
                      currentUser.familyAndDependents
                    }
                    isEditing={
                      isCmEditing
                    }
                    onChange={(
                      field,
                      value
                    ) =>
                      updateSection(
                        "familyAndDependents",
                        field,
                        value
                      )
                    }
                  />
                )}

              {activeSection ===
                "assets" && (
                  <IndividualAssets
                    data={
                      currentUser.individualAssets
                    }
                    isEditing={
                      isCmEditing
                    }
                    onChange={(
                      field,
                      value
                    ) =>
                      updateSection(
                        "individualAssets",
                        field,
                        value
                      )
                    }
                  />
                )}

              {activeSection ===
                "income" && (
                  <IncomeRevenue
                    data={
                      currentUser.incomeAndRevenue
                    }
                    isEditing={
                      isCmEditing
                    }
                    onChange={(
                      field,
                      value
                    ) =>
                      updateSection(
                        "incomeAndRevenue",
                        field,
                        value
                      )
                    }
                  />
                )}

              {activeSection ===
                "liabilities" && (
                  <LiabilitiesDebts
                    data={
                      currentUser.liabilitiesAndDebts
                    }
                    isEditing={
                      isCmEditing
                    }
                    onChange={(
                      field,
                      value
                    ) =>
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

        {activeParty ===
          "joint" && (
            <>
              {activeJointSection ===
                "assets" && (
                  <JointAssets
                    data={
                      joint.jointAssets
                    }
                    isEditing={
                      isCmEditing
                    }
                    onChange={(
                      field,
                      value
                    ) =>
                      updateJointSection(
                        "jointAssets",
                        field,
                        value
                      )
                    }
                  />
                )}

              {activeJointSection ===
                "income" && (
                  <JointIncome
                    data={
                      joint.jointIncomeAndRevenue
                    }
                    isEditing={
                      isCmEditing
                    }
                    onChange={(
                      field,
                      value
                    ) =>
                      updateJointSection(
                        "jointIncomeAndRevenue",
                        field,
                        value
                      )
                    }
                  />
                )}

              {activeJointSection ===
                "liabilities" && (
                  <JointLiabilities
                    data={
                      joint.jointLiabilitiesAndDebts
                    }
                    isEditing={
                      isCmEditing
                    }
                    onChange={(
                      field,
                      value
                    ) =>
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

      {/* SAVE */}

      {isCmEditing && (
        <div className="flex justify-end">

          <button
            onClick={saveAll}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>

        </div>
      )}

    </div>
  );
}
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  caseData: any;
}

export default function FormsTab({ caseData }: Props) {
  const [activeSection, setActiveSection] =
    useState<string | null>("myInformation");

  const toggleSection = (section: string) => {
    setActiveSection((prev) =>
      prev === section ? null : section
    );
  };

  return (
    <div className="space-y-6">

      {/* Form Status Cards */}

      <div className="grid md:grid-cols-3 gap-4">

        <ExpandableCard
          title="My Information"
          submitted={
            caseData.status?.myInformation?.submitted
          }
          active={activeSection === "myInformation"}
          onClick={() =>
            toggleSection("myInformation")
          }
        />

        <ExpandableCard
          title="Joint Information"
          submitted={
            caseData.status?.jointInformation?.submitted
          }
          active={
            activeSection === "jointInformation"
          }
          onClick={() =>
            toggleSection("jointInformation")
          }
        />

        <ExpandableCard
          title="Independent Legal Advice"
          submitted={
            caseData.status
              ?.independentLegalAdvice?.submitted
          }
          active={
            activeSection ===
            "independentLegalAdvice"
          }
          onClick={() =>
            toggleSection(
              "independentLegalAdvice"
            )
          }
        />

      </div>

      {/* MY INFORMATION */}

      {activeSection === "myInformation" && (
        <MyInformationDetails
          data={caseData.myInformation}
        />
      )}

      {/* JOINT INFORMATION */}

      {activeSection === "jointInformation" && (
        <JointInformationDetails
          data={caseData.jointInformation}
        />
      )}

      {/* ILA */}

      {activeSection ===
        "independentLegalAdvice" && (
        <ILADetails
          data={caseData.independentLegalAdvice}
        />
      )}

    </div>
  );
}

/* ---------------- CARD ---------------- */

function ExpandableCard({
  title,
  submitted,
  active,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      disabled={!submitted}
      className={`border rounded-xl p-4 text-left transition w-full ${
        submitted
          ? "hover:border-slate-400 cursor-pointer"
          : "opacity-60 cursor-not-allowed"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">
            {title}
          </div>

          <div
            className={`text-sm mt-2 ${
              submitted
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {submitted
              ? "Submitted"
              : "Pending"}
          </div>
        </div>

        {active ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </div>
    </button>
  );
}

/* ---------------- MY INFO ---------------- */

function MyInformationDetails({
  data,
}: any) {
  const personal =
    data?.personalInformation || {};

  const declaration =
    data?.legalDeclaration || {};

  const assets =
    data?.individualAssets || {};

  const income =
    data?.incomeAndRevenue || {};

  const debts =
    data?.liabilitiesAndDebts || {};

  return (
    <div className="space-y-5">

      <Section title="Personal Information">
        <Field
          label="First Name"
          value={personal.firstName}
        />
        <Field
          label="Middle Name"
          value={personal.middleName}
        />
        <Field
          label="Last Name"
          value={personal.lastName}
        />
        <Field
          label="Date Of Birth"
          value={personal.dateOfBirth}
        />
        <Field
          label="Nationality"
          value={personal.nationality}
        />
        <Field
          label="Language Fluency"
          value={personal.languageFluency}
        />
        <Field
          label="Profession"
          value={personal.currentProfession}
        />
        <Field
          label="Domicile Status"
          value={personal.domicileStatus}
        />
        <Field
          label="City"
          value={personal.city}
        />
        <Field
          label="County"
          value={personal.county}
        />
        <Field
          label="Postcode"
          value={personal.postcode}
        />
        <Field
          label="Marriage Date"
          value={personal.marriageDate}
        />
      </Section>

      <Section title="Legal Declaration">
        <Field
          label="Agreement Objectives"
          value={
            declaration.agreementObjectives
          }
        />

        <Field
          label="Future Living Situation"
          value={
            declaration.livingSituationFuture
          }
        />

        <Field
          label="Confirm Personal Effects"
          value={
            declaration.confirmPersonalEffects
              ? "Yes"
              : "No"
          }
        />

        <Field
          label="Confirm Accuracy"
          value={
            declaration.confirmAccuracy
              ? "Yes"
              : "No"
          }
        />
      </Section>

      <Section title="Assets">
        <Field
          label="Real Estate"
          value={assets.hasRealEstate}
        />

        <Field
          label="Savings"
          value={assets.hasSavings}
        />

        <Field
          label="Pensions"
          value={assets.hasPensions}
        />

        <Field
          label="Businesses"
          value={assets.hasBusinesses}
        />

        <Field
          label="IP Assets"
          value={assets.hasIP}
        />

        <Field
          label="Chattels"
          value={assets.hasChattels}
        />
      </Section>

      <Section title="Income & Revenue">
        <Field
          label="Gross Annual Income"
          value={income.grossAnnualIncome}
        />

        <Field
          label="Primary Bonus"
          value={income.hasPrimaryBonus}
        />

        <Field
          label="Alternative Income"
          value={income.hasAlternativeIncome}
        />
      </Section>

      <Section title="Liabilities & Debts">
        <Field
          label="Has Debts"
          value={debts.hasDebts}
        />

        <Field
          label="Has Maintenance"
          value={debts.hasMaintenance}
        />
      </Section>

    </div>
  );
}

/* ---------------- JOINT INFO ---------------- */

function JointInformationDetails({
  data,
}: any) {
  return (
    <div className="border rounded-xl p-5">
      <h3 className="font-semibold mb-4">
        Joint Information
      </h3>

      <pre className="bg-slate-50 p-4 rounded-lg overflow-auto text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

/* ---------------- ILA ---------------- */

function ILADetails({
  data,
}: any) {
  const questionnaire =
    data?.lawyerQuestionnaire || {};

  return (
    <div className="border rounded-xl p-5">

      <h3 className="font-semibold mb-4">
        Independent Legal Advice
      </h3>

      <div className="grid md:grid-cols-2 gap-4">

        {Object.entries(questionnaire).map(
          ([key, value]) => (
            <Field
              key={key}
              label={key}
              value={
                typeof value === "boolean"
                  ? value
                    ? "Yes"
                    : "No"
                  : value
              }
            />
          )
        )}

      </div>

    </div>
  );
}

/* ---------------- SHARED ---------------- */

function Section({
  title,
  children,
}: any) {
  return (
    <div className="border rounded-xl p-5">
      <h3 className="font-semibold mb-4">
        {title}
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
}: any) {
  return (
    <div>
      <div className="text-xs text-slate-500">
        {label}
      </div>

      <div className="font-medium">
        {value || "-"}
      </div>
    </div>
  );
}
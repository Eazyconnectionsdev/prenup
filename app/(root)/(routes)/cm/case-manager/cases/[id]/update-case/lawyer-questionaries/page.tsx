"use client"

import React, { useState } from "react";
import Axios from "@/lib/ApiConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


interface QuestionnaireData {
  complianceParticipation: string;
  compliancePurpose: string;
  complianceFreeWill: string;
  complianceLegalOpportunity: string;
  weddingTimingAssessment: string;

  complianceRadmacherUnderstanding: string;
  complianceCourtDiscretion: string;
  complianceFinancialImpact: string;
  compliancePodeUtilization: string;

  userAge: string;
  partnerAge: string;
  relationshipDuration: string;
  medicalExists: string;
  medicalDetails: string;
  housingNeeds: string;
  incomeNeeds: string;
  pensionNeeds: string;

  complianceDisclosureScope: string;
  complianceDigitalAssets: string;
  complianceDigitalAssetsDetails: string;
  complianceCorporateRestrictions: string;
  complianceCorporateRestrictionsDetails: string;
  complianceWorldwideScope: string;
  complianceDataAccuracy: string;
  finalDeclarationSignature: boolean;
}

const initialData: QuestionnaireData = {
  complianceParticipation: "",
  compliancePurpose: "",
  complianceFreeWill: "",
  complianceLegalOpportunity: "",
  weddingTimingAssessment: "",

  complianceRadmacherUnderstanding: "",
  complianceCourtDiscretion: "",
  complianceFinancialImpact: "",
  compliancePodeUtilization: "",

  userAge: "",
  partnerAge: "",
  relationshipDuration: "",
  medicalExists: "",
  medicalDetails: "",
  housingNeeds: "",
  incomeNeeds: "",
  pensionNeeds: "",

  complianceDisclosureScope: "",
  complianceDigitalAssets: "",
  complianceDigitalAssetsDetails: "",
  complianceCorporateRestrictions: "",
  complianceCorporateRestrictionsDetails: "",
  complianceWorldwideScope: "",
  complianceDataAccuracy: "",
  finalDeclarationSignature: false,
};

const inputClasses =
  "w-full rounded-[10px] border border-slate-300 bg-white px-4 py-3 text-[0.95rem] text-slate-900 transition focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-600/10";

const textareaClasses = inputClasses + " min-h-[90px] resize-y";

const smallLabelClasses =
  "mb-2 block text-[0.85rem] font-normal text-slate-500";

function ModuleTag({
  children,
  colorClasses = "bg-indigo-100 text-indigo-600",
}: {
  children: React.ReactNode;
  colorClasses?: string;
}) {
  return (
    <span
      className={`mb-3 inline-block rounded-full px-3 py-1 text-[0.725rem] font-bold uppercase tracking-wide ${colorClasses}`}
    >
      {children}
    </span>
  );
}

function PartHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 mt-12 border-b-[3px] border-indigo-100 pb-2.5 text-[1.25rem] font-bold uppercase tracking-wide text-indigo-600 first:mt-0">
      {children}
    </div>
  );
}

function FormGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 rounded-[10px] border border-slate-300 bg-slate-50 p-6">
      {children}
    </div>
  );
}

function QuestionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-3 block text-[0.975rem] font-bold leading-snug text-slate-800">
      {children}
    </label>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

function SelectField({
  name,
  value,
  onChange,
  options,
  placeholder = "Select one option...",
  required = true,
}: SelectFieldProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={inputClasses}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function ConditionalTextarea({
  visible,
  label,
  value,
  onChange,
  placeholder,
}: {
  visible: boolean;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  if (!visible) return null;
  return (
    <div className="mt-4 rounded-r-[10px] border border-slate-100 border-l-4 border-l-indigo-600 bg-white p-5">
      <label className="mb-2 block text-[0.85rem] text-slate-500">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className={textareaClasses}
      />
    </div>
  );
}

function ContextCaption({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 text-[0.85rem] italic text-slate-500">{children}</div>
  );
}

/* ---------------------------------------------------------------------- */
/* Main component                                                          */
/* ---------------------------------------------------------------------- */

interface LawyerQuestionnaireFormProps {
  onContinue?: () => void;
}

export default function LawyerQuestionnaire({
  onContinue,
}: LawyerQuestionnaireFormProps = {}) {

  const caseId = useSelector(
  (state: RootState) => state.auth.caseId
);

  const [data, setData] = useState<QuestionnaireData>(initialData);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof QuestionnaireData>(
    key: K,
    value: QuestionnaireData[K],
  ) => setData((prev) => ({ ...prev, [key]: value }));

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
console.log("inside submit")
  try {
    const payload = {
      ...data,
    };

    await Axios.post(
      `/cases/${caseId}/questionnaire/lawyer-questionnaire`,
      payload
    );

    setSubmitted(true);

    if (onContinue) {
      onContinue();
    } else {
      window.alert(
        "Thank you. Your questionnaire has been submitted successfully and will be available to your independent solicitor."
      );
    }
  } catch (error) {
    console.error(
      "Error saving lawyer questionnaire:",
      error
    );
  }
};

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-14">
      <div className="mx-auto max-w-3xl">

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-12 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.4rem] font-extrabold tracking-tight text-slate-900">
            Independent Legal Advice Questionnaire
          </h2>
          <p className="mb-6 text-[0.95rem] text-slate-500">
            Please complete this questionnaire before meeting with your
            independent solicitor. Your answers will help your solicitor
            understand your circumstances and provide tailored legal advice.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* ================= SECTION 1 ================= */}
            <PartHeader>
              Section 1: Personal Choice, Independence & Professional Guidance
            </PartHeader>

            <FormGroup>
              <ModuleTag>01. Personal Participation</ModuleTag>
              <QuestionLabel>
                Please confirm that the answers you provide represent your own
                thoughts, decisions, and understanding. You should complete this
                questionnaire without another person influencing your responses.
              </QuestionLabel>
              <SelectField
                name="compliance_participation"
                value={data.complianceParticipation}
                onChange={(v) => set("complianceParticipation", v)}
                options={[
                  {
                    value: "Confirmed",
                    label: "I confirm that my responses are my own.",
                  },
                  {
                    value: "Flagged",
                    label:
                      "I have a concern that I would like to discuss privately with my legal advisor.",
                  },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag>02. Purpose of this Questionnaire</ModuleTag>
              <QuestionLabel>
                This questionnaire collects important information to help your
                independent solicitor understand your circumstances before your
                consultation. Your solicitor will explain how the proposed
                agreement applies to your personal situation.
              </QuestionLabel>
              <SelectField
                name="compliance_purpose"
                value={data.compliancePurpose}
                onChange={(v) => set("compliancePurpose", v)}
                options={[
                  {
                    value: "Confirmed",
                    label:
                      "I understand the purpose of this questionnaire and wish to continue.",
                  },
                  {
                    value: "Flagged",
                    label:
                      "I would like further clarification before continuing.",
                  },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag>03. Voluntary Participation</ModuleTag>
              <QuestionLabel>
                Please confirm that your decision to consider this agreement has
                been made freely. This means you participate willingly, feel
                completely free from outside pressure, and are able to ask
                questions.
              </QuestionLabel>
              <SelectField
                name="compliance_free_will"
                value={data.complianceFreeWill}
                onChange={(v) => set("complianceFreeWill", v)}
                options={[
                  {
                    value: "Confirmed",
                    label:
                      "I confirm that this is my own decision made freely.",
                  },
                  {
                    value: "Flagged",
                    label:
                      "I would like to discuss something confidentially with my legal advisor.",
                  },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag>04. Legal Advice</ModuleTag>
              <QuestionLabel>
                Independent legal advice is an important part of the prenuptial
                agreement process. It gives you the opportunity to understand
                the agreement, ask questions, and make informed decisions before
                signing.
              </QuestionLabel>
              <SelectField
                name="compliance_legal_opportunity"
                value={data.complianceLegalOpportunity}
                onChange={(v) => set("complianceLegalOpportunity", v)}
                options={[
                  {
                    value: "Confirmed_Current",
                    label:
                      "I am comfortable continuing with my current legal advisor.",
                  },
                  {
                    value: "Flagged_Time",
                    label:
                      "I would like additional time to discuss my questions.",
                  },
                  {
                    value: "Flagged_Separate",
                    label:
                      "I would like to consider separate independent legal advice.",
                  },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag>05. Wedding & Timing Information</ModuleTag>
              <QuestionLabel>
                The timing of a prenuptial agreement can be an important
                consideration. Solicitors generally recommend that agreements
                are discussed and signed well in advance of a wedding or civil
                partnership ceremony.
              </QuestionLabel>
              <label className="mb-3 mt-5 block text-[0.975rem] font-bold text-slate-800">
                Approximately how many days remain before your planned wedding
                or civil partnership ceremony?
              </label>
              <SelectField
                name="wedding_timing_assessment"
                value={data.weddingTimingAssessment}
                onChange={(v) => set("weddingTimingAssessment", v)}
                placeholder="Select an option..."
                options={[
                  { value: "90+", label: "More than 90 days" },
                  { value: "60-90", label: "Between 60 and 90 days" },
                  { value: "30-60", label: "Between 30 and 60 days" },
                  { value: "14-30", label: "Between 14 and 30 days" },
                  { value: "LessThan14", label: "Less than 14 days" },
                  {
                    value: "Unknown",
                    label: "I am not yet certain of the ceremony date.",
                  },
                ]}
              />
              <ContextCaption>
                This information helps your solicitor assess whether there is
                sufficient time for both parties to obtain independent legal
                advice and consider the proposed agreement before the ceremony.
              </ContextCaption>
            </FormGroup>

            {/* ================= SECTION 2 ================= */}
            <PartHeader>
              Section 2: Legal Awareness, Court Considerations & Future Planning
            </PartHeader>

            <FormGroup>
              <ModuleTag>
                05. How Courts Consider Prenuptial Agreements
              </ModuleTag>
              <QuestionLabel>
                Under the law of England and Wales, courts may give significant
                weight to a prenuptial agreement where both partners entered
                into it voluntarily, understood its legal and financial
                implications, provided honest and complete financial disclosure,
                and the agreement remains fair. These principles were
                established by the Supreme Court in{" "}
                <em>Radmacher v Granatino [2010] UKSC 42</em>. However, the
                court always retains the final discretion to decide whether an
                agreement should be upheld based on the circumstances at the
                time of separation.
              </QuestionLabel>
              <SelectField
                name="compliance_radmacher_understanding"
                value={data.complianceRadmacherUnderstanding}
                onChange={(v) => set("complianceRadmacherUnderstanding", v)}
                options={[
                  {
                    value: "Confirmed",
                    label: "I understand this information.",
                  },
                  {
                    value: "Flagged_Apply",
                    label:
                      "I understand but would like to discuss how this applies to me.",
                  },
                  {
                    value: "Flagged_Explanation",
                    label:
                      "I would like further explanation before continuing.",
                  },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag>06. Future Changes in Circumstances</ModuleTag>
              <QuestionLabel>
                Do you understand that your personal, financial, and family
                circumstances may change over time, and that a court may take
                those changes into account when deciding whether your agreement
                remains fair and enforceable?
              </QuestionLabel>
              <SelectField
                name="compliance_court_discretion"
                value={data.complianceCourtDiscretion}
                onChange={(v) => set("complianceCourtDiscretion", v)}
                options={[
                  { value: "Confirmed", label: "I understand this risk." },
                  {
                    value: "Flagged",
                    label:
                      "I would like my legal advisor to explain this further.",
                  },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag>
                07. Understanding the Financial Effect of this Agreement
              </ModuleTag>
              <QuestionLabel>
                I understand that this agreement may affect my legal rights in
                relation to property, savings, income, pensions, and other
                financial matters if our marriage ends.
              </QuestionLabel>
              <SelectField
                name="compliance_financial_impact"
                value={data.complianceFinancialImpact}
                onChange={(v) => set("complianceFinancialImpact", v)}
                options={[
                  {
                    value: "Confirmed",
                    label: "I understand the possible financial impact.",
                  },
                  {
                    value: "Flagged",
                    label:
                      "I would like specific advice about my personal circumstances.",
                  },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag>08. Pension Considerations</ModuleTag>
              <QuestionLabel>
                Pensions are often one of the most valuable assets in a marriage
                and can be complex to value. Depending on your circumstances,
                your solicitor may recommend obtaining advice from a Pension on
                Divorce Expert (PODE).
              </QuestionLabel>
              <SelectField
                name="compliance_pode_utilization"
                value={data.compliancePodeUtilization}
                onChange={(v) => set("compliancePodeUtilization", v)}
                options={[
                  {
                    value: "Confirmed",
                    label: "I understand this asset risk and wish to continue.",
                  },
                  {
                    value: "Flagged_Advisor",
                    label:
                      "I would like to discuss pension matters with my legal advisor.",
                  },
                  {
                    value: "Flagged_Expert",
                    label:
                      "I would like to consider specialist pension guidance from a PODE.",
                  },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag>09. Future Needs Assessment</ModuleTag>
              <QuestionLabel>
                To help your solicitor assess whether the proposed agreement is
                fair and appropriate, please provide the information below
                regarding your future needs and personal circumstances.
              </QuestionLabel>
              <div className="mt-2 text-[0.85rem] italic text-slate-500">
                This information helps your solicitor consider:
                <ul className="mt-2 list-disc space-y-1 pl-5 not-italic">
                  <li>Housing arrangements</li>
                  <li>Day-to-day financial needs</li>
                  <li>Retirement planning</li>
                  <li>Family responsibilities</li>
                  <li>Health and medical circumstances</li>
                  <li>Changes in personal circumstances</li>
                </ul>
              </div>

              {/* Ages */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={smallLabelClasses}>Your Age</label>
                  <input
                    type="number"
                    min={18}
                    max={110}
                    placeholder="Age"
                    value={data.userAge}
                    onChange={(e) => set("userAge", e.target.value)}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={smallLabelClasses}>
                    Partner&apos;s Age
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={110}
                    placeholder="Partner's Age"
                    value={data.partnerAge}
                    onChange={(e) => set("partnerAge", e.target.value)}
                    required
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Relationship duration */}
              <div className="mt-4">
                <label className={smallLabelClasses}>
                  How long have you and your partner been in a relationship, and
                  if applicable, how long have you lived together?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Together for 5 years, living together for 3 years"
                  value={data.relationshipDuration}
                  onChange={(e) => set("relationshipDuration", e.target.value)}
                  required
                  className={inputClasses}
                />
              </div>

              {/* Medical */}
              <div className="mt-4">
                <label className={smallLabelClasses}>
                  Do either of you have any relevant health or medical
                  circumstances?
                </label>
                <SelectField
                  name="medical_baseline_exists"
                  value={data.medicalExists}
                  onChange={(v) => set("medicalExists", v)}
                  placeholder="Select an option..."
                  options={[
                    { value: "No", label: "No" },
                    {
                      value: "Yes",
                      label:
                        "Yes, there are relevant health or medical circumstances.",
                    },
                  ]}
                />
                <ConditionalTextarea
                  visible={data.medicalExists === "Yes"}
                  label="Provide medical circumstances overview for your legal reviewer."
                  value={data.medicalDetails}
                  onChange={(v) => set("medicalDetails", v)}
                  placeholder="Describe any relevant health conditions, disabilities, or ongoing medical circumstances that your solicitor should be aware of."
                />
              </div>

              {/* Housing needs */}
              <div className="mt-4">
                <label className={smallLabelClasses}>
                  Are you satisfied that the proposed agreement adequately
                  provides for your housing needs if your marriage ends?
                </label>
                <SelectField
                  name="housing_needs"
                  value={data.housingNeeds}
                  onChange={(v) => set("housingNeeds", v)}
                  placeholder="Select an option..."
                  options={[
                    {
                      value: "Yes",
                      label:
                        "Yes, I believe my housing needs have been adequately considered.",
                    },
                    {
                      value: "Discuss",
                      label:
                        "I would like to discuss my housing needs with my solicitor.",
                    },
                    {
                      value: "No",
                      label:
                        "No, I do not believe my housing needs have been adequately addressed.",
                    },
                  ]}
                />
              </div>

              {/* Income needs */}
              <div className="mt-4">
                <label className={smallLabelClasses}>
                  Are you satisfied that the proposed agreement adequately
                  provides for your future income and day-to-day living expenses
                  if your marriage ends?
                </label>
                <SelectField
                  name="income_needs"
                  value={data.incomeNeeds}
                  onChange={(v) => set("incomeNeeds", v)}
                  placeholder="Select an option..."
                  options={[
                    {
                      value: "Yes",
                      label:
                        "Yes, I believe my future income needs have been adequately considered.",
                    },
                    {
                      value: "Discuss",
                      label:
                        "I would like to discuss my future income needs with my solicitor.",
                    },
                    {
                      value: "No",
                      label:
                        "No, I do not believe my future income needs have been adequately addressed.",
                    },
                  ]}
                />
              </div>

              {/* Pension needs */}
              <div className="mt-4">
                <label className={smallLabelClasses}>
                  Are you satisfied that the proposed agreement adequately
                  provides for your pension and retirement needs?
                </label>
                <SelectField
                  name="pension_needs"
                  value={data.pensionNeeds}
                  onChange={(v) => set("pensionNeeds", v)}
                  placeholder="Select an option..."
                  options={[
                    {
                      value: "Yes",
                      label:
                        "Yes, I believe my pension and retirement needs have been adequately considered.",
                    },
                    {
                      value: "Discuss",
                      label:
                        "I would like to discuss my pension and retirement needs with my solicitor.",
                    },
                    {
                      value: "No",
                      label:
                        "No, I do not believe my pension and retirement needs have been adequately addressed.",
                    },
                  ]}
                />
              </div>
            </FormGroup>

            {/* ================= SECTION 3 ================= */}
            <PartHeader>
              Section 3: Financial Information, Transparency & Accuracy
            </PartHeader>

            <FormGroup>
              <ModuleTag>10. Financial Disclosure Confirmation</ModuleTag>
              <QuestionLabel>
                Please confirm that you have disclosed all assets, income,
                liabilities, pensions, business interests, and any other
                financial information that may be relevant to this agreement,
                including assets or interests held outside the UK.
              </QuestionLabel>
              <SelectField
                name="compliance_disclosure_scope"
                value={data.complianceDisclosureScope}
                onChange={(v) => set("complianceDisclosureScope", v)}
                options={[
                  {
                    value: "Confirmed",
                    label:
                      "I believe the information provided is fully complete.",
                  },
                  {
                    value: "Flagged",
                    label:
                      "I am unsure about some information and would like structural guidance.",
                  },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag colorClasses="bg-green-50 text-green-600">
                Digital Assets
              </ModuleTag>
              <QuestionLabel>
                Do you own any significant digital assets such as
                cryptocurrency, NFTs, online businesses, domain names, or
                digital intellectual property?
              </QuestionLabel>
              <SelectField
                name="compliance_digital_assets"
                value={data.complianceDigitalAssets}
                onChange={(v) => set("complianceDigitalAssets", v)}
                placeholder="Select an option..."
                options={[
                  { value: "No", label: "No" },
                  { value: "Yes", label: "Yes, I own digital assets" },
                ]}
              />
              <ConditionalTextarea
                visible={data.complianceDigitalAssets === "Yes"}
                label="Please provide brief details of your digital assets (if applicable)."
                value={data.complianceDigitalAssetsDetails}
                onChange={(v) => set("complianceDigitalAssetsDetails", v)}
                placeholder="For example: cryptocurrency, NFTs, online businesses, domain names, digital intellectual property, or other digital assets."
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag colorClasses="bg-pink-50 text-pink-600">
                Business Ownership
              </ModuleTag>
              <QuestionLabel>
                Do you own shares in a private company or have an ownership
                interest in a business that may be subject to restrictions on
                ownership or transfer (for example, under a Shareholders&apos;
                Agreement or similar legal document)?
              </QuestionLabel>
              <SelectField
                name="compliance_corporate_restrictions"
                value={data.complianceCorporateRestrictions}
                onChange={(v) => set("complianceCorporateRestrictions", v)}
                placeholder="Select an option..."
                options={[
                  { value: "No", label: "No / Not Applicable" },
                  {
                    value: "Yes",
                    label: "Yes, restriction clauses are in place",
                  },
                ]}
              />
              <ConditionalTextarea
                visible={data.complianceCorporateRestrictions === "Yes"}
                label="Please briefly describe any ownership or transfer restrictions that apply."
                value={data.complianceCorporateRestrictionsDetails}
                onChange={(v) =>
                  set("complianceCorporateRestrictionsDetails", v)
                }
                placeholder="For example: pre-emption rights, buy-back provisions, transfer restrictions, or other shareholder obligations."
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag>11. Global Assets & Expected Inheritances</ModuleTag>
              <QuestionLabel>
                Please confirm that your answers include any overseas assets,
                foreign property, business interests, trusts, expected
                inheritances, or other significant future financial interests
                that may be relevant to this agreement.
              </QuestionLabel>
              <SelectField
                name="compliance_worldwide_scope"
                value={data.complianceWorldwideScope}
                onChange={(v) => set("complianceWorldwideScope", v)}
                options={[
                  {
                    value: "Confirmed",
                    label:
                      "I have accurately included all global/future items.",
                  },
                  {
                    value: "Flagged",
                    label:
                      "I need advice about whether a foreign or trust interest should be included.",
                  },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <ModuleTag>12. Accuracy Declaration</ModuleTag>
              <QuestionLabel>
                Please review your answers before final submission. Confirm that
                the details provided are completely accurate based on your
                current knowledge and understanding.
              </QuestionLabel>
              <SelectField
                name="compliance_data_accuracy"
                value={data.complianceDataAccuracy}
                onChange={(v) => set("complianceDataAccuracy", v)}
                options={[
                  {
                    value: "Confirmed",
                    label:
                      "I confirm the information provided is entirely accurate.",
                  },
                  {
                    value: "Flagged",
                    label:
                      "I need to return and update my information entries.",
                  },
                ]}
              />
            </FormGroup>

            {/* FINAL COMPLIANCE ACCEPTANCE BLOCK */}
            <div className="mb-5 mt-10 rounded-[10px] border border-indigo-200 bg-indigo-50 p-5 text-[0.925rem] font-medium leading-relaxed text-indigo-800">
              <strong>📋 Final Declaration:</strong> By submitting this
              questionnaire, you confirm that the information you have provided
              is true, complete, and accurate to the best of your knowledge. You
              also understand that you may discuss, amend, or update any part of
              your proposed agreement with your independent solicitor before
              signing. Providing incomplete or inaccurate information may affect
              the advice your solicitor is able to provide and may reduce the
              effectiveness of your agreement.
            </div>

            {/* Interactive Declaration Agreement Switch Card */}
            <label
              htmlFor="final_declaration_lock"
              className={`relative mb-6 flex cursor-pointer items-center gap-3.5 rounded-[10px] border px-6 py-6 transition ${
                data.finalDeclarationSignature
                  ? "border-indigo-600 bg-white"
                  : "border-slate-300 bg-white hover:border-indigo-600"
              }`}
            >
              <input
                type="checkbox"
                id="final_declaration_lock"
                checked={data.finalDeclarationSignature}
                onChange={(e) =>
                  set("finalDeclarationSignature", e.target.checked)
                }
                required
                className="sr-only"
              />
              <span
                className={`relative h-5 w-5 flex-shrink-0 rounded-[6px] border-2 transition ${
                  data.finalDeclarationSignature
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-slate-300 bg-white"
                }`}
              >
                {data.finalDeclarationSignature && (
                  <svg
                    viewBox="0 0 10 10"
                    className="absolute left-1/2 top-1/2 h-[10px] w-[7px] -translate-x-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 5l2.5 3L9 1" />
                  </svg>
                )}
              </span>
              <span
                className={`ml-2 text-[0.925rem] font-semibold ${
                  data.finalDeclarationSignature
                    ? "text-indigo-600"
                    : "text-slate-900"
                }`}
              >
                I confirm that the information provided is true and accurate to
                the best of my knowledge.
              </span>
            </label>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-[10px] bg-indigo-600 px-10 py-4 font-semibold text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition hover:-translate-y-px hover:bg-indigo-700"
              >
                Submit Questionnaire
              </button>
            </div>
          </form>

          {submitted && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              Lawyers questionnaire saved successfully.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

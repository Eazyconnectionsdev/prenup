"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";

type YesNo = "Yes" | "No";

type Treatment =
  | ""
  | "KeepSeparate"
  | "ShareEqually"
  | "Contribution"
  | "Percentage"
  | "Custom";

interface TreatmentFields {
  treatment: Treatment;
  contributionText: string;
  percentageValue: string;
  customText: string;
}

const emptyTreatment: TreatmentFields = {
  treatment: "",
  contributionText: "",
  percentageValue: "",
  customText: "",
};

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/* ---------------------------------------------------------------------- */
/* Row types per asset category                                            */
/* ---------------------------------------------------------------------- */

interface RealEstateRow extends TreatmentFields {
  id: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  propertyType: string;
  value: string;
  valueUnknown: boolean;
  mortgageBalance: string;
  earlyPenalty: string;
  ownershipShare: string;
  ownershipMode: string;
  coOwnerDetails: string;
  thirdPartyInterest: string;
  thirdPartyDetail: string;
}

interface SavingsRow extends TreatmentFields {
  id: string;
  institution: string;
  accountType: string;
  balance: string;
}

interface PensionRow extends TreatmentFields {
  id: string;
  provider: string;
  value: string;
  valueUnknown: boolean;
}

interface BusinessRow extends TreatmentFields {
  id: string;
  name: string;
  entityType: string;
  turnover: string;
  netProfit: string;
  ownershipPercent: string;
  valueOfStake: string;
  valueUnknown: boolean;
  justification: string;
}

interface ChattelRow extends TreatmentFields {
  id: string;
  description: string;
  category: string;
  value: string;
  valueUnknown: boolean;
}

interface IPRow extends TreatmentFields {
  id: string;
  name: string;
  ipType: string;
  value: string;
  valueUnknown: boolean;
  registrationNumber: string;
  description: string;
}

interface OtherAssetRow extends TreatmentFields {
  id: string;
  description: string;
  value: string;
  valueUnknown: boolean;
}

function makeRealEstateRow(): RealEstateRow {
  return {
    id: makeId("re"),
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    propertyType: "",
    value: "",
    valueUnknown: false,
    mortgageBalance: "",
    earlyPenalty: "",
    ownershipShare: "",
    ownershipMode: "",
    coOwnerDetails: "",
    thirdPartyInterest: "",
    thirdPartyDetail: "",
    ...emptyTreatment,
  };
}
function makeSavingsRow(): SavingsRow {
  return {
    id: makeId("sav"),
    institution: "",
    accountType: "",
    balance: "",
    ...emptyTreatment,
  };
}
function makePensionRow(): PensionRow {
  return {
    id: makeId("pen"),
    provider: "",
    value: "",
    valueUnknown: false,
    ...emptyTreatment,
  };
}
function makeBusinessRow(): BusinessRow {
  return {
    id: makeId("biz"),
    name: "",
    entityType: "",
    turnover: "",
    netProfit: "",
    ownershipPercent: "",
    valueOfStake: "",
    valueUnknown: false,
    justification: "",
    ...emptyTreatment,
  };
}
function makeChattelRow(): ChattelRow {
  return {
    id: makeId("chat"),
    description: "",
    category: "",
    value: "",
    valueUnknown: false,
    ...emptyTreatment,
  };
}
function makeIPRow(): IPRow {
  return {
    id: makeId("ip"),
    name: "",
    ipType: "",
    value: "",
    valueUnknown: false,
    registrationNumber: "",
    description: "",
    ...emptyTreatment,
  };
}
function makeOtherAssetRow(): OtherAssetRow {
  return {
    id: makeId("other"),
    description: "",
    value: "",
    valueUnknown: false,
    ...emptyTreatment,
  };
}

/* ---------------------------------------------------------------------- */
/* Shared styling helpers                                                  */
/* ---------------------------------------------------------------------- */

const inputClasses =
  "w-full rounded-[10px] border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[0.925rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 disabled:cursor-not-allowed disabled:opacity-60";

const textareaClasses = inputClasses + " min-h-[70px] resize-y";

/* ---------------------------------------------------------------------- */
/* Reusable field components                                               */
/* ---------------------------------------------------------------------- */

function Tooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex h-[18px] w-[18px] cursor-help items-center justify-center rounded-full bg-indigo-100 text-[0.75rem] font-bold text-indigo-600"
    >
      ⓘ
    </span>
  );
}

function PartHeader({
  children,
  tooltip,
}: {
  children: ReactNode;
  tooltip?: string;
}) {
  return (
    <div className="mb-4 mt-8 flex items-center gap-2 text-[1.15rem] font-bold text-slate-800">
      {children}
      {tooltip && <Tooltip text={tooltip} />}
    </div>
  );
}

interface YesNoToggleProps {
  name: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}

function YesNoToggle({ name, value, onChange }: YesNoToggleProps) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-3">
      {(["Yes", "No"] as YesNo[]).map((opt) => {
        const checked = value === opt;
        return (
          <label
            key={opt}
            className={`relative flex cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-3 transition ${
              checked
                ? "border-indigo-600 bg-slate-50"
                : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={checked}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            <span
              className={`relative h-4 w-4 flex-shrink-0 rounded-full border-2 ${
                checked
                  ? "border-indigo-600 bg-indigo-600"
                  : "border-slate-300 bg-white"
              }`}
            >
              {checked && (
                <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              )}
            </span>
            <span
              className={`text-[0.9rem] font-semibold ${checked ? "text-indigo-600" : "text-slate-900"}`}
            >
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function MatrixBox({
  title,
  children,
  onAdd,
  addLabel,
}: {
  title: string;
  children: ReactNode;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-300 bg-slate-50 p-6">
      <div className="mb-4 text-[0.85rem] font-bold uppercase tracking-wide text-slate-500">
        {title}
      </div>
      {children}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-indigo-600 bg-transparent px-5 py-3 text-[0.9rem] font-semibold text-indigo-600 transition hover:border-solid hover:bg-indigo-100"
      >
        + {addLabel}
      </button>
    </div>
  );
}

function RowItem({
  children,
  onDelete,
}: {
  children: ReactNode;
  onDelete: () => void;
}) {
  return (
    <div className="relative mb-5 rounded-[10px] border border-slate-300 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <button
        type="button"
        onClick={onDelete}
        aria-label="Remove item"
        className="absolute right-4 top-4 text-[1.1rem] text-slate-500 transition hover:text-red-500"
      >
        ✕
      </button>
      {children}
    </div>
  );
}

interface ValueWithUnsureProps {
  id: string;
  value: string;
  unknown: boolean;
  onValueChange: (v: string) => void;
  onUnknownChange: (v: boolean) => void;
  placeholder: string;
}

function ValueWithUnsure({
  id,
  value,
  unknown,
  onValueChange,
  onUnknownChange,
  placeholder,
}: ValueWithUnsureProps) {
  return (
    <div>
      <input
        type="number"
        id={id}
        value={unknown ? "" : value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={unknown}
        required={!unknown}
        placeholder={unknown ? "Value unknown" : placeholder}
        className={inputClasses}
      />
      <label className="mt-1.5 flex cursor-pointer items-center gap-1.5 text-[0.8rem] font-normal text-slate-500">
        <input
          type="checkbox"
          checked={unknown}
          onChange={(e) => onUnknownChange(e.target.checked)}
          className="h-3.5 w-3.5"
        />
        I am unsure of the current value.
      </label>
      <small className="mt-1 block pl-5 text-[0.75rem] leading-tight text-slate-500">
        Please provide an estimated value where possible. You may update this
        information later if additional details become available.
      </small>
    </div>
  );
}

interface TreatmentSelectProps {
  id: string;
  fields: TreatmentFields;
  onChange: (fields: TreatmentFields) => void;
  label?: string;
  options?: { value: Treatment; label: string }[];
}

const allTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "KeepSeparate", label: "Keep it Separate" },
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

function TreatmentSelect({
  id,
  fields,
  onChange,
  label = "How should this be shared?",
  options = allTreatmentOptions,
}: TreatmentSelectProps) {
  return (
    <div className="mt-3">
      <select
        id={`treatment_${id}`}
        value={fields.treatment}
        onChange={(e) =>
          onChange({ ...fields, treatment: e.target.value as Treatment })
        }
        required
        className={inputClasses}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {fields.treatment === "Contribution" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Define contribution (e.g., salary, initial deposit):
          </label>
          <input
            type="text"
            value={fields.contributionText}
            onChange={(e) =>
              onChange({ ...fields, contributionText: e.target.value })
            }
            placeholder="Explain your contribution logic"
            className={inputClasses}
          />
        </div>
      )}
      {fields.treatment === "Percentage" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Specify percentage (e.g., 60/40):
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={fields.percentageValue}
            onChange={(e) =>
              onChange({ ...fields, percentageValue: e.target.value })
            }
            placeholder="Percentage (%)"
            className={inputClasses}
          />
        </div>
      )}
      {fields.treatment === "Custom" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Custom Arrangement Details:
          </label>
          <textarea
            value={fields.customText}
            onChange={(e) =>
              onChange({ ...fields, customText: e.target.value })
            }
            placeholder="Create your own arrangement..."
            className={textareaClasses}
          />
        </div>
      )}
    </div>
  );
}

export default function IndividualAssetsForm() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [hasRealEstate, setHasRealEstate] = useState<YesNo>("No");
  const [realEstate, setRealEstate] = useState<RealEstateRow[]>([]);

  const [hasSavings, setHasSavings] = useState<YesNo>("No");
  const [savings, setSavings] = useState<SavingsRow[]>([]);

  const [hasPensions, setHasPensions] = useState<YesNo>("No");
  const [pensions, setPensions] = useState<PensionRow[]>([]);

  const [hasBusinesses, setHasBusinesses] = useState<YesNo>("No");
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);

  const [hasIP, setHasIP] = useState<YesNo>("No");
  const [ipAssets, setIpAssets] = useState<IPRow[]>([]);

  const [hasChattels, setHasChattels] = useState<YesNo>("No");
  const [chattels, setChattels] = useState<ChattelRow[]>([]);

  const [hasOtherAssets, setHasOtherAssets] = useState<YesNo>("No");
  const [otherAssets, setOtherAssets] = useState<OtherAssetRow[]>([]);

  const [submitted, setSubmitted] = useState(false);
  const caseId = useSelector((state: RootState) => state.auth.caseId);
  // Generic toggle helper: when switching to "Yes" ensure at least one row exists;
  // when switching to "No" clear all rows for that section.
  function makeToggleHandler<T>(
    setEnabled: React.Dispatch<React.SetStateAction<YesNo>>,
    setRows: React.Dispatch<React.SetStateAction<T[]>>,
    makeRow: () => T,
  ) {
    return (value: YesNo) => {
      setEnabled(value);
      if (value === "Yes") {
        setRows((prev) => (prev.length === 0 ? [makeRow()] : prev));
      } else {
        setRows([]);
      }
    };
  }

  const handleRealEstateToggle = makeToggleHandler(
    setHasRealEstate,
    setRealEstate,
    makeRealEstateRow,
  );
  const handleSavingsToggle = makeToggleHandler(
    setHasSavings,
    setSavings,
    makeSavingsRow,
  );
  const handlePensionsToggle = makeToggleHandler(
    setHasPensions,
    setPensions,
    makePensionRow,
  );
  const handleBusinessesToggle = makeToggleHandler(
    setHasBusinesses,
    setBusinesses,
    makeBusinessRow,
  );
  const handleIPToggle = makeToggleHandler(setHasIP, setIpAssets, makeIPRow);
  const handleChattelsToggle = makeToggleHandler(
    setHasChattels,
    setChattels,
    makeChattelRow,
  );
  const handleOtherAssetsToggle = makeToggleHandler(
    setHasOtherAssets,
    setOtherAssets,
    makeOtherAssetRow,
  );

  function updateRow<T extends { id: string }>(
    setRows: React.Dispatch<React.SetStateAction<T[]>>,
    id: string,
    patch: Partial<T>,
  ) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow<T extends { id: string }>(
    setRows: React.Dispatch<React.SetStateAction<T[]>>,
    id: string,
  ) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      hasRealEstate,
      realEstate,

      hasSavings,
      savings,

      hasPensions,
      pensions,

      hasBusinesses,
      businesses,

      hasIP,
      ipAssets,

      hasChattels,
      chattels,

      hasOtherAssets,
      otherAssets,
    };

    try {
      const { data } = await Axios.post(
        `/cases/${caseId}/questionnaire/${user.endUserType === "user1" ? "individual-assets" : "partner-individual-assets"}`,
        payload,
      );

      setSubmitted(true);

      // onContinue?.();
    } catch (error) {
      console.error("Error saving individual assets:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { data },
        } = await Axios.get(
          `/cases/${caseId}/section/${user.endUserType === "user1" ? "myInformation" : "partnerInformation"}`,
        );

        const assets = data?.individualAssets;
        if (!assets) return;

        // Real estate
        setHasRealEstate(assets.hasRealEstate ?? "No");
        setRealEstate(
          Array.isArray(assets.realEstate) ? assets.realEstate : [],
        );

        // Savings
        setHasSavings(assets.hasSavings ?? "No");
        setSavings(Array.isArray(assets.savings) ? assets.savings : []);

        // Pensions
        setHasPensions(assets.hasPensions ?? "No");
        setPensions(Array.isArray(assets.pensions) ? assets.pensions : []);

        // Businesses
        setHasBusinesses(assets.hasBusinesses ?? "No");
        setBusinesses(
          Array.isArray(assets.businesses) ? assets.businesses : [],
        );

        // IP
        setHasIP(assets.hasIP ?? "No");
        setIpAssets(Array.isArray(assets.ipAssets) ? assets.ipAssets : []);

        // Chattels
        setHasChattels(assets.hasChattels ?? "No");
        setChattels(Array.isArray(assets.chattels) ? assets.chattels : []);


        setHasOtherAssets(assets.hasOtherAssets ?? "No");
        setOtherAssets(
          Array.isArray(assets.otherAssets) ? assets.otherAssets : [],
        );
      } catch (error) {
        console.error("Error fetching individual assets:", error);
      } finally {
      }
    };

      fetchData();
  }, [caseId, user?.endUserType]);

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-11 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Your Individual Assets
          </h2>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
            Please tell us about the assets you personally own or partly own.
            Include any assets owned with another person, such as a parent,
            family member, business partner or trust.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* PROPERTY & REAL ESTATE */}
            <PartHeader tooltip="List details of any properties you own personally or with third parties that you want to keep separate from your partner.">
              Property & Real Estate
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you own, partly own, or have a financial interest in any real
                estate / properties?
              </label>
              <YesNoToggle
                name="has_real_estate"
                value={hasRealEstate}
                onChange={handleRealEstateToggle}
              />
            </div>
            {hasRealEstate === "Yes" && (
              <MatrixBox
                title="Real Estate Registry Asset Rows"
                onAdd={() =>
                  setRealEstate((prev) => [...prev, makeRealEstateRow()])
                }
                addLabel="Add Property Asset"
              >
                {realEstate.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setRealEstate, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        value={row.addressLine1}
                        onChange={(e) =>
                          updateRow(setRealEstate, row.id, {
                            addressLine1: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <input
                        type="text"
                        placeholder="Address Line 2 (Optional)"
                        value={row.addressLine2}
                        onChange={(e) =>
                          updateRow(setRealEstate, row.id, {
                            addressLine2: e.target.value,
                          })
                        }
                        className={inputClasses}
                      />
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <input
                        type="text"
                        placeholder="Postcode"
                        value={row.postcode}
                        onChange={(e) =>
                          updateRow(setRealEstate, row.id, {
                            postcode: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <select
                        value={row.propertyType}
                        onChange={(e) =>
                          updateRow(setRealEstate, row.id, {
                            propertyType: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      >
                        <option value="">Property Type</option>
                        <option value="House">House</option>
                        <option value="Flat">Flat</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                      <ValueWithUnsure
                        id={`val_${row.id}`}
                        value={row.value}
                        unknown={row.valueUnknown}
                        onValueChange={(v) =>
                          updateRow(setRealEstate, row.id, { value: v })
                        }
                        onUnknownChange={(v) =>
                          updateRow(setRealEstate, row.id, { valueUnknown: v })
                        }
                        placeholder="Value (GBP)"
                      />
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <input
                        type="number"
                        placeholder="Mortgage Balance"
                        value={row.mortgageBalance}
                        onChange={(e) =>
                          updateRow(setRealEstate, row.id, {
                            mortgageBalance: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <input
                        type="number"
                        placeholder="Early Penalty Charges (£)"
                        value={row.earlyPenalty}
                        onChange={(e) =>
                          updateRow(setRealEstate, row.id, {
                            earlyPenalty: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Ownership Share %"
                        value={row.ownershipShare}
                        onChange={(e) =>
                          updateRow(setRealEstate, row.id, {
                            ownershipShare: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <select
                        value={row.ownershipMode}
                        onChange={(e) =>
                          updateRow(setRealEstate, row.id, {
                            ownershipMode: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      >
                        <option value="">Ownership Mode</option>
                        <option value="Solely">Solely Owned</option>
                        <option value="Jointly">
                          Jointly Owned (with family, business partners, etc.)
                        </option>
                      </select>
                      <select
                        value={row.thirdPartyInterest}
                        onChange={(e) =>
                          updateRow(setRealEstate, row.id, {
                            thirdPartyInterest: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      >
                        <option value="">Third-Party Interest?</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    {row.ownershipMode === "Jointly" && (
                      <textarea
                        placeholder="Specify co-owner names, shares, and relationship."
                        value={row.coOwnerDetails}
                        onChange={(e) =>
                          updateRow(setRealEstate, row.id, {
                            coOwnerDetails: e.target.value,
                          })
                        }
                        className={textareaClasses + " mb-3.5"}
                      />
                    )}
                    {row.thirdPartyInterest === "Yes" && (
                      <textarea
                        placeholder="Specify who holds the interest (e.g. parent loan) and if a written agreement exists."
                        value={row.thirdPartyDetail}
                        onChange={(e) =>
                          updateRow(setRealEstate, row.id, {
                            thirdPartyDetail: e.target.value,
                          })
                        }
                        className={textareaClasses + " mb-3.5"}
                      />
                    )}
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setRealEstate, row.id, f)}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* SAVINGS & INVESTMENTS */}
            <PartHeader tooltip="List personal bank accounts, cash savings, premium bonds, or investment portfolios.">
              Savings & Investments
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you currently hold any personal bank accounts, cash savings,
                premium bonds, or investment portfolios?
              </label>
              <YesNoToggle
                name="has_separate_savings"
                value={hasSavings}
                onChange={handleSavingsToggle}
              />
            </div>
            {hasSavings === "Yes" && (
              <MatrixBox
                title="Savings & Cash Resource Pools"
                onAdd={() => setSavings((prev) => [...prev, makeSavingsRow()])}
                addLabel="Add Savings / Portfolio Account"
              >
                {savings.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setSavings, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <input
                        type="text"
                        placeholder="Institution / Bank Name"
                        value={row.institution}
                        onChange={(e) =>
                          updateRow(setSavings, row.id, {
                            institution: e.target.value,
                          })
                        }
                        required
                        className={inputClasses + " sm:col-span-1"}
                      />
                      <select
                        value={row.accountType}
                        onChange={(e) =>
                          updateRow(setSavings, row.id, {
                            accountType: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      >
                        <option value="">Account Type</option>
                        <option value="Current">Current Account</option>
                        <option value="Savings">Savings Account</option>
                        <option value="ISA">ISA</option>
                        <option value="Investment">Investment Portfolio</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Valuation Balance (GBP)"
                        value={row.balance}
                        onChange={(e) =>
                          updateRow(setSavings, row.id, {
                            balance: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setSavings, row.id, f)}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* PENSIONS & RETIREMENT FUNDS */}
            <PartHeader tooltip="List your private, corporate, or state pension pots or retirement annuities.">
              Pensions & Retirement Funds
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you hold any private, corporate, or state pension pots or
                retirement annuities?
              </label>
              <YesNoToggle
                name="has_separate_pensions"
                value={hasPensions}
                onChange={handlePensionsToggle}
              />
            </div>
            {hasPensions === "Yes" && (
              <MatrixBox
                title="Pension Scheme Registry"
                onAdd={() => setPensions((prev) => [...prev, makePensionRow()])}
                addLabel="Add Pension Pot"
              >
                {pensions.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setPensions, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Pension Provider Name"
                        value={row.provider}
                        onChange={(e) =>
                          updateRow(setPensions, row.id, {
                            provider: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <ValueWithUnsure
                        id={`val_${row.id}`}
                        value={row.value}
                        unknown={row.valueUnknown}
                        onValueChange={(v) =>
                          updateRow(setPensions, row.id, { value: v })
                        }
                        onUnknownChange={(v) =>
                          updateRow(setPensions, row.id, { valueUnknown: v })
                        }
                        placeholder="Current CETV Valuation (£)"
                      />
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setPensions, row.id, f)}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* BUSINESS INTERESTS */}
            <PartHeader tooltip="Declare entity infrastructure details if you are a director, shareholder, partner, or sole trader.">
              Business Interests
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Are you a director, shareholder, partner, or sole trader in any
                active or dormant business enterprises?
              </label>
              <YesNoToggle
                name="has_businesses"
                value={hasBusinesses}
                onChange={handleBusinessesToggle}
              />
            </div>
            {hasBusinesses === "Yes" && (
              <MatrixBox
                title="Business Interests"
                onAdd={() =>
                  setBusinesses((prev) => [...prev, makeBusinessRow()])
                }
                addLabel="Add Corporate Entity"
              >
                {businesses.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setBusinesses, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr]">
                      <input
                        type="text"
                        placeholder="Registered Business Name"
                        value={row.name}
                        onChange={(e) =>
                          updateRow(setBusinesses, row.id, {
                            name: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <select
                        value={row.entityType}
                        onChange={(e) =>
                          updateRow(setBusinesses, row.id, {
                            entityType: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      >
                        <option value="">Entity Structure</option>
                        <option value="Ltd">Limited Company (Ltd)</option>
                        <option value="LLP">LLP</option>
                        <option value="Sole">Sole Trader</option>
                      </select>
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <input
                        type="number"
                        placeholder="Turnover (£) (Optional)"
                        value={row.turnover}
                        onChange={(e) =>
                          updateRow(setBusinesses, row.id, {
                            turnover: e.target.value,
                          })
                        }
                        className={inputClasses}
                      />
                      <input
                        type="number"
                        placeholder="Net Profit (£) (Optional)"
                        value={row.netProfit}
                        onChange={(e) =>
                          updateRow(setBusinesses, row.id, {
                            netProfit: e.target.value,
                          })
                        }
                        className={inputClasses}
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Your Ownership %"
                        value={row.ownershipPercent}
                        onChange={(e) =>
                          updateRow(setBusinesses, row.id, {
                            ownershipPercent: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <ValueWithUnsure
                        id={`val_${row.id}`}
                        value={row.valueOfStake}
                        unknown={row.valueUnknown}
                        onValueChange={(v) =>
                          updateRow(setBusinesses, row.id, { valueOfStake: v })
                        }
                        onUnknownChange={(v) =>
                          updateRow(setBusinesses, row.id, { valueUnknown: v })
                        }
                        placeholder="Value of Stake (£)"
                      />
                      <input
                        type="text"
                        placeholder={
                          row.valueUnknown
                            ? "Not required (Value unknown)"
                            : "Valuation Justification (e.g. Book Value)"
                        }
                        value={row.valueUnknown ? "" : row.justification}
                        disabled={row.valueUnknown}
                        onChange={(e) =>
                          updateRow(setBusinesses, row.id, {
                            justification: e.target.value,
                          })
                        }
                        required={!row.valueUnknown}
                        className={inputClasses}
                      />
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setBusinesses, row.id, f)}
                      options={[
                        { value: "KeepSeparate", label: "Keep it Separate" },
                        {
                          value: "ShareEqually",
                          label: "Share Equally (50/50)",
                        },
                        { value: "Custom", label: "Custom Arrangement" },
                      ]}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* INTELLECTUAL PROPERTY */}
            <PartHeader tooltip="Declare any valuable intellectual property that you personally own, such as patents, trademarks, copyrights or licensing rights.">
              Intellectual Property
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you personally own any intellectual property or licensing
                rights that have financial value?
              </label>
              <YesNoToggle
                name="has_ip"
                value={hasIP}
                onChange={handleIPToggle}
              />
            </div>
            {hasIP === "Yes" && (
              <MatrixBox
                title="Intellectual Property Register"
                onAdd={() => setIpAssets((prev) => [...prev, makeIPRow()])}
                addLabel="Add Intellectual Property Asset"
              >
                {ipAssets.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setIpAssets, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr]">
                      <input
                        type="text"
                        placeholder="Intellectual Property Name"
                        value={row.name}
                        onChange={(e) =>
                          updateRow(setIpAssets, row.id, {
                            name: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <select
                        value={row.ipType}
                        onChange={(e) =>
                          updateRow(setIpAssets, row.id, {
                            ipType: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      >
                        <option value="">IP Type</option>
                        <option value="Patent">Patent</option>
                        <option value="Website">
                          Website / Online Platform
                        </option>
                        <option value="Trademark">Trademark</option>
                        <option value="Copyright">Copyright</option>
                        <option value="Software">Software / Source Code</option>
                        <option value="Domain">Domain Name</option>
                        <option value="Licence">
                          Licence / Royalty Rights
                        </option>
                        <option value="Design">Registered Design</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <ValueWithUnsure
                        id={`val_${row.id}`}
                        value={row.value}
                        unknown={row.valueUnknown}
                        onValueChange={(v) =>
                          updateRow(setIpAssets, row.id, { value: v })
                        }
                        onUnknownChange={(v) =>
                          updateRow(setIpAssets, row.id, { valueUnknown: v })
                        }
                        placeholder="Estimated Value (£)"
                      />
                      <input
                        type="text"
                        placeholder="Registration / Reference Number (Optional)"
                        value={row.registrationNumber}
                        onChange={(e) =>
                          updateRow(setIpAssets, row.id, {
                            registrationNumber: e.target.value,
                          })
                        }
                        className={inputClasses}
                      />
                    </div>
                    <textarea
                      placeholder="Brief description (optional)"
                      value={row.description}
                      onChange={(e) =>
                        updateRow(setIpAssets, row.id, {
                          description: e.target.value,
                        })
                      }
                      className={textareaClasses + " mb-3.5"}
                    />
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setIpAssets, row.id, f)}
                      label="How should this be treated?"
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* HIGH-VALUE PERSONAL BELONGINGS */}
            <PartHeader tooltip="Personal property items valued individually over £5,000.">
              High-Value Personal Belongings (Chattels)
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you possess any personal belongings valued individually over
                £5,000 (such as vehicles, jewelry, artwork, or cryptocurrency
                assets)?
              </label>
              <YesNoToggle
                name="has_chattels"
                value={hasChattels}
                onChange={handleChattelsToggle}
              />
            </div>
            {hasChattels === "Yes" && (
              <MatrixBox
                title="High-Value Items & Chattels Registry"
                onAdd={() => setChattels((prev) => [...prev, makeChattelRow()])}
                addLabel="Add Asset Entry"
              >
                {chattels.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setChattels, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1.5fr_1fr]">
                      <input
                        type="text"
                        placeholder="Asset Description / Name"
                        value={row.description}
                        onChange={(e) =>
                          updateRow(setChattels, row.id, {
                            description: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <select
                        value={row.category}
                        onChange={(e) =>
                          updateRow(setChattels, row.id, {
                            category: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      >
                        <option value="">Asset Category</option>
                        <option value="Vehicles">
                          Motor Vehicles (Cars, Motorcycles, Boats)
                        </option>
                        <option value="Luxury">
                          Luxury Items (Jewelry, Watches, Designer Goods)
                        </option>
                        <option value="Art">
                          Fine Art, Antiques & Collectibles
                        </option>
                        <option value="Digital">
                          Digital Assets (Cryptocurrency, NFTs)
                        </option>
                        <option value="Other">
                          Other High-Value Physical Property
                        </option>
                      </select>
                      <ValueWithUnsure
                        id={`val_${row.id}`}
                        value={row.value}
                        unknown={row.valueUnknown}
                        onValueChange={(v) =>
                          updateRow(setChattels, row.id, { value: v })
                        }
                        onUnknownChange={(v) =>
                          updateRow(setChattels, row.id, { valueUnknown: v })
                        }
                        placeholder="Value (GBP)"
                      />
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setChattels, row.id, f)}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* OTHER PERSONAL ASSETS */}
            <PartHeader tooltip="Declare any other assets, inheritances, trust interests, or financial rights not covered above.">
              Other Personal Assets
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Have we missed anything? Do you own or expect to receive any
                other assets, financial interests, inheritances, or property
                that have not been listed above?
              </label>
              <YesNoToggle
                name="has_other_assets"
                value={hasOtherAssets}
                onChange={handleOtherAssetsToggle}
              />
            </div>
            {hasOtherAssets === "Yes" && (
              <MatrixBox
                title="Other Assets Registry"
                onAdd={() =>
                  setOtherAssets((prev) => [...prev, makeOtherAssetRow()])
                }
                addLabel="Add Other Asset"
              >
                {otherAssets.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setOtherAssets, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr]">
                      <input
                        type="text"
                        placeholder="Asset Name / Description (e.g. Trust Interest, Offshore Account, Safe Deposit Box)"
                        value={row.description}
                        onChange={(e) =>
                          updateRow(setOtherAssets, row.id, {
                            description: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <ValueWithUnsure
                        id={`val_${row.id}`}
                        value={row.value}
                        unknown={row.valueUnknown}
                        onValueChange={(v) =>
                          updateRow(setOtherAssets, row.id, { value: v })
                        }
                        onUnknownChange={(v) =>
                          updateRow(setOtherAssets, row.id, { valueUnknown: v })
                        }
                        placeholder="Estimated Value (GBP)"
                      />
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setOtherAssets, row.id, f)}
                      label="How should this be treated?"
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-8 rounded-[10px] bg-indigo-600 px-10 py-3.5 font-semibold text-white shadow-[0_4px_12px_rgba(79,70,229,0.2)] transition hover:bg-indigo-700"
              >
                Next: Income & Revenue
              </button>
            </div>
          </form>

          {submitted && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              Individual assets saved successfully.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

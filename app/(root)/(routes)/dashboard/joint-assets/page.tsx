"use client";

import React, { useEffect, useState } from "react";
import {
  TreatmentFields,
  emptyTreatment,
  makeId,
  inputClasses,
  textareaClasses,
  PartHeader,
  YesNoToggle,
  MatrixBox,
  RowItem,
  ValueWithUnsure,
  TreatmentSelect,
  Treatment,
  makeToggleHandler,
  updateRow,
  removeRow,
} from "@/components/Formprimitives";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";

const sharedTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

type YesNo = "Yes" | "No";

/* ---------------------------------------------------------------------- */
/* Living arrangements                                                     */
/* ---------------------------------------------------------------------- */

type LivingArrangement =
  | ""
  | "Separate"
  | "Rent"
  | "OneOwner"
  | "Joint"
  | "ThirdParty"
  | "Other";

const livingArrangementOptions: { value: LivingArrangement; label: string }[] =
  [
    { value: "Separate", label: "We currently live separately" },
    { value: "Rent", label: "We rent a home together" },
    { value: "OneOwner", label: "We live in a home owned by one of us" },
    { value: "Joint", label: "We live in a home we jointly own" },
    { value: "ThirdParty", label: "We live with family or third parties" },
    { value: "Other", label: "Other (please specify)" },
  ];

function LivingArrangementRadio({
  value,
  onChange,
}: {
  value: LivingArrangement;
  onChange: (v: LivingArrangement) => void;
}) {
  return (
    <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {livingArrangementOptions.map((opt) => {
        const checked = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`relative flex cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-3 transition ${checked
              ? "border-indigo-600 bg-slate-50"
              : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
              }`}
          >
            <input
              type="radio"
              name="living_arrangement"
              value={opt.value}
              checked={checked}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span
              className={`relative h-4 w-4 flex-shrink-0 rounded-full border-2 ${checked
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
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-[10px] border border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Row types                                                                */
/* ---------------------------------------------------------------------- */

interface SharedRealEstateRow extends TreatmentFields {
  id: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  propertyType: string;
  value: string;
  valueUnknown: boolean;
  mortgageBalance: string;
  earlyPenalty: string;
  ownershipPercentage: string;
  thirdPartyInterest: string;
  thirdPartyDetail: string;
}
interface SharedSavingsRow extends TreatmentFields {
  id: string;
  accountHolder: string;
  institution: string;
  accountType: string;
  balance: string;
}
interface SharedBusinessRow extends TreatmentFields {
  id: string;
  name: string;
  entityType: string;
  turnover: string;
  netProfit: string;
  ownershipPercent: string;
  valueOfStake: string;
  valueUnknown: boolean;
  justification: string;
  directorLoanBalance: string;
}
interface SharedIPRow extends TreatmentFields {
  id: string;
  name: string;
  ipType: string;
  value: string;
  valueUnknown: boolean;
  registrationNumber: string;
  description: string;
}
interface SharedChattelRow extends TreatmentFields {
  id: string;
  description: string;
  category: string;
  value: string;
  valueUnknown: boolean;
}
interface SharedOtherAssetRow extends TreatmentFields {
  id: string;
  description: string;
  value: string;
  valueUnknown: boolean;
}

function makeSharedRealEstateRow(): SharedRealEstateRow {
  return {
    id: makeId("sre"),
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    propertyType: "",
    value: "",
    valueUnknown: false,
    mortgageBalance: "",
    earlyPenalty: "",
    ownershipPercentage: "",
    thirdPartyInterest: "",
    thirdPartyDetail: "",
    ...emptyTreatment,
  };
}
function makeSharedSavingsRow(): SharedSavingsRow {
  return {
    id: makeId("ssav"),
    accountHolder: "",
    institution: "",
    accountType: "",
    balance: "",
    ...emptyTreatment,
  };
}
function makeSharedBusinessRow(): SharedBusinessRow {
  return {
    id: makeId("sbiz"),
    name: "",
    entityType: "",
    turnover: "",
    netProfit: "",
    ownershipPercent: "",
    valueOfStake: "",
    valueUnknown: false,
    justification: "",
    directorLoanBalance: "",
    ...emptyTreatment,
  };
}
function makeSharedIPRow(): SharedIPRow {
  return {
    id: makeId("sip"),
    name: "",
    ipType: "",
    value: "",
    valueUnknown: false,
    registrationNumber: "",
    description: "",
    ...emptyTreatment,
  };
}
function makeSharedChattelRow(): SharedChattelRow {
  return {
    id: makeId("schat"),
    description: "",
    category: "",
    value: "",
    valueUnknown: false,
    ...emptyTreatment,
  };
}
function makeSharedOtherAssetRow(): SharedOtherAssetRow {
  return {
    id: makeId("sother"),
    description: "",
    value: "",
    valueUnknown: false,
    ...emptyTreatment,
  };
}

/* ---------------------------------------------------------------------- */
/* Main component                                                          */
/* ---------------------------------------------------------------------- */

export default function SharedAssetsForm() {


  const caseId = useSelector((state: RootState) => state.auth.caseId);
  const [livingArrangement, setLivingArrangement] =
    useState<LivingArrangement>("");
  const [rentDuration, setRentDuration] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [thirdPartyDescription, setThirdPartyDescription] = useState("");
  const [otherDescription, setOtherDescription] = useState("");

  const [hasSharedRealEstate, setHasSharedRealEstate] = useState<YesNo>("No");
  const [sharedRealEstate, setSharedRealEstate] = useState<
    SharedRealEstateRow[]
  >([]);

  const [hasSharedSavings, setHasSharedSavings] = useState<YesNo>("No");
  const [sharedSavings, setSharedSavings] = useState<SharedSavingsRow[]>([]);

  const [hasSharedBusinesses, setHasSharedBusinesses] = useState<YesNo>("No");
  const [sharedBusinesses, setSharedBusinesses] = useState<SharedBusinessRow[]>(
    [],
  );

  const [hasSharedIP, setHasSharedIP] = useState<YesNo>("No");
  const [sharedIP, setSharedIP] = useState<SharedIPRow[]>([]);

  const [hasSharedChattels, setHasSharedChattels] = useState<YesNo>("No");
  const [sharedChattels, setSharedChattels] = useState<SharedChattelRow[]>([]);

  const [hasSharedOtherAssets, setHasSharedOtherAssets] = useState<YesNo>("No");
  const [sharedOtherAssets, setSharedOtherAssets] = useState<
    SharedOtherAssetRow[]
  >([]);

  const [submitted, setSubmitted] = useState(false);

  const handleSharedRealEstateToggle = makeToggleHandler(
    setHasSharedRealEstate,
    setSharedRealEstate,
    makeSharedRealEstateRow,
  );
  const handleSharedSavingsToggle = makeToggleHandler(
    setHasSharedSavings,
    setSharedSavings,
    makeSharedSavingsRow,
  );
  const handleSharedBusinessesToggle = makeToggleHandler(
    setHasSharedBusinesses,
    setSharedBusinesses,
    makeSharedBusinessRow,
  );
  const handleSharedIPToggle = makeToggleHandler(
    setHasSharedIP,
    setSharedIP,
    makeSharedIPRow,
  );
  const handleSharedChattelsToggle = makeToggleHandler(
    setHasSharedChattels,
    setSharedChattels,
    makeSharedChattelRow,
  );
  const handleSharedOtherAssetsToggle = makeToggleHandler(
    setHasSharedOtherAssets,
    setSharedOtherAssets,
    makeSharedOtherAssetRow,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("here in submit")
    const payload = {
      livingArrangement,
      rentDuration,
      monthlyRent,
      thirdPartyDescription,
      otherDescription,

      hasSharedRealEstate,
      sharedRealEstate,

      hasSharedSavings,
      sharedSavings,

      hasSharedBusinesses,
      sharedBusinesses,

      hasSharedIP,
      sharedIP,

      hasSharedChattels,
      sharedChattels,

      hasSharedOtherAssets,
      sharedOtherAssets,
    };

    try {
      const { data } = await Axios.post(
        `/cases/${caseId}/questionnaire/joint-assets`,
        payload
      );

      setSubmitted(true);

    } catch (error) {
      console.error("Error saving joint assets:", error);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const {
        data: { data },
      } = await Axios.get(`/cases/${caseId}/section/jointInformation`);

      const assets = data?.jointAssets;
      if (!assets) return;

      setLivingArrangement(assets.livingArrangement ?? "");
      setRentDuration(assets.rentDuration ?? "");
      setMonthlyRent(assets.monthlyRent ?? "");
      setThirdPartyDescription(assets.thirdPartyDescription ?? "");
      setOtherDescription(assets.otherDescription ?? "");

      setHasSharedRealEstate(assets.hasSharedRealEstate ?? "No");
      setSharedRealEstate(
        Array.isArray(assets.sharedRealEstate) ? assets.sharedRealEstate : []
      );

      setHasSharedSavings(assets.hasSharedSavings ?? "No");
      setSharedSavings(
        Array.isArray(assets.sharedSavings) ? assets.sharedSavings : []
      );

      setHasSharedBusinesses(assets.hasSharedBusinesses ?? "No");
      setSharedBusinesses(
        Array.isArray(assets.sharedBusinesses) ? assets.sharedBusinesses : []
      );

      setHasSharedIP(assets.hasSharedIP ?? "No");
      setSharedIP(Array.isArray(assets.sharedIP) ? assets.sharedIP : []);

      setHasSharedChattels(assets.hasSharedChattels ?? "No");
      setSharedChattels(
        Array.isArray(assets.sharedChattels) ? assets.sharedChattels : []
      );

      setHasSharedOtherAssets(assets.hasSharedOtherAssets ?? "No");
      setSharedOtherAssets(
        Array.isArray(assets.sharedOtherAssets) ? assets.sharedOtherAssets : []
      );
    } catch (error) {
      console.error("Error fetching joint assets:", error);
    }
  };

  if (caseId) {
    fetchData();
  }
}, [caseId]);

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-11 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.35rem] font-extrabold tracking-tight text-slate-900">
            Shared Assets
          </h2>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
            Please tell us about any assets, property, or financial interests
            that you and your partner currently own or hold together, and how
            you would like them to be treated under your prenuptial agreement.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* CURRENT LIVING ARRANGEMENTS */}
            <PartHeader tooltip="Tell us about your current living arrangements. This helps us understand your current circumstances. Property ownership and how it should be treated under your agreement will be collected separately.">
              Current Living Arrangements
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Which of the following best describes your current living
                arrangements?
              </label>
              <LivingArrangementRadio
                value={livingArrangement}
                onChange={setLivingArrangement}
              />

              {livingArrangement === "Separate" && (
                <InfoBanner>
                  💡 You currently live separately. Any future property
                  arrangements can be outlined in your shared asset registers
                  below.
                </InfoBanner>
              )}
              {livingArrangement === "Rent" && (
                <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="How long have you lived here together?"
                    value={rentDuration}
                    onChange={(e) => setRentDuration(e.target.value)}
                    required
                    className={inputClasses}
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Monthly Rent (£)"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    required
                    className={inputClasses}
                  />
                </div>
              )}
              {livingArrangement === "OneOwner" && (
                <InfoBanner>
                  💡 You live in a home owned by one of you. Individual asset
                  parameters are configuration details tracked separately inside
                  Section 3.
                </InfoBanner>
              )}
              {livingArrangement === "Joint" && (
                <InfoBanner>
                  💡 You live in a jointly owned home. Please ensure you
                  document this asset details in the register below.
                </InfoBanner>
              )}
              {livingArrangement === "ThirdParty" && (
                <textarea
                  placeholder="Please briefly describe your current third-party living arrangements (e.g., living with parents, employer-provided accommodation)..."
                  value={thirdPartyDescription}
                  onChange={(e) => setThirdPartyDescription(e.target.value)}
                  required
                  className={textareaClasses + " mt-3"}
                />
              )}
              {livingArrangement === "Other" && (
                <textarea
                  placeholder="Please describe your current living arrangements..."
                  value={otherDescription}
                  onChange={(e) => setOtherDescription(e.target.value)}
                  required
                  className={textareaClasses + " mt-3"}
                />
              )}
            </div>

            {/* SHARED PROPERTY & REAL ESTATE */}
            <PartHeader tooltip="Declare any property or real estate that you and your partner jointly own or have a shared financial interest in.">
              Shared Property & Real Estate
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you and your partner jointly own, partly own, or have a
                shared financial interest in any real estate or property?
              </label>
              <YesNoToggle
                name="has_shared_real_estate"
                value={hasSharedRealEstate}
                onChange={handleSharedRealEstateToggle}
              />
            </div>
            {hasSharedRealEstate === "Yes" && (
              <MatrixBox
                title="Shared Property Register"
                onAdd={() =>
                  setSharedRealEstate((prev) => [
                    ...prev,
                    makeSharedRealEstateRow(),
                  ])
                }
                addLabel="Add Shared Property"
              >
                {sharedRealEstate.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setSharedRealEstate, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        value={row.addressLine1}
                        onChange={(e) =>
                          updateRow(setSharedRealEstate, row.id, {
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
                          updateRow(setSharedRealEstate, row.id, {
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
                          updateRow(setSharedRealEstate, row.id, {
                            postcode: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <select
                        value={row.propertyType}
                        onChange={(e) =>
                          updateRow(setSharedRealEstate, row.id, {
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
                          updateRow(setSharedRealEstate, row.id, { value: v })
                        }
                        onUnknownChange={(v) =>
                          updateRow(setSharedRealEstate, row.id, {
                            valueUnknown: v,
                          })
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
                          updateRow(setSharedRealEstate, row.id, {
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
                          updateRow(setSharedRealEstate, row.id, {
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
                        placeholder="Ownership Percentage (%)"
                        value={row.ownershipPercentage}
                        onChange={(e) =>
                          updateRow(setSharedRealEstate, row.id, {
                            ownershipPercentage: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                    </div>
                    <div className="mb-3.5">
                      <select
                        value={row.thirdPartyInterest}
                        onChange={(e) =>
                          updateRow(setSharedRealEstate, row.id, {
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
                    {row.thirdPartyInterest === "Yes" && (
                      <textarea
                        placeholder="Specify who holds the interest (e.g. parent loan) and if a written agreement exists."
                        value={row.thirdPartyDetail}
                        onChange={(e) =>
                          updateRow(setSharedRealEstate, row.id, {
                            thirdPartyDetail: e.target.value,
                          })
                        }
                        className={textareaClasses + " mb-3.5"}
                      />
                    )}
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) =>
                        updateRow(setSharedRealEstate, row.id, f)
                      }
                      label="How should this property be treated?"
                      options={sharedTreatmentOptions}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* SHARED SAVINGS & INVESTMENTS */}
            <PartHeader tooltip="Declare any bank accounts, savings, investments or other financial accounts that you own jointly with your partner.">
              Shared Savings & Investments
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you jointly hold any bank accounts, savings, investments or
                other financial accounts together?
              </label>
              <YesNoToggle
                name="has_shared_savings"
                value={hasSharedSavings}
                onChange={handleSharedSavingsToggle}
              />
            </div>
            {hasSharedSavings === "Yes" && (
              <MatrixBox
                title="Shared Savings & Investments"
                onAdd={() =>
                  setSharedSavings((prev) => [...prev, makeSharedSavingsRow()])
                }
                addLabel="Add Savings / Investments"
              >
                {sharedSavings.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setSharedSavings, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1fr_1.5fr]">
                      <select
                        value={row.accountHolder}
                        onChange={(e) =>
                          updateRow(setSharedSavings, row.id, {
                            accountHolder: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      >
                        <option value="">Account Holder</option>
                        <option value="Partner1">Partner 1</option>
                        <option value="Partner2">Partner 2</option>
                        <option value="Joint">Joint</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Institution / Bank Name"
                        value={row.institution}
                        onChange={(e) =>
                          updateRow(setSharedSavings, row.id, {
                            institution: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr]">
                      <select
                        value={row.accountType}
                        onChange={(e) =>
                          updateRow(setSharedSavings, row.id, {
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
                          updateRow(setSharedSavings, row.id, {
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
                      onChange={(f) => updateRow(setSharedSavings, row.id, f)}
                      options={sharedTreatmentOptions}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* SHARED BUSINESS INTERESTS */}
            <PartHeader tooltip="Declare any businesses, companies or partnerships that you and your partner jointly own or operate.">
              Shared Business Interests
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you jointly own or operate a business together?
              </label>
              <YesNoToggle
                name="has_shared_businesses"
                value={hasSharedBusinesses}
                onChange={handleSharedBusinessesToggle}
              />
            </div>
            {hasSharedBusinesses === "Yes" && (
              <MatrixBox
                title="Shared Business Interests"
                onAdd={() =>
                  setSharedBusinesses((prev) => [
                    ...prev,
                    makeSharedBusinessRow(),
                  ])
                }
                addLabel="Add Business"
              >
                {sharedBusinesses.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setSharedBusinesses, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr]">
                      <input
                        type="text"
                        placeholder="Registered Business Name"
                        value={row.name}
                        onChange={(e) =>
                          updateRow(setSharedBusinesses, row.id, {
                            name: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <select
                        value={row.entityType}
                        onChange={(e) =>
                          updateRow(setSharedBusinesses, row.id, {
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
                        <option value="Partnership">Partnership</option>
                      </select>
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <input
                        type="number"
                        placeholder="Last Year Turnover (£)"
                        value={row.turnover}
                        onChange={(e) =>
                          updateRow(setSharedBusinesses, row.id, {
                            turnover: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <input
                        type="number"
                        placeholder="Last Year Net Profit (£)"
                        value={row.netProfit}
                        onChange={(e) =>
                          updateRow(setSharedBusinesses, row.id, {
                            netProfit: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Your Ownership %"
                        value={row.ownershipPercent}
                        onChange={(e) =>
                          updateRow(setSharedBusinesses, row.id, {
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
                          updateRow(setSharedBusinesses, row.id, {
                            valueOfStake: v,
                          })
                        }
                        onUnknownChange={(v) =>
                          updateRow(setSharedBusinesses, row.id, {
                            valueUnknown: v,
                          })
                        }
                        placeholder="Value of Joint Stake (£)"
                      />
                      <input
                        type="text"
                        placeholder={
                          row.valueUnknown
                            ? "Not required (Value unknown)"
                            : "Valuation Justification"
                        }
                        value={row.valueUnknown ? "" : row.justification}
                        disabled={row.valueUnknown}
                        onChange={(e) =>
                          updateRow(setSharedBusinesses, row.id, {
                            justification: e.target.value,
                          })
                        }
                        required={!row.valueUnknown}
                        className={inputClasses}
                      />
                    </div>
                    <div className="mb-3.5">
                      <input
                        type="number"
                        placeholder="Director Loan A/C Balance (£)"
                        value={row.directorLoanBalance}
                        onChange={(e) =>
                          updateRow(setSharedBusinesses, row.id, {
                            directorLoanBalance: e.target.value,
                          })
                        }
                        className={inputClasses}
                      />
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) =>
                        updateRow(setSharedBusinesses, row.id, f)
                      }
                      options={sharedTreatmentOptions}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* SHARED INTELLECTUAL PROPERTY */}
            <PartHeader tooltip="Declare any intellectual property that you and your partner jointly own, such as patents, trademarks, copyrights, software, websites or licensing rights.">
              Shared Intellectual Property
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you jointly own any intellectual property or licensing rights
                with your partner?
              </label>
              <YesNoToggle
                name="has_shared_ip"
                value={hasSharedIP}
                onChange={handleSharedIPToggle}
              />
            </div>
            {hasSharedIP === "Yes" && (
              <MatrixBox
                title="Shared Intellectual Property Register"
                onAdd={() =>
                  setSharedIP((prev) => [...prev, makeSharedIPRow()])
                }
                addLabel="Add Intellectual Property Asset"
              >
                {sharedIP.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setSharedIP, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr]">
                      <input
                        type="text"
                        placeholder="Intellectual Property Name"
                        value={row.name}
                        onChange={(e) =>
                          updateRow(setSharedIP, row.id, {
                            name: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <select
                        value={row.ipType}
                        onChange={(e) =>
                          updateRow(setSharedIP, row.id, {
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
                          updateRow(setSharedIP, row.id, { value: v })
                        }
                        onUnknownChange={(v) =>
                          updateRow(setSharedIP, row.id, { valueUnknown: v })
                        }
                        placeholder="Estimated Valuation (£)"
                      />
                      <input
                        type="text"
                        placeholder="Registration Number (Optional)"
                        value={row.registrationNumber}
                        onChange={(e) =>
                          updateRow(setSharedIP, row.id, {
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
                        updateRow(setSharedIP, row.id, {
                          description: e.target.value,
                        })
                      }
                      className={textareaClasses + " mb-3.5"}
                    />
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setSharedIP, row.id, f)}
                      options={sharedTreatmentOptions}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* SHARED HIGH-VALUE BELONGINGS */}
            <PartHeader tooltip="Personal property items valued individually over £5,000.">
              Shared High-Value Personal Belongings
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do you jointly own any high-value personal belongings valued at
                more than £5,000, such as vehicles, jewellery, artwork or
                cryptocurrency?
              </label>
              <YesNoToggle
                name="has_shared_chattels"
                value={hasSharedChattels}
                onChange={handleSharedChattelsToggle}
              />
            </div>
            {hasSharedChattels === "Yes" && (
              <MatrixBox
                title="Shared High-Value Belongings / Chattels"
                onAdd={() =>
                  setSharedChattels((prev) => [...prev, makeSharedChattelRow()])
                }
                addLabel="Add Asset Entry"
              >
                {sharedChattels.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setSharedChattels, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1.5fr_1fr]">
                      <input
                        type="text"
                        placeholder="Asset Description / Name"
                        value={row.description}
                        onChange={(e) =>
                          updateRow(setSharedChattels, row.id, {
                            description: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      />
                      <select
                        value={row.category}
                        onChange={(e) =>
                          updateRow(setSharedChattels, row.id, {
                            category: e.target.value,
                          })
                        }
                        required
                        className={inputClasses}
                      >
                        <option value="">Asset Category</option>
                        <option value="Vehicles">Motor Vehicles</option>
                        <option value="Luxury">Luxury Items</option>
                        <option value="Art">Fine Art & Collectibles</option>
                        <option value="Digital">Digital Assets</option>
                        <option value="Other">Other Physical Property</option>
                      </select>
                      <ValueWithUnsure
                        id={`val_${row.id}`}
                        value={row.value}
                        unknown={row.valueUnknown}
                        onValueChange={(v) =>
                          updateRow(setSharedChattels, row.id, { value: v })
                        }
                        onUnknownChange={(v) =>
                          updateRow(setSharedChattels, row.id, {
                            valueUnknown: v,
                          })
                        }
                        placeholder="Value (GBP)"
                      />
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) => updateRow(setSharedChattels, row.id, f)}
                      options={sharedTreatmentOptions}
                    />
                  </RowItem>
                ))}
              </MatrixBox>
            )}

            {/* OTHER SHARED ASSETS */}
            <PartHeader tooltip="Declare any other joint assets, inheritances, trust interests, or shared financial rights not covered above.">
              Other Shared Assets
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Have we missed anything? Do you and your partner jointly own or
                expect to receive any other joint assets, financial interests,
                or shared property that have not been listed above?
              </label>
              <YesNoToggle
                name="has_shared_other_assets"
                value={hasSharedOtherAssets}
                onChange={handleSharedOtherAssetsToggle}
              />
            </div>
            {hasSharedOtherAssets === "Yes" && (
              <MatrixBox
                title="Other Shared Assets Registry"
                onAdd={() =>
                  setSharedOtherAssets((prev) => [
                    ...prev,
                    makeSharedOtherAssetRow(),
                  ])
                }
                addLabel="Add Other Shared Asset"
              >
                {sharedOtherAssets.map((row) => (
                  <RowItem
                    key={row.id}
                    onDelete={() => removeRow(setSharedOtherAssets, row.id)}
                  >
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr]">
                      <input
                        type="text"
                        placeholder="Shared Asset Description (e.g. Joint Art Collection, Joint Foreign Asset)"
                        value={row.description}
                        onChange={(e) =>
                          updateRow(setSharedOtherAssets, row.id, {
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
                          updateRow(setSharedOtherAssets, row.id, { value: v })
                        }
                        onUnknownChange={(v) =>
                          updateRow(setSharedOtherAssets, row.id, {
                            valueUnknown: v,
                          })
                        }
                        placeholder="Estimated Value (GBP)"
                      />
                    </div>
                    <TreatmentSelect
                      id={row.id}
                      fields={row}
                      onChange={(f) =>
                        updateRow(setSharedOtherAssets, row.id, f)
                      }
                      label="How should this shared asset be treated?"
                      options={sharedTreatmentOptions}
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
                Save and Continue
              </button>
            </div>
          </form>

          {submitted && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              Shared assets saved successfully.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

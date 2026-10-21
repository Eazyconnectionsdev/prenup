"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Boxes,
  Briefcase,
  Building2,
  ChartColumnIncreasing,
  FileText,
  Gem,
  Home,
  Landmark,
  Users,
  MoreHorizontal,
} from "lucide-react";
import {
  FieldLabel,
  emptyTreatment,
  makeId,
  inputClasses,
  textareaClasses,
  FormShell,
  SectionCard,
  SubmitBar,
  YesNoToggle,
  MatrixBox,
  RowItem,
  ValueWithUnsure,
  TreatmentSelect,
  makeToggleHandler,
  updateRow,
  removeRow,
} from "@/components/questionnaire/QuestionnaireUI";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/store/store";
import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "@/lib/api/http-error";
import { getCasesDetails } from "@/store/asyncThunk/casesThunk";
import { useJointSectionStatus } from "@/hooks/useJointSectionStatus";
import { JointStatusBanner } from "@/components/joint/JointStatusBanner";
import type { Treatment, TreatmentFields } from "@/types/forms/form-primitives";
import type { LivingArrangement, SharedBusinessRow, SharedChattelRow, SharedIPRow, SharedOtherAssetRow, SharedRealEstateRow, SharedSavingsRow, YesNo } from "@/types/dashboard/joint-assets";

const sharedTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];


const livingArrangementOptions: { value: LivingArrangement; label: string; icon: any }[] =
  [
    { value: "Separate", label: "We currently live separately", icon: Home },
    { value: "Rent", label: "We rent a home together", icon: Home },
    { value: "OneOwner", label: "We live in a home owned by one of us", icon: Home },
    { value: "Joint", label: "We live in a home we jointly own", icon: Home },
    { value: "ThirdParty", label: "We live with family or third parties", icon: Users },
    { value: "Other", label: "Other (please specify)", icon: MoreHorizontal },
  ];

function LivingArrangementRadio({
  value,
  onChange,
}: {
  value: LivingArrangement;
  onChange: (v: LivingArrangement) => void;
}) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {livingArrangementOptions.map((opt) => {
        const checked = value === opt.value;
        const Icon = opt.icon;
        return (
          <label
            key={opt.value}
            className={`group relative flex cursor-pointer items-center gap-3.5 rounded-xl border p-4 transition-all duration-200 ${
              checked
                ? "border-[#6366F1] bg-[#6366F1]/5 ring-2 ring-[#6366F1]/20 shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
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
              className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                checked
                  ? "border-[#6366F1] bg-[#6366F1]"
                  : "border-slate-300 bg-white group-hover:border-slate-400"
              }`}
            >
              {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            {Icon && (
              <Icon
                className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                  checked ? "text-[#6366F1]" : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
            )}
            <span
              className={`text-[13.5px] transition-colors ${
                checked ? "font-bold text-[#4338CA]" : "font-semibold text-slate-900 group-hover:text-black"
              }`}
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
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const caseId = useSelector((state: RootState) => state.auth.caseId);
  // Read-only unless it's this user's turn to edit the joint section
  const { canEdit } = useJointSectionStatus();
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
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      setIsSaving(true);
      await Axios.post(`/cases/${caseId}/questionnaire/joint-assets`, payload);
      setSubmitted(true);
      toast.success("Joint assets saved.");
      // Refresh so the sidebar tick turns green
      if (caseId) dispatch(getCasesDetails(caseId));
      router.push("/dashboard/joint-income-revenue");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't save joint assets."));
    } finally {
      setIsSaving(false);
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
    <FormShell
      title="Shared Assets"
      stepLabel="Step 1 of 4"
      icon={<Home className="h-5 w-5" />}
      description="Please tell us about any assets, property, or financial interests that you and your partner currently own or hold together, and how you would like them to be treated under your prenuptial agreement."
    >
          <JointStatusBanner />

          <form onSubmit={handleSubmit} noValidate>
            <fieldset disabled={!canEdit} className="m-0 min-w-0 border-0 p-0 space-y-6">
            {/* CURRENT LIVING ARRANGEMENTS */}
            <SectionCard
              title="Current Living Arrangements"
              icon={<Home className="h-5 w-5" />}
              colorIndex={0}
              tooltip="This section helps us understand your current circumstances. Property ownership details are collected separately below."
            >
            <div className="mb-4">
              <FieldLabel>
                Which of the following best describes your current living
                arrangements?
              </FieldLabel>
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
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[13px] font-bold text-slate-900">
                      How long have you lived here together?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 years"
                      value={rentDuration}
                      onChange={(e) => setRentDuration(e.target.value)}
                      required
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-bold text-slate-900">
                      Monthly Rent (£)
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 1,200"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      required
                      className={inputClasses}
                    />
                  </div>
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

            </SectionCard>
            {/* SHARED PROPERTY & REAL ESTATE */}
            <SectionCard
              title="Shared Property & Real Estate"
              icon={<Building2 className="h-5 w-5" />}
              colorIndex={1}
              tooltip="Include any property you jointly own or where both parties have a financial interest, regardless of whose name appears on the title deeds."
            >
            <div className="mb-4">
              <FieldLabel>
                Do you and your partner jointly own, partly own, or have a
                shared financial interest in any real estate or property?
              </FieldLabel>
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

            </SectionCard>
            {/* SHARED SAVINGS & INVESTMENTS */}
            <SectionCard
              title="Shared Savings & Investments"
              icon={<ChartColumnIncreasing className="h-5 w-5" />}
              colorIndex={2}
              tooltip="Include all jointly held bank accounts, ISAs, investment portfolios, and other shared financial accounts."
            >
            <div className="mb-4">
              <FieldLabel>
                Do you jointly hold any bank accounts, savings, investments or
                other financial accounts together?
              </FieldLabel>
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

            </SectionCard>
            {/* SHARED BUSINESS INTERESTS */}
            <SectionCard
              title="Shared Business Interests"
              icon={<Briefcase className="h-5 w-5" />}
              colorIndex={3}
              tooltip="Include any businesses, partnerships, or companies in which both parties have an ownership interest."
            >
            <div className="mb-4">
              <FieldLabel>
                Do you jointly own or operate a business together?
              </FieldLabel>
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

            </SectionCard>
            {/* SHARED INTELLECTUAL PROPERTY */}
            <SectionCard
              title="Shared Intellectual Property"
              icon={<FileText className="h-5 w-5" />}
              colorIndex={4}
              tooltip="Intellectual property includes patents, trademarks, copyrights, software, websites, domain names, and royalty or licensing rights."
            >
            <div className="mb-4">
              <FieldLabel>
                Do you jointly own any intellectual property or licensing rights
                with your partner?
              </FieldLabel>
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

            </SectionCard>
            {/* SHARED HIGH-VALUE BELONGINGS */}
            <SectionCard
              title="Shared High-Value Personal Belongings"
              icon={<Gem className="h-5 w-5" />}
              colorIndex={5}
              tooltip="Include jointly owned items with an estimated value exceeding £5,000, including vehicles, artwork, jewellery, and digital assets."
            >
            <div className="mb-4">
              <FieldLabel>
                Do you jointly own any high-value personal belongings valued at
                more than £5,000, such as vehicles, jewellery, artwork or
                cryptocurrency?
              </FieldLabel>
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

            </SectionCard>
            {/* OTHER SHARED ASSETS */}
            <SectionCard
              title="Other Shared Assets"
              icon={<Boxes className="h-5 w-5" />}
              colorIndex={6}
              tooltip="Include any shared assets not listed elsewhere, including trust interests, foreign assets, inheritances, or future financial entitlements."
            >
            <div className="mb-4">
              <FieldLabel>
                Have we missed anything? Do you and your partner jointly own or
                expect to receive any other joint assets, financial interests,
                or shared property that have not been listed above?
              </FieldLabel>
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

            </SectionCard>
            </fieldset>

            {canEdit ? (
              <SubmitBar
                isSaving={isSaving}
                label="Save & continue"
                withArrow
                backHref="/dashboard/liabilities_debts"
              />
            ) : (
              <div className="mt-8 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/80">
                <Link
                  href="/dashboard"
                  className="text-[13.5px] font-semibold text-[#5B4DF5] transition hover:text-[#4338CA] text-left cursor-pointer"
                >
                  Save and exit
                </Link>

                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard/liabilities_debts"
                    className="inline-flex h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 text-[13.5px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                  <Link
                    href="/dashboard/joint-income-revenue"
                    className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-[#5B4DF5] hover:from-indigo-700 hover:to-[#4E3EEA] px-7 text-[13.5px] font-semibold text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#5B4DF5]/30 cursor-pointer"
                  >
                    Next: Shared Income &amp; Revenue →
                  </Link>
                </div>
              </div>
            )}
          </form>

          {submitted && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              Shared assets saved successfully.
            </div>
          )}
    </FormShell>
  );
}

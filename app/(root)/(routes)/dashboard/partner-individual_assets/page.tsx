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

/* ---------------------------------------------------------------------- */
/* Shared styling helpers                                                  */
/* ---------------------------------------------------------------------- */

const inputClasses =
  "w-full rounded-[10px] border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[0.925rem] text-slate-900 disabled:cursor-not-allowed disabled:opacity-70";

const textareaClasses = inputClasses + " min-h-[70px] resize-none";

/* ---------------------------------------------------------------------- */
/* Reusable read-only field components                                     */
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

function PartHeader({ children, tooltip }: { children: ReactNode; tooltip?: string }) {
  return (
    <div className="mb-4 mt-8 flex items-center gap-2 text-[1.15rem] font-bold text-slate-800">
      {children}
      {tooltip && <Tooltip text={tooltip} />}
    </div>
  );
}

function YesNoToggleView({ value }: { value: YesNo }) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-3">
      {(["Yes", "No"] as YesNo[]).map((opt) => {
        const checked = value === opt;
        return (
          <div
            key={opt}
            className={`relative flex items-center gap-3 rounded-[10px] border px-4 py-3 ${
              checked ? "border-indigo-600 bg-slate-50" : "border-slate-300 bg-slate-50"
            }`}
          >
            <span
              className={`relative h-4 w-4 flex-shrink-0 rounded-full border-2 ${
                checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
              }`}
            >
              {checked && (
                <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              )}
            </span>
            <span className={`text-[0.9rem] font-semibold ${checked ? "text-indigo-600" : "text-slate-900"}`}>
              {opt}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MatrixBoxView({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-300 bg-slate-50 p-6">
      <div className="mb-4 text-[0.85rem] font-bold uppercase tracking-wide text-slate-500">{title}</div>
      {children}
    </div>
  );
}

function RowItemView({ children }: { children: ReactNode }) {
  return (
    <div className="relative mb-5 rounded-[10px] border border-slate-300 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      {children}
    </div>
  );
}

function ValueWithUnsureView({
  id,
  value,
  unknown,
  placeholder,
}: {
  id: string;
  value: string;
  unknown: boolean;
  placeholder: string;
}) {
  return (
    <div>
      <input
        type="number"
        id={id}
        value={unknown ? "" : value}
        disabled
        placeholder={unknown ? "Value unknown" : placeholder}
        className={inputClasses}
      />
      <div className="mt-1.5 flex items-center gap-1.5 text-[0.8rem] font-normal text-slate-500">
        <input type="checkbox" checked={unknown} disabled className="h-3.5 w-3.5 disabled:cursor-not-allowed" />
        I am unsure of the current value.
      </div>
    </div>
  );
}

function TreatmentSelectView({
  id,
  fields,
  label = "How should this be shared?",
  options,
}: {
  id: string;
  fields: TreatmentFields;
  label?: string;
  options: { value: Treatment; label: string }[];
}) {
  return (
    <div className="mt-3">
      <select id={`treatment_${id}`} value={fields.treatment} disabled className={inputClasses}>
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
          <input type="text" value={fields.contributionText} disabled className={inputClasses} />
        </div>
      )}
      {fields.treatment === "Percentage" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Specify percentage (e.g., 60/40):
          </label>
          <input type="number" value={fields.percentageValue} disabled className={inputClasses} />
        </div>
      )}
      {fields.treatment === "Custom" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Custom Arrangement Details:
          </label>
          <textarea value={fields.customText} disabled className={textareaClasses} />
        </div>
      )}
    </div>
  );
}

const allTreatmentOptions: { value: Treatment; label: string }[] = [
  { value: "KeepSeparate", label: "Keep it Separate" },
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Contribution", label: "Split by Contribution" },
  { value: "Percentage", label: "Share by Percentage" },
  { value: "Custom", label: "Custom Arrangement" },
];

export default function PartnerIndividualAssetsView() {
  const user = useSelector((state: RootState) => state.auth.user);
  const caseId = useSelector((state: RootState) => state.auth.caseId);

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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { data },
        } = await Axios.get(
          `/cases/${caseId}/section/${user.endUserType === "user1" ? "partnerInformation" : "myInformation"}`,
        );

        const assets = data?.individualAssets;
        if (!assets) return;

        setHasRealEstate(assets.hasRealEstate ?? "No");
        setRealEstate(Array.isArray(assets.realEstate) ? assets.realEstate : []);

        setHasSavings(assets.hasSavings ?? "No");
        setSavings(Array.isArray(assets.savings) ? assets.savings : []);

        setHasPensions(assets.hasPensions ?? "No");
        setPensions(Array.isArray(assets.pensions) ? assets.pensions : []);

        setHasBusinesses(assets.hasBusinesses ?? "No");
        setBusinesses(Array.isArray(assets.businesses) ? assets.businesses : []);

        setHasIP(assets.hasIP ?? "No");
        setIpAssets(Array.isArray(assets.ipAssets) ? assets.ipAssets : []);

        setHasChattels(assets.hasChattels ?? "No");
        setChattels(Array.isArray(assets.chattels) ? assets.chattels : []);

        setHasOtherAssets(assets.hasOtherAssets ?? "No");
        setOtherAssets(Array.isArray(assets.otherAssets) ? assets.otherAssets : []);
      } catch (error) {
        console.error("Error fetching individual assets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (caseId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [caseId, user?.endUserType]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-500">Loading your information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-11 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)]">
          <h2 className="mb-2 text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            Partner's Individual Assets
          </h2>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-slate-500">
            This is a read-only view of the individual assets your partner has declared.
          </p>

          <div>
            {/* PROPERTY & REAL ESTATE */}
            <PartHeader tooltip="Details of properties owned personally or with third parties that are kept separate.">
              Property & Real Estate
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do they own, partly own, or have a financial interest in any real estate / properties?
              </label>
              <YesNoToggleView value={hasRealEstate} />
            </div>
            {hasRealEstate === "Yes" && (
              <MatrixBoxView title="Real Estate Registry Asset Rows">
                {realEstate.map((row) => (
                  <RowItemView key={row.id}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <input type="text" placeholder="Address Line 1" value={row.addressLine1} disabled className={inputClasses} />
                      <input type="text" placeholder="Address Line 2 (Optional)" value={row.addressLine2} disabled className={inputClasses} />
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <input type="text" placeholder="Postcode" value={row.postcode} disabled className={inputClasses} />
                      <select value={row.propertyType} disabled className={inputClasses}>
                        <option value="">Property Type</option>
                        <option value="House">House</option>
                        <option value="Flat">Flat</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                      <ValueWithUnsureView id={`val_${row.id}`} value={row.value} unknown={row.valueUnknown} placeholder="Value (GBP)" />
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <input type="number" placeholder="Mortgage Balance" value={row.mortgageBalance} disabled className={inputClasses} />
                      <input type="number" placeholder="Early Penalty Charges (£)" value={row.earlyPenalty} disabled className={inputClasses} />
                      <input type="number" placeholder="Ownership Share %" value={row.ownershipShare} disabled className={inputClasses} />
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <select value={row.ownershipMode} disabled className={inputClasses}>
                        <option value="">Ownership Mode</option>
                        <option value="Solely">Solely Owned</option>
                        <option value="Jointly">Jointly Owned (with family, business partners, etc.)</option>
                      </select>
                      <select value={row.thirdPartyInterest} disabled className={inputClasses}>
                        <option value="">Third-Party Interest?</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    {row.ownershipMode === "Jointly" && (
                      <textarea
                        placeholder="Co-owner names, shares, and relationship."
                        value={row.coOwnerDetails}
                        disabled
                        className={textareaClasses + " mb-3.5"}
                      />
                    )}
                    {row.thirdPartyInterest === "Yes" && (
                      <textarea
                        placeholder="Who holds the interest and if a written agreement exists."
                        value={row.thirdPartyDetail}
                        disabled
                        className={textareaClasses + " mb-3.5"}
                      />
                    )}
                    <TreatmentSelectView id={row.id} fields={row} options={allTreatmentOptions} />
                  </RowItemView>
                ))}
              </MatrixBoxView>
            )}

            {/* SAVINGS & INVESTMENTS */}
            <PartHeader tooltip="Personal bank accounts, cash savings, premium bonds, or investment portfolios.">
              Savings & Investments
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do they currently hold any personal bank accounts, cash savings, premium bonds, or investment portfolios?
              </label>
              <YesNoToggleView value={hasSavings} />
            </div>
            {hasSavings === "Yes" && (
              <MatrixBoxView title="Savings & Cash Resource Pools">
                {savings.map((row) => (
                  <RowItemView key={row.id}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <input type="text" placeholder="Institution / Bank Name" value={row.institution} disabled className={inputClasses} />
                      <select value={row.accountType} disabled className={inputClasses}>
                        <option value="">Account Type</option>
                        <option value="Current">Current Account</option>
                        <option value="Savings">Savings Account</option>
                        <option value="ISA">ISA</option>
                        <option value="Investment">Investment Portfolio</option>
                        <option value="Other">Other</option>
                      </select>
                      <input type="number" placeholder="Valuation Balance (GBP)" value={row.balance} disabled className={inputClasses} />
                    </div>
                    <TreatmentSelectView id={row.id} fields={row} options={allTreatmentOptions} />
                  </RowItemView>
                ))}
              </MatrixBoxView>
            )}

            {/* PENSIONS & RETIREMENT FUNDS */}
            <PartHeader tooltip="Private, corporate, or state pension pots or retirement annuities.">
              Pensions & Retirement Funds
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do they hold any private, corporate, or state pension pots or retirement annuities?
              </label>
              <YesNoToggleView value={hasPensions} />
            </div>
            {hasPensions === "Yes" && (
              <MatrixBoxView title="Pension Scheme Registry">
                {pensions.map((row) => (
                  <RowItemView key={row.id}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <input type="text" placeholder="Pension Provider Name" value={row.provider} disabled className={inputClasses} />
                      <ValueWithUnsureView id={`val_${row.id}`} value={row.value} unknown={row.valueUnknown} placeholder="Current CETV Valuation (£)" />
                    </div>
                    <TreatmentSelectView id={row.id} fields={row} options={allTreatmentOptions} />
                  </RowItemView>
                ))}
              </MatrixBoxView>
            )}

            {/* BUSINESS INTERESTS */}
            <PartHeader tooltip="Entity infrastructure details for directors, shareholders, partners, or sole traders.">
              Business Interests
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Are they a director, shareholder, partner, or sole trader in any active or dormant business enterprises?
              </label>
              <YesNoToggleView value={hasBusinesses} />
            </div>
            {hasBusinesses === "Yes" && (
              <MatrixBoxView title="Business Interests">
                {businesses.map((row) => (
                  <RowItemView key={row.id}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr]">
                      <input type="text" placeholder="Registered Business Name" value={row.name} disabled className={inputClasses} />
                      <select value={row.entityType} disabled className={inputClasses}>
                        <option value="">Entity Structure</option>
                        <option value="Ltd">Limited Company (Ltd)</option>
                        <option value="LLP">LLP</option>
                        <option value="Sole">Sole Trader</option>
                      </select>
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <input type="number" placeholder="Turnover (£) (Optional)" value={row.turnover} disabled className={inputClasses} />
                      <input type="number" placeholder="Net Profit (£) (Optional)" value={row.netProfit} disabled className={inputClasses} />
                      <input type="number" placeholder="Ownership %" value={row.ownershipPercent} disabled className={inputClasses} />
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <ValueWithUnsureView id={`val_${row.id}`} value={row.valueOfStake} unknown={row.valueUnknown} placeholder="Value of Stake (£)" />
                      <input
                        type="text"
                        placeholder={row.valueUnknown ? "Not required (Value unknown)" : "Valuation Justification (e.g. Book Value)"}
                        value={row.valueUnknown ? "" : row.justification}
                        disabled
                        className={inputClasses}
                      />
                    </div>
                    <TreatmentSelectView
                      id={row.id}
                      fields={row}
                      options={[
                        { value: "KeepSeparate", label: "Keep it Separate" },
                        { value: "ShareEqually", label: "Share Equally (50/50)" },
                        { value: "Custom", label: "Custom Arrangement" },
                      ]}
                    />
                  </RowItemView>
                ))}
              </MatrixBoxView>
            )}

            {/* INTELLECTUAL PROPERTY */}
            <PartHeader tooltip="Valuable intellectual property such as patents, trademarks, copyrights or licensing rights.">
              Intellectual Property
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do they personally own any intellectual property or licensing rights that have financial value?
              </label>
              <YesNoToggleView value={hasIP} />
            </div>
            {hasIP === "Yes" && (
              <MatrixBoxView title="Intellectual Property Register">
                {ipAssets.map((row) => (
                  <RowItemView key={row.id}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr]">
                      <input type="text" placeholder="Intellectual Property Name" value={row.name} disabled className={inputClasses} />
                      <select value={row.ipType} disabled className={inputClasses}>
                        <option value="">IP Type</option>
                        <option value="Patent">Patent</option>
                        <option value="Website">Website / Online Platform</option>
                        <option value="Trademark">Trademark</option>
                        <option value="Copyright">Copyright</option>
                        <option value="Software">Software / Source Code</option>
                        <option value="Domain">Domain Name</option>
                        <option value="Licence">Licence / Royalty Rights</option>
                        <option value="Design">Registered Design</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <ValueWithUnsureView id={`val_${row.id}`} value={row.value} unknown={row.valueUnknown} placeholder="Estimated Value (£)" />
                      <input type="text" placeholder="Registration / Reference Number (Optional)" value={row.registrationNumber} disabled className={inputClasses} />
                    </div>
                    <textarea placeholder="Brief description (optional)" value={row.description} disabled className={textareaClasses + " mb-3.5"} />
                    <TreatmentSelectView id={row.id} fields={row} label="How should this be treated?" options={allTreatmentOptions} />
                  </RowItemView>
                ))}
              </MatrixBoxView>
            )}

            {/* HIGH-VALUE PERSONAL BELONGINGS */}
            <PartHeader tooltip="Personal property items valued individually over £5,000.">
              High-Value Personal Belongings (Chattels)
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do they possess any personal belongings valued individually over £5,000 (such as vehicles, jewelry, artwork, or cryptocurrency assets)?
              </label>
              <YesNoToggleView value={hasChattels} />
            </div>
            {hasChattels === "Yes" && (
              <MatrixBoxView title="High-Value Items & Chattels Registry">
                {chattels.map((row) => (
                  <RowItemView key={row.id}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1.5fr_1fr]">
                      <input type="text" placeholder="Asset Description / Name" value={row.description} disabled className={inputClasses} />
                      <select value={row.category} disabled className={inputClasses}>
                        <option value="">Asset Category</option>
                        <option value="Vehicles">Motor Vehicles (Cars, Motorcycles, Boats)</option>
                        <option value="Luxury">Luxury Items (Jewelry, Watches, Designer Goods)</option>
                        <option value="Art">Fine Art, Antiques & Collectibles</option>
                        <option value="Digital">Digital Assets (Cryptocurrency, NFTs)</option>
                        <option value="Other">Other High-Value Physical Property</option>
                      </select>
                      <ValueWithUnsureView id={`val_${row.id}`} value={row.value} unknown={row.valueUnknown} placeholder="Value (GBP)" />
                    </div>
                    <TreatmentSelectView id={row.id} fields={row} options={allTreatmentOptions} />
                  </RowItemView>
                ))}
              </MatrixBoxView>
            )}

            {/* OTHER PERSONAL ASSETS */}
            <PartHeader tooltip="Any other assets, inheritances, trust interests, or financial rights.">
              Other Personal Assets
            </PartHeader>
            <div className="mb-4">
              <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
                Do they own or expect to receive any other assets, financial interests, inheritances, or property not listed above?
              </label>
              <YesNoToggleView value={hasOtherAssets} />
            </div>
            {hasOtherAssets === "Yes" && (
              <MatrixBoxView title="Other Assets Registry">
                {otherAssets.map((row) => (
                  <RowItemView key={row.id}>
                    <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr]">
                      <input
                        type="text"
                        placeholder="Asset Name / Description (e.g. Trust Interest, Offshore Account, Safe Deposit Box)"
                        value={row.description}
                        disabled
                        className={inputClasses}
                      />
                      <ValueWithUnsureView id={`val_${row.id}`} value={row.value} unknown={row.valueUnknown} placeholder="Estimated Value (GBP)" />
                    </div>
                    <TreatmentSelectView id={row.id} fields={row} label="How should this be treated?" options={allTreatmentOptions} />
                  </RowItemView>
                ))}
              </MatrixBoxView>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
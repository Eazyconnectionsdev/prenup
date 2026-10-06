"use client";

import React, { ReactNode } from "react";
import {
  FieldLabel,
  MatrixBox,
  PartHeader,
  RowItem,
  TreatmentSelect,
  ValueWithUnsure,
  YesNoToggle,
  emptyTreatment,
  inputClasses,
  makeId,
  textareaClasses,
} from "../QuestionnaireUI";
import type { Treatment, TreatmentFields, YesNo } from "@/types/forms/form-primitives";
import type { AssetsData, FlagKey, ListKey, Option, Props, RowOf } from "@/types/questionnaire/assets-fields";

/* ---------------------------------------------------------------------- */
/* Row types                                                               */
/* ---------------------------------------------------------------------- */
// Each category: its yes/no flag, its row list and how to create a blank row
const CATEGORIES: { [K in ListKey]: { flag: FlagKey; makeRow: () => RowOf<K> } } = {
  realEstate: {
    flag: "hasRealEstate",
    makeRow: () => ({
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
    }),
  },
  savings: {
    flag: "hasSavings",
    makeRow: () => ({ id: makeId("sav"), institution: "", accountType: "", balance: "", ...emptyTreatment }),
  },
  pensions: {
    flag: "hasPensions",
    makeRow: () => ({ id: makeId("pen"), provider: "", value: "", valueUnknown: false, ...emptyTreatment }),
  },
  businesses: {
    flag: "hasBusinesses",
    makeRow: () => ({
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
    }),
  },
  ipAssets: {
    flag: "hasIP",
    makeRow: () => ({
      id: makeId("ip"),
      name: "",
      ipType: "",
      value: "",
      valueUnknown: false,
      registrationNumber: "",
      description: "",
      ...emptyTreatment,
    }),
  },
  chattels: {
    flag: "hasChattels",
    makeRow: () => ({
      id: makeId("chat"),
      description: "",
      category: "",
      value: "",
      valueUnknown: false,
      ...emptyTreatment,
    }),
  },
  otherAssets: {
    flag: "hasOtherAssets",
    makeRow: () => ({ id: makeId("other"), description: "", value: "", valueUnknown: false, ...emptyTreatment }),
  },
};

export const initialAssets: AssetsData = {
  hasRealEstate: "No",
  realEstate: [],
  hasSavings: "No",
  savings: [],
  hasPensions: "No",
  pensions: [],
  hasBusinesses: "No",
  businesses: [],
  hasIP: "No",
  ipAssets: [],
  hasChattels: "No",
  chattels: [],
  hasOtherAssets: "No",
  otherAssets: [],
};

// Maps the API section into form state (same defaults the forms always used)
export function toAssets(raw: any): AssetsData {
  if (!raw) return initialAssets;
  const list = (v: unknown) => (Array.isArray(v) ? v : []);
  return {
    hasRealEstate: raw.hasRealEstate ?? "No",
    realEstate: list(raw.realEstate),
    hasSavings: raw.hasSavings ?? "No",
    savings: list(raw.savings),
    hasPensions: raw.hasPensions ?? "No",
    pensions: list(raw.pensions),
    hasBusinesses: raw.hasBusinesses ?? "No",
    businesses: list(raw.businesses),
    hasIP: raw.hasIP ?? "No",
    ipAssets: list(raw.ipAssets),
    hasChattels: raw.hasChattels ?? "No",
    chattels: list(raw.chattels),
    hasOtherAssets: raw.hasOtherAssets ?? "No",
    otherAssets: list(raw.otherAssets),
  };
}

/* ---------------------------------------------------------------------- */
/* Select options                                                          */
/* ---------------------------------------------------------------------- */
const PROPERTY_TYPES: Option[] = [
  { value: "House", label: "House" },
  { value: "Flat", label: "Flat" },
  { value: "Commercial", label: "Commercial" },
];

const ACCOUNT_TYPES: Option[] = [
  { value: "Current", label: "Current Account" },
  { value: "Savings", label: "Savings Account" },
  { value: "ISA", label: "ISA" },
  { value: "Investment", label: "Investment Portfolio" },
  { value: "Other", label: "Other" },
];

const ENTITY_TYPES: Option[] = [
  { value: "Ltd", label: "Limited Company (Ltd)" },
  { value: "LLP", label: "LLP" },
  { value: "Sole", label: "Sole Trader" },
];

const IP_TYPES: Option[] = [
  { value: "Patent", label: "Patent" },
  { value: "Website", label: "Website / Online Platform" },
  { value: "Trademark", label: "Trademark" },
  { value: "Copyright", label: "Copyright" },
  { value: "Software", label: "Software / Source Code" },
  { value: "Domain", label: "Domain Name" },
  { value: "Licence", label: "Licence / Royalty Rights" },
  { value: "Design", label: "Registered Design" },
  { value: "Other", label: "Other" },
];

const CHATTEL_CATEGORIES: Option[] = [
  { value: "Vehicles", label: "Motor Vehicles (Cars, Motorcycles, Boats)" },
  { value: "Luxury", label: "Luxury Items (Jewellery, Watches, Designer Goods)" },
  { value: "Art", label: "Fine Art, Antiques & Collectibles" },
  { value: "Digital", label: "Digital Assets (Cryptocurrency, NFTs)" },
  { value: "Other", label: "Other High-Value Physical Property" },
];

const BUSINESS_TREATMENT_OPTIONS: { value: Treatment; label: string }[] = [
  { value: "KeepSeparate", label: "Keep it Separate" },
  { value: "ShareEqually", label: "Share Equally (50/50)" },
  { value: "Custom", label: "Custom Arrangement" },
];

/* ---------------------------------------------------------------------- */
/* Component                                                               */
/* ---------------------------------------------------------------------- */

export function AssetsFields({ data, onChange, readOnly }: Props) {
  const ask = (you: string, they: string) => (readOnly ? they : you);

  const toggle = (key: ListKey) => (value: YesNo) =>
    onChange?.((prev) => ({
      ...prev,
      [CATEGORIES[key].flag]: value,
      [key]: value === "Yes" ? (prev[key].length ? prev[key] : [CATEGORIES[key].makeRow()]) : [],
    }));

  const addRow = (key: ListKey) =>
    onChange?.((prev) => ({ ...prev, [key]: [...prev[key], CATEGORIES[key].makeRow()] }));

  const removeRow = (key: ListKey, id: string) =>
    onChange?.((prev) => ({ ...prev, [key]: prev[key].filter((r) => r.id !== id) }));

  const update = <K extends ListKey>(key: K, id: string, patch: Partial<RowOf<K>>) =>
    onChange?.((prev) => ({
      ...prev,
      [key]: (prev[key] as RowOf<K>[]).map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));

  // Text/number input bound to one row field
  const text = <K extends ListKey>(
    key: K,
    row: RowOf<K>,
    field: keyof RowOf<K> & string,
    placeholder: string,
    extra: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <input
      type="text"
      placeholder={placeholder}
      value={String(row[field] ?? "")}
      onChange={(e) => update(key, row.id, { [field]: e.target.value } as Partial<RowOf<K>>)}
      disabled={readOnly}
      className={inputClasses}
      {...extra}
    />
  );

  const select = <K extends ListKey>(
    key: K,
    row: RowOf<K>,
    field: keyof RowOf<K> & string,
    placeholder: string,
    options: Option[],
  ) => (
    <select
      value={String(row[field] ?? "")}
      onChange={(e) => update(key, row.id, { [field]: e.target.value } as Partial<RowOf<K>>)}
      disabled={readOnly}
      className={inputClasses}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );

  // Value input with the "I am unsure" checkbox (rows that have `valueUnknown`)
  const value = <K extends ListKey>(
    key: K,
    row: RowOf<K>,
    field: "value" | "valueOfStake",
    placeholder: string,
  ) => {
    const fields = row as unknown as Record<string, unknown>;
    return (
      <ValueWithUnsure
        id={`val_${row.id}`}
        value={String(fields[field] ?? "")}
        unknown={Boolean(fields.valueUnknown)}
        onValueChange={(v) => update(key, row.id, { [field]: v } as unknown as Partial<RowOf<K>>)}
        onUnknownChange={(v) =>
          update(key, row.id, { valueUnknown: v } as unknown as Partial<RowOf<K>>)
        }
        placeholder={placeholder}
        readOnly={readOnly}
      />
    );
  };

  const treatment = <K extends ListKey>(
    key: K,
    row: RowOf<K>,
    props: { label?: string; options?: { value: Treatment; label: string }[] } = {},
  ) => (
    <TreatmentSelect
      id={row.id}
      fields={row}
      onChange={(f) => update(key, row.id, f as Partial<RowOf<K>>)}
      readOnly={readOnly}
      {...props}
    />
  );

  // Header + yes/no question + list of rows for one asset category
  const category = <K extends ListKey>(
    key: K,
    cfg: { title: string; tooltip: string; question: string; matrixTitle: string; addLabel: string },
    renderRow: (row: RowOf<K>) => ReactNode,
  ) => {
    const enabled = data[CATEGORIES[key].flag] === "Yes";
    return (
      <>
        <PartHeader tooltip={cfg.tooltip}>{cfg.title}</PartHeader>
        <FieldLabel>{cfg.question}</FieldLabel>
        <YesNoToggle
          name={`has_${key}`}
          value={data[CATEGORIES[key].flag]}
          onChange={toggle(key)}
          readOnly={readOnly}
        />
        {enabled && (
          <MatrixBox
            title={cfg.matrixTitle}
            onAdd={readOnly ? undefined : () => addRow(key)}
            addLabel={cfg.addLabel}
          >
            {(data[key] as RowOf<K>[]).map((row) => (
              <RowItem key={row.id} onDelete={readOnly ? undefined : () => removeRow(key, row.id)}>
                {renderRow(row)}
              </RowItem>
            ))}
          </MatrixBox>
        )}
      </>
    );
  };

  const grid = (cols: string, children: ReactNode) => (
    <div className={`mb-3.5 grid grid-cols-1 gap-3.5 ${cols}`}>{children}</div>
  );

  return (
    <>
      {category(
        "realEstate",
        {
          title: "Property & Real Estate",
          tooltip: "Properties owned personally or with third parties that should be kept separate.",
          question: ask(
            "Do you own, partly own, or have a financial interest in any real estate / properties?",
            "Do they own, partly own, or have a financial interest in any real estate / properties?",
          ),
          matrixTitle: "Properties",
          addLabel: "Add property",
        },
        (row) => (
          <>
            {grid(
              "sm:grid-cols-2",
              <>
                {text("realEstate", row, "addressLine1", "Address line 1")}
                {text("realEstate", row, "addressLine2", "Address line 2 (optional)")}
              </>,
            )}
            {grid(
              "sm:grid-cols-3",
              <>
                {text("realEstate", row, "postcode", "Postcode")}
                {select("realEstate", row, "propertyType", "Property type", PROPERTY_TYPES)}
                {value("realEstate", row, "value", "Value (GBP)")}
              </>,
            )}
            {grid(
              "sm:grid-cols-3",
              <>
                {text("realEstate", row, "mortgageBalance", "Mortgage balance (£)", { type: "number" })}
                {text("realEstate", row, "earlyPenalty", "Early penalty charges (£)", { type: "number" })}
                {text("realEstate", row, "ownershipShare", "Ownership share %", {
                  type: "number",
                  min: 0,
                  max: 100,
                })}
              </>,
            )}
            {grid(
              "sm:grid-cols-2",
              <>
                {select("realEstate", row, "ownershipMode", "Ownership mode", [
                  { value: "Solely", label: "Solely Owned" },
                  { value: "Jointly", label: "Jointly Owned (with family, business partners, etc.)" },
                ])}
                {select("realEstate", row, "thirdPartyInterest", "Third-party interest?", [
                  { value: "No", label: "No" },
                  { value: "Yes", label: "Yes" },
                ])}
              </>,
            )}
            {row.ownershipMode === "Jointly" && (
              <textarea
                placeholder="Specify co-owner names, shares, and relationship."
                value={row.coOwnerDetails}
                onChange={(e) => update("realEstate", row.id, { coOwnerDetails: e.target.value })}
                disabled={readOnly}
                className={`${textareaClasses} mb-3.5`}
              />
            )}
            {row.thirdPartyInterest === "Yes" && (
              <textarea
                placeholder="Specify who holds the interest (e.g. parent loan) and if a written agreement exists."
                value={row.thirdPartyDetail}
                onChange={(e) => update("realEstate", row.id, { thirdPartyDetail: e.target.value })}
                disabled={readOnly}
                className={`${textareaClasses} mb-3.5`}
              />
            )}
            {treatment("realEstate", row)}
          </>
        ),
      )}

      {category(
        "savings",
        {
          title: "Savings & Investments",
          tooltip: "Personal bank accounts, cash savings, premium bonds, or investment portfolios.",
          question: ask(
            "Do you currently hold any personal bank accounts, cash savings, premium bonds, or investment portfolios?",
            "Do they currently hold any personal bank accounts, cash savings, premium bonds, or investment portfolios?",
          ),
          matrixTitle: "Savings & investment accounts",
          addLabel: "Add savings / portfolio account",
        },
        (row) => (
          <>
            {grid(
              "sm:grid-cols-3",
              <>
                {text("savings", row, "institution", "Institution / bank name")}
                {select("savings", row, "accountType", "Account type", ACCOUNT_TYPES)}
                {text("savings", row, "balance", "Balance (GBP)", { type: "number" })}
              </>,
            )}
            {treatment("savings", row)}
          </>
        ),
      )}

      {category(
        "pensions",
        {
          title: "Pensions & Retirement Funds",
          tooltip: "Private, corporate, or state pension pots or retirement annuities.",
          question: ask(
            "Do you hold any private, corporate, or state pension pots or retirement annuities?",
            "Do they hold any private, corporate, or state pension pots or retirement annuities?",
          ),
          matrixTitle: "Pensions",
          addLabel: "Add pension pot",
        },
        (row) => (
          <>
            {grid(
              "sm:grid-cols-2",
              <>
                {text("pensions", row, "provider", "Pension provider name")}
                {value("pensions", row, "value", "Current CETV valuation (£)")}
              </>,
            )}
            {treatment("pensions", row)}
          </>
        ),
      )}

      {category(
        "businesses",
        {
          title: "Business Interests",
          tooltip: "Businesses where this person is a director, shareholder, partner, or sole trader.",
          question: ask(
            "Are you a director, shareholder, partner, or sole trader in any active or dormant business?",
            "Are they a director, shareholder, partner, or sole trader in any active or dormant business?",
          ),
          matrixTitle: "Businesses",
          addLabel: "Add business",
        },
        (row) => (
          <>
            {grid(
              "sm:grid-cols-[2fr_1fr]",
              <>
                {text("businesses", row, "name", "Registered business name")}
                {select("businesses", row, "entityType", "Entity structure", ENTITY_TYPES)}
              </>,
            )}
            {grid(
              "sm:grid-cols-3",
              <>
                {text("businesses", row, "turnover", "Turnover (£) (optional)", { type: "number" })}
                {text("businesses", row, "netProfit", "Net profit (£) (optional)", { type: "number" })}
                {text("businesses", row, "ownershipPercent", "Ownership %", {
                  type: "number",
                  min: 0,
                  max: 100,
                })}
              </>,
            )}
            {grid(
              "sm:grid-cols-2",
              <>
                {value("businesses", row, "valueOfStake", "Value of stake (£)")}
                <input
                  type="text"
                  placeholder={
                    row.valueUnknown
                      ? "Not required (value unknown)"
                      : "Valuation justification (e.g. book value)"
                  }
                  value={row.valueUnknown ? "" : row.justification}
                  disabled={readOnly || row.valueUnknown}
                  onChange={(e) => update("businesses", row.id, { justification: e.target.value })}
                  className={inputClasses}
                />
              </>,
            )}
            {treatment("businesses", row, { options: BUSINESS_TREATMENT_OPTIONS })}
          </>
        ),
      )}

      {category(
        "ipAssets",
        {
          title: "Intellectual Property",
          tooltip: "Patents, trademarks, copyrights, licensing rights or other valuable IP.",
          question: ask(
            "Do you personally own any intellectual property or licensing rights that have financial value?",
            "Do they personally own any intellectual property or licensing rights that have financial value?",
          ),
          matrixTitle: "Intellectual property",
          addLabel: "Add intellectual property",
        },
        (row) => (
          <>
            {grid(
              "sm:grid-cols-[1.5fr_1fr]",
              <>
                {text("ipAssets", row, "name", "Intellectual property name")}
                {select("ipAssets", row, "ipType", "IP type", IP_TYPES)}
              </>,
            )}
            {grid(
              "sm:grid-cols-2",
              <>
                {value("ipAssets", row, "value", "Estimated value (£)")}
                {text("ipAssets", row, "registrationNumber", "Registration / reference number (optional)")}
              </>,
            )}
            <textarea
              placeholder="Brief description (optional)"
              value={row.description}
              onChange={(e) => update("ipAssets", row.id, { description: e.target.value })}
              disabled={readOnly}
              className={`${textareaClasses} mb-3.5`}
            />
            {treatment("ipAssets", row, { label: "How should this be treated?" })}
          </>
        ),
      )}

      {category(
        "chattels",
        {
          title: "High-Value Personal Belongings",
          tooltip: "Personal property items valued individually over £5,000.",
          question: ask(
            "Do you own any personal belongings valued individually over £5,000 (such as vehicles, jewellery, artwork, or cryptocurrency)?",
            "Do they own any personal belongings valued individually over £5,000 (such as vehicles, jewellery, artwork, or cryptocurrency)?",
          ),
          matrixTitle: "High-value items",
          addLabel: "Add item",
        },
        (row) => (
          <>
            {grid(
              "sm:grid-cols-[2fr_1.5fr_1fr]",
              <>
                {text("chattels", row, "description", "Item description / name")}
                {select("chattels", row, "category", "Category", CHATTEL_CATEGORIES)}
                {value("chattels", row, "value", "Value (GBP)")}
              </>,
            )}
            {treatment("chattels", row)}
          </>
        ),
      )}

      {category(
        "otherAssets",
        {
          title: "Other Personal Assets",
          tooltip: "Any other assets, inheritances, trust interests, or financial rights not covered above.",
          question: ask(
            "Have we missed anything? Do you own or expect to receive any other assets, financial interests, inheritances, or property not listed above?",
            "Do they own or expect to receive any other assets, financial interests, inheritances, or property not listed above?",
          ),
          matrixTitle: "Other assets",
          addLabel: "Add other asset",
        },
        (row) => (
          <>
            {grid(
              "sm:grid-cols-[2fr_1fr]",
              <>
                {text(
                  "otherAssets",
                  row,
                  "description",
                  "Asset name / description (e.g. trust interest, offshore account)",
                )}
                {value("otherAssets", row, "value", "Estimated value (GBP)")}
              </>,
            )}
            {treatment("otherAssets", row, { label: "How should this be treated?" })}
          </>
        ),
      )}
    </>
  );
}

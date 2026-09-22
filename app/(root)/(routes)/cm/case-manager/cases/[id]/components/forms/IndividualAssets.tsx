
"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

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

const inputClass =
  "w-full rounded-[10px] border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[0.925rem] text-slate-900 transition focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 disabled:cursor-not-allowed disabled:opacity-60";

const textareaClass =
  inputClass + " min-h-[70px] resize-y";

const allTreatmentOptions: {
  value: Treatment;
  label: string;
}[] = [
  {
    value: "KeepSeparate",
    label: "Keep it Separate",
  },
  {
    value: "ShareEqually",
    label: "Share Equally (50/50)",
  },
  {
    value: "Contribution",
    label: "Split by Contribution",
  },
  {
    value: "Percentage",
    label: "Share by Percentage",
  },
  {
    value: "Custom",
    label: "Custom Arrangement",
  },
];

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

/* -------------------------------------------------------------------------- */
/* Reusable helpers                                                           */
/* -------------------------------------------------------------------------- */

function getTreatmentFields(row: any): TreatmentFields {
  return {
    treatment: row?.treatment ?? "",
    contributionText: row?.contributionText ?? "",
    percentageValue: row?.percentageValue ?? "",
    customText: row?.customText ?? "",
  };
}

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
  children: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <div className="mb-4 mt-8 flex items-center gap-2 text-[1.15rem] font-bold text-slate-800">
      {children}
      {tooltip && <Tooltip text={tooltip} />}
    </div>
  );
}

function YesNoToggle({
  name,
  value,
  onChange,
  disabled,
}: {
  name: string;
  value: "Yes" | "No";
  onChange: (value: "Yes" | "No") => void;
  disabled?: boolean;
}) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-3">
      {(["Yes", "No"] as const).map((option) => {
        const checked = value === option;

        return (
          <label
            key={option}
            className={`relative flex items-center gap-3 rounded-[10px] border px-4 py-3 transition ${
              disabled
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            } ${
              checked
                ? "border-indigo-600 bg-slate-50"
                : "border-slate-300 bg-slate-50 hover:border-indigo-600 hover:bg-white"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={checked}
              disabled={disabled}
              onChange={() => onChange(option)}
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
              className={`text-[0.9rem] font-semibold ${
                checked
                  ? "text-indigo-600"
                  : "text-slate-900"
              }`}
            >
              {option}
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
  isEditing,
}: {
  title: string;
  children: React.ReactNode;
  onAdd: () => void;
  addLabel: string;
  isEditing: boolean;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-300 bg-slate-50 p-6">
      <div className="mb-4 text-[0.85rem] font-bold uppercase tracking-wide text-slate-500">
        {title}
      </div>

      {children}

      {isEditing && (
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-indigo-600 bg-transparent px-5 py-3 text-[0.9rem] font-semibold text-indigo-600 transition hover:border-solid hover:bg-indigo-100"
        >
          <Plus size={16} />
          {addLabel}
        </button>
      )}
    </div>
  );
}

function RowItem({
  children,
  onDelete,
  isEditing,
}: {
  children: React.ReactNode;
  onDelete: () => void;
  isEditing: boolean;
}) {
  return (
    <div className="relative mb-5 rounded-[10px] border border-slate-300 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      {isEditing && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Remove item"
          className="absolute right-4 top-4 text-[1.1rem] text-slate-500 transition hover:text-red-500"
        >
          <Trash2 size={17} />
        </button>
      )}

      {children}
    </div>
  );
}

function ValueWithUnsure({
  value,
  unknown,
  onValueChange,
  onUnknownChange,
  placeholder,
  disabled,
}: {
  value: string;
  unknown: boolean;
  onValueChange: (value: string) => void;
  onUnknownChange: (value: boolean) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <input
        type="number"
        value={unknown ? "" : value ?? ""}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled || unknown}
        required={!unknown}
        placeholder={
          unknown ? "Value unknown" : placeholder
        }
        className={inputClass}
      />

      <label
        className={`mt-1.5 flex items-center gap-1.5 text-[0.8rem] font-normal text-slate-500 ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          checked={unknown}
          disabled={disabled}
          onChange={(e) =>
            onUnknownChange(e.target.checked)
          }
          className="h-3.5 w-3.5"
        />

        I am unsure of the current value.
      </label>

      <small className="mt-1 block pl-5 text-[0.75rem] leading-tight text-slate-500">
        Please provide an estimated value where possible.
        You may update this information later if additional
        details become available.
      </small>
    </div>
  );
}

function TreatmentSelect({
  row,
  onChange,
  disabled,
  label = "How should this be shared?",
  options = allTreatmentOptions,
}: {
  row: any;
  onChange: (fields: TreatmentFields) => void;
  disabled?: boolean;
  label?: string;
  options?: {
    value: Treatment;
    label: string;
  }[];
}) {
  const fields = getTreatmentFields(row);

  const update = (patch: Partial<TreatmentFields>) => {
    onChange({
      ...fields,
      ...patch,
    });
  };

  return (
    <div className="mt-3">
      <select
        value={fields.treatment}
        disabled={disabled}
        onChange={(e) =>
          update({
            treatment: e.target.value as Treatment,
          })
        }
        required
        className={inputClass}
      >
        <option value="">{label}</option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {fields.treatment === "Contribution" && (
        <div className="mt-3 rounded-r-[10px] border-l-4 border-indigo-600 bg-slate-50 p-4">
          <label className="mb-1.5 block text-[0.9rem] font-semibold text-slate-800">
            Define contribution (e.g., salary, initial
            deposit):
          </label>

          <input
            type="text"
            value={fields.contributionText}
            disabled={disabled}
            onChange={(e) =>
              update({
                contributionText: e.target.value,
              })
            }
            placeholder="Explain your contribution logic"
            className={inputClass}
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
            disabled={disabled}
            onChange={(e) =>
              update({
                percentageValue: e.target.value,
              })
            }
            placeholder="Percentage (%)"
            className={inputClass}
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
            disabled={disabled}
            onChange={(e) =>
              update({
                customText: e.target.value,
              })
            }
            placeholder="Create your own arrangement..."
            className={textareaClass}
          />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main CM component                                                          */
/* -------------------------------------------------------------------------- */

export default function IndividualAssets({
  data,
  isEditing,
  onChange,
}: Props) {
  const safeData = data || {};

  const updateRow = (
    field: string,
    id: string,
    key: string,
    value: any
  ) => {
    const rows = Array.isArray(safeData[field])
      ? safeData[field]
      : [];

    onChange(
      field,
      rows.map((item: any) =>
        item.id === id
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );
  };

  const updateTreatment = (
    field: string,
    id: string,
    treatmentFields: TreatmentFields
  ) => {
    const rows = Array.isArray(safeData[field])
      ? safeData[field]
      : [];

    onChange(
      field,
      rows.map((item: any) =>
        item.id === id
          ? {
              ...item,
              ...treatmentFields,
            }
          : item
      )
    );
  };

  const addRow = (field: string, row: any) => {
    onChange(field, [
      ...(Array.isArray(safeData[field])
        ? safeData[field]
        : []),
      row,
    ]);
  };

  const removeRow = (
    field: string,
    id: string
  ) => {
    const rows = Array.isArray(safeData[field])
      ? safeData[field]
      : [];

    onChange(
      field,
      rows.filter((item: any) => item.id !== id)
    );
  };

  const setSectionEnabled = (
    enabledField: string,
    rowsField: string,
    value: "Yes" | "No",
    createRow: () => any
  ) => {
    onChange(enabledField, value);

    if (value === "No") {
      onChange(rowsField, []);
    } else {
      const rows = Array.isArray(safeData[rowsField])
        ? safeData[rowsField]
        : [];

      if (rows.length === 0) {
        onChange(rowsField, [createRow()]);
      }
    }
  };

  const makeRealEstateRow = () => ({
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
  });

  const makeSavingsRow = () => ({
    id: makeId("sav"),
    institution: "",
    accountType: "",
    balance: "",
    ...emptyTreatment,
  });

  const makePensionRow = () => ({
    id: makeId("pen"),
    provider: "",
    value: "",
    valueUnknown: false,
    ...emptyTreatment,
  });

  const makeBusinessRow = () => ({
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
  });

  const makeIPRow = () => ({
    id: makeId("ip"),
    name: "",
    ipType: "",
    value: "",
    valueUnknown: false,
    registrationNumber: "",
    description: "",
    ...emptyTreatment,
  });

  const makeChattelRow = () => ({
    id: makeId("chat"),
    description: "",
    category: "",
    value: "",
    valueUnknown: false,
    ...emptyTreatment,
  });

  const makeOtherAssetRow = () => ({
    id: makeId("other"),
    description: "",
    value: "",
    valueUnknown: false,
    ...emptyTreatment,
  });

  const hasRealEstate =
    safeData.hasRealEstate === "Yes";

  const hasSavings =
    safeData.hasSavings === "Yes";

  const hasPensions =
    safeData.hasPensions === "Yes";

  const hasBusinesses =
    safeData.hasBusinesses === "Yes";

  const hasIP =
    safeData.hasIP === "Yes";

  const hasChattels =
    safeData.hasChattels === "Yes";

  const hasOtherAssets =
    safeData.hasOtherAssets === "Yes";

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div>
        <h2 className="text-xl font-bold">
          Individual Assets
        </h2>

        <p className="text-sm text-slate-500">
          Assets owned personally by this individual.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PROPERTY & REAL ESTATE                                              */}
      {/* ------------------------------------------------------------------ */}

      <PartHeader
        tooltip="List details of any properties you own personally or with third parties that you want to keep separate from your partner."
      >
        Property & Real Estate
      </PartHeader>

      <div className="mb-4">
        <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
          Do you own, partly own, or have a financial
          interest in any real estate / properties?
        </label>

        <YesNoToggle
          name="has_real_estate"
          value={safeData.hasRealEstate || "No"}
          disabled={!isEditing}
          onChange={(value) =>
            setSectionEnabled(
              "hasRealEstate",
              "realEstate",
              value,
              makeRealEstateRow
            )
          }
        />
      </div>

      {hasRealEstate && (
        <MatrixBox
          title="Real Estate Registry Asset Rows"
          isEditing={isEditing}
          onAdd={() =>
            addRow(
              "realEstate",
              makeRealEstateRow()
            )
          }
          addLabel="Add Property Asset"
        >
          {(safeData.realEstate || []).map(
            (row: any) => (
              <RowItem
                key={row.id}
                isEditing={isEditing}
                onDelete={() =>
                  removeRow(
                    "realEstate",
                    row.id
                  )
                }
              >
                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={row.addressLine1 ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "addressLine1",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={row.addressLine2 ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "addressLine2",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  <input
                    type="text"
                    placeholder="Postcode"
                    value={row.postcode ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "postcode",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <select
                    value={row.propertyType ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "propertyType",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Property Type
                    </option>
                    <option value="House">
                      House
                    </option>
                    <option value="Flat">
                      Flat
                    </option>
                    <option value="Commercial">
                      Commercial
                    </option>
                  </select>

                  <ValueWithUnsure
                    value={row.value ?? ""}
                    unknown={
                      row.valueUnknown ?? false
                    }
                    disabled={!isEditing}
                    onValueChange={(value) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "value",
                        value
                      )
                    }
                    onUnknownChange={(value) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "valueUnknown",
                        value
                      )
                    }
                    placeholder="Value (GBP)"
                  />
                </div>

                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  <input
                    type="number"
                    placeholder="Mortgage Balance"
                    value={
                      row.mortgageBalance ?? ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "mortgageBalance",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <input
                    type="number"
                    placeholder="Early Penalty Charges (£)"
                    value={
                      row.earlyPenalty ?? ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "earlyPenalty",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Ownership Share %"
                    value={
                      row.ownershipShare ?? ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "ownershipShare",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <select
                    value={row.ownershipMode ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "ownershipMode",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Ownership Mode
                    </option>
                    <option value="Solely">
                      Solely Owned
                    </option>
                    <option value="Jointly">
                      Jointly Owned (with family,
                      business partners, etc.)
                    </option>
                  </select>

                  <select
                    value={
                      row.thirdPartyInterest ?? ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "thirdPartyInterest",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Third-Party Interest?
                    </option>
                    <option value="No">
                      No
                    </option>
                    <option value="Yes">
                      Yes
                    </option>
                  </select>
                </div>

                {row.ownershipMode ===
                  "Jointly" && (
                  <textarea
                    placeholder="Specify co-owner names, shares, and relationship."
                    value={
                      row.coOwnerDetails ?? ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "coOwnerDetails",
                        e.target.value
                      )
                    }
                    className={
                      textareaClass + " mb-3.5"
                    }
                  />
                )}

                {row.thirdPartyInterest ===
                  "Yes" && (
                  <textarea
                    placeholder="Specify who holds the interest (e.g. parent loan) and if a written agreement exists."
                    value={
                      row.thirdPartyDetail ?? ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "realEstate",
                        row.id,
                        "thirdPartyDetail",
                        e.target.value
                      )
                    }
                    className={
                      textareaClass + " mb-3.5"
                    }
                  />
                )}

                <TreatmentSelect
                  row={row}
                  disabled={!isEditing}
                  onChange={(fields) =>
                    updateTreatment(
                      "realEstate",
                      row.id,
                      fields
                    )
                  }
                />
              </RowItem>
            )
          )}
        </MatrixBox>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SAVINGS & INVESTMENTS                                               */}
      {/* ------------------------------------------------------------------ */}

      <PartHeader
        tooltip="List personal bank accounts, cash savings, premium bonds, or investment portfolios."
      >
        Savings & Investments
      </PartHeader>

      <div className="mb-4">
        <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
          Do you currently hold any personal bank
          accounts, cash savings, premium bonds, or
          investment portfolios?
        </label>

        <YesNoToggle
          name="has_separate_savings"
          value={safeData.hasSavings || "No"}
          disabled={!isEditing}
          onChange={(value) =>
            setSectionEnabled(
              "hasSavings",
              "savings",
              value,
              makeSavingsRow
            )
          }
        />
      </div>

      {hasSavings && (
        <MatrixBox
          title="Savings & Cash Resource Pools"
          isEditing={isEditing}
          onAdd={() =>
            addRow(
              "savings",
              makeSavingsRow()
            )
          }
          addLabel="Add Savings / Portfolio Account"
        >
          {(safeData.savings || []).map(
            (row: any) => (
              <RowItem
                key={row.id}
                isEditing={isEditing}
                onDelete={() =>
                  removeRow(
                    "savings",
                    row.id
                  )
                }
              >
                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  <input
                    type="text"
                    placeholder="Institution / Bank Name"
                    value={row.institution ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "savings",
                        row.id,
                        "institution",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <select
                    value={row.accountType ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "savings",
                        row.id,
                        "accountType",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Account Type
                    </option>
                    <option value="Current">
                      Current Account
                    </option>
                    <option value="Savings">
                      Savings Account
                    </option>
                    <option value="ISA">
                      ISA
                    </option>
                    <option value="Investment">
                      Investment Portfolio
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>

                  <input
                    type="number"
                    placeholder="Valuation Balance (GBP)"
                    value={row.balance ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "savings",
                        row.id,
                        "balance",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <TreatmentSelect
                  row={row}
                  disabled={!isEditing}
                  onChange={(fields) =>
                    updateTreatment(
                      "savings",
                      row.id,
                      fields
                    )
                  }
                />
              </RowItem>
            )
          )}
        </MatrixBox>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PENSIONS                                                            */}
      {/* ------------------------------------------------------------------ */}

      <PartHeader
        tooltip="List your private, corporate, or state pension pots or retirement annuities."
      >
        Pensions & Retirement Funds
      </PartHeader>

      <div className="mb-4">
        <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
          Do you hold any private, corporate, or state
          pension pots or retirement annuities?
        </label>

        <YesNoToggle
          name="has_separate_pensions"
          value={safeData.hasPensions || "No"}
          disabled={!isEditing}
          onChange={(value) =>
            setSectionEnabled(
              "hasPensions",
              "pensions",
              value,
              makePensionRow
            )
          }
        />
      </div>

      {hasPensions && (
        <MatrixBox
          title="Pension Scheme Registry"
          isEditing={isEditing}
          onAdd={() =>
            addRow(
              "pensions",
              makePensionRow()
            )
          }
          addLabel="Add Pension Pot"
        >
          {(safeData.pensions || []).map(
            (row: any) => (
              <RowItem
                key={row.id}
                isEditing={isEditing}
                onDelete={() =>
                  removeRow(
                    "pensions",
                    row.id
                  )
                }
              >
                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Pension Provider Name"
                    value={row.provider ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "pensions",
                        row.id,
                        "provider",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <ValueWithUnsure
                    value={row.value ?? ""}
                    unknown={
                      row.valueUnknown ?? false
                    }
                    disabled={!isEditing}
                    onValueChange={(value) =>
                      updateRow(
                        "pensions",
                        row.id,
                        "value",
                        value
                      )
                    }
                    onUnknownChange={(value) =>
                      updateRow(
                        "pensions",
                        row.id,
                        "valueUnknown",
                        value
                      )
                    }
                    placeholder="Current CETV Valuation (£)"
                  />
                </div>

                <TreatmentSelect
                  row={row}
                  disabled={!isEditing}
                  onChange={(fields) =>
                    updateTreatment(
                      "pensions",
                      row.id,
                      fields
                    )
                  }
                />
              </RowItem>
            )
          )}
        </MatrixBox>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* BUSINESS INTERESTS                                                  */}
      {/* ------------------------------------------------------------------ */}

      <PartHeader
        tooltip="Declare entity infrastructure details if you are a director, shareholder, partner, or sole trader."
      >
        Business Interests
      </PartHeader>

      <div className="mb-4">
        <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
          Are you a director, shareholder, partner, or
          sole trader in any active or dormant business
          enterprises?
        </label>

        <YesNoToggle
          name="has_businesses"
          value={safeData.hasBusinesses || "No"}
          disabled={!isEditing}
          onChange={(value) =>
            setSectionEnabled(
              "hasBusinesses",
              "businesses",
              value,
              makeBusinessRow
            )
          }
        />
      </div>

      {hasBusinesses && (
        <MatrixBox
          title="Business Interests"
          isEditing={isEditing}
          onAdd={() =>
            addRow(
              "businesses",
              makeBusinessRow()
            )
          }
          addLabel="Add Corporate Entity"
        >
          {(safeData.businesses || []).map(
            (row: any) => (
              <RowItem
                key={row.id}
                isEditing={isEditing}
                onDelete={() =>
                  removeRow(
                    "businesses",
                    row.id
                  )
                }
              >
                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr]">
                  <input
                    type="text"
                    placeholder="Registered Business Name"
                    value={row.name ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "businesses",
                        row.id,
                        "name",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <select
                    value={row.entityType ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "businesses",
                        row.id,
                        "entityType",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Entity Structure
                    </option>
                    <option value="Ltd">
                      Limited Company (Ltd)
                    </option>
                    <option value="LLP">
                      LLP
                    </option>
                    <option value="Sole">
                      Sole Trader
                    </option>
                  </select>
                </div>

                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  <input
                    type="number"
                    placeholder="Turnover (£) (Optional)"
                    value={row.turnover ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "businesses",
                        row.id,
                        "turnover",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <input
                    type="number"
                    placeholder="Net Profit (£) (Optional)"
                    value={row.netProfit ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "businesses",
                        row.id,
                        "netProfit",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Your Ownership %"
                    value={
                      row.ownershipPercent ?? ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "businesses",
                        row.id,
                        "ownershipPercent",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <ValueWithUnsure
                    value={
                      row.valueOfStake ?? ""
                    }
                    unknown={
                      row.valueUnknown ?? false
                    }
                    disabled={!isEditing}
                    onValueChange={(value) =>
                      updateRow(
                        "businesses",
                        row.id,
                        "valueOfStake",
                        value
                      )
                    }
                    onUnknownChange={(value) =>
                      updateRow(
                        "businesses",
                        row.id,
                        "valueUnknown",
                        value
                      )
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
                    value={
                      row.valueUnknown
                        ? ""
                        : row.justification ?? ""
                    }
                    disabled={
                      !isEditing ||
                      row.valueUnknown
                    }
                    onChange={(e) =>
                      updateRow(
                        "businesses",
                        row.id,
                        "justification",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <TreatmentSelect
                  row={row}
                  disabled={!isEditing}
                  options={[
                    {
                      value: "KeepSeparate",
                      label: "Keep it Separate",
                    },
                    {
                      value: "ShareEqually",
                      label: "Share Equally (50/50)",
                    },
                    {
                      value: "Custom",
                      label: "Custom Arrangement",
                    },
                  ]}
                  onChange={(fields) =>
                    updateTreatment(
                      "businesses",
                      row.id,
                      fields
                    )
                  }
                />
              </RowItem>
            )
          )}
        </MatrixBox>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* INTELLECTUAL PROPERTY                                               */}
      {/* ------------------------------------------------------------------ */}

      <PartHeader
        tooltip="Declare any valuable intellectual property that you personally own, such as patents, trademarks, copyrights or licensing rights."
      >
        Intellectual Property
      </PartHeader>

      <div className="mb-4">
        <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
          Do you personally own any intellectual property
          or licensing rights that have financial value?
        </label>

        <YesNoToggle
          name="has_ip"
          value={safeData.hasIP || "No"}
          disabled={!isEditing}
          onChange={(value) =>
            setSectionEnabled(
              "hasIP",
              "ipAssets",
              value,
              makeIPRow
            )
          }
        />
      </div>

      {hasIP && (
        <MatrixBox
          title="Intellectual Property Register"
          isEditing={isEditing}
          onAdd={() =>
            addRow(
              "ipAssets",
              makeIPRow()
            )
          }
          addLabel="Add Intellectual Property Asset"
        >
          {(safeData.ipAssets || []).map(
            (row: any) => (
              <RowItem
                key={row.id}
                isEditing={isEditing}
                onDelete={() =>
                  removeRow(
                    "ipAssets",
                    row.id
                  )
                }
              >
                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr]">
                  <input
                    type="text"
                    placeholder="Intellectual Property Name"
                    value={row.name ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "ipAssets",
                        row.id,
                        "name",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <select
                    value={row.ipType ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "ipAssets",
                        row.id,
                        "ipType",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      IP Type
                    </option>
                    <option value="Patent">
                      Patent
                    </option>
                    <option value="Website">
                      Website / Online Platform
                    </option>
                    <option value="Trademark">
                      Trademark
                    </option>
                    <option value="Copyright">
                      Copyright
                    </option>
                    <option value="Software">
                      Software / Source Code
                    </option>
                    <option value="Domain">
                      Domain Name
                    </option>
                    <option value="Licence">
                      Licence / Royalty Rights
                    </option>
                    <option value="Design">
                      Registered Design
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <ValueWithUnsure
                    value={row.value ?? ""}
                    unknown={
                      row.valueUnknown ?? false
                    }
                    disabled={!isEditing}
                    onValueChange={(value) =>
                      updateRow(
                        "ipAssets",
                        row.id,
                        "value",
                        value
                      )
                    }
                    onUnknownChange={(value) =>
                      updateRow(
                        "ipAssets",
                        row.id,
                        "valueUnknown",
                        value
                      )
                    }
                    placeholder="Estimated Value (£)"
                  />

                  <input
                    type="text"
                    placeholder="Registration / Reference Number (Optional)"
                    value={
                      row.registrationNumber ?? ""
                    }
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "ipAssets",
                        row.id,
                        "registrationNumber",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <textarea
                  placeholder="Brief description (optional)"
                  value={row.description ?? ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateRow(
                      "ipAssets",
                      row.id,
                      "description",
                      e.target.value
                    )
                  }
                  className={
                    textareaClass + " mb-3.5"
                  }
                />

                <TreatmentSelect
                  row={row}
                  disabled={!isEditing}
                  label="How should this be treated?"
                  onChange={(fields) =>
                    updateTreatment(
                      "ipAssets",
                      row.id,
                      fields
                    )
                  }
                />
              </RowItem>
            )
          )}
        </MatrixBox>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* HIGH-VALUE PERSONAL BELONGINGS                                      */}
      {/* ------------------------------------------------------------------ */}

      <PartHeader
        tooltip="Personal property items valued individually over £5,000."
      >
        High-Value Personal Belongings (Chattels)
      </PartHeader>

      <div className="mb-4">
        <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
          Do you possess any personal belongings valued
          individually over £5,000 (such as vehicles,
          jewelry, artwork, or cryptocurrency assets)?
        </label>

        <YesNoToggle
          name="has_chattels"
          value={safeData.hasChattels || "No"}
          disabled={!isEditing}
          onChange={(value) =>
            setSectionEnabled(
              "hasChattels",
              "chattels",
              value,
              makeChattelRow
            )
          }
        />
      </div>

      {hasChattels && (
        <MatrixBox
          title="High-Value Items & Chattels Registry"
          isEditing={isEditing}
          onAdd={() =>
            addRow(
              "chattels",
              makeChattelRow()
            )
          }
          addLabel="Add Asset Entry"
        >
          {(safeData.chattels || []).map(
            (row: any) => (
              <RowItem
                key={row.id}
                isEditing={isEditing}
                onDelete={() =>
                  removeRow(
                    "chattels",
                    row.id
                  )
                }
              >
                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1.5fr_1fr]">
                  <input
                    type="text"
                    placeholder="Asset Description / Name"
                    value={row.description ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "chattels",
                        row.id,
                        "description",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <select
                    value={row.category ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "chattels",
                        row.id,
                        "category",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Asset Category
                    </option>

                    <option value="Vehicles">
                      Motor Vehicles (Cars,
                      Motorcycles, Boats)
                    </option>

                    <option value="Luxury">
                      Luxury Items (Jewelry,
                      Watches, Designer Goods)
                    </option>

                    <option value="Art">
                      Fine Art, Antiques &
                      Collectibles
                    </option>

                    <option value="Digital">
                      Digital Assets (Cryptocurrency,
                      NFTs)
                    </option>

                    <option value="Other">
                      Other High-Value Physical
                      Property
                    </option>
                  </select>

                  <ValueWithUnsure
                    value={row.value ?? ""}
                    unknown={
                      row.valueUnknown ?? false
                    }
                    disabled={!isEditing}
                    onValueChange={(value) =>
                      updateRow(
                        "chattels",
                        row.id,
                        "value",
                        value
                      )
                    }
                    onUnknownChange={(value) =>
                      updateRow(
                        "chattels",
                        row.id,
                        "valueUnknown",
                        value
                      )
                    }
                    placeholder="Value (GBP)"
                  />
                </div>

                <TreatmentSelect
                  row={row}
                  disabled={!isEditing}
                  onChange={(fields) =>
                    updateTreatment(
                      "chattels",
                      row.id,
                      fields
                    )
                  }
                />
              </RowItem>
            )
          )}
        </MatrixBox>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* OTHER PERSONAL ASSETS                                               */}
      {/* ------------------------------------------------------------------ */}

      <PartHeader
        tooltip="Declare any other assets, inheritances, trust interests, or financial rights not covered above."
      >
        Other Personal Assets
      </PartHeader>

      <div className="mb-4">
        <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
          Have we missed anything? Do you own or expect
          to receive any other assets, financial interests,
          inheritances, or property that have not been
          listed above?
        </label>

        <YesNoToggle
          name="has_other_assets"
          value={
            safeData.hasOtherAssets || "No"
          }
          disabled={!isEditing}
          onChange={(value) =>
            setSectionEnabled(
              "hasOtherAssets",
              "otherAssets",
              value,
              makeOtherAssetRow
            )
          }
        />
      </div>

      {hasOtherAssets && (
        <MatrixBox
          title="Other Assets Registry"
          isEditing={isEditing}
          onAdd={() =>
            addRow(
              "otherAssets",
              makeOtherAssetRow()
            )
          }
          addLabel="Add Other Asset"
        >
          {(safeData.otherAssets || []).map(
            (row: any) => (
              <RowItem
                key={row.id}
                isEditing={isEditing}
                onDelete={() =>
                  removeRow(
                    "otherAssets",
                    row.id
                  )
                }
              >
                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr]">
                  <input
                    type="text"
                    placeholder="Asset Name / Description (e.g. Trust Interest, Offshore Account, Safe Deposit Box)"
                    value={row.description ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      updateRow(
                        "otherAssets",
                        row.id,
                        "description",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <ValueWithUnsure
                    value={row.value ?? ""}
                    unknown={
                      row.valueUnknown ?? false
                    }
                    disabled={!isEditing}
                    onValueChange={(value) =>
                      updateRow(
                        "otherAssets",
                        row.id,
                        "value",
                        value
                      )
                    }
                    onUnknownChange={(value) =>
                      updateRow(
                        "otherAssets",
                        row.id,
                        "valueUnknown",
                        value
                      )
                    }
                    placeholder="Estimated Value (GBP)"
                  />
                </div>

                <TreatmentSelect
                  row={row}
                  disabled={!isEditing}
                  label="How should this be treated?"
                  onChange={(fields) =>
                    updateTreatment(
                      "otherAssets",
                      row.id,
                      fields
                    )
                  }
                />
              </RowItem>
            )
          )}
        </MatrixBox>
      )}
    </div>
  );
}


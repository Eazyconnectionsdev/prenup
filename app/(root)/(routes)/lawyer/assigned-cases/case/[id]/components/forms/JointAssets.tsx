"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
data: any;
isEditing: boolean;
onChange: (field: string, value: any) => void;
}

type YesNo = "Yes" | "No";

type LivingArrangement =
| ""
| "Separate"
| "Rent"
| "OneOwner"
| "Joint"
| "ThirdParty"
| "Other";

interface TreatmentFields {
treatment?: string;
contributionText?: string;
percentageValue?: string;
customText?: string;
}

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

const inputClass =
"w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500";

const textareaClass =
"w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500";

const treatmentOptions = [
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

const livingArrangementOptions = [
{
value: "Separate",
label: "We currently live separately",
},
{
value: "Rent",
label: "We rent a home together",
},
{
value: "OneOwner",
label: "We live in a home owned by one of us",
},
{
value: "Joint",
label: "We live in a home we jointly own",
},
{
value: "ThirdParty",
label: "We live with family or third parties",
},
{
value: "Other",
label: "Other (please specify)",
},
];

const makeId = (prefix: string) =>
`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const emptyTreatment = {
treatment: "",
contributionText: "",
percentageValue: "",
customText: "",
};

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

function PartHeader({
children,
tooltip,
}: {
children: React.ReactNode;
tooltip?: string;
}) {
return ( <div className="mb-4 flex items-center gap-2"> <h3 className="text-base font-bold text-slate-900">{children}</h3>


  {tooltip && (
    <span
      title={tooltip}
      className="flex h-5 w-5 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600"
    >
      ?
    </span>
  )}
</div>


);
}

function YesNoToggle({
name,
value,
onChange,
disabled = false,
}: {
name: string;
value: YesNo;
onChange: (value: YesNo) => void;
disabled?: boolean;
}) {
return ( <div className="flex gap-3">
<label
className={`flex cursor-pointer items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${
          value === "Yes"
            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
            : "border-slate-300 bg-white text-slate-700"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
>
<input
type="radio"
name={name}
value="Yes"
checked={value === "Yes"}
disabled={disabled}
onChange={() => onChange("Yes")}
className="accent-indigo-600"
/>
Yes </label>


  <label
    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${
      value === "No"
        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
        : "border-slate-300 bg-white text-slate-700"
    } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
  >
    <input
      type="radio"
      name={name}
      value="No"
      checked={value === "No"}
      disabled={disabled}
      onChange={() => onChange("No")}
      className="accent-indigo-600"
    />
    No
  </label>
</div>


);
}

function MatrixBox({
title,
onAdd,
addLabel,
children,
disabled,
}: {
title: string;
onAdd: () => void;
addLabel: string;
children: React.ReactNode;
disabled?: boolean;
}) {
return ( <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4"> <div className="mb-4 flex items-center justify-between gap-3"> <h4 className="font-semibold text-slate-800">{title}</h4>


    {disabled ? null : (
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        <Plus size={15} />
        {addLabel}
      </button>
    )}
  </div>

  <div className="space-y-4">{children}</div>
</div>


);
}

function RowItem({
children,
onDelete,
disabled,
}: {
children: React.ReactNode;
onDelete: () => void;
disabled?: boolean;
}) {
return ( <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
{children}


  {!disabled && (
    <button
      type="button"
      onClick={onDelete}
      className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
    >
      <Trash2 size={14} />
      Remove
    </button>
  )}
</div>


);
}

function ValueWithUnsure({
id,
value,
unknown,
onValueChange,
onUnknownChange,
placeholder,
disabled = false,
}: {
id: string;
value: string;
unknown: boolean;
onValueChange: (value: string) => void;
onUnknownChange: (value: boolean) => void;
placeholder: string;
disabled?: boolean;
}) {
return ( <div>
<input
id={id}
type="number"
min={0}
value={unknown ? "" : value}
disabled={disabled || unknown}
placeholder={unknown ? "Value unknown" : placeholder}
onChange={(e) => onValueChange(e.target.value)}
className={inputClass}
/>


  <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">
    <input
      type="checkbox"
      checked={unknown}
      disabled={disabled}
      onChange={(e) => onUnknownChange(e.target.checked)}
      className="accent-indigo-600"
    />
    I&apos;m unsure of the value
  </label>
</div>


);
}

function TreatmentSelect({
id,
fields,
onChange,
label = "How should this asset be treated?",
options = treatmentOptions,
disabled = false,
}: {
id: string;
fields: TreatmentFields;
onChange: (fields: Partial<TreatmentFields>) => void;
label?: string;
options?: { value: string; label: string }[];
disabled?: boolean;
}) {
return ( <div className="space-y-3">
<label
htmlFor={`treatment-${id}`}
className="block text-sm font-semibold text-slate-800"
>
{label} </label>


  <select
    id={`treatment-${id}`}
    value={fields.treatment || ""}
    disabled={disabled}
    className={inputClass}
    onChange={(e) =>
      onChange({
        treatment: e.target.value,
        ...(e.target.value !== "Contribution"
          ? { contributionText: "" }
          : {}),
        ...(e.target.value !== "Percentage"
          ? { percentageValue: "" }
          : {}),
        ...(e.target.value !== "Custom" ? { customText: "" } : {}),
      })
    }
  >
    <option value="">Select treatment</option>

    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>

  {fields.treatment === "Contribution" && (
    <input
      type="text"
      value={fields.contributionText || ""}
      disabled={disabled}
      placeholder="Describe how the contribution should be calculated"
      className={inputClass}
      onChange={(e) =>
        onChange({
          contributionText: e.target.value,
        })
      }
    />
  )}

  {fields.treatment === "Percentage" && (
    <input
      type="number"
      min={0}
      max={100}
      value={fields.percentageValue || ""}
      disabled={disabled}
      placeholder="Percentage share"
      className={inputClass}
      onChange={(e) =>
        onChange({
          percentageValue: e.target.value,
        })
      }
    />
  )}

  {fields.treatment === "Custom" && (
    <textarea
      value={fields.customText || ""}
      disabled={disabled}
      placeholder="Describe the custom arrangement"
      className={textareaClass}
      onChange={(e) =>
        onChange({
          customText: e.target.value,
        })
      }
    />
  )}
</div>


);
}

function LivingArrangementRadio({
value,
onChange,
disabled,
}: {
value: LivingArrangement;
onChange: (value: LivingArrangement) => void;
disabled?: boolean;
}) {
return ( <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
{livingArrangementOptions.map((option) => {
const checked = value === option.value;


    return (
      <label
        key={option.value}
        className={`relative flex items-center gap-3 rounded-[10px] border px-4 py-3 transition ${
          checked
            ? "border-indigo-600 bg-slate-50"
            : "border-slate-300 bg-slate-50"
        } ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-indigo-600 hover:bg-white"
        }`}
      >
        <input
          type="radio"
          name="living_arrangement"
          value={option.value}
          checked={checked}
          disabled={disabled}
          onChange={() =>
            onChange(option.value as LivingArrangement)
          }
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
          className={`text-sm font-semibold ${
            checked ? "text-indigo-600" : "text-slate-900"
          }`}
        >
          {option.label}
        </span>
      </label>
    );
  })}
</div>


);
}

function InfoBanner({ children }: { children: React.ReactNode }) {
return ( <div className="mt-3 rounded-[10px] border border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
{children} </div>
);
}

export default function SharedAssetsForm({
data = {},
isEditing,
onChange,
}: Props) {
const updateRow = (
field: string,
id: string,
key: string,
value: any
) => {
const rows = Array.isArray(data?.[field]) ? data[field] : [];


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

const updateRowFields = (
field: string,
id: string,
fields: Partial<TreatmentFields>
) => {
const rows = Array.isArray(data?.[field]) ? data[field] : [];


onChange(
  field,
  rows.map((item: any) =>
    item.id === id
      ? {
          ...item,
          ...fields,
        }
      : item
  )
);


};

const addRow = (field: string, row: any) => {
onChange(field, [
...(Array.isArray(data?.[field]) ? data[field] : []),
row,
]);
};

const removeRow = (field: string, id: string) => {
const rows = Array.isArray(data?.[field]) ? data[field] : [];


onChange(
  field,
  rows.filter((item: any) => item.id !== id)
);


};

const setToggle = (
field: string,
rowsField: string,
value: YesNo,
factory: () => any
) => {
onChange(field, value);


if (value === "Yes") {
  const rows = Array.isArray(data?.[rowsField])
    ? data[rowsField]
    : [];

  if (rows.length === 0) {
    onChange(rowsField, [factory()]);
  }
} else {
  onChange(rowsField, []);
}


};

const livingArrangement =
(data?.livingArrangement || "") as LivingArrangement;

return ( <div className="space-y-8"> <div> <h2 className="text-xl font-bold text-slate-900">
Joint Assets </h2>


    <p className="mt-1 text-sm text-slate-500">
      Assets jointly owned by both partners.
    </p>
  </div>

  {/* CURRENT LIVING ARRANGEMENTS */}

  <div className="rounded-xl border border-slate-200 p-5">
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
        disabled={!isEditing}
        onChange={(value) =>
          onChange("livingArrangement", value)
        }
      />

      {livingArrangement === "Separate" && (
        <InfoBanner>
          💡 You currently live separately. Any future property
          arrangements can be outlined in your shared asset
          registers below.
        </InfoBanner>
      )}

      {livingArrangement === "Rent" && (
        <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <input
            type="text"
            placeholder="How long have you lived here together?"
            value={data?.rentDuration || ""}
            disabled={!isEditing}
            onChange={(e) =>
              onChange("rentDuration", e.target.value)
            }
            className={inputClass}
          />

          <input
            type="number"
            min={0}
            placeholder="Monthly Rent (£)"
            value={data?.monthlyRent || ""}
            disabled={!isEditing}
            onChange={(e) =>
              onChange("monthlyRent", e.target.value)
            }
            className={inputClass}
          />
        </div>
      )}

      {livingArrangement === "OneOwner" && (
        <InfoBanner>
          💡 You live in a home owned by one of you. Individual
          asset parameters are configuration details tracked
          separately inside Section 3.
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
          value={data?.thirdPartyDescription || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange(
              "thirdPartyDescription",
              e.target.value
            )
          }
          className={textareaClass + " mt-3"}
        />
      )}

      {livingArrangement === "Other" && (
        <textarea
          placeholder="Please describe your current living arrangements..."
          value={data?.otherDescription || ""}
          disabled={!isEditing}
          onChange={(e) =>
            onChange("otherDescription", e.target.value)
          }
          className={textareaClass + " mt-3"}
        />
      )}
    </div>
  </div>

  {/* SHARED PROPERTY & REAL ESTATE */}

  <div>
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
        value={(data?.hasSharedRealEstate || "No") as YesNo}
        disabled={!isEditing}
        onChange={(value) =>
          setToggle(
            "hasSharedRealEstate",
            "sharedRealEstate",
            value,
            makeSharedRealEstateRow
          )
        }
      />
    </div>

    {data?.hasSharedRealEstate === "Yes" && (
      <MatrixBox
        title="Shared Property Register"
        disabled={!isEditing}
        onAdd={() =>
          addRow(
            "sharedRealEstate",
            makeSharedRealEstateRow()
          )
        }
        addLabel="Add Shared Property"
      >
        {(data?.sharedRealEstate || []).map(
          (row: SharedRealEstateRow) => (
            <RowItem
              key={row.id}
              disabled={!isEditing}
              onDelete={() =>
                removeRow("sharedRealEstate", row.id)
              }
            >
              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={row.addressLine1 || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedRealEstate",
                      row.id,
                      "addressLine1",
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={row.addressLine2 || ""}
                  disabled={!isEditing}
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedRealEstate",
                      row.id,
                      "addressLine2",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Postcode"
                  value={row.postcode || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedRealEstate",
                      row.id,
                      "postcode",
                      e.target.value
                    )
                  }
                />

                <select
                  value={row.propertyType || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedRealEstate",
                      row.id,
                      "propertyType",
                      e.target.value
                    )
                  }
                >
                  <option value="">Property Type</option>
                  <option value="House">House</option>
                  <option value="Flat">Flat</option>
                  <option value="Commercial">
                    Commercial
                  </option>
                </select>

                <ValueWithUnsure
                  id={`real-estate-value-${row.id}`}
                  value={row.value || ""}
                  unknown={!!row.valueUnknown}
                  disabled={!isEditing}
                  placeholder="Value (GBP)"
                  onValueChange={(value) =>
                    updateRow(
                      "sharedRealEstate",
                      row.id,
                      "value",
                      value
                    )
                  }
                  onUnknownChange={(value) =>
                    updateRow(
                      "sharedRealEstate",
                      row.id,
                      "valueUnknown",
                      value
                    )
                  }
                />
              </div>

              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                <input
                  type="number"
                  placeholder="Mortgage Balance"
                  value={row.mortgageBalance || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedRealEstate",
                      row.id,
                      "mortgageBalance",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Early Penalty Charges (£)"
                  value={row.earlyPenalty || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedRealEstate",
                      row.id,
                      "earlyPenalty",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="Ownership Percentage (%)"
                  value={row.ownershipPercentage || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedRealEstate",
                      row.id,
                      "ownershipPercentage",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="mb-3.5">
                <select
                  value={row.thirdPartyInterest || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedRealEstate",
                      row.id,
                      "thirdPartyInterest",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Third-Party Interest?
                  </option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {row.thirdPartyInterest === "Yes" && (
                <textarea
                  placeholder="Specify who holds the interest (e.g. parent loan) and if a written agreement exists."
                  value={row.thirdPartyDetail || ""}
                  disabled={!isEditing}
                  className={textareaClass + " mb-3.5"}
                  onChange={(e) =>
                    updateRow(
                      "sharedRealEstate",
                      row.id,
                      "thirdPartyDetail",
                      e.target.value
                    )
                  }
                />
              )}

              <TreatmentSelect
                id={row.id}
                fields={row}
                disabled={!isEditing}
                onChange={(fields) =>
                  updateRowFields(
                    "sharedRealEstate",
                    row.id,
                    fields
                  )
                }
                label="How should this property be treated?"
              />
            </RowItem>
          )
        )}
      </MatrixBox>
    )}
  </div>

  {/* SHARED SAVINGS & INVESTMENTS */}

  <div>
    <PartHeader tooltip="Declare any bank accounts, savings, investments or other financial accounts that you own jointly with your partner.">
      Shared Savings & Investments
    </PartHeader>

    <div className="mb-4">
      <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
        Do you jointly hold any bank accounts, savings, investments
        or other financial accounts together?
      </label>

      <YesNoToggle
        name="has_shared_savings"
        value={(data?.hasSharedSavings || "No") as YesNo}
        disabled={!isEditing}
        onChange={(value) =>
          setToggle(
            "hasSharedSavings",
            "sharedSavings",
            value,
            makeSharedSavingsRow
          )
        }
      />
    </div>

    {data?.hasSharedSavings === "Yes" && (
      <MatrixBox
        title="Shared Savings & Investments"
        disabled={!isEditing}
        onAdd={() =>
          addRow("sharedSavings", makeSharedSavingsRow())
        }
        addLabel="Add Savings / Investments"
      >
        {(data?.sharedSavings || []).map(
          (row: SharedSavingsRow) => (
            <RowItem
              key={row.id}
              disabled={!isEditing}
              onDelete={() =>
                removeRow("sharedSavings", row.id)
              }
            >
              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1fr_1.5fr]">
                <select
                  value={row.accountHolder || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedSavings",
                      row.id,
                      "accountHolder",
                      e.target.value
                    )
                  }
                >
                  <option value="">Account Holder</option>
                  <option value="Partner1">Partner 1</option>
                  <option value="Partner2">Partner 2</option>
                  <option value="Joint">Joint</option>
                </select>

                <input
                  type="text"
                  placeholder="Institution / Bank Name"
                  value={row.institution || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedSavings",
                      row.id,
                      "institution",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr]">
                <select
                  value={row.accountType || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedSavings",
                      row.id,
                      "accountType",
                      e.target.value
                    )
                  }
                >
                  <option value="">Account Type</option>
                  <option value="Current">
                    Current Account
                  </option>
                  <option value="Savings">
                    Savings Account
                  </option>
                  <option value="ISA">ISA</option>
                  <option value="Investment">
                    Investment Portfolio
                  </option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="number"
                  placeholder="Valuation Balance (GBP)"
                  value={row.balance || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedSavings",
                      row.id,
                      "balance",
                      e.target.value
                    )
                  }
                />
              </div>

              <TreatmentSelect
                id={row.id}
                fields={row}
                disabled={!isEditing}
                onChange={(fields) =>
                  updateRowFields(
                    "sharedSavings",
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

  {/* SHARED BUSINESS INTERESTS */}

  <div>
    <PartHeader tooltip="Declare any businesses, companies or partnerships that you and your partner jointly own or operate.">
      Shared Business Interests
    </PartHeader>

    <div className="mb-4">
      <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
        Do you jointly own or operate a business together?
      </label>

      <YesNoToggle
        name="has_shared_businesses"
        value={(data?.hasSharedBusinesses || "No") as YesNo}
        disabled={!isEditing}
        onChange={(value) =>
          setToggle(
            "hasSharedBusinesses",
            "sharedBusinesses",
            value,
            makeSharedBusinessRow
          )
        }
      />
    </div>

    {data?.hasSharedBusinesses === "Yes" && (
      <MatrixBox
        title="Shared Business Interests"
        disabled={!isEditing}
        onAdd={() =>
          addRow(
            "sharedBusinesses",
            makeSharedBusinessRow()
          )
        }
        addLabel="Add Business"
      >
        {(data?.sharedBusinesses || []).map(
          (row: SharedBusinessRow) => (
            <RowItem
              key={row.id}
              disabled={!isEditing}
              onDelete={() =>
                removeRow("sharedBusinesses", row.id)
              }
            >
              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr]">
                <input
                  type="text"
                  placeholder="Registered Business Name"
                  value={row.name || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedBusinesses",
                      row.id,
                      "name",
                      e.target.value
                    )
                  }
                />

                <select
                  value={row.entityType || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedBusinesses",
                      row.id,
                      "entityType",
                      e.target.value
                    )
                  }
                >
                  <option value="">Entity Structure</option>
                  <option value="Ltd">
                    Limited Company (Ltd)
                  </option>
                  <option value="LLP">LLP</option>
                  <option value="Sole">Sole Trader</option>
                  <option value="Partnership">
                    Partnership
                  </option>
                </select>
              </div>

              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                <input
                  type="number"
                  placeholder="Last Year Turnover (£)"
                  value={row.turnover || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedBusinesses",
                      row.id,
                      "turnover",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Last Year Net Profit (£)"
                  value={row.netProfit || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedBusinesses",
                      row.id,
                      "netProfit",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="Your Ownership %"
                  value={row.ownershipPercent || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedBusinesses",
                      row.id,
                      "ownershipPercent",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <ValueWithUnsure
                  id={`business-value-${row.id}`}
                  value={row.valueOfStake || ""}
                  unknown={!!row.valueUnknown}
                  disabled={!isEditing}
                  placeholder="Value of Joint Stake (£)"
                  onValueChange={(value) =>
                    updateRow(
                      "sharedBusinesses",
                      row.id,
                      "valueOfStake",
                      value
                    )
                  }
                  onUnknownChange={(value) =>
                    updateRow(
                      "sharedBusinesses",
                      row.id,
                      "valueUnknown",
                      value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder={
                    row.valueUnknown
                      ? "Not required (Value unknown)"
                      : "Valuation Justification"
                  }
                  value={
                    row.valueUnknown
                      ? ""
                      : row.justification || ""
                  }
                  disabled={!isEditing || row.valueUnknown}
                  required={!row.valueUnknown}
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedBusinesses",
                      row.id,
                      "justification",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="mb-3.5">
                <input
                  type="number"
                  placeholder="Director Loan A/C Balance (£)"
                  value={row.directorLoanBalance || ""}
                  disabled={!isEditing}
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedBusinesses",
                      row.id,
                      "directorLoanBalance",
                      e.target.value
                    )
                  }
                />
              </div>

              <TreatmentSelect
                id={row.id}
                fields={row}
                disabled={!isEditing}
                onChange={(fields) =>
                  updateRowFields(
                    "sharedBusinesses",
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

  {/* SHARED INTELLECTUAL PROPERTY */}

  <div>
    <PartHeader tooltip="Declare any intellectual property that you and your partner jointly own, such as patents, trademarks, copyrights, software, websites or licensing rights.">
      Shared Intellectual Property
    </PartHeader>

    <div className="mb-4">
      <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
        Do you jointly own any intellectual property or licensing
        rights with your partner?
      </label>

      <YesNoToggle
        name="has_shared_ip"
        value={(data?.hasSharedIP || "No") as YesNo}
        disabled={!isEditing}
        onChange={(value) =>
          setToggle(
            "hasSharedIP",
            "sharedIP",
            value,
            makeSharedIPRow
          )
        }
      />
    </div>

    {data?.hasSharedIP === "Yes" && (
      <MatrixBox
        title="Shared Intellectual Property Register"
        disabled={!isEditing}
        onAdd={() =>
          addRow("sharedIP", makeSharedIPRow())
        }
        addLabel="Add Intellectual Property Asset"
      >
        {(data?.sharedIP || []).map(
          (row: SharedIPRow) => (
            <RowItem
              key={row.id}
              disabled={!isEditing}
              onDelete={() =>
                removeRow("sharedIP", row.id)
              }
            >
              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[1.5fr_1fr]">
                <input
                  type="text"
                  placeholder="Intellectual Property Name"
                  value={row.name || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedIP",
                      row.id,
                      "name",
                      e.target.value
                    )
                  }
                />

                <select
                  value={row.ipType || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedIP",
                      row.id,
                      "ipType",
                      e.target.value
                    )
                  }
                >
                  <option value="">IP Type</option>
                  <option value="Patent">Patent</option>
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
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <ValueWithUnsure
                  id={`ip-value-${row.id}`}
                  value={row.value || ""}
                  unknown={!!row.valueUnknown}
                  disabled={!isEditing}
                  placeholder="Estimated Valuation (£)"
                  onValueChange={(value) =>
                    updateRow(
                      "sharedIP",
                      row.id,
                      "value",
                      value
                    )
                  }
                  onUnknownChange={(value) =>
                    updateRow(
                      "sharedIP",
                      row.id,
                      "valueUnknown",
                      value
                    )
                  }
                />

                <input
                  type="text"
                  placeholder="Registration Number (Optional)"
                  value={row.registrationNumber || ""}
                  disabled={!isEditing}
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedIP",
                      row.id,
                      "registrationNumber",
                      e.target.value
                    )
                  }
                />
              </div>

              <textarea
                placeholder="Brief description (optional)"
                value={row.description || ""}
                disabled={!isEditing}
                className={textareaClass + " mb-3.5"}
                onChange={(e) =>
                  updateRow(
                    "sharedIP",
                    row.id,
                    "description",
                    e.target.value
                  )
                }
              />

              <TreatmentSelect
                id={row.id}
                fields={row}
                disabled={!isEditing}
                onChange={(fields) =>
                  updateRowFields(
                    "sharedIP",
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

  {/* SHARED HIGH-VALUE BELONGINGS */}

  <div>
    <PartHeader tooltip="Personal property items valued individually over £5,000.">
      Shared High-Value Personal Belongings
    </PartHeader>

    <div className="mb-4">
      <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
        Do you jointly own any high-value personal belongings valued
        at more than £5,000, such as vehicles, jewellery, artwork or
        cryptocurrency?
      </label>

      <YesNoToggle
        name="has_shared_chattels"
        value={(data?.hasSharedChattels || "No") as YesNo}
        disabled={!isEditing}
        onChange={(value) =>
          setToggle(
            "hasSharedChattels",
            "sharedChattels",
            value,
            makeSharedChattelRow
          )
        }
      />
    </div>

    {data?.hasSharedChattels === "Yes" && (
      <MatrixBox
        title="Shared High-Value Belongings / Chattels"
        disabled={!isEditing}
        onAdd={() =>
          addRow(
            "sharedChattels",
            makeSharedChattelRow()
          )
        }
        addLabel="Add Asset Entry"
      >
        {(data?.sharedChattels || []).map(
          (row: SharedChattelRow) => (
            <RowItem
              key={row.id}
              disabled={!isEditing}
              onDelete={() =>
                removeRow("sharedChattels", row.id)
              }
            >
              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1.5fr_1fr]">
                <input
                  type="text"
                  placeholder="Asset Description / Name"
                  value={row.description || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedChattels",
                      row.id,
                      "description",
                      e.target.value
                    )
                  }
                />

                <select
                  value={row.category || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedChattels",
                      row.id,
                      "category",
                      e.target.value
                    )
                  }
                >
                  <option value="">Asset Category</option>
                  <option value="Vehicles">
                    Motor Vehicles
                  </option>
                  <option value="Luxury">
                    Luxury Items
                  </option>
                  <option value="Art">
                    Fine Art & Collectibles
                  </option>
                  <option value="Digital">
                    Digital Assets
                  </option>
                  <option value="Other">
                    Other Physical Property
                  </option>
                </select>

                <ValueWithUnsure
                  id={`chattel-value-${row.id}`}
                  value={row.value || ""}
                  unknown={!!row.valueUnknown}
                  disabled={!isEditing}
                  placeholder="Value (GBP)"
                  onValueChange={(value) =>
                    updateRow(
                      "sharedChattels",
                      row.id,
                      "value",
                      value
                    )
                  }
                  onUnknownChange={(value) =>
                    updateRow(
                      "sharedChattels",
                      row.id,
                      "valueUnknown",
                      value
                    )
                  }
                />
              </div>

              <TreatmentSelect
                id={row.id}
                fields={row}
                disabled={!isEditing}
                onChange={(fields) =>
                  updateRowFields(
                    "sharedChattels",
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

  {/* OTHER SHARED ASSETS */}

  <div>
    <PartHeader tooltip="Declare any other joint assets, inheritances, trust interests, or shared financial rights not covered above.">
      Other Shared Assets
    </PartHeader>

    <div className="mb-4">
      <label className="mb-2 block text-[0.95rem] font-semibold text-slate-800">
        Have we missed anything? Do you and your partner jointly own
        or expect to receive any other joint assets, financial
        interests, or shared property that have not been listed
        above?
      </label>

      <YesNoToggle
        name="has_shared_other_assets"
        value={
          (data?.hasSharedOtherAssets || "No") as YesNo
        }
        disabled={!isEditing}
        onChange={(value) =>
          setToggle(
            "hasSharedOtherAssets",
            "sharedOtherAssets",
            value,
            makeSharedOtherAssetRow
          )
        }
      />
    </div>

    {data?.hasSharedOtherAssets === "Yes" && (
      <MatrixBox
        title="Other Shared Assets Registry"
        disabled={!isEditing}
        onAdd={() =>
          addRow(
            "sharedOtherAssets",
            makeSharedOtherAssetRow()
          )
        }
        addLabel="Add Other Shared Asset"
      >
        {(data?.sharedOtherAssets || []).map(
          (row: SharedOtherAssetRow) => (
            <RowItem
              key={row.id}
              disabled={!isEditing}
              onDelete={() =>
                removeRow(
                  "sharedOtherAssets",
                  row.id
                )
              }
            >
              <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr]">
                <input
                  type="text"
                  placeholder="Shared Asset Description (e.g. Joint Art Collection, Joint Foreign Asset)"
                  value={row.description || ""}
                  disabled={!isEditing}
                  required
                  className={inputClass}
                  onChange={(e) =>
                    updateRow(
                      "sharedOtherAssets",
                      row.id,
                      "description",
                      e.target.value
                    )
                  }
                />

                <ValueWithUnsure
                  id={`other-value-${row.id}`}
                  value={row.value || ""}
                  unknown={!!row.valueUnknown}
                  disabled={!isEditing}
                  placeholder="Estimated Value (GBP)"
                  onValueChange={(value) =>
                    updateRow(
                      "sharedOtherAssets",
                      row.id,
                      "value",
                      value
                    )
                  }
                  onUnknownChange={(value) =>
                    updateRow(
                      "sharedOtherAssets",
                      row.id,
                      "valueUnknown",
                      value
                    )
                  }
                />
              </div>

              <TreatmentSelect
                id={row.id}
                fields={row}
                disabled={!isEditing}
                onChange={(fields) =>
                  updateRowFields(
                    "sharedOtherAssets",
                    row.id,
                    fields
                  )
                }
                label="How should this shared asset be treated?"
              />
            </RowItem>
          )
        )}
      </MatrixBox>
    )}
  </div>
</div>


);
}

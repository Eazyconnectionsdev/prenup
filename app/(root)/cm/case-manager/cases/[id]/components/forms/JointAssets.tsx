"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function IndividualAssets({
  data = {},
  isEditing,
  onChange,
}: Props) {

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm";

  const addRow = (
    field: string,
    row: any
  ) => {
    onChange(field, [
      ...(data[field] || []),
      row,
    ]);
  };

  const removeRow = (
    field: string,
    id: string
  ) => {
    onChange(
      field,
      data[field].filter(
        (item: any) =>
          item.id !== id
      )
    );
  };

  const updateRow = (
    field: string,
    id: string,
    key: string,
    value: any
  ) => {
    onChange(
      field,
      data[field].map((item: any) =>
        item.id === id
          ? {
              ...item,
              value,
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-xl font-bold">
          Joint Assets
        </h2>

        <p className="text-sm text-slate-500">
          Assets jointly owned by both
          partners.
        </p>
      </div>

      {/* LIVING ARRANGEMENT */}

      <div className="border rounded-xl p-5">

        <h3 className="font-semibold mb-4">
          Living Arrangement
        </h3>

        <select
          value={
            data?.livingArrangement || ""
          }
          disabled={!isEditing}
          className={inputClass}
          onChange={(e) =>
            onChange(
              "livingArrangement",
              e.target.value
            )
          }
        >
          <option value="">
            Select
          </option>

          <option value="Separate">
            Separate Homes
          </option>

          <option value="Rent">
            Renting Together
          </option>

          <option value="OneOwner">
            One Partner Owns Home
          </option>

          <option value="Joint">
            Joint Owners
          </option>

          <option value="ThirdParty">
            Living With Third Party
          </option> 

          <option value="Other">
            Other
          </option>
        </select>

        {data?.livingArrangement ===
          "Rent" && (
          <div className="grid md:grid-cols-2 gap-4 mt-4">

            <input
              className={inputClass}
              value={
                data?.rentDuration || ""
              }
              disabled={!isEditing}
              placeholder="Rent Duration"
              onChange={(e) =>
                onChange(
                  "rentDuration",
                  e.target.value
                )
              }
            />

            <input
              className={inputClass}
              value={
                data?.monthlyRent || ""
              }
              disabled={!isEditing}
              placeholder="Monthly Rent"
              onChange={(e) =>
                onChange(
                  "monthlyRent",
                  e.target.value
                )
              }
            />

          </div>
        )}

      </div>

      {/* SHARED SAVINGS */}

      <AssetGroup
        title="Shared Savings"
       enabled={data?.hasRealEstate}
        onToggle={(v:string) =>
          onChange(
            "hasSharedSavings",
            v
          )
        }
      >
        {(data?.sharedSavings || []).map(
          (row: any) => (
            <div
              key={row.id}
              className="border rounded-lg p-4"
            >
              <div className="grid md:grid-cols-4 gap-3">

                <input
                  className={inputClass}
                  value={
                    row.accountHolder
                  }
                  disabled={!isEditing}
                  placeholder="Account Holder"
                  onChange={(e) =>
                    updateRow(
                      "sharedSavings",
                      row.id,
                      "accountHolder",
                      e.target.value
                    )
                  }
                />

                <input
                  className={inputClass}
                  value={
                    row.institution
                  }
                  disabled={!isEditing}
                  placeholder="Institution"
                  onChange={(e) =>
                    updateRow(
                      "sharedSavings",
                      row.id,
                      "institution",
                      e.target.value
                    )
                  }
                />

                <input
                  className={inputClass}
                  value={
                    row.accountType
                  }
                  disabled={!isEditing}
                  placeholder="Account Type"
                  onChange={(e) =>
                    updateRow(
                      "sharedSavings",
                      row.id,
                      "accountType",
                      e.target.value
                    )
                  }
                />

                <input
                  className={inputClass}
                  value={row.balance}
                  disabled={!isEditing}
                  placeholder="Balance"
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

              {isEditing && (
                <button
                  type="button"
                  onClick={() =>
                    removeRow(
                      "sharedSavings",
                      row.id
                    )
                  }
                  className="text-red-600 mt-3 flex gap-2"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>
          )
        )}

        {isEditing && (
          <button
            type="button"
            onClick={() =>
              addRow(
                "sharedSavings",
                {
                  id: Date.now().toString(),
                  accountHolder: "",
                  institution: "",
                  accountType: "",
                  balance: "",
                }
              )
            }
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={14} />
            Add Shared Saving
          </button>
        )}
      </AssetGroup>

      {/* SHARED BUSINESSES */}

      <AssetGroup
        title="Shared Businesses"
        enabled={
          data?.hasSharedBusinesses
        }
        onToggle={(v:string) =>
          onChange(
            "hasSharedBusinesses",
            v
          )
        }
      >
        {(data?.sharedBusinesses ||
          []).map((row: any) => (
          <div
            key={row.id}
            className="border rounded-lg p-4"
          >
            <div className="grid md:grid-cols-2 gap-3">

              <input
                className={inputClass}
                value={row.name}
                disabled={!isEditing}
                placeholder="Business Name"
                onChange={(e) =>
                  updateRow(
                    "sharedBusinesses",
                    row.id,
                    "name",
                    e.target.value
                  )
                }
              />

              <input
                className={inputClass}
                value={
                  row.entityType
                }
                disabled={!isEditing}
                placeholder="Entity Type"
                onChange={(e) =>
                  updateRow(
                    "sharedBusinesses",
                    row.id,
                    "entityType",
                    e.target.value
                  )
                }
              />

            </div>
          </div>
        ))}
      </AssetGroup>

      {/* SHARED REAL ESTATE */}

      <AssetGroup
        title="Shared Real Estate"
        enabled={
          data?.hasSharedRealEstate
        }
        onToggle={(v:string) =>
          onChange(
            "hasSharedRealEstate",
            v
          )
        }
      >
        <pre className="bg-slate-50 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(
            data?.sharedRealEstate ||
              [],
            null,
            2
          )}
        </pre>
      </AssetGroup>

      {/* SHARED IP */}

      <AssetGroup
        title="Shared Intellectual Property"
        enabled={data?.hasSharedIP}
        onToggle={(v:string) =>
          onChange("hasSharedIP", v)
        }
      >
        <pre className="bg-slate-50 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(
            data?.sharedIP || [],
            null,
            2
          )}
        </pre>
      </AssetGroup>

      {/* SHARED CHATTELS */}

      <AssetGroup
        title="Shared Chattels"
        enabled={
          data?.hasSharedChattels
        }
        onToggle={(v:string) =>
          onChange(
            "hasSharedChattels",
            v
          )
        }
      >
        <pre className="bg-slate-50 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(
            data?.sharedChattels ||
              [],
            null,
            2
          )}
        </pre>
      </AssetGroup>

      {/* OTHER */}

      <AssetGroup
        title="Other Shared Assets"
        enabled={
          data?.hasSharedOtherAssets
        }
        onToggle={(v:string) =>
          onChange(
            "hasSharedOtherAssets",
            v
          )
        }
      >
        <pre className="bg-slate-50 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(
            data?.sharedOtherAssets ||
              [],
            null,
            2
          )}
        </pre>
      </AssetGroup>

    </div>
  );
}

function AssetGroup({
  title,
  enabled,
  onToggle,
  children,
}: any) {
  return (
    <div className="border rounded-xl p-5">

      <div className="flex justify-between items-center mb-4">

        <h3 className="font-semibold">
          {title}
        </h3>

        <select
          value={enabled || "No"}
          onChange={(e) =>
            onToggle(
              e.target.value
            )
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="Yes">
            Yes
          </option>

          <option value="No">
            No
          </option>
        </select>

      </div>

      {enabled === "Yes" &&
        children}
    </div>
  );
}
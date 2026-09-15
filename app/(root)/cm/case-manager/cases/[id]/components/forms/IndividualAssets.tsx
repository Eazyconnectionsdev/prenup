"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function IndividualAssets({
  data,
  isEditing,
  onChange,
}: Props) {
  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";

  const addRow = (
    field: string,
    row: any
  ) => {
    onChange(field, [...(data[field] || []), row]);
  };

  const removeRow = (
    field: string,
    id: string
  ) => {
    onChange(
      field,
      data[field].filter(
        (item: any) => item.id !== id
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
          ? { ...item, value }
          : item
      )
    );
  };


  


  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-xl font-bold">
          Individual Assets
        </h2>

        <p className="text-sm text-slate-500">
          Assets owned personally by this
          individual.
        </p>
      </div>

      {/* REAL ESTATE */}

      <AssetSection
        title="Real Estate"
        enabled={data?.hasRealEstate}
        onEnabledChange={(v:string) =>
          onChange("hasRealEstate", v)
        }
      >
        {(data?.realEstate || []).map(
          (property: any) => (
            <div
              key={property.id}
              className="border rounded-lg p-4"
            >
              <div className="grid md:grid-cols-2 gap-3">

                <input
                  className={inputClass}
                  value={
                    property.addressLine1
                  }
                  placeholder="Address"
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateRow(
                      "realEstate",
                      property.id,
                      "addressLine1",
                      e.target.value
                    )
                  }
                />

                <input
                  className={inputClass}
                  value={
                    property.postcode
                  }
                  placeholder="Postcode"
                  disabled={!isEditing}
                  onChange={(e) =>
                    updateRow(
                      "realEstate",
                      property.id,
                      "postcode",
                      e.target.value
                    )
                  }
                />

              </div>

              <button
                onClick={() =>
                  removeRow(
                    "realEstate",
                    property.id
                  )
                }
                className="mt-3 text-red-600 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          )
        )}

        {isEditing && (
          <button
            onClick={() =>
              addRow("realEstate", {
                id: Date.now().toString(),
                addressLine1: "",
                postcode: "",
                propertyType: "",
              })
            }
            className="bg-indigo-600 text-white px-3 py-2 rounded-lg flex gap-2"
          >
            <Plus size={14} />
            Add Property
          </button>
        )}
      </AssetSection>

      {/* SAVINGS */}

      <AssetSection
        title="Savings & Investments"
        enabled={data?.hasSavings}
        onEnabledChange={(v:string) =>
          onChange("hasSavings", v)
        }
      >
        {(data?.savings || []).map(
          (account: any) => (
            <div
              key={account.id}
              className="border rounded-lg p-4"
            >
              <input
                className={inputClass}
                value={
                  account.institution
                }
                placeholder="Institution"
                disabled={!isEditing}
                onChange={(e) =>
                  updateRow(
                    "savings",
                    account.id,
                    "institution",
                    e.target.value
                  )
                }
              />
            </div>
          )
        )}
      </AssetSection>

      {/* PENSIONS */}

      <AssetSection
        title="Pensions"
        enabled={data?.hasPensions}
        onEnabledChange={(v:string) =>
          onChange("hasPensions", v)
        }
      >
        {(data?.pensions || []).map(
          (item: any) => (
            <div
              key={item.id}
              className="border rounded-lg p-4"
            >
              <input
                className={inputClass}
                value={item.provider}
                placeholder="Provider"
                disabled={!isEditing}
                onChange={(e) =>
                  updateRow(
                    "pensions",
                    item.id,
                    "provider",
                    e.target.value
                  )
                }
              />
            </div>
          )
        )}
      </AssetSection>

      {/* BUSINESSES */}

      <AssetSection
        title="Businesses"
        enabled={data?.hasBusinesses}
        onEnabledChange={(v:string) =>
          onChange("hasBusinesses", v)
        }
      >
        {(data?.businesses || []).map(
          (business: any) => (
            <div
              key={business.id}
              className="border rounded-lg p-4"
            >
              <input
                className={inputClass}
                value={business.name}
                placeholder="Business Name"
                disabled={!isEditing}
                onChange={(e) =>
                  updateRow(
                    "businesses",
                    business.id,
                    "name",
                    e.target.value
                  )
                }
              />
            </div>
          )
        )}
      </AssetSection>

      {/* IP */}

      <AssetSection
        title="Intellectual Property"
        enabled={data?.hasIP}
        onEnabledChange={(v:string) =>
          onChange("hasIP", v)
        }
      >
        {(data?.ipAssets || []).map(
          (ip: any) => (
            <div
              key={ip.id}
              className="border rounded-lg p-4"
            >
              <input
                className={inputClass}
                value={ip.name}
                placeholder="IP Name"
                disabled={!isEditing}
                onChange={(e) =>
                  updateRow(
                    "ipAssets",
                    ip.id,
                    "name",
                    e.target.value
                  )
                }
              />
            </div>
          )
        )}
      </AssetSection>

      {/* CHATTELS */}

      <AssetSection
        title="High Value Chattels"
        enabled={data?.hasChattels}
        onEnabledChange={(v:string) =>
          onChange("hasChattels", v)
        }
      >
        {(data?.chattels || []).map(
          (item: any) => (
            <div
              key={item.id}
              className="border rounded-lg p-4"
            >
              <input
                className={inputClass}
                value={
                  item.description
                }
                placeholder="Description"
                disabled={!isEditing}
                onChange={(e) =>
                  updateRow(
                    "chattels",
                    item.id,
                    "description",
                    e.target.value
                  )
                }
              />
            </div>
          )
        )}
      </AssetSection>

      {/* OTHER ASSETS */}

      <AssetSection
        title="Other Assets"
        enabled={data?.hasOtherAssets}
        onEnabledChange={(v:string) =>
          onChange("hasOtherAssets", v)
        }
      >
        {(data?.otherAssets || []).map(
          (asset: any) => (
            <div
              key={asset.id}
              className="border rounded-lg p-4"
            >
              <input
                className={inputClass}
                value={
                  asset.description
                }
                placeholder="Description"
                disabled={!isEditing}
                onChange={(e) =>
                  updateRow(
                    "otherAssets",
                    asset.id,
                    "description",
                    e.target.value
                  )
                }
              />
            </div>
          )
        )}
      </AssetSection>

    </div>
  );
}

function AssetSection({
  title,
  enabled,
  onEnabledChange,
  children,
}: any) {
  return (
    <div className="border rounded-xl p-5">

      <div className="flex justify-between items-center mb-4">

        <h3 className="font-semibold">
          {title}
        </h3>

        <select
          className="border rounded-lg px-3 py-1"
          value={enabled || "No"}
          onChange={(e) =>
            onEnabledChange(
              e.target.value
            )
          }
        >
          <option value="Yes">
            Yes
          </option>

          <option value="No">
            No
          </option>
        </select>
      </div>

      {enabled === "Yes" && children}
    </div>
  );
}
"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React from "react";

type Property = {
  houseNumber: string;
  street: string;
  city: string;
  postcode: string;
  value: string;
  outstandingMortgage: string;
  monthlyMortgage: string;
};

const SepratePropertyModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [properties, setProperties] = React.useState<Property[]>([
    {
      houseNumber: "",
      street: "",
      city: "",
      postcode: "",
      value: "",
      outstandingMortgage: "",
      monthlyMortgage: "",
    },
  ]);

  const handleChange = (
    index: number,
    field: keyof Property,
    value: string
  ) => {
    const updated = [...properties];
    updated[index][field] = value;
    setProperties(updated);
  };

  const addNewEntry = () => {
    setProperties([
      ...properties,
      {
        houseNumber: "",
        street: "",
        city: "",
        postcode: "",
        value: "",
        outstandingMortgage: "",
        monthlyMortgage: "",
      },
    ]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogTitle />
      <DialogContent className="min-w-[820px] w-full max-h-[550px] overflow-y-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="w-full space-y-10">
          {/* Question 1 */}

          {/* Dynamic Property Entries */}
          {properties.map((property, index) => (
            <div key={index} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="House number"
                  value={property.houseNumber}
                  onChange={(e) =>
                    handleChange(index, "houseNumber", e.target.value)
                  }
                  className="rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-gray-200 outline-none"
                />

                <input
                  placeholder="Street name"
                  value={property.street}
                  onChange={(e) =>
                    handleChange(index, "street", e.target.value)
                  }
                  className="rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-gray-200 outline-none"
                />

                <input
                  placeholder="Town / City"
                  value={property.city}
                  onChange={(e) =>
                    handleChange(index, "city", e.target.value)
                  }
                  className="rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-gray-200 outline-none"
                />

                <input
                  placeholder="Postcode"
                  value={property.postcode}
                  onChange={(e) =>
                    handleChange(index, "postcode", e.target.value)
                  }
                  className="rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-gray-200 outline-none"
                />

                <input
                  placeholder="Property value (£)"
                  value={property.value}
                  onChange={(e) =>
                    handleChange(index, "value", e.target.value)
                  }
                  className="rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-gray-200 outline-none"
                />

                <input
                  placeholder="Outstanding mortgage (£)"
                  value={property.outstandingMortgage}
                  onChange={(e) =>
                    handleChange(index, "outstandingMortgage", e.target.value)
                  }
                  className="rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-gray-200 outline-none"
                />

                <input
                  placeholder="Monthly mortgage (£)"
                  value={property.monthlyMortgage}
                  onChange={(e) =>
                    handleChange(index, "monthlyMortgage", e.target.value)
                  }
                  className="rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-gray-200 outline-none"
                />
              </div>

              {index !== properties.length - 1 && (
                <hr className="border-gray-200 mt-4" />
              )}
            </div>
          ))}

          {/* Add Entry Button */}
          <div
            onClick={addNewEntry}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900"
          >
            <div className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">
              +
            </div>
            Add New Entry
          </div>

          {/* Debug / Optional */}
          {/* <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto">
            {JSON.stringify(properties, null, 2)}
          </pre> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SepratePropertyModal;

"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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

const SepratePropertyModal = ({ open, onClose }: any) => {
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle />
      <DialogContent className=" min-w-[820px] w-full max-h-[600px] overflow-y-auto overflow-x-hidden scrollbar-hide bg-white rounded-3xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-10">
        <div className="w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-medium text-text-color">
              Property Details
            </h1>
            <p className="text-base font-light text-gray-500">
              Add properties you’d like to keep separate
            </p>
          </div>

          {/* Property Cards */}
          {properties.map((property, index) => (
            <div
              key={index}
              className="
            bg-white border border-gray-100 rounded-2xl
            shadow-sm p-4 space-y-5
          "
            >
              {/* Title */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-normal text-text-color">
                  Property {index + 1}
                </h2>
                {index > 0 && (
                  <span className="text-xs text-gray-400">
                    Additional Entry
                  </span>
                )}
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-5">
                {[
                  { placeholder: "House number", key: "houseNumber" },
                  { placeholder: "Street name", key: "street" },
                  { placeholder: "Town / City", key: "city" },
                  { placeholder: "Postcode", key: "postcode" },
                  { placeholder: "Property value (£)", key: "value" },
                  {
                    placeholder: "Outstanding mortgage (£)",
                    key: "outstandingMortgage",
                  },
                  {
                    placeholder: "Monthly mortgage (£)",
                    key: "monthlyMortgage",
                  },
                ].map((field) => (
                  <Input
                    key={field.key}
                    placeholder={field.placeholder}
                    value={(property as any)[field.key]}
                    onChange={(e) =>
                      handleChange(
                        index,
                        field.key as keyof Property,
                        e.target.value
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Add Entry Button */}
          <div className="pt-2">
            <button
              onClick={addNewEntry}
              className="bg-gradient-to-r from-secondary to-primary-foreground flex gap-3 items-center text-text-color font- px-8 shadow-md py-2 rounded-full  cursor-pointer"
            >
              <div
                className="
            w-6 h-6 rounded-full bg-gray-900 text-white
            flex items-center justify-center text-base
            shadow-sm
          "
              >
                <Plus className="w-4 h-4" />
              </div>
              Add another property
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SepratePropertyModal;

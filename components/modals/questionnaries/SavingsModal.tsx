"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import React from "react";

type Entry = {
  name: string;
  amount: string;
};

const defaultEntry: Entry = {
  name: "",
  amount: "",
};

const SavingsModal = ({ open, onClose }: any) => {
  const [entries, setEntries] = React.useState<Entry[]>([defaultEntry]);

  const handleChange = (index: number, field: keyof Entry, value: string) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([...entries, { ...defaultEntry }]);
  };

  const removeEntry = (index: number) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle />

      <DialogContent className="min-w-[600px] max-h-[600px] overflow-y-auto bg-white rounded-3xl border border-gray-100 shadow-lg p-10">
        <div className="w-full space-y-8">

          <div className="text-center">
            <h1 className="text-2xl font-medium text-text-color">
              Savings Details
            </h1>
            <p className="text-base text-gray-500">
              Add multiple savings entries
            </p>
          </div>

          {/* Render Entries */}
          {entries.map((entry, index) => (
            <div
              key={index}
              className="relative bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
            >
              {/* Remove Button */}
              {entries.length > 1 && (
                <button
                  onClick={() => removeEntry(index)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className="flex items-center gap-4 pt-4">
                <Input
                  className="bg-white"
                  placeholder="Savings name"
                  value={entry.name}
                  onChange={(e) =>
                    handleChange(index, "name", e.target.value)
                  }
                />

                <Input
                  className="bg-white w-[200px]"
                  placeholder="£"
                  value={entry.amount}
                  onChange={(e) =>
                    handleChange(index, "amount", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          {/* Add New Entry */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={addEntry}
              className="bg-gradient-to-r from-secondary to-primary-foreground flex gap-3 items-center text-text-color px-8 py-2 rounded-full shadow-md cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              Add New Entry
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavingsModal;

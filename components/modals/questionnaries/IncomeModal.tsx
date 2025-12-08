"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import React from "react";

// Each row has 3 fields
type Row = {
  type: string;
  description: string;
  amount: string;
};

// Each block contains 4 rows → 12 fields
type Block = Row[];

const defaultRow: Row = {
  type: "",
  description: "",
  amount: "",
};

const createNewBlock = (): Block => [
  { ...defaultRow },
];

const incomeTypes = [
  "Salary",
  "Business Dividends",
  "Retirement Pension",
  "Freelance/Self-Employed Income",
];

const descriptionOptions = [
  "BFI",
  "I own multiple companies",
  "BFI / B&Y Mellon",
  "I do on and off IT contracting",
];

const IncomeModal = ({ open, onClose }: any) => {
  const [blocks, setBlocks] = React.useState<Block[]>([createNewBlock()]);

  const handleChange = (
    blockIndex: number,
    rowIndex: number,
    field: keyof Row,
    value: string
  ) => {
    const updated = [...blocks];
    updated[blockIndex][rowIndex][field] = value;
    setBlocks(updated);
  };

  const addBlock = () => {
    setBlocks([...blocks, createNewBlock()]);
  };

  const removeRow = (blockIndex: number, rowIndex: number) => {
    const updated = [...blocks];
    updated[blockIndex].splice(rowIndex, 1);
    setBlocks(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle />

      <DialogContent className="min-w-[900px] max-h-[600px] overflow-y-auto overflow-x-hidden scrollbar-hide bg-white rounded-3xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-10">
        <div className="w-full space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-text-color">
              Earning Details
            </h1>
            <p className="text-base font-light text-gray-500">
              Add Earning you’d like to keep separate
            </p>
          </div>

          {blocks.map((block, blockIndex) => (
            <div key={blockIndex} className="space-y-5 bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-700">
                Income Block {blockIndex + 1}
              </h2>

              {/* 4 Rows (12 fields) */}
              {block.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex items-center gap-4"
                >
                  {/* Dropdown 1 */}
                  <Select
                    onValueChange={(v) =>
                      handleChange(blockIndex, rowIndex, "type", v)
                    }
                    value={row.type}
                  >
                    <SelectTrigger className="w-[200px] bg-white">
                      <SelectValue placeholder="Income Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Dropdown 2 */}
                  <Select
                    onValueChange={(v) =>
                      handleChange(blockIndex, rowIndex, "description", v)
                    }
                    value={row.description}
                  >
                    <SelectTrigger className="w-[260px] bg-white">
                      <SelectValue placeholder="Description" />
                    </SelectTrigger>
                    <SelectContent>
                      {descriptionOptions.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Amount */}
                  <Input
                    className="w-[220px] bg-white"
                    placeholder="£ Amount"
                    value={row.amount}
                    onChange={(e) =>
                      handleChange(
                        blockIndex,
                        rowIndex,
                        "amount",
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}
            </div>
          ))}

          {/* Add New Block Button */}

          <div className="pt-2">
            <button
              onClick={addBlock}
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

export default IncomeModal;

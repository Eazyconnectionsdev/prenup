// file: app/questions/Page.tsx
"use client";

import Axios from "@/lib/ApiConfig";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

/** Info box (NOT a question) */
const INFO =
  "Any assets listed on this page will be treated as a separate asset in the event of a divorce, including any increase in value of these assets.";

/** Questions (8 actual questions) */
const QUESTIONS: string[] = [
  `Do you have any earnings you’d like to keep separate from your partner?`,
  `Do you have any properties you’d like to keep separate from your partner?`,
  `Do you have any savings you’d like to keep separate from your partner?`,
  `Do you have any pensions you’d like to keep separate from your partner?`,
  `Do you have any debts you’d like to keep separate from your partner? This includes current credit card balances, loans, etc.`,
  `Do you have any businesses you’d like to keep separate from your partner?`,
  `Do you have any chattels you’d like to keep separate from your partner?`,
  `Do you have any other assets you’d like to keep separate from your partner?`,
];

/** Field descriptor for dynamic forms */
type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  options?: string[]; // for select
  placeholder?: string;
};

const QUESTION_FIELDS: FieldDef[][] = [
  [
    {
      key: "source",
      label: "Source of income",
      type: "select",
      options: ["Salary", "Self-employed", "Rental", "Investment", "Other"],
    },
    {
      key: "company",
      label: "Name of company",
      type: "text",
      placeholder: "Company / Employer name",
    },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
  [
    { key: "line1", label: "Address Line 1", type: "text" },
    { key: "line2", label: "Address Line 2", type: "text" },
    { key: "town", label: "Town or City", type: "text" },
    { key: "postcode", label: "Postcode", type: "text" },
    {
      key: "value",
      label: "Property Value (GBP)",
      type: "number",
      placeholder: "£",
    },
    { key: "extra", label: "Mortgage / Outstanding / Notes", type: "text" },
  ],
  [
    { key: "savingsName", label: "Savings name", type: "text" },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
  [
    { key: "pensionName", label: "Name of pension", type: "text" },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
  [
    { key: "lender", label: "Account / Lender", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "value", label: "Value (GBP)", type: "number", placeholder: "£" },
  ],
  [
    { key: "businessName", label: "Business name", type: "text" },
    { key: "businessDescription", label: "Business description", type: "text" },
    {
      key: "businessValue",
      label: "Business value (GBP)",
      type: "number",
      placeholder: "£",
    },
    {
      key: "sharePercentage",
      label: "Share percentage",
      type: "number",
      placeholder: "%",
    },
    {
      key: "shareValue",
      label: "Value of share holding (GBP)",
      type: "number",
      placeholder: "£",
    },
    { key: "turnover", label: "Turnover", type: "number", placeholder: "£" },
    { key: "profits", label: "Profits", type: "number", placeholder: "£" },
    { key: "explanation", label: "Explanation of business", type: "textarea" },
  ],
  [
    { key: "registration", label: "Car registration number", type: "text" },
    { key: "amount", label: "Amount (GBP)", type: "number", placeholder: "£" },
  ],
  [
    { key: "provider", label: "Account provider", type: "text" },
    { key: "description", label: "Description of assets", type: "text" },
    {
      key: "value",
      label: "Assets value (GBP)",
      type: "number",
      placeholder: "£",
    },
  ],
];

type Entry = {
  id: string;
  values: Record<string, string | number>;
};

export default function QuestionsPage() {
    const { user : {endUserType}, caseId } = useSelector((state: RootState) => state?.auth);

  const [answers, setAnswers] = useState<("yes" | "no" | null)[]>(() =>
    Array(QUESTIONS.length).fill(null)
  );
  const [entries, setEntries] = useState<Entry[][]>(() =>
    Array(QUESTIONS.length)
      .fill([])
      .map(() => [])
  );


  const setAnswer = (qIndex: number, val: "yes" | "no") => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = val;
      return next;
    });

    if (val === "yes") {
      setEntries((prev) => {
        const copy = prev.map((e) => [...e]);
        if (!copy[qIndex] || copy[qIndex].length === 0) {
          copy[qIndex] = [makeEmptyEntry(qIndex)];
        }
        return copy;
      });
    }
    if (val === "no") {
      setEntries((prev) => {
        const copy = prev.map((e) => [...e]);
        copy[qIndex] = [];
        return copy;
      });
    }
  };

  function makeEmptyEntry(qIndex: number): Entry {
    const values: Record<string, string | number> = {};
    const defs = QUESTION_FIELDS[qIndex] || [];
    for (const f of defs) values[f.key] = "";
    return {
      id: String(Date.now()) + Math.random().toString(36).slice(2),
      values,
    };
  }

  const addEntry = (qIndex: number) => {
    setEntries((prev) => {
      const copy = prev.map((e) => [...e]);
      copy[qIndex] = copy[qIndex] || [];
      copy[qIndex].push(makeEmptyEntry(qIndex));
      return copy;
    });
  };

  const removeEntry = (qIndex: number, entryId: string) => {
    setEntries((prev) => {
      const copy = prev.map((e) => [...e]);
      copy[qIndex] = copy[qIndex].filter((ent) => ent.id !== entryId);
      return copy;
    });
  };

  const yesNo = (val?: boolean): "yes" | "no" | null =>
  typeof val === "boolean" ? (val ? "yes" : "no") : null;

const mapEntries = (
  list: any[],
  mapFn: (item: any) => Record<string, string | number>
): Entry[] =>
  (list || []).map((item) => ({
    id: String(Date.now()) + Math.random().toString(36).slice(2),
    values: mapFn(item),
  }));

  const updateEntryField = (
    qIndex: number,
    entryId: string,
    fieldKey: string,
    value: string | number
  ) => {

    console.log(`Update Q${qIndex} Entry ${entryId} Field ${fieldKey} =`, value);

    setEntries((prev) => {
      const copy = prev.map((e) => e.map((x) => ({ ...x })));
      const list = copy[qIndex];
      if (!list) return prev;
      const ent = list.find((x) => x.id === entryId);
      if (!ent) return prev;
      ent.values[fieldKey] = value;
      return copy;
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const payload = {
      /* 1️⃣ Earnings */
      separateEarnings: answers[0] === "yes",
      earningsEntries: entries[0].map((e) => ({
        source: [e.values.source, e.values.company].filter(Boolean).join(" - "),
        amount: Number(e.values.amount || 0),
        notes: "",
      })),

      /* 2️⃣ Properties */
      separateProperties: answers[1] === "yes",
      propertyEntries: entries[1].map((e) => ({
        addressLine1: e.values.line1,
        addressLine2: e.values.line2 || undefined,
        townOrCity: e.values.town,
        postcode: e.values.postcode,
        value: Number(e.values.value || 0),
        mortgageOutstanding: e.values.extra || undefined,
        notes: "",
      })),

      /* 3️⃣ Savings */
      separateSavings: answers[2] === "yes",
      savingsEntries: entries[2].map((e) => ({
        name: e.values.savingsName,
        amount: Number(e.values.amount || 0),
        notes: "",
      })),

      /* 4️⃣ Pensions */
      separatePensions: answers[3] === "yes",
      pensionEntries: entries[3].map((e) => ({
        name: e.values.pensionName,
        value: Number(e.values.amount || 0),
        notes: "",
      })),

      /* 5️⃣ Debts */
      separateDebts: answers[4] === "yes",
      debtEntries: entries[4].map((e) => ({
        accountOrLender: e.values.lender,
        description: e.values.description,
        amount: Number(e.values.value || 0),
        notes: "",
      })),

      /* 6️⃣ Businesses */
      separateBusinesses: answers[5] === "yes",
      businessEntries: entries[5].map((e) => ({
        name: e.values.businessName,
        description: e.values.businessDescription,
        value: Number(e.values.businessValue || 0),
        ownershipPercentage: Number(e.values.sharePercentage || 0),
        explanation: e.values.explanation || "",
      })),

      /* 7️⃣ Chattels */
      separateChattels: answers[6] === "yes",
      chattelEntries: entries[6].map((e) => ({
        description: "Chattel",
        value: Number(e.values.amount || 0),
        registrationOrId: e.values.registration,
        notes: "",
      })),

      /* 8️⃣ Other Assets */
      separateOtherAssets: answers[7] === "yes",
      otherAssetEntries: entries[7].map((e) => ({
        provider: e.values.provider,
        description: e.values.description,
        value: Number(e.values.value || 0),
        notes: "",
      })),
    };

    try {
      const { data } = await Axios.post(`/cases/${caseId}/steps/${endUserType === 'user1' ? '4' : '2'}`, payload);
      toast.success("Submitted Successfully");
    } catch (error: any) {
      console.error("Error submitting questionnaire:", error);
      if (error && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message || error.message);
      }
    }
  };

  // ---------------- Fetch existing ----------------
useEffect(() => {
  if (!caseId) return;

  const fetchData = async () => {
    try {
      const { data } = await Axios.get(`/cases/${caseId}/steps/${endUserType === 'user1' ? '4' : '2'}`);
      const d = data?.data;
      if (!d) return;

      /* Answers (Yes / No) */
      setAnswers([
        yesNo(d.separateEarnings),
        yesNo(d.separateProperties),
        yesNo(d.separateSavings),
        yesNo(d.separatePensions),
        yesNo(d.separateDebts),
        yesNo(d.separateBusinesses),
        yesNo(d.separateChattels),
        yesNo(d.separateOtherAssets),
      ]);

      /* Entries */
      setEntries([
        mapEntries(d.earningsEntries, (x) => ({
          source: x.source || "",
          company: "",
          amount: x.amount ?? "",
        })),

        mapEntries(d.propertyEntries, (x) => ({
          line1: x.addressLine1 || "",
          line2: x.addressLine2 || "",
          town: x.townOrCity || "",
          postcode: x.postcode || "",
          value: x.value ?? "",
          extra: x.mortgageOutstanding || "",
        })),

        mapEntries(d.savingsEntries, (x) => ({
          savingsName: x.name || "",
          amount: x.amount ?? "",
        })),

        mapEntries(d.pensionEntries, (x) => ({
          pensionName: x.name || "",
          amount: x.value ?? "",
        })),

        mapEntries(d.debtEntries, (x) => ({
          lender: x.accountOrLender || "",
          description: x.description || "",
          value: x.amount ?? "",
        })),

        mapEntries(d.businessEntries, (x) => ({
          businessName: x.name || "",
          businessDescription: x.description || "",
          businessValue: x.value ?? "",
          sharePercentage: x.ownershipPercentage ?? "",
          explanation: x.explanation || "",
        })),

        mapEntries(d.chattelEntries, (x) => ({
          registration: x.registrationOrId || "",
          amount: x.value ?? "",
        })),

        mapEntries(d.otherAssetEntries, (x) => ({
          provider: x.provider || "",
          description: x.description || "",
          value: x.value ?? "",
        })),
      ]);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  fetchData();
}, [caseId]);

  return (
    <div className="h-full">
      <div className="w-full max-w-5xl mx-auto pl-16 py-2 pr-26">
        <header className="mb-4">
          <h1 className="text-3xl font-normal text-text-color">
            Partner separate assets
          </h1>
          <p className="mt-2 text-[15px] font-light text-text-color">
            Please fill in each of the sections below to complete your
            agreement.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="space-y-10 bg-gradient-to-br from-secondary to-primary-foreground text-white py-10 px-6 rounded-lg my-10">
            {/* Info box inside gradient (white card look) */}
            <div className="w-full max-w-4xl text-left mx-auto">
              <div className="rounded-md bg-white text-slate-900 p-4 mb-6 border">
                {INFO}
              </div>
            </div>

            {/* Questions */}
            {QUESTIONS.map((q, qi) => {
              const defs = QUESTION_FIELDS[qi] || [];
              return (
                <div
                  key={qi}
                  className="flex flex-col items-center text-center pb-6 border-b border-white/20"
                >
                  <span className="text-base font-normal text-text-color max-w-3xl">
                    <span className="font-medium mr-2">{qi + 1}.</span>
                    {q}
                  </span>

                  <div
                    className="flex gap-3 mt-6"
                    role="group"
                    aria-label={`Question ${qi + 1} answer`}
                  >
                    <button
                      type="button"
                      onClick={() => setAnswer(qi, "yes")}
                      aria-pressed={answers[qi] === "yes"}
                      className={`px-14 shadow-md hover:bg-gray-100 py-1.5 rounded-full font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 ${
                        answers[qi] === "yes"
                          ? "bg-green-600 text-white"
                          : "bg-white text-text-color"
                      }`}
                    >
                      Yes
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnswer(qi, "no")}
                      aria-pressed={answers[qi] === "no"}
                      className={`px-14 shadow-md hover:bg-gray-100 py-1.5 rounded-full font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 ${
                        answers[qi] === "no"
                          ? "bg-red-600 text-white"
                          : "bg-white text-text-color"
                      }`}
                    >
                      No
                    </button>
                  </div>

                  {/* Entries when answered yes */}
                  {answers[qi] === "yes" && (
                    <div className="mt-6 w-full max-w-4xl text-left bg-white/90 rounded-md p-4 mx-auto text-slate-900">
                      <div className="space-y-4">
                        {(entries[qi] || []).map((entry) => (
                          <div
                            key={entry.id}
                            className="relative grid grid-cols-1 md:grid-cols-2 gap-3 bg-white text-slate-900 rounded-md p-4 shadow-sm"
                          >
                            <button
                              onClick={() => removeEntry(qi, entry.id)}
                              aria-label="Remove entry"
                              className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white border shadow flex items-center justify-center text-slate-700"
                            >
                              ×
                            </button>

                            <div className="space-y-3">
                              {defs
                                .slice(0, Math.ceil(defs.length / 2))
                                .map((f) => {
                                  const val = entry.values[f.key] ?? "";
                                  if (f.type === "select") {
                                    return (
                                      <label
                                        key={f.key}
                                        className="block text-slate-900"
                                      >
                                        <select
                                          value={String(val)}
                                          onChange={(e) =>
                                            updateEntryField(
                                              qi,
                                              entry.id,
                                              f.key,
                                              e.target.value
                                            )
                                          }
                                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white text-slate-900"
                                        >
                                          <option value="">
                                            Select {f.label}
                                          </option>
                                          {f.options?.map((opt) => (
                                            <option key={opt} value={opt}>
                                              {opt}
                                            </option>
                                          ))}
                                        </select>
                                      </label>
                                    );
                                  }
                                  if (f.type === "textarea") {
                                    return (
                                      <label
                                        key={f.key}
                                        className="block text-slate-900"
                                      >
                                        <textarea
                                          value={String(val)}
                                          onChange={(e) =>
                                            updateEntryField(
                                              qi,
                                              entry.id,
                                              f.key,
                                              e.target.value
                                            )
                                          }
                                          placeholder={f.label}
                                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900"
                                          rows={4}
                                        />
                                      </label>
                                    );
                                  }
                                  return (
                                    <label
                                      key={f.key}
                                      className="block text-slate-900"
                                    >
                                      <input
                                        type={
                                          f.type === "number"
                                            ? "number"
                                            : "text"
                                        }
                                        step={
                                          f.type === "number"
                                            ? "any"
                                            : undefined
                                        }
                                        value={String(val)}
                                        onChange={(e) =>
                                          updateEntryField(
                                            qi,
                                            entry.id,
                                            f.key,
                                            f.type === "number"
                                              ? e.target.value === ""
                                                ? ""
                                                : Number(e.target.value)
                                              : e.target.value
                                          )
                                        }
                                        placeholder={f.placeholder ?? f.label}
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white text-slate-900"
                                      />
                                    </label>
                                  );
                                })}
                            </div>

                            <div className="space-y-3">
                              {defs
                                .slice(Math.ceil(defs.length / 2))
                                .map((f) => {
                                  const val = entry.values[f.key] ?? "";
                                  if (f.type === "select") {
                                    return (
                                      <label
                                        key={f.key}
                                        className="block text-slate-900"
                                      >
                                        <select
                                          value={String(val)}
                                          onChange={(e) =>
                                            updateEntryField(
                                              qi,
                                              entry.id,
                                              f.key,
                                              e.target.value
                                            )
                                          }
                                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white text-slate-900"
                                        >
                                          <option value="">
                                            Select {f.label}
                                          </option>
                                          {f.options?.map((opt) => (
                                            <option key={opt} value={opt}>
                                              {opt}
                                            </option>
                                          ))}
                                        </select>
                                      </label>
                                    );
                                  }
                                  if (f.type === "textarea") {
                                    return (
                                      <label
                                        key={f.key}
                                        className="block text-slate-900"
                                      >
                                        <textarea
                                          value={String(val)}
                                          onChange={(e) =>
                                            updateEntryField(
                                              qi,
                                              entry.id,
                                              f.key,
                                              e.target.value
                                            )
                                          }
                                          placeholder={f.label}
                                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900"
                                          rows={4}
                                        />
                                      </label>
                                    );
                                  }
                                  return (
                                    <label
                                      key={f.key}
                                      className="block text-slate-900"
                                    >
                                      <input
                                        type={
                                          f.type === "number"
                                            ? "number"
                                            : "text"
                                        }
                                        step={
                                          f.type === "number"
                                            ? "any"
                                            : undefined
                                        }
                                        value={String(val)}
                                        onChange={(e) =>
                                          updateEntryField(
                                            qi,
                                            entry.id,
                                            f.key,
                                            f.type === "number"
                                              ? e.target.value === ""
                                                ? ""
                                                : Number(e.target.value)
                                              : e.target.value
                                          )
                                        }
                                        placeholder={f.placeholder ?? f.label}
                                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white text-slate-900"
                                      />
                                    </label>
                                  );
                                })}
                            </div>
                          </div>
                        ))}

                        <div className="mt-4 flex justify-center">
                          <button
                            type="button"
                            onClick={() => addEntry(qi)}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-white text-slate-900 font-medium shadow border"
                          >
                            <span className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500 text-white text-sm font-bold">
                              +
                            </span>
                            Add New Entry
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow"
              >
                Save / Continue
              </button>
            </div>

            <footer className="mt-6 text-xs text-slate-200 text-center">
              These input labels are set per question — update QUESTION_FIELDS
              if you want different names or types.
            </footer>
          </div>
        </form>
      </div>
    </div>
  );
}

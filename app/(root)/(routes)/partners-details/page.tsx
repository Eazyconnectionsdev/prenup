// file: app/about-you/Page.tsx
"use client";

import React, { useState } from "react";

type ChildEntry = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string; // ISO date string
  specialNeeds: "yes" | "no" | ""; // will keep as yes/no
  fromCurrentRelationship: "yes" | "no" | "";
  livesWithYou: "yes" | "no" | "";
  maintenanceAndCustody: string;
};

export default function AboutYouPage() {
  // Basic personal info
  const [firstName, setFirstName] = useState("");
  const [middleNames, setMiddleNames] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfMarriage, setDateOfMarriage] = useState("");

  // Children section
  const [hasChildren, setHasChildren] = useState<"yes" | "no" | "">("");
  const [children, setChildren] = useState<ChildEntry[]>([]);

  // Other personal fields
  const [englishFluent, setEnglishFluent] = useState<"yes" | "no" | "">("");
  const [nationality, setNationality] = useState("");
  const [domicileResidency, setDomicileResidency] = useState("");
  const [occupation, setOccupation] = useState("");
  const [incomeGBP, setIncomeGBP] = useState<string>("");

  // Long text areas
  const [agreementOverview, setAgreementOverview] = useState("");
  const [livingSituationSummary, setLivingSituationSummary] = useState("");

  // Checkboxes (confirmations)
  const [confirmDraft, setConfirmDraft] = useState(false);
  const [confirmPersonalPossessions, setConfirmPersonalPossessions] = useState(false);
  const [confirmContentsDivide, setConfirmContentsDivide] = useState(false);
  const [confirmCourtPower, setConfirmCourtPower] = useState(false);
  const [confirmCostsShared, setConfirmCostsShared] = useState(false);

  // Helper to create child entry
  const makeChild = (): ChildEntry => ({
    id: String(Date.now()) + Math.random().toString(36).slice(2),
    firstName: "",
    lastName: "",
    dob: "",
    specialNeeds: "",
    fromCurrentRelationship: "",
    livesWithYou: "",
    maintenanceAndCustody: "",
  });

  // When user selects hasChildren = yes, create first blank child if none
  const setHasChildrenAndMaybeInit = (val: "yes" | "no") => {
    setHasChildren(val);
    if (val === "yes" && children.length === 0) setChildren([makeChild()]);
    if (val === "no") setChildren([]);
  };

  const addChild = () => setChildren((c) => [...c, makeChild()]);
  const removeChild = (id: string) => setChildren((c) => c.filter((x) => x.id !== id));
  const updateChild = (id: string, patch: Partial<ChildEntry>) =>
    setChildren((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  // Minimal submit validation and JSON output
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    // minimal checks
    const errors: string[] = [];
    if (!firstName.trim()) errors.push("First name is required");
    if (!lastName.trim()) errors.push("Last name is required");
    if (!dob) errors.push("Date of birth is required");
    if (hasChildren === "yes") {
      children.forEach((ch, idx) => {
        if (!ch.firstName.trim()) errors.push(`Child ${idx + 1}: first name required`);
        if (!ch.lastName.trim()) errors.push(`Child ${idx + 1}: last name required`);
        if (!ch.dob) errors.push(`Child ${idx + 1}: date of birth required`);
      });
    }
    if (errors.length) {
      alert("Please fix the following:\n\n" + errors.join("\n"));
      return;
    }

    const payload = {
      personal: {
        firstName,
        middleNames,
        lastName,
        dob,
        address,
        dateOfMarriage,
      },
      children: hasChildren === "yes" ? children : [],
      englishFluent,
      nationality,
      domicileResidency,
      occupation,
      incomeGBP,
      agreementOverview,
      livingSituationSummary,
      confirmations: {
        confirmDraft,
        confirmPersonalPossessions,
        confirmContentsDivide,
        confirmCourtPower,
        confirmCostsShared,
      },
      meta: { savedAt: new Date().toISOString() },
    };

    // Replace with real save call. For now log and show success.
    console.log("ABOUT YOU SUBMIT", payload);
    alert("Form saved locally (check console). You can now POST payload to your backend.");
  };

  return (
    <div className="h-full">
      <div className="w-full max-w-5xl mx-auto pl-16 py-2 pr-26">
        <header className="mb-4">
          <h1 className="text-3xl font-normal text-text-color">About Partner</h1>
          <p className="mt-2 text-[15px] font-light text-text-color">Please complete all relevant fields — use the Add buttons to add multiple records (e.g., children).</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="space-y-10 bg-gradient-to-br from-secondary to-primary-foreground text-white py-10 px-6 rounded-lg my-10">
            {/* Personal name + DOB + address */}
            <div className="w-full max-w-4xl mx-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">First Name</div>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                </label>

                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">Middle Name(s)</div>
                  <input value={middleNames} onChange={(e) => setMiddleNames(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                </label>

                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">Last Name</div>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">Date of Birth</div>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                </label>

                <label className="block md:col-span-2">
                  <div className="text-sm text-slate-900 mb-1">Address</div>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Home address" className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                </label>
              </div>

              <div>
                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">Date of your Marriage</div>
                  <input type="date" value={dateOfMarriage} onChange={(e) => setDateOfMarriage(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                </label>
              </div>
            </div>

            {/* Children question */}
            <div className="w-full max-w-4xl mx-auto pb-4 border-b border-white/20">
              <div className="mb-3 text-black">
                <p className="text-base leading-relaxed">Do you have any children either from your current relationship or a previous relationship?</p>
              </div>

              <div className="flex items-center gap-4 mb-4 justify-center">
                <button
                  type="button"
                  onClick={() => setHasChildrenAndMaybeInit("yes")}
                  className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 transition-colors ${
                    hasChildren === "yes" ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-900 border-slate-200"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHasChildrenAndMaybeInit("no")}
                  className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 transition-colors ${
                    hasChildren === "no" ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-900 border-slate-200"
                  }`}
                >
                  No
                </button>
              </div>

              {hasChildren === "yes" && (
                <div className="bg-white/90 p-4 rounded-lg border border-slate-100 text-slate-900">
                  <div className="space-y-4">
                    {children.map((ch, idx) => (
                      <div key={ch.id} className="relative grid grid-cols-1 md:grid-cols-2 gap-4 bg-white text-slate-900 rounded-md p-4 shadow-sm">
                        <button
                          type="button"
                          onClick={() => removeChild(ch.id)}
                          className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white border shadow flex items-center justify-center text-slate-700"
                          aria-label={`Remove child ${idx + 1}`}
                        >
                          ×
                        </button>

                        <label>
                          <div className="text-sm text-slate-900 mb-1">Child first name</div>
                          <input value={ch.firstName} onChange={(e) => updateChild(ch.id, { firstName: e.target.value })} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                        </label>

                        <label>
                          <div className="text-sm text-slate-900 mb-1">Child surname</div>
                          <input value={ch.lastName} onChange={(e) => updateChild(ch.id, { lastName: e.target.value })} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                        </label>

                        <label>
                          <div className="text-sm text-slate-900 mb-1">Child date of birth</div>
                          <input type="date" value={ch.dob} onChange={(e) => updateChild(ch.id, { dob: e.target.value })} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                        </label>

                        <div>
                          <div className="text-sm text-slate-900 mb-1">Does the child have any special needs that will mean they remain dependent after 18?</div>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => updateChild(ch.id, { specialNeeds: "yes" })} className={`px-3 py-1 rounded-full border transition-colors ${ch.specialNeeds === "yes" ? "bg-green-600 text-white" : "bg-white text-slate-900 border-slate-200"}`}>
                              Yes
                            </button>
                            <button type="button" onClick={() => updateChild(ch.id, { specialNeeds: "no" })} className={`px-3 py-1 rounded-full border transition-colors ${ch.specialNeeds === "no" ? "bg-red-600 text-white" : "bg-white text-slate-900 border-slate-200"}`}>
                              No
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-slate-900 mb-1">Is the child from your current relationship?</div>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => updateChild(ch.id, { fromCurrentRelationship: "yes" })} className={`px-3 py-1 rounded-full border transition-colors ${ch.fromCurrentRelationship === "yes" ? "bg-green-600 text-white" : "bg-white text-slate-900 border-slate-200"}`}>
                              Yes
                            </button>
                            <button type="button" onClick={() => updateChild(ch.id, { fromCurrentRelationship: "no" })} className={`px-3 py-1 rounded-full border transition-colors ${ch.fromCurrentRelationship === "no" ? "bg-red-600 text-white" : "bg-white text-slate-900 border-slate-200"}`}>
                              No
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-slate-900 mb-1">Does this child live with you?</div>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => updateChild(ch.id, { livesWithYou: "yes" })} className={`px-3 py-1 rounded-full border transition-colors ${ch.livesWithYou === "yes" ? "bg-green-600 text-white" : "bg-white text-slate-900 border-slate-200"}`}>
                              Yes
                            </button>
                            <button type="button" onClick={() => updateChild(ch.id, { livesWithYou: "no" })} className={`px-3 py-1 rounded-full border transition-colors ${ch.livesWithYou === "no" ? "bg-red-600 text-white" : "bg-white text-slate-900 border-slate-200"}`}>
                              No
                            </button>
                          </div>
                        </div>

                        <label className="md:col-span-2">
                          <div className="text-sm text-slate-900 mb-1">Child maintenance and custody arrangement</div>
                          <textarea value={ch.maintenanceAndCustody} onChange={(e) => updateChild(ch.id, { maintenanceAndCustody: e.target.value })} rows={3} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                        </label>
                      </div>
                    ))}

                    <div className="mt-3 flex justify-center">
                      <button type="button" onClick={addChild} className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-white text-slate-900 font-medium shadow border">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500 text-white text-sm font-bold">+</span>
                        Add more
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other personal details */}
            <div className="w-full max-w-4xl mx-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="text-sm text-slate-900 mb-1">Do you fluent in English?</div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setEnglishFluent("yes")} className={`px-6 py-2 rounded-full border transition-colors ${englishFluent === "yes" ? "bg-green-600 text-white" : "bg-white text-slate-900 border-slate-200"}`}>
                      Yes
                    </button>
                    <button type="button" onClick={() => setEnglishFluent("no")} className={`px-6 py-2 rounded-full border transition-colors ${englishFluent === "no" ? "bg-red-600 text-white" : "bg-white text-slate-900 border-slate-200"}`}>
                      No
                    </button>
                  </div>
                </div>

                <label>
                  <div className="text-sm text-slate-900 mb-1">Nationality</div>
                  <input value={nationality} onChange={(e) => setNationality(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                </label>

                <label>
                  <div className="text-sm text-slate-900 mb-1">Domicile and residency status</div>
                  <input value={domicileResidency} onChange={(e) => setDomicileResidency(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label>
                  <div className="text-sm text-slate-900 mb-1">Occupation</div>
                  <input value={occupation} onChange={(e) => setOccupation(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                </label>

                <label className="md:col-span-2">
                  <div className="text-sm text-slate-900 mb-1">Income (GBP)</div>
                  <input type="number" step="any" value={incomeGBP} onChange={(e) => setIncomeGBP(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
                </label>
              </div>
            </div>

            {/* Long text areas with instruction to use third-person */}
            <div className="w-full max-w-4xl mx-auto space-y-4">
              <div>
                <div className="text-sm text-slate-900 mb-1">Please provide an overview of what you are both aiming to do with your agreement and why you want it in place.</div>
                <div className="text-xs text-slate-400 mb-2">Please avoid first-person (use third-person: e.g., "Jenny owns a house").</div>
                <textarea value={agreementOverview} onChange={(e) => setAgreementOverview(e.target.value)} rows={6} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
              </div>

              <div>
                <div className="text-sm text-slate-900 mb-1">Please provide a summary of your current living situation, and any future plans (e.g., significant asset purchases, house moves, key life decisions).</div>
                <div className="text-xs text-slate-400 mb-2">Please avoid first-person (use third-person).</div>
                <textarea value={livingSituationSummary} onChange={(e) => setLivingSituationSummary(e.target.value)} rows={6} className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900" />
              </div>
            </div>

            {/* Confirmations / checkboxes */}
            <div className="w-full max-w-4xl mx-auto pt-2 border-t border-white/20 space-y-3 text-slate-900">
              <label className="block">
                <input type="checkbox" checked={confirmDraft} onChange={(e) => setConfirmDraft(e.target.checked)} className="mr-2" />
                We confirm that we have used the Wenup platform to create a draft, which will later be edited to cater to our needs by our respective legal advisors. We understand that Wenup is not providing legal advice and cannot be held liable for any omissions or inaccuracies in the agreement, neither can Wenup be liable for any losses or damages related to it, or if for whatever reason, the agreement is not upheld in future.
              </label>

              <label className="block">
                <input type="checkbox" checked={confirmPersonalPossessions} onChange={(e) => setConfirmPersonalPossessions(e.target.checked)} className="mr-2" />
                Do you agree that any items of personal possessions shall remain the absolute property of the person who, as between the couple, purchased the item in the event of a Relationship Ending Event?
              </label>

              <label className="block">
                <input type="checkbox" checked={confirmContentsDivide} onChange={(e) => setConfirmContentsDivide(e.target.checked)} className="mr-2" />
                Do you agree that the contents of the Family Home, other than any assets listed in Separate Assets, shall be divided equally unless otherwise agreed in writing?
              </label>

              <label className="block">
                <input type="checkbox" checked={confirmCourtPower} onChange={(e) => setConfirmCourtPower(e.target.checked)} className="mr-2" />
                Do you recognise that the court has the power to depart from any provision of this agreement in the exercise of its jurisdiction to make provision for the needs of any child of the family (under Schedule 1 of the Children Act 1989)?
              </label>

              <label className="block">
                <input type="checkbox" checked={confirmCostsShared} onChange={(e) => setConfirmCostsShared(e.target.checked)} className="mr-2" />
                Do you agree that the costs of this agreement shall be shared equally between you. In the event that one party bears more than his/her/their share of the cost, do you acknowledge that this is not evidence that that party has undue influence on the other?
              </label>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-center">
              <button type="submit" onClick={handleSubmit} className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow">
                Save / Submit
              </button>
            </div>

            <footer className="mt-6 text-xs text-slate-200 text-center">
              You can modify field names or add server submit logic where indicated.
            </footer>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useCallback, useEffect, useState } from "react";
import Axios from "@/lib/ApiConfig";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toDateInputValue } from "@/lib/utils";

type YesNo = "yes" | "no" | "";

type ChildEntry = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  specialNeeds: YesNo;
  fromCurrentRelationship: YesNo;
  livesWithYou: YesNo;
  maintenanceAndCustody: string;
};

// ---------------- Helpers ----------------
const makeChild = (): ChildEntry => ({
  id:
    typeof crypto !== "undefined" && (crypto as any).randomUUID
      ? (crypto as any).randomUUID()
      : String(Date.now()) + Math.random().toString(36).slice(2),
  firstName: "",
  lastName: "",
  dob: "",
  specialNeeds: "",
  fromCurrentRelationship: "",
  livesWithYou: "",
  maintenanceAndCustody: "",
});

// ---------------- Component ----------------
export default function AboutYouPage() {
  const { user : {endUserType}, caseId } = useSelector((state: RootState) => state?.auth);

  // -------- Personal --------
  const [firstName, setFirstName] = useState("");
  const [middleNames, setMiddleNames] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfMarriage, setDateOfMarriage] = useState("");

  // -------- Other fields --------
  const [hasChildren, setHasChildren] = useState<YesNo>("");
  const [children, setChildren] = useState<ChildEntry[]>([]);
  const [englishFluent, setEnglishFluent] = useState<YesNo>("");
  const [nationality, setNationality] = useState("");
  const [domicileResidency, setDomicileResidency] = useState("");
  const [occupation, setOccupation] = useState("");
  const [incomeGBP, setIncomeGBP] = useState<number | "">("");
  const [agreementOverview, setAgreementOverview] = useState("");
  const [livingSituationSummary, setLivingSituationSummary] = useState("");

  // -------- Confirmations --------
  const [confirmDraft, setConfirmDraft] = useState(false);
  const [confirmPersonalPossessions, setConfirmPersonalPossessions] =
    useState(false);
  const [confirmContentsDivide, setConfirmContentsDivide] = useState(false);
  const [confirmCourtPower, setConfirmCourtPower] = useState(false);
  const [confirmCostsShared, setConfirmCostsShared] = useState(false);

  // -------- Meta --------
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  // ---------------- Children helpers ----------------
  const addChild = () => setChildren((prev) => [...prev, makeChild()]);

  const removeChild = (id: string) =>
    setChildren((prev) => prev.filter((c) => c.id !== id));

  const updateChild = (id: string, patch: Partial<ChildEntry>) =>
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );

  const setHasChildrenSafe = (val: YesNo) => {
    setHasChildren(val);
    if (val === "yes" && children.length === 0) setChildren([makeChild()]);
    if (val === "no") setChildren([]);
  };

  // helpers (define once, outside useEffect)
  const boolToYesNo = (v?: boolean | null): "yes" | "no" | "" =>
    v === true ? "yes" : v === false ? "no" : "";

  // ---------------- Validation ----------------
  const validate = useCallback(() => {
    const errors: string[] = [];
    if (!firstName.trim()) errors.push("First name is required");
    if (!lastName.trim()) errors.push("Last name is required");
    if (!dob) errors.push("Date of birth is required");

    if (hasChildren === "yes") {
      children.forEach((c, i) => {
        if (!c.firstName.trim())
          errors.push(`Child ${i + 1}: first name required`);
        if (!c.lastName.trim())
          errors.push(`Child ${i + 1}: last name required`);
        if (!c.dob) errors.push(`Child ${i + 1}: date of birth required`);
      });
    }
    return errors;
  }, [firstName, lastName, dob, hasChildren, children]);

  // ---------------- Fetch existing ----------------
  useEffect(() => {
    if (!caseId) return;
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await Axios.get(`/cases/${caseId}/steps/${endUserType === "user1" ? "1" : "3"}`);
        const d = data?.data;
        if (!d || !mounted) return;

        setFirstName(d.firstName ?? "");
        setMiddleNames(d.middleNames ?? "");
        setLastName(d.lastName ?? "");
        setDob(d.dateOfBirth ?? "");
        setAddress(d.address ?? "");
        setDateOfMarriage(d.dateOfMarriage ?? "");

        setHasChildren(boolToYesNo(d.hasChildren));
        setChildren(
          d.hasChildren && Array.isArray(d.children) ? d.children : []
        );

        setEnglishFluent(boolToYesNo(d.fluentInEnglish));
        setNationality(d.nationality ?? "");
        setDomicileResidency(d.domicileResidencyStatus ?? "");
        setOccupation(d.occupation ?? "");
        setIncomeGBP(d.incomeGBP ?? "");

        setAgreementOverview(d.overviewAim ?? "");
        setLivingSituationSummary(d.currentLivingSituation ?? "");

        setConfirmDraft(!!d.confirm_wenup_platform_used);
        setConfirmPersonalPossessions(!!d.property_personal_possessions_remain);
        setConfirmContentsDivide(!!d.family_home_divided_equally);
        setConfirmCourtPower(!!d.court_can_depart_for_children);
        setConfirmCostsShared(!!d.agree_costs_shared);

        setHasExisting(true);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [caseId]);

  // ---------------- Submit ----------------
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const errors = validate();
    if (errors.length) {
      toast.error("Please fix validation errors (see console)");
      console.warn(errors);
      return;
    }

    const payload = {
      firstName,
      middleNames,
      lastName,
      dateOfBirth: dob,
      address,
      dateOfMarriage,

      hasChildren: hasChildren === "yes",
      fluentInEnglish: englishFluent === "yes",
      nationality,
      domicileResidencyStatus: domicileResidency,
      occupation,
      incomeGBP: incomeGBP === "" ? null : Number(incomeGBP),

      overviewAim: agreementOverview,
      currentLivingSituation: livingSituationSummary,

      confirm_wenup_platform_used: confirmDraft,
      property_personal_possessions_remain: confirmPersonalPossessions,
      family_home_divided_equally: confirmContentsDivide,
      court_can_depart_for_children: confirmCourtPower,
      agree_costs_shared: confirmCostsShared,
    };

    setSaving(true);
    try {
      if (hasExisting) {
        await Axios.post(`/cases/${caseId}/steps/${endUserType === "user1" ? "1" : "3"}`, payload);
        toast.success("Updated successfully");
      } else {
        await Axios.post(`/cases/${caseId}/steps/${endUserType === "user1" ? "1" : "3"}`, payload);
        toast.success("Saved successfully");
        setHasExisting(true);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Submission failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const disabled = loading || saving || !caseId;

  // NOTE: JSX layout + Tailwind classes intentionally unchanged
  return (
    <div className="h-full">
      <div className="w-full max-w-5xl mx-auto pl-16 py-2 pr-26">
        <header className="mb-4">
          <h1 className="text-3xl font-normal text-text-color">About you</h1>
          <p className="mt-2 text-[15px] font-light text-text-color">
            Please complete all relevant fields — use the Add buttons to add
            multiple records (e.g., children).
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="space-y-10 bg-gradient-to-br from-secondary to-primary-foreground text-white py-10 px-6 rounded-lg my-10">
            {/* container with vertical gaps between major rows */}
            <div className="w-full max-w-4xl mx-auto space-y-8">
              {/* Row 1: First / Middle / Last */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">First Name</div>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                    aria-label="First Name"
                  />
                </label>

                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">
                    Middle Name(s)
                  </div>
                  <input
                    value={middleNames}
                    onChange={(e) => setMiddleNames(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                    aria-label="Middle Names"
                  />
                </label>

                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">Last Name</div>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                    aria-label="Last Name"
                  />
                </label>
              </div>

              {/* Row 2: Date of Birth & Date of Marriage (half / half) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">
                    Date of Birth
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pr-2 flex items-center pointer-events-none">
                      <svg
                        className={`w-4 h-4 ${
                          dob ? "text-slate-900" : "text-slate-400"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <path
                          d="M7 11H17M7 15H13M8 2V5M16 2V5M3 7H21V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V7Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {!dob && (
                      <div className="absolute inset-y-0 left-10 pl-1 flex items-center pointer-events-none">
                        <span className="text-slate-400 text-sm">dd/mm/yy</span>
                      </div>
                    )}

                    <input
                      type="date"
                      value={toDateInputValue(dob)}
                      onChange={(e) => setDob(e.target.value)}
                      className={`w-full rounded-md border border-slate-200 px-3 py-2 bg-white ${
                        dob ? "text-slate-900" : "text-transparent"
                      }`}
                      style={{ paddingLeft: "3rem" }}
                      aria-label="Date of Birth"
                    />
                  </div>
                </label>

                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">
                    Date of your Marriage
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pr-2 flex items-center pointer-events-none">
                      <svg
                        className={`w-4 h-4 ${
                          dateOfMarriage ? "text-slate-900" : "text-slate-400"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <path
                          d="M7 11H17M7 15H13M8 2V5M16 2V5M3 7H21V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V7Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {!dateOfMarriage && (
                      <div className="absolute inset-y-0 left-10 pl-1 flex items-center pointer-events-none">
                        <span className="text-slate-400 text-sm">dd/mm/yy</span>
                      </div>
                    )}

                    <input
                      type="date"
                      value={toDateInputValue(dateOfMarriage)}
                      onChange={(e) => setDateOfMarriage(e.target.value)}
                      className={`w-full rounded-md border border-slate-200 px-3 py-2 bg-white ${
                        dateOfMarriage ? "text-slate-900" : "text-transparent"
                      }`}
                      style={{ paddingLeft: "3rem" }}
                      aria-label="Date of Marriage"
                    />
                  </div>
                </label>
              </div>

              {/* Row 3: Address / Occupation / Income — 3 in one line */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">Address</div>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Home address"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                    aria-label="Address"
                  />
                </label>

                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">Occupation</div>
                  <input
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                    aria-label="Occupation"
                  />
                </label>

                <label className="block">
                  <div className="text-sm text-slate-900 mb-1">
                    Income (GBP)
                  </div>
                  <input
                    type="number"
                    step="any"
                    value={incomeGBP === "" ? "" : incomeGBP}
                    onChange={(e) =>
                      setIncomeGBP(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                    aria-label="Income (GBP)"
                  />
                </label>
              </div>

              {/* Row 4: English Fluent / Nationality / Domicile — 3 in one line */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
                <div>
                  <div className="text-sm text-slate-900 mb-1">
                    Are you fluent in English?
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEnglishFluent("yes")}
                      className={`px-6 py-2 rounded-full border transition-colors ${
                        englishFluent === "yes"
                          ? "bg-green-600 text-white"
                          : "bg-white text-slate-900 border-slate-200"
                      }`}
                      aria-pressed={englishFluent === "yes"}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnglishFluent("no")}
                      className={`px-6 py-2 rounded-full border transition-colors ${
                        englishFluent === "no"
                          ? "bg-red-600 text-white"
                          : "bg-white text-slate-900 border-slate-200"
                      }`}
                      aria-pressed={englishFluent === "no"}
                    >
                      No
                    </button>
                  </div>
                </div>

                <label>
                  <div className="text-sm text-slate-900 mb-1">Nationality</div>
                  <input
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                    aria-label="Nationality"
                  />
                </label>

                <label>
                  <div className="text-sm text-slate-900 mb-1">
                    Domicile and residency status
                  </div>
                  <input
                    value={domicileResidency}
                    onChange={(e) => setDomicileResidency(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                    aria-label="Domicile and residency status"
                  />
                </label>
              </div>

              {/* Children question moved below the English/Nationality row */}
              <div className="w-full pb-4 border-b border-white/20">
                <div className="mb-3 text-black">
                  <p className="text-base leading-relaxed">
                    Do you have any children either from your current
                    relationship or a previous relationship?
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-4 justify-center">
                  <button
                    type="button"
                    onClick={() => setHasChildrenSafe("yes")}
                    className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 transition-colors ${
                      hasChildren === "yes"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-slate-900 border-slate-200"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasChildrenSafe("no")}
                    className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 transition-colors ${
                      hasChildren === "no"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-slate-900 border-slate-200"
                    }`}
                  >
                    No
                  </button>
                </div>

                {hasChildren === "yes" && (
                  <div className="bg-white/90 p-4 rounded-lg border border-slate-100 text-slate-900">
                    <div className="space-y-4">
                      {children.map((ch, idx) => (
                        <div
                          key={ch.id}
                          className="relative grid grid-cols-1 md:grid-cols-2 gap-4 bg-white text-slate-900 rounded-md p-4 shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() => removeChild(ch.id)}
                            className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white border shadow flex items-center justify-center text-slate-700"
                            aria-label={`Remove child ${idx + 1}`}
                          >
                            ×
                          </button>

                          <label>
                            <div className="text-sm text-slate-900 mb-1">
                              Child first name
                            </div>
                            <input
                              value={ch.firstName}
                              onChange={(e) =>
                                updateChild(ch.id, {
                                  firstName: e.target.value,
                                })
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                            />
                          </label>

                          <label>
                            <div className="text-sm text-slate-900 mb-1">
                              Child surname
                            </div>
                            <input
                              value={ch.lastName}
                              onChange={(e) =>
                                updateChild(ch.id, { lastName: e.target.value })
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                            />
                          </label>

                          <label>
                            <div className="text-sm text-slate-900 mb-1">
                              Child date of birth
                            </div>
                            <input
                              type="date"
                              value={ch.dob}
                              onChange={(e) =>
                                updateChild(ch.id, { dob: e.target.value })
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                            />
                          </label>

                          <div>
                            <div className="text-sm text-slate-900 mb-1">
                              Does the child have any special needs that will
                              mean they remain dependent after 18?
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  updateChild(ch.id, { specialNeeds: "yes" })
                                }
                                className={`px-3 py-1 rounded-full border transition-colors ${
                                  ch.specialNeeds === "yes"
                                    ? "bg-green-600 text-white"
                                    : "bg-white text-slate-900 border-slate-200"
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateChild(ch.id, { specialNeeds: "no" })
                                }
                                className={`px-3 py-1 rounded-full border transition-colors ${
                                  ch.specialNeeds === "no"
                                    ? "bg-red-600 text-white"
                                    : "bg-white text-slate-900 border-slate-200"
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-slate-900 mb-1">
                              Is the child from your current relationship?
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  updateChild(ch.id, {
                                    fromCurrentRelationship: "yes",
                                  })
                                }
                                className={`px-3 py-1 rounded-full border transition-colors ${
                                  ch.fromCurrentRelationship === "yes"
                                    ? "bg-green-600 text-white"
                                    : "bg-white text-slate-900 border-slate-200"
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateChild(ch.id, {
                                    fromCurrentRelationship: "no",
                                  })
                                }
                                className={`px-3 py-1 rounded-full border transition-colors ${
                                  ch.fromCurrentRelationship === "no"
                                    ? "bg-red-600 text-white"
                                    : "bg-white text-slate-900 border-slate-200"
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-slate-900 mb-1">
                              Does this child live with you?
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  updateChild(ch.id, { livesWithYou: "yes" })
                                }
                                className={`px-3 py-1 rounded-full border transition-colors ${
                                  ch.livesWithYou === "yes"
                                    ? "bg-green-600 text-white"
                                    : "bg-white text-slate-900 border-slate-200"
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateChild(ch.id, { livesWithYou: "no" })
                                }
                                className={`px-3 py-1 rounded-full border transition-colors ${
                                  ch.livesWithYou === "no"
                                    ? "bg-red-600 text-white"
                                    : "bg-white text-slate-900 border-slate-200"
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </div>

                          <label className="md:col-span-2">
                            <div className="text-sm text-slate-900 mb-1">
                              Child maintenance and custody arrangement
                            </div>
                            <textarea
                              value={ch.maintenanceAndCustody}
                              onChange={(e) =>
                                updateChild(ch.id, {
                                  maintenanceAndCustody: e.target.value,
                                })
                              }
                              rows={3}
                              className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                            />
                          </label>
                        </div>
                      ))}

                      <div className="mt-3 flex justify-center">
                        <button
                          type="button"
                          onClick={addChild}
                          className="inline-flex items-center gap-3 px-4 py-2 rounded-md bg-white text-slate-900 font-medium shadow border"
                        >
                          <span className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500 text-white text-sm font-bold">
                            +
                          </span>
                          Add more
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Long text areas */}
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-slate-900 mb-1">
                    Please provide an overview of what you are both aiming to do
                    with your agreement and why you want it in place.
                  </div>
                  <div className="text-xs text-slate-400 mb-2">
                    Please avoid first-person (use third-person: e.g., &quot;Jenny
                    owns a house&quot;).
                  </div>
                  <textarea
                    value={agreementOverview}
                    onChange={(e) => setAgreementOverview(e.target.value)}
                    rows={6}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                  />
                </div>

                <div>
                  <div className="text-sm text-slate-900 mb-1">
                    Please provide a summary of your current living situation,
                    and any future plans (e.g., significant asset purchases,
                    house moves, key life decisions).
                  </div>
                  <div className="text-xs text-slate-400 mb-2">
                    Please avoid first-person (use third-person).
                  </div>
                  <textarea
                    value={livingSituationSummary}
                    onChange={(e) => setLivingSituationSummary(e.target.value)}
                    rows={6}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Confirmations / checkboxes with gaps between each */}
              <div className="w-full max-w-4xl mx-auto pt-2 border-t border-white/20 space-y-0 text-slate-900">
                <label className="block mb-4">
                  <input
                    type="checkbox"
                    checked={confirmDraft}
                    onChange={(e) => setConfirmDraft(e.target.checked)}
                    className="mr-2"
                  />
                  We confirm that we have used the Wenup platform to create a
                  draft, which will later be edited to cater to our needs by our
                  respective legal advisors. We understand that Wenup is not
                  providing legal advice and cannot be held liable for any
                  omissions or inaccuracies in the agreement, neither can Wenup
                  be liable for any losses or damages related to it, or if for
                  whatever reason, the agreement is not upheld in future.
                </label>

                <label className="block mb-4">
                  <input
                    type="checkbox"
                    checked={confirmPersonalPossessions}
                    onChange={(e) =>
                      setConfirmPersonalPossessions(e.target.checked)
                    }
                    className="mr-2"
                  />
                  Do you agree that any items of personal possessions shall
                  remain the absolute property of the person who, as between the
                  couple, purchased the item in the event of a Relationship
                  Ending Event?
                </label>

                <label className="block mb-4">
                  <input
                    type="checkbox"
                    checked={confirmContentsDivide}
                    onChange={(e) => setConfirmContentsDivide(e.target.checked)}
                    className="mr-2"
                  />
                  Do you agree that the contents of the Family Home, other than
                  any assets listed in Separate Assets, shall be divided equally
                  unless otherwise agreed in writing?
                </label>

                <label className="block mb-4">
                  <input
                    type="checkbox"
                    checked={confirmCourtPower}
                    onChange={(e) => setConfirmCourtPower(e.target.checked)}
                    className="mr-2"
                  />
                  Do you recognise that the court has the power to depart from
                  any provision of this agreement in the exercise of its
                  jurisdiction to make provision for the needs of any child of
                  the family (under Schedule 1 of the Children Act 1989)?
                </label>

                <label className="block mb-4">
                  <input
                    type="checkbox"
                    checked={confirmCostsShared}
                    onChange={(e) => setConfirmCostsShared(e.target.checked)}
                    className="mr-2"
                  />
                  Do you agree that the costs of this agreement shall be shared
                  equally between you. In the event that one party bears more
                  than his/her/their share of the cost, do you acknowledge that
                  this is not evidence that that party has undue influence on
                  the other?
                </label>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow"
                >
                  Save
                </button>
              </div>

              <footer className="mt-6 text-xs text-slate-200 text-center">
                You can modify field names or add server submit logic where
                indicated.
              </footer>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

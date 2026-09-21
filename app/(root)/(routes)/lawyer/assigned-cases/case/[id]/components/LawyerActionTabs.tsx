"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Eye,
  Download,
  CheckCircle2,
  FileText,
  Upload,
  Lock,
  FileCode,
  Check,
  ShieldCheck,
  Plus,
} from "lucide-react";

type Persona = "L1" | "L2" | "L3";

interface ClientConfirmation {
  fileName: string;
  fileUrl: string;
  submittedAt: string;
}

interface LawyerSignoff {
  ilaFile: string;
  signedAt: string;
}

interface CaseNote {
  createdBy: string;
  createdDate: string;
  version: number;
  notes: string;
  visibleTo: Persona | "BOTH";
}

interface CaseObj {
  id: string;
  p1Name: string;
  p2Name: string;
  notes: CaseNote[];
}

const MOCK_CASE: CaseObj = {
  id: "CASE-2026-0091",
  p1Name: "Shah Mir",
  p2Name: "Ayesha Mir",
  notes: [
    {
      createdBy: "Robert Miller, Esq.",
      createdDate: "18 Aug 2026",
      version: 1,
      notes: "Client confirmed no objections to the joint savings clause.",
      visibleTo: "L1",
    },
  ],
};

export default function LawyerCleanMasterPage() {
  const [activeTab, setActiveTab] = useState<"notes" | "versions">("notes");

  const [resetNotice, setResetNotice] = useState<string | null>(null);

  const [activePersona] = useState<Persona>("L1");
  const activeLawyer = activePersona === "L1" ? "Robert Miller, Esq." : activePersona === "L2" ? "Mark Sterling, Esq." : "Clara Conner, Esq.";

  const [caseObj, setCaseObj] = useState<CaseObj>(MOCK_CASE);

  const [activeVersionId] = useState("v3-CLEAN");

  const [clientConfirmationP1, setClientConfirmationP1] = useState<ClientConfirmation | null>(null);
  const [clientConfirmationP2, setClientConfirmationP2] = useState<ClientConfirmation | null>(null);
  const [p1FileText, setP1FileText] = useState("");
  const [p2FileText, setP2FileText] = useState("");

  const [lawyerSignoffP1, setLawyerSignoffP1] = useState<LawyerSignoff | null>(null);
  const [lawyerSignoffP2, setLawyerSignoffP2] = useState<LawyerSignoff | null>(null);
  const [isIlaModalOpen, setIsIlaModalOpen] = useState(false);

  const [noteText, setNoteText] = useState("");

  const onUpdateWorkflowState = (_caseId: string, _patch: Record<string, unknown>) => {
    // Static page — no backend to persist to. Left as a no-op hook point
    // for when this is wired to a real API.
  };

  const handleSaveNoteClick = () => {
    if (!noteText.trim()) return;

    const newNote: CaseNote = {
      createdBy: activeLawyer,
      createdDate: new Date().toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }),
      version: caseObj.notes.length + 1,
      notes: noteText.trim(),
      visibleTo: activePersona,
    };

    setCaseObj((prev) => ({ ...prev, notes: [...prev.notes, newNote] }));
    setNoteText("");
  };

  return (
    <>
      {activeTab === "notes" && (
        <div className="flex flex-col gap-6 font-sans">
          {resetNotice && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between text-amber-900 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">{resetNotice}</span>
              </div>
              <button
                onClick={() => setResetNotice(null)}
                className="text-amber-700 hover:text-amber-950 text-xs font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="bg-[#f8fafc] border border-slate-300 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>LAWYER ACTIONS — current Clean Master</span>
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 font-mono">
                  <span>
                    Case: <strong>{caseObj.id}</strong>
                  </span>
                  <span>|</span>
                  <span>
                    Status: <strong className="text-emerald-700">CLEAN MASTER</strong>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Active Profile:</span>
                <span className="bg-[#0d1527] text-white text-xs font-mono font-bold px-3 py-1 rounded-lg">
                  {activePersona === "L1" ? "P1 LAWYER" : activePersona === "L2" ? "P2 LAWYER" : "Neutral (L3)"}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-250 rounded-xl p-5 shadow-xs flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                CURRENT CLEAN MASTER
              </span>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-slate-900">{activeVersionId}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                      Clean Master
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Uploaded by: <strong className="text-slate-800">P1 Lawyer</strong>
                  </p>
                  <p className="text-xs text-slate-500">Uploaded: 19 Aug 2026, 14:32</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("versions")}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Document</span>
                  </button>
                  <button
                    onClick={() => alert(`Downloading ${activeVersionId} Clean Master PDF...`)}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-250 rounded-xl p-5 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1e3a8a] text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-sans">
                    STAGE 1 — CLIENT CONFIRMATION
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-slate-500 font-mono">
                  {clientConfirmationP1 && clientConfirmationP2 ? "✓ BOTH CONFIRMATIONS RECEIVED" : "STEP 1 IN PROGRESS"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div
                  className={`border rounded-xl p-4 flex flex-col gap-3 transition-all ${
                    clientConfirmationP1 ? "bg-emerald-50/40 border-emerald-300" : "bg-slate-50/50 border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      P1 – YOUR CLIENT ({caseObj.p1Name})
                    </h4>
                    {activePersona === "L1" && (
                      <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        YOU (L1)
                      </span>
                    )}
                  </div>

                  {clientConfirmationP1 ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Confirmation Received</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-mono">{clientConfirmationP1.submittedAt}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => alert(`Opening attached confirmation email: ${clientConfirmationP1.fileName}`)}
                          className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Email ({clientConfirmationP1.fileName})</span>
                        </button>
                        {activePersona === "L1" && (
                          <button
                            onClick={() => setClientConfirmationP1(null)}
                            className="text-red-600 hover:text-red-800 text-[10px] font-bold underline cursor-pointer"
                          >
                            Re-upload
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-slate-600">
                        Attach your client's confirmation email or document (PDF / PNG / DOC):
                      </p>
                      {activePersona === "L1" ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={p1FileText}
                              onChange={(e) => setP1FileText(e.target.value)}
                              placeholder="e.g. P1_Client_Confirmation.pdf"
                              className="bg-white border border-slate-300 text-xs px-3 py-1.5 rounded-lg flex-1 outline-none focus:border-slate-400"
                            />
                            <label className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all">
                              Browse
                              <input
                                type="file"
                                accept=".pdf,.png,.doc,.docx"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    setP1FileText(e.target.files[0].name);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          <button
                            onClick={() => {
                              const nameToUse = p1FileText.trim() || "P1_Client_Confirmation.pdf";
                              const newConf: ClientConfirmation = {
                                fileName: nameToUse,
                                fileUrl: "#",
                                submittedAt: new Date().toLocaleString([], {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }),
                              };
                              setClientConfirmationP1(newConf);
                              setP1FileText("");
                              onUpdateWorkflowState(caseObj.id, { clientConfirmationP1: newConf });
                            }}
                            className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs mt-1"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Submit Client Confirmation</span>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 italic">
                          Awaiting P1 Lawyer to upload and submit client confirmation.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className={`border rounded-xl p-4 flex flex-col gap-3 transition-all ${
                    clientConfirmationP2 ? "bg-emerald-50/40 border-emerald-300" : "bg-slate-50/50 border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      P2 – OTHER CLIENT ({caseObj.p2Name})
                    </h4>
                    {activePersona === "L2" && (
                      <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        YOU (L2)
                      </span>
                    )}
                  </div>

                  {clientConfirmationP2 ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Confirmation Received</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-mono">{clientConfirmationP2.submittedAt}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => alert(`Opening attached confirmation document: ${clientConfirmationP2.fileName}`)}
                          className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Confirmation ({clientConfirmationP2.fileName})</span>
                        </button>
                        {activePersona === "L2" && (
                          <button
                            onClick={() => {
                              setClientConfirmationP2(null);
                              onUpdateWorkflowState(caseObj.id, { clientConfirmationP2: null });
                            }}
                            className="text-red-600 hover:text-red-800 text-[10px] font-bold underline cursor-pointer"
                          >
                            Re-upload
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-slate-600">
                        Attach your client's confirmation email or document (PDF / PNG / DOC):
                      </p>
                      {activePersona === "L2" ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={p2FileText}
                              onChange={(e) => setP2FileText(e.target.value)}
                              placeholder="e.g. P2_Client_Confirmation.pdf"
                              className="bg-white border border-slate-300 text-xs px-3 py-1.5 rounded-lg flex-1 outline-none focus:border-slate-400"
                            />
                            <label className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all">
                              Browse
                              <input
                                type="file"
                                accept=".pdf,.png,.doc,.docx"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    setP2FileText(e.target.files[0].name);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          <button
                            onClick={() => {
                              const nameToUse = p2FileText.trim() || "P2_Client_Confirmation.pdf";
                              const newConf: ClientConfirmation = {
                                fileName: nameToUse,
                                fileUrl: "#",
                                submittedAt: new Date().toLocaleString([], {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }),
                              };
                              setClientConfirmationP2(newConf);
                              setP2FileText("");
                              onUpdateWorkflowState(caseObj.id, { clientConfirmationP2: newConf });
                            }}
                            className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs mt-1"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Submit Client Confirmation</span>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 italic">
                          Awaiting P2 Lawyer to upload and submit client confirmation.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {clientConfirmationP1 && clientConfirmationP2 ? (
                <div className="bg-emerald-100/90 border border-emerald-300 rounded-lg p-3 text-center text-xs font-extrabold text-emerald-900 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Both client confirmations have been received. Stage 2 (Sign-off &amp; ILA) is now available!</span>
                </div>
              ) : (
                <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-center text-xs text-slate-600 font-semibold">
                  Stage 2 will unlock automatically once both P1 and P2 client confirmations are submitted.
                </div>
              )}
            </div>

            <div
              className={`border rounded-xl p-5 shadow-xs flex flex-col gap-5 transition-all ${
                clientConfirmationP1 && clientConfirmationP2 ? "bg-white border-slate-250" : "bg-slate-50/60 border-slate-200 opacity-75"
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center ${
                      clientConfirmationP1 && clientConfirmationP2 ? "bg-[#0d1527] text-white" : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    2
                  </span>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-sans">
                    STAGE 2 — LAWYER SIGN-OFF &amp; ILA
                  </h3>
                </div>
                {!(clientConfirmationP1 && clientConfirmationP2) && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Locked until Stage 1 completes</span>
                  </span>
                )}
              </div>

              {clientConfirmationP1 && clientConfirmationP2 ? (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div
                      className={`border rounded-xl p-4 flex flex-col gap-3 transition-all ${
                        lawyerSignoffP1 ? "bg-emerald-50/40 border-emerald-300" : "bg-slate-50/50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          P1 LAWYER {activePersona === "L1" ? "– YOU" : ""}
                        </h4>
                      </div>

                      {lawyerSignoffP1 ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Sign-off Complete</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 font-semibold">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ILA Generated – {lawyerSignoffP1.ilaFile || "ILA_P1.pdf"}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono">{lawyerSignoffP1.signedAt}</p>
                          <button
                            onClick={() => alert(`Downloading ${lawyerSignoffP1.ilaFile}...`)}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs self-start mt-1 flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>View ILA</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                            <span>Sign-off Pending</span>
                          </div>
                          {activePersona === "L1" ? (
                            <button
                              onClick={() => setIsIlaModalOpen(true)}
                              className="bg-[#0d1527] hover:bg-[#1b2947] text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-all cursor-pointer shadow-xs text-center flex items-center justify-center gap-2"
                            >
                              <FileCode className="w-4 h-4 text-emerald-400" />
                              <span>COMPLETE SIGN-OFF &amp; ILA</span>
                            </button>
                          ) : (
                            <p className="text-xs text-slate-500 italic">
                              Awaiting P1 Lawyer to complete sign-off and upload ILA.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div
                      className={`border rounded-xl p-4 flex flex-col gap-3 transition-all ${
                        lawyerSignoffP2 ? "bg-emerald-50/40 border-emerald-300" : "bg-slate-50/50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          P2 LAWYER {activePersona === "L2" ? "– YOU" : ""}
                        </h4>
                      </div>

                      {lawyerSignoffP2 ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Sign-off Complete</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 font-semibold">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ILA Generated – {lawyerSignoffP2.ilaFile || "ILA_P2.pdf"}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono">{lawyerSignoffP2.signedAt}</p>
                          <button
                            onClick={() => alert(`Downloading ${lawyerSignoffP2.ilaFile}...`)}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs self-start mt-1 flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>View ILA</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                            <span>Sign-off Pending</span>
                          </div>
                          {activePersona === "L2" ? (
                            <button
                              onClick={() => setIsIlaModalOpen(true)}
                              className="bg-[#0d1527] hover:bg-[#1b2947] text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-all cursor-pointer shadow-xs text-center flex items-center justify-center gap-2"
                            >
                              <FileCode className="w-4 h-4 text-emerald-400" />
                              <span>COMPLETE SIGN-OFF &amp; ILA</span>
                            </button>
                          ) : (
                            <p className="text-xs text-slate-500 italic">
                              Awaiting P2 Lawyer to complete sign-off and upload ILA.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {lawyerSignoffP1 && lawyerSignoffP2 ? (
                    <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-5 text-center flex flex-col items-center justify-center gap-3 shadow-sm font-sans">
                      <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm uppercase tracking-wide">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>✓ DUAL LAWYER SIGN-OFF &amp; ILA COMPLETE</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 text-xs font-mono">
                        <span>System Integrity Check:</span>
                        <span className="font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          PASSED
                        </span>
                      </div>
                      <div className="bg-white border border-emerald-300 text-emerald-900 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-2xs mt-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Matter Completed! Available in the Completed Cases left menu page.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-center text-xs text-slate-600 italic">
                      {lawyerSignoffP1
                        ? "P1 Sign-off complete. Awaiting P2 Lawyer sign-off & ILA."
                        : lawyerSignoffP2
                        ? "P2 Sign-off complete. Awaiting P1 Lawyer sign-off & ILA."
                        : "Awaiting both P1 and P2 Lawyers to complete sign-off."}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center text-slate-500">
                  <Lock className="w-6 h-6 text-slate-400" />
                  <p className="text-xs font-bold text-slate-700">Stage 2 Unavailable</p>
                  <p className="text-xs">
                    Both P1 and P2 client confirmations must be uploaded and submitted in Stage 1 before lawyer
                    sign-off and ILA actions become available.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider font-sans">
                CONFIDENTIAL SUMMARY NOTES
              </h3>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                {activePersona} Workspace
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {caseObj.notes.filter((n) => n.visibleTo === activePersona || n.visibleTo === "BOTH").length > 0 ? (
                caseObj.notes
                  .filter((n) => n.visibleTo === activePersona || n.visibleTo === "BOTH")
                  .map((note, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col gap-1.5 text-xs text-slate-700"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Author: {note.createdBy}</span>
                        <span>
                          {note.createdDate} | Version: {note.version}
                        </span>
                      </div>
                      <p className="text-slate-800 italic mt-0.5">"{note.notes}"</p>
                    </div>
                  ))
              ) : (
                <p className="text-xs text-slate-500 font-sans italic text-center py-4">
                  No confidential notes added yet by {activeLawyer}.
                </p>
              )}
            </div>

            {activePersona !== "L3" ? (
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add private summary notes (visible ONLY to your lawyer profile)..."
                  className="bg-white border border-slate-350 text-xs p-3 rounded-xl font-sans outline-none focus:border-slate-400 resize-none h-[80px]"
                />
                <button
                  onClick={handleSaveNoteClick}
                  className="bg-[#0d1527] hover:bg-[#1b2947] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer self-end flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Private Note</span>
                </button>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-red-800 text-xs">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Neutral third party cannot record client summary notes.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
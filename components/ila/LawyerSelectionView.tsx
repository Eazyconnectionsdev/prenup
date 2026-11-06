"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  BadgeCheck,
  Building2,
  Check,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Axios from "@/lib/ApiConfig";
import { getErrorMessage } from "@/lib/api/http-error";
import IlaGateNotice from "@/components/ila/IlaGateNotice";
import { useIlaStage } from "@/lib/useIlaStage";
import { asLawyer, lawyerFirmName, lawyerInitials } from "@/lib/ila";
import type { LawyerOption } from "@/types/dashboard/lawyer-selection";

function LawyerCard({
  lawyer,
  selected,
  takenByPartner,
  onChoose,
  saving,
  readOnly = false,
}: {
  lawyer: LawyerOption;
  selected: boolean;
  takenByPartner: boolean;
  onChoose: () => void;
  saving: boolean;
  // The partner's view: same cards, nothing to choose
  readOnly?: boolean;
}) {
  const firm = lawyerFirmName(lawyer);
  const unavailable = Boolean(lawyer.status && lawyer.status !== "available");
  const disabled = takenByPartner || unavailable || saving;

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)] transition ${
        selected
          ? "border-indigo-500 ring-4 ring-indigo-600/10"
          : "border-[#E7E7F2]"
      } ${takenByPartner ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#E02693] to-[#8B23E3] text-lg font-bold text-white shadow-sm">
          {lawyerInitials(lawyer.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[1.05rem] font-bold text-[#1E1B3C]">
              {lawyer.name}
            </p>
            {lawyer.verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 text-[#6D28D9]" />
            )}
          </div>
          {firm && (
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-[0.85rem] text-[#5B5B75]">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              {firm}
            </p>
          )}
          {lawyer.priceText && (
            <p className="mt-1.5 text-[0.85rem] font-semibold text-slate-800">
              {lawyer.priceText}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-1.5 border-t border-[#E7E7F2] pt-4 text-[0.825rem] text-[#5B5B75]">
        {lawyer.publicEmail && (
          <p className="flex items-center gap-2 truncate">
            <Mail className="h-3.5 w-3.5 shrink-0 text-[#6D28D9]" />
            {lawyer.publicEmail}
          </p>
        )}
        {lawyer.publicPhone && (
          <p className="flex items-center gap-2 truncate">
            <Phone className="h-3.5 w-3.5 shrink-0 text-[#6D28D9]" />
            {lawyer.publicPhone}
          </p>
        )}
        {lawyer.address && (
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6D28D9]" />
            <span>{lawyer.address}</span>
          </p>
        )}
        {lawyer.website && (
          <p className="flex items-center gap-2 truncate">
            <Globe className="h-3.5 w-3.5 shrink-0 text-[#6D28D9]" />
            <a
              href={lawyer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-indigo-600 hover:underline"
            >
              {lawyer.website}
            </a>
          </p>
        )}
      </div>

      <div className="mt-5">
        {selected ? (
          <div className="flex items-center justify-center gap-2 rounded-[10px] bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700">
            <Check className="h-4 w-4" strokeWidth={3} />
            {readOnly ? "Your partner's solicitor" : "Your solicitor"}
          </div>
        ) : readOnly ? null : (
          <button
            type="button"
            onClick={onChoose}
            disabled={disabled}
            title={
              takenByPartner
                ? "Your partner has chosen this solicitor"
                : unavailable
                  ? "Not currently accepting new clients"
                  : undefined
            }
            className="w-full rounded-[10px] bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {takenByPartner
              ? "Chosen by your partner"
              : unavailable
                ? "Unavailable"
                : "Choose this solicitor"}
          </button>
        )}
      </div>
    </div>
  );
}

// "mine" lets the signed-in partner choose; "partner" shows the same page with
// the other partner's choice, read-only.
export default function LawyerSelectionView({
  viewer = "mine",
}: {
  viewer?: "mine" | "partner";
}) {
  const { caseId, gate, mine, partner, reload } = useIlaStage();
  const isPartnerView = viewer === "partner";

  // null until the list has come back, so "loading" needs no separate state
  const [lawyers, setLawyers] = useState<LawyerOption[] | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loading = Boolean(caseId) && gate.unlocked && lawyers === null;

  const myLawyer = asLawyer(mine.selectedLawyer);
  // Whose choice this page highlights
  const shownLawyer = isPartnerView ? asLawyer(partner.selectedLawyer) : myLawyer;
  const partnerLawyerId =
    asLawyer(partner.selectedLawyer)?._id ??
    (typeof partner.selectedLawyer === "string"
      ? partner.selectedLawyer
      : null);

  useEffect(() => {
    if (!caseId || !gate.unlocked) return;
    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await Axios.get(`/cases/${caseId}/lawyers`);
        if (cancelled) return;
        setLawyers(Array.isArray(data?.lawyers) ? data.lawyers : []);
      } catch (error) {
        if (cancelled) return;
        setLawyers([]);
        toast.error(
          getErrorMessage(error, "Failed to load the list of solicitors."),
        );
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [caseId, gate.unlocked]);

  const visibleLawyers = useMemo(
    () => (lawyers ?? []).filter((l) => l.status !== "archived"),
    [lawyers],
  );

  const choose = async (lawyer: LawyerOption) => {
    if (!caseId) return;
    try {
      setSavingId(lawyer._id);
      await Axios.post(`/cases/${caseId}/select-lawyer`, {
        lawyerId: lawyer._id,
      });
      toast.success(`${lawyer.name} is now your independent solicitor.`);
      reload();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save your choice."));
    } finally {
      setSavingId(null);
    }
  };

  if (!gate.unlocked) {
    return (
      <IlaGateNotice
        title={isPartnerView ? "Partner's Lawyer Selection" : "My Lawyer Selection"}
        handshakeDone={gate.handshakeDone}
        caseManagerApproved={gate.caseManagerApproved}
        reason={gate.reason}
      />
    );
  }

  // Your partner chooses on their own; nothing to show until they have
  if (isPartnerView && !shownLawyer) {
    return (
      <div className="min-h-full bg-slate-100 px-5 py-6 sm:px-8" style={{ zoom: 0.9 }}>
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#E7E7F2] bg-white p-8 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6D28D9]">
            Awaiting partner
          </p>
          <h2 className="mt-1 text-[1.3rem] font-extrabold tracking-tight text-slate-900">
            Partner&apos;s Lawyer Selection
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Your partner selects their own solicitor independently. You will be notified
            once your partner has completed this step.
          </p>
        </div>
      </div>
    );
  }

  // Choosing a solicitor follows the questionnaire
  if (!isPartnerView && !mine.submitted) {
    return (
      <div className="min-h-full bg-slate-100 px-5 py-6 sm:px-8" style={{ zoom: 0.9 }}>
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#E7E7F2] bg-white p-8 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6D28D9]">
            Locked
          </p>
          <h2 className="mt-1 text-[1.3rem] font-extrabold tracking-tight text-slate-900">
            My Lawyer Selection
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Choose your independent solicitor once you have submitted your pre-lawyer
            questionnaire.
          </p>
          <Link
            href="/dashboard/lawyer-questionaries"
            className="mt-5 inline-block rounded-[10px] bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Start questionnaire →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-full bg-slate-100 px-5 py-6 sm:px-8"
      style={{ zoom: 0.9 }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-5">
          <h2 className="text-[1.45rem] font-extrabold tracking-tight text-slate-900">
            {isPartnerView ? "Partner's Lawyer Selection" : "My Lawyer Selection"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isPartnerView
              ? "The independent solicitor your partner has instructed. This is read-only; only they can change it."
              : "Choose the SRA-regulated solicitor who will give you independent legal advice. You and your partner must each instruct a different solicitor."}
          </p>
        </div>

        {!isPartnerView && myLawyer && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Check
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                strokeWidth={3}
              />
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  You have chosen {myLawyer.name}
                </p>
                <p className="mt-0.5 text-sm text-emerald-800">
                  {lawyerFirmName(myLawyer) || "Independent solicitor"}
                  {mine.selectedAt
                    ? ` · selected ${new Date(mine.selectedAt).toLocaleDateString()}`
                    : ""}
                </p>
              </div>
            </div>
            <p className="text-sm text-emerald-800">
              Pick another below to change it.
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-[#E7E7F2] bg-white p-5"
              >
                <div className="flex items-start gap-3.5">
                  <div className="h-[52px] w-[52px] shrink-0 rounded-[14px] bg-slate-200" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-slate-200" />
                    <div className="h-3 w-40 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="mt-6 h-10 rounded-[10px] bg-slate-100" />
              </div>
            ))}
          </div>
        ) : visibleLawyers.length === 0 ? (
          <div className="rounded-2xl border border-[#E7E7F2] bg-white p-10 text-center text-sm text-slate-500">
            No solicitors are listed yet. Your case manager will add them
            shortly.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleLawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer._id}
                lawyer={lawyer}
                selected={shownLawyer?._id === lawyer._id}
                readOnly={isPartnerView}
                takenByPartner={!isPartnerView && partnerLawyerId === lawyer._id}
                onChoose={() => choose(lawyer)}
                saving={savingId === lawyer._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

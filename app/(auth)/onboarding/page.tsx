'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import type { AppDispatch, RootState } from '@/store/store';
import { completeOnboarding, getOnboarding } from '@/store/asyncThunk/casesThunk';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { AgreementCard } from '@/components/onboarding/AgreementCard';

import { ServiceOverview } from '@/components/onboarding/ServiceOverview';
import { Step3Success } from '@/components/onboarding/Step3Success';
import type { AgreementOption } from "@/types/onboarding";

export const AGREEMENT_OPTIONS: AgreementOption[] = [
  {
    id: 'prenup-marriage',
    title: 'Prenuptial Agreement',
    badge: 'POPULAR',
    subtitle: 'I intend to get married and my wedding is more than 28 days away.',
    overviewTitle: 'Prenuptial Agreement (Marriage)',
    overviewDescription: 'A Prenuptial Agreement is designed for couples who intend to marry and wish to establish financial arrangements before their wedding.',
    legalNote: 'We recommend starting as early as possible. If your wedding is within 28 days, legal considerations apply.'
  },
  {
    id: 'prenup-civil',
    title: 'Prenuptial Agreement (Civil Partnership)',
    subtitle: 'I intend to enter a civil partnership and my registration is > 28 days away.',
    overviewTitle: 'Prenuptial Agreement (Civil Partnership)',
    overviewDescription: 'Designed for partners planning a legal civil partnership in the UK to set out asset ownership and financial protection prior to registration.',
    legalNote: 'We recommend starting as early as possible. If your registration is within 28 days, legal considerations apply.'
  },
  {
    id: 'postnup-marriage',
    title: 'Postnuptial Agreement',
    subtitle: 'I am already married, OR my wedding date is within the next 28 days.',
    overviewTitle: 'Postnuptial Agreement (Marriage)',
    overviewDescription: 'A Postnuptial Agreement is for currently married couples or those with a wedding date within 28 days who wish to establish clear financial arrangements.',
    legalNote: 'This agreement is executed after marriage or when the wedding date is under 28 days away.'
  },
  {
    id: 'postnup-civil',
    title: 'Postnuptial Agreement (Civil Partnership)',
    subtitle: 'I am already in a civil partnership, OR my registration is within 28 days.',
    overviewTitle: 'Postnuptial Agreement (Civil Partnership)',
    overviewDescription: 'For registered civil partners or couples registering within 28 days to outline financial rights and asset divisions.',
    legalNote: 'Provides clear legal structure for partners already in or entering a civil partnership shortly.'
  },
  {
    id: 'cohabitation',
    title: 'Cohabitation Agreement',
    subtitle: 'I live with or plan to live with my partner without marrying.',
    overviewTitle: 'Cohabitation Agreement',
    overviewDescription: 'Protects cohabiting couples who live together without marriage or civil partnership, detailing property ownership shares, bills, and joint financial responsibilities.',
    legalNote: 'Essential protection for unmarried couples sharing property or living expenses.'
  },
  {
    id: 'help-choose',
    title: 'Help Me Choose',
    subtitle: 'I am unsure which agreement best reflects my situation.',
    overviewTitle: 'Guided Agreement Selection',
    overviewDescription: 'Our interactive guide will ask a few simple questions regarding your relationship status and timelines to recommend the correct legal agreement.',
    legalNote: 'No commitment required—we will guide you to the appropriate legal pathway.'
  }
];

export default function OnboardingPage () {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // Steps: 1 = choose service, 3 = confirmation. (Payment is added later,
  // from the dashboard, so there is no payment step here.)
  const [step, setStep] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string>('prenup-marriage');
  const [resideChecked, setResideChecked] = useState<boolean>(false);
  const [understandChecked, setUnderstandChecked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const caseId: string | undefined = user?.inviteCaseId;
  const userName: string = user?.firstName || 'there';
  const selectedOption = AGREEMENT_OPTIONS.find((o) => o.id === selectedId) || AGREEMENT_OPTIONS[0];

  // Onboarding is for user 1 only. Partners (user 2) and users who already
  // completed it go straight to the dashboard.
  useEffect(() => {
    if (user?.endUserType === 'user2') {
      router.replace('/dashboard');
      return;
    }
    if (!caseId) return;
    dispatch(getOnboarding(caseId))
      .unwrap()
      .then((res) => {
        if (res.completed) {
          router.replace('/dashboard');
          return;
        }
        setIsChecking(false);
      })
      .catch(() => setIsChecking(false));
  }, [user?.endUserType, caseId, dispatch, router]);

  const handleStep1Continue = async () => {
    if (!caseId) {
      toast.error('We could not find your case. Please sign in again.');
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(
        completeOnboarding({
          caseId,
          agreementType: selectedId,
          residesInUK: resideChecked,
          understandsService: understandChecked,
        })
      ).unwrap();
      toast.success('Your service selection has been saved');
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to save your selection. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // With no case id there is nothing to check, so show the form (saving will
  // then ask the user to sign in again).
  if (isChecking && (caseId || user?.endUserType === 'user2')) {
    return (
      <main className="min-h-screen flex items-center justify-center text-sm text-[#64748B]">
        Loading...
      </main>
    );
  }

  return (
    <>
      {/* Header */}
      {/* <header className="w-full bg-[#0F172A] text-white shadow-md py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center space-x-3 text-white hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-full border border-[#8B3A3A] bg-[#1E293B] flex items-center justify-center font-serif-legal font-bold text-[#E26D6D] text-sm tracking-wider shadow-inner">
              LP
            </div>
            <div>
              <span className="font-serif-legal font-bold tracking-[0.15em] text-lg uppercase text-white block leading-none">
                Let's Prenup
              </span>
              <span className="text-[0.6rem] font-mono tracking-wider text-[#E26D6D] uppercase block mt-1">
                Next.js Service Onboarding v1.0
              </span>
            </div>
          </a>

          <div className="flex items-center space-x-4">
            <div className="text-xs text-[#94A3B8] hidden md:block font-medium">
              Step <span className="text-[#E26D6D] font-bold">{step}</span> of 2
            </div>
            <div className="px-3.5 py-1 rounded bg-[#8B3A3A] text-white text-[0.65rem] font-bold tracking-[0.15em] uppercase shadow-xs">
              Status: Active
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Views */}
      {step === 1 && (
        <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 transition-all duration-300">
          <section className="lg:col-span-7 space-y-6">
            <div className="space-y-2 mb-8">
              <h1 className="text-3xl md:text-4xl font-serif-legal font-semibold tracking-wide text-[#0F172A]">
                Welcome to Let&apos;s Prenup
              </h1>
              <p className="text-[#5A6578] text-sm md:text-base font-normal">
                Select the agreement that best reflects your current circumstances.
              </p>
            </div>

            <div className="space-y-3.5" role="radiogroup" aria-label="Agreement Options">
              {AGREEMENT_OPTIONS.map((option) => (
                <AgreementCard
                  key={option.id}
                  option={option}
                  isSelected={option.id === selectedId}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </section>

          <ServiceOverview
            selectedOption={selectedOption}
            resideChecked={resideChecked}
            understandChecked={understandChecked}
            onResideChange={setResideChecked}
            onUnderstandChange={setUnderstandChecked}
            onContinue={handleStep1Continue}
            isSubmitting={isSubmitting}
          />
        </main>
      )}

      {step === 3 && (
        <Step3Success
          userName={userName}
          serviceTitle={selectedOption.overviewTitle}
        />
      )}

      {/* Footer */}
      <footer className="w-full border-t border-[#E6E3DC] bg-white py-6 px-6 text-center">
        <p className="text-[0.72rem] text-[#64748B] max-w-4xl mx-auto leading-relaxed">
          &copy; 2026 Let's Prenup Ltd. All rights reserved. Independent legal advice provided by panel solicitors regulated by the SRA &amp; BSB.
        </p>
      </footer>
    </>
  );
};


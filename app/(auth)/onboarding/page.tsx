'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { HelpCircle } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store/store';
import { completeOnboarding, getOnboarding } from '@/store/asyncThunk/casesThunk';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { AgreementCard } from '@/components/onboarding/AgreementCard';
import { Step2Payment } from '@/components/onboarding/Step2Payment';
import { ServiceOverview } from '@/components/onboarding/ServiceOverview';
import { Step3Success } from '@/components/onboarding/Step3Success';
import { HelpMeChooseModal } from '@/components/onboarding/HelpMeChooseModal';
import type { AgreementOption } from "@/types/onboarding";
import type { AgreementServiceItem } from "@/types/onboarding/agreement-card";

export const AGREEMENT_OPTIONS: AgreementOption[] = [
  {
    id: 'prenup-marriage',
    title: 'Prenuptial Agreement',
    badge: 'POPULAR',
    tags: ['Prenup', 'Marriage'],
    serviceName: 'Prenup',
    serviceTag: 'PRENUP',
    subTag: 'MARRIAGE',
    subtitle: 'I intend to get married and my wedding is more than 28 days away.',
    overviewTitle: 'Prenuptial Agreement (Marriage)',
    overviewDescription: 'A Prenuptial Agreement is designed for couples who intend to marry and wish to establish financial arrangements before their wedding.',
    legalNote: 'We recommend starting as early as possible. If your wedding is within 28 days, legal considerations apply.'
  },
  {
    id: 'prenup-civil',
    title: 'Prenuptial Agreement (Civil Partnership)',
    tags: ['Prenup', 'Civil Partnership'],
    serviceName: 'Prenup',
    serviceTag: 'PRENUP',
    subTag: 'CIVIL PARTNERSHIP',
    subtitle: 'I intend to enter a civil partnership and my registration is more than 28 days away.',
    overviewTitle: 'Prenuptial Agreement (Civil Partnership)',
    overviewDescription: 'Designed for partners planning a legal civil partnership in the UK to set out asset ownership and financial protection prior to registration.',
    legalNote: 'We recommend starting as early as possible. If your registration is within 28 days, legal considerations apply.'
  },
  {
    id: 'postnup-marriage',
    title: 'Postnuptial Agreement',
    tags: ['Postnup', 'Marriage'],
    serviceName: 'Postnup',
    serviceTag: 'POSTNUP',
    subTag: 'MARRIAGE',
    subtitle: 'I am already married or my wedding is within the next 28 days.',
    overviewTitle: 'Postnuptial Agreement (Marriage)',
    overviewDescription: 'A Postnuptial Agreement is for currently married couples or those with a wedding date within 28 days who wish to establish clear financial arrangements.',
    legalNote: 'This agreement is executed after marriage or when the wedding date is under 28 days away.'
  },
  {
    id: 'postnup-civil',
    title: 'Postnuptial Agreement (Civil Partnership)',
    tags: ['Postnup', 'Civil Partnership'],
    serviceName: 'Postnup',
    serviceTag: 'POSTNUP',
    subTag: 'CIVIL PARTNERSHIP',
    subtitle: 'I am already in a civil partnership, or my registration is within 28 days.',
    overviewTitle: 'Postnuptial Agreement (Civil Partnership)',
    overviewDescription: 'For registered civil partners or couples registering within 28 days to outline financial rights and asset divisions.',
    legalNote: 'Provides clear legal structure for partners already in or entering a civil partnership shortly.'
  },
  {
    id: 'cohabitation',
    title: 'Cohabitation Agreement',
    tags: ['Cohabitation', 'Cohabitation'],
    serviceName: 'Cohabitation',
    serviceTag: 'COHABITATION',
    subTag: 'COHABITATION',
    subtitle: 'I live with or Plan to live with my partner without marriage or civil partnership.',
    overviewTitle: 'Cohabitation Agreement',
    overviewDescription: 'Protects cohabiting couples who live together without marriage or civil partnership, detailing property ownership shares, bills, and joint financial responsibilities.',
    legalNote: 'Essential protection for unmarried couples sharing property or living expenses.'
  },
  {
    id: 'help-choose',
    title: 'Help Me Choose',
    tags: ['Guided', 'Consultation'],
    serviceName: 'Help Me Choose',
    serviceTag: 'GUIDED',
    subTag: 'SELECTION',
    subtitle: 'I am unsure which agreement best reflects my situation.',
    overviewTitle: 'Guided Agreement Selection',
    overviewDescription: 'Our interactive guide will ask a few simple questions regarding your relationship status and timelines to recommend the correct legal agreement.',
    legalNote: 'No commitment required—we will guide you to the appropriate legal pathway.'
  }
];

export const ONBOARDING_SERVICES: AgreementServiceItem[] = [
  {
    key: 'prenup',
    title: 'Prenuptial Agreement',
    badge: 'POPULAR',
    serviceTag: 'PRENUP',
    subtitle: 'For couples planning to marry or form a civil partnership (wedding > 28 days away).',
    subOptionCountText: '2 options (Marriage, Civil Partnership)',
  },
  {
    key: 'postnup',
    title: 'Postnuptial Agreement',
    serviceTag: 'POSTNUP',
    subtitle: 'For couples already married or entering a civil partnership within 28 days.',
    subOptionCountText: '2 options (Marriage, Civil Partnership)',
  },
  {
    key: 'cohabitation',
    title: 'Cohabitation Agreement',
    serviceTag: 'COHABITATION',
    subtitle: 'I live with or Plan to live with my partner without marriage or civil partnership.',
    subOptionCountText: '1 option (Cohabitation)',
  },
];

export default function OnboardingPage () {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // Steps: 1 = choose service, 2 = payment, 3 = confirmation.
  const [step, setStep] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string>('prenup-marriage');
  const [resideChecked, setResideChecked] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const caseId: string | undefined = user?.inviteCaseId;
  const userName: string = user?.firstName || 'there';
  const selectedOption = AGREEMENT_OPTIONS.find((o) => o.id === selectedId) || AGREEMENT_OPTIONS[0];

  const selectedService: 'prenup' | 'postnup' | 'cohabitation' | 'guided' =
    selectedId.startsWith('prenup')
      ? 'prenup'
      : selectedId.startsWith('postnup')
      ? 'postnup'
      : selectedId === 'cohabitation'
      ? 'cohabitation'
      : 'guided';

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
        if (res.completed && user?.paymentDone) {
          router.replace('/dashboard');
          return;
        }
        if (res.agreementType) {
          setSelectedId(res.agreementType);
        }
        setIsChecking(false);
      })
      .catch(() => setIsChecking(false));
  }, [user?.endUserType, user?.paymentDone, caseId, dispatch, router]);

  const handleSelectService = (serviceKey: 'prenup' | 'postnup' | 'cohabitation') => {
    if (serviceKey === 'prenup') {
      if (!selectedId.startsWith('prenup')) {
        setSelectedId('prenup-marriage');
      }
    } else if (serviceKey === 'postnup') {
      if (!selectedId.startsWith('postnup')) {
        setSelectedId('postnup-marriage');
      }
    } else if (serviceKey === 'cohabitation') {
      setSelectedId('cohabitation');
    }
  };

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
          understandsService: true,
        })
      ).unwrap();
      toast.success('Your service selection has been saved');
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to save your selection. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {/* Main Views */}
      {step === 1 && (
        <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 transition-all duration-300">
          {/* Left Column: 3 Agreement Options */}
          <section className="lg:col-span-5 space-y-5">
            {/* Header: Title and Help me choose button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              <div>
                <h1 className="text-2xl md:text-3xl font-serif-legal font-bold tracking-tight text-[#0F172A]">
                  Choose your Agreement
                </h1>
                <p className="text-[#5A6578] text-xs md:text-sm font-normal mt-1">
                  Select the agreement that best reflects your circumstances.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#C5A880] bg-[#FAF8F5] text-[#0F172A] hover:bg-[#0F172A] hover:text-[#FAF8F5] hover:border-[#0F172A] transition-all shadow-xs text-xs font-bold tracking-wider uppercase cursor-pointer self-start sm:self-auto group"
              >
                <HelpCircle className="w-4 h-4 text-[#8B3A3A] group-hover:text-[#C5A880] transition-colors" />
                <span>Help me choose</span>
              </button>
            </div>

            {/* Guided consultation banner if selected */}
            {selectedId === 'help-choose' && (
              <div className="p-3.5 rounded-xl bg-[#0F172A] text-white border border-[#C5A880] flex items-center justify-between text-xs shadow-md">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#C5A880]">Guided Mode:</span>
                  <span className="text-[#CBD5E1]">Our team will assist with your selection.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId('prenup-marriage')}
                  className="text-[11px] underline text-[#C5A880] hover:text-white cursor-pointer ml-2"
                >
                  Pick service
                </button>
              </div>
            )}

            {/* 3 Main Agreement Choices on the Left */}
            <div className="space-y-3.5" role="radiogroup" aria-label="3 Agreement Services">
              {ONBOARDING_SERVICES.map((service) => (
                <AgreementCard
                  key={service.key}
                  serviceKey={service.key}
                  title={service.title}
                  badge={service.badge}
                  serviceTag={service.serviceTag}
                  subtitle={service.subtitle}
                  subOptionCountText={service.subOptionCountText}
                  isSelected={selectedService === service.key}
                  onSelect={() => handleSelectService(service.key)}
                />
              ))}
            </div>
          </section>

          {/* Right Column: Sub-options (2 in Prenup/Postnup, 1 in Cohabitation) & Service Overview & Confirmation */}
          <aside className="lg:col-span-7 sticky top-24">
            <ServiceOverview
              selectedOption={selectedOption}
              selectedService={selectedService}
              selectedId={selectedId}
              onSelectSubOption={(id) => setSelectedId(id)}
              resideChecked={resideChecked}
              onResideChange={setResideChecked}
              onContinue={handleStep1Continue}
              isSubmitting={isSubmitting}
            />
          </aside>
        </main>
      )}

      {step === 2 && (
        <Step2Payment
          selectedOption={selectedOption}
          isPaid={Boolean(user?.paymentDone)}
          onBack={() => {
            setStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onChooseService={() => {
            setStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {step === 3 && (
        <Step3Success
          userName={userName}
          serviceTitle={selectedOption?.overviewTitle || 'Agreement Service'}
        />
      )}

      {/* Help Me Choose Guidance Modal */}
      <HelpMeChooseModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onSelect={(id) => {
          setSelectedId(id);
          toast.info('Agreement selected');
        }}
      />

      {/* Footer */}
      <footer className="w-full border-t border-[#E6E3DC] bg-white py-6 px-6 text-center">
        <p className="text-[0.72rem] text-[#64748B] max-w-4xl mx-auto leading-relaxed">
          &copy; 2026 Let&apos;s Prenup Ltd. All rights reserved. Independent legal advice provided by panel solicitors regulated by the SRA &amp; BSB.
        </p>
      </footer>
    </>
  );
};

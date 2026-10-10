'use client';

import React, { useState } from 'react';
import { HelpCircle, X, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface HelpMeChooseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export const HelpMeChooseModal: React.FC<HelpMeChooseModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [relationshipStatus, setRelationshipStatus] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setRelationshipStatus(null);
    setTimeline(null);
  };

  const handleChoose = (id: string) => {
    onSelect(id);
    onClose();
    handleReset();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div className="bg-[#FAF8F5] border-2 border-[#8B3A3A] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between border-b border-[#1E293B]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#8B3A3A] flex items-center justify-center text-white">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 id="help-modal-title" className="font-serif-legal font-bold text-base md:text-lg text-white">
                Help Me Choose
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                Find the right agreement for your situation in 2 simple steps
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5 text-[#0F172A]">
          {/* Step 1: Relationship Status */}
          {!relationshipStatus && (
            <div className="space-y-4">
              <div>
                <span className="text-[0.65rem] font-bold tracking-[0.16em] uppercase text-[#8B3A3A] block mb-1">
                  Step 1 of 2
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">
                  What best describes your current circumstances?
                </h3>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setRelationshipStatus('planning')}
                  className="w-full text-left p-4 rounded-xl border border-[#E6E3DC] hover:border-[#8B3A3A] hover:bg-white bg-white/70 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="font-bold text-xs md:text-sm text-[#0F172A] group-hover:text-[#8B3A3A]">
                      Planning to marry or register a civil partnership
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      We have a wedding or civil registration planned.
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#8B3A3A] flex-shrink-0 ml-2" />
                </button>

                <button
                  type="button"
                  onClick={() => setRelationshipStatus('already')}
                  className="w-full text-left p-4 rounded-xl border border-[#E6E3DC] hover:border-[#8B3A3A] hover:bg-white bg-white/70 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="font-bold text-xs md:text-sm text-[#0F172A] group-hover:text-[#8B3A3A]">
                      Already married or in a civil partnership
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      We are already legally married or registered.
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#8B3A3A] flex-shrink-0 ml-2" />
                </button>

                <button
                  type="button"
                  onClick={() => setRelationshipStatus('cohabitation')}
                  className="w-full text-left p-4 rounded-xl border border-[#E6E3DC] hover:border-[#8B3A3A] hover:bg-white bg-white/70 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="font-bold text-xs md:text-sm text-[#0F172A] group-hover:text-[#8B3A3A]">
                      Living together unmarried
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      We live together or plan to without marriage or civil partnership.
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#8B3A3A] flex-shrink-0 ml-2" />
                </button>

                <button
                  type="button"
                  onClick={() => setRelationshipStatus('unsure')}
                  className="w-full text-left p-4 rounded-xl border border-[#E6E3DC] hover:border-[#8B3A3A] hover:bg-white bg-white/70 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="font-bold text-xs md:text-sm text-[#0F172A] group-hover:text-[#8B3A3A]">
                      I'm unsure which agreement reflects my situation
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      I would like guided assistance and personal recommendations.
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#8B3A3A] flex-shrink-0 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: If Planning, ask timeline */}
          {relationshipStatus === 'planning' && !timeline && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[0.65rem] font-bold tracking-[0.16em] uppercase text-[#8B3A3A] block mb-1">
                    Step 2 of 2
                  </span>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    When is your planned wedding or registration date?
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-[#8B3A3A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Back
                </button>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setTimeline('more28')}
                  className="w-full text-left p-4 rounded-xl border border-[#E6E3DC] hover:border-[#8B3A3A] hover:bg-white bg-white/70 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="font-bold text-xs md:text-sm text-[#0F172A] group-hover:text-[#8B3A3A]">
                      More than 28 days away
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      There is ample time for legal advice before the date.
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#8B3A3A] flex-shrink-0 ml-2" />
                </button>

                <button
                  type="button"
                  onClick={() => setTimeline('less28')}
                  className="w-full text-left p-4 rounded-xl border border-[#E6E3DC] hover:border-[#8B3A3A] hover:bg-white bg-white/70 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="font-bold text-xs md:text-sm text-[#0F172A] group-hover:text-[#8B3A3A]">
                      Within the next 28 days
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      The wedding or registration is taking place shortly.
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#8B3A3A] flex-shrink-0 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {/* Case 1: Planning + More than 28 days -> PRENUP */}
          {relationshipStatus === 'planning' && timeline === 'more28' && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-[#8B3A3A] rounded-xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[0.62rem] font-extrabold tracking-wider px-2 py-0.5 rounded uppercase bg-[#8B3A3A] text-white">
                    RECOMMENDED
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-[#8B3A3A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Change Answers
                  </button>
                </div>
                <h3 className="text-lg font-serif-legal font-bold text-[#0F172A]">
                  Prenuptial Agreement
                </h3>
                <p className="text-xs text-[#5A6578] leading-relaxed">
                  Because your wedding or registration is more than 28 days away, a Prenuptial Agreement is the recommended legal route. It gives both parties enough time to complete financial disclosure and receive independent legal advice.
                </p>
                <div className="pt-2 border-t border-[#E6E3DC] space-y-2">
                  <div className="text-[11px] font-bold text-[#0F172A]">
                    Select your partnership type:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleChoose('prenup-marriage')}
                      className="p-3 rounded-lg bg-[#FAF8F5] border border-[#8B3A3A] hover:bg-[#8B3A3A] hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="font-bold text-xs">Marriage</div>
                      <div className="text-[10px] text-[#64748B] group-hover:text-white/80 mt-0.5">
                        Wedding &gt; 28 days away
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChoose('prenup-civil')}
                      className="p-3 rounded-lg bg-[#FAF8F5] border border-[#8B3A3A] hover:bg-[#8B3A3A] hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="font-bold text-xs">Civil Partnership</div>
                      <div className="text-[10px] text-[#64748B] group-hover:text-white/80 mt-0.5">
                        Registration &gt; 28 days away
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Case 2: Planning + Within 28 days -> POSTNUP */}
          {relationshipStatus === 'planning' && timeline === 'less28' && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-[#8B3A3A] rounded-xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[0.62rem] font-extrabold tracking-wider px-2 py-0.5 rounded uppercase bg-[#8B3A3A] text-white">
                    RECOMMENDED
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-[#8B3A3A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Change Answers
                  </button>
                </div>
                <h3 className="text-lg font-serif-legal font-bold text-[#0F172A]">
                  Postnuptial Agreement
                </h3>
                <p className="text-xs text-[#5A6578] leading-relaxed">
                  Under UK Law Commission guidance, signing an agreement within 28 days of your wedding carries legal validity risks. We recommend executing a <strong>Postnuptial Agreement</strong> shortly after your ceremony.
                </p>
                <div className="pt-2 border-t border-[#E6E3DC] space-y-2">
                  <div className="text-[11px] font-bold text-[#0F172A]">
                    Select your partnership type:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleChoose('postnup-marriage')}
                      className="p-3 rounded-lg bg-[#FAF8F5] border border-[#8B3A3A] hover:bg-[#8B3A3A] hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="font-bold text-xs">Marriage</div>
                      <div className="text-[10px] text-[#64748B] group-hover:text-white/80 mt-0.5">
                        Wedding within 28 days
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChoose('postnup-civil')}
                      className="p-3 rounded-lg bg-[#FAF8F5] border border-[#8B3A3A] hover:bg-[#8B3A3A] hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="font-bold text-xs">Civil Partnership</div>
                      <div className="text-[10px] text-[#64748B] group-hover:text-white/80 mt-0.5">
                        Registration within 28 days
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Case 3: Already married -> POSTNUP */}
          {relationshipStatus === 'already' && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-[#8B3A3A] rounded-xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[0.62rem] font-extrabold tracking-wider px-2 py-0.5 rounded uppercase bg-[#8B3A3A] text-white">
                    RECOMMENDED
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-[#8B3A3A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Change Answers
                  </button>
                </div>
                <h3 className="text-lg font-serif-legal font-bold text-[#0F172A]">
                  Postnuptial Agreement
                </h3>
                <p className="text-xs text-[#5A6578] leading-relaxed">
                  As you are already married or in a registered civil partnership, a <strong>Postnuptial Agreement</strong> is the legally appropriate framework to document and protect your assets.
                </p>
                <div className="pt-2 border-t border-[#E6E3DC] space-y-2">
                  <div className="text-[11px] font-bold text-[#0F172A]">
                    Select your partnership type:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleChoose('postnup-marriage')}
                      className="p-3 rounded-lg bg-[#FAF8F5] border border-[#8B3A3A] hover:bg-[#8B3A3A] hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="font-bold text-xs">Marriage</div>
                      <div className="text-[10px] text-[#64748B] group-hover:text-white/80 mt-0.5">
                        Already married
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChoose('postnup-civil')}
                      className="p-3 rounded-lg bg-[#FAF8F5] border border-[#8B3A3A] hover:bg-[#8B3A3A] hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="font-bold text-xs">Civil Partnership</div>
                      <div className="text-[10px] text-[#64748B] group-hover:text-white/80 mt-0.5">
                        Already in civil partnership
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Case 4: Cohabitation */}
          {relationshipStatus === 'cohabitation' && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-[#8B3A3A] rounded-xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[0.62rem] font-extrabold tracking-wider px-2 py-0.5 rounded uppercase bg-[#8B3A3A] text-white">
                    RECOMMENDED
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-[#8B3A3A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Change Answers
                  </button>
                </div>
                <h3 className="text-lg font-serif-legal font-bold text-[#0F172A]">
                  Cohabitation Agreement
                </h3>
                <p className="text-xs text-[#5A6578] leading-relaxed">
                  For couples living together without marriage or civil partnership, a <strong>Cohabitation Agreement</strong> defines ownership shares of property, bill arrangements, and joint assets.
                </p>
                <div className="pt-2 border-t border-[#E6E3DC]">
                  <button
                    type="button"
                    onClick={() => handleChoose('cohabitation')}
                    className="w-full py-3 px-4 rounded-lg bg-[#8B3A3A] text-white hover:bg-[#702E2E] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Select Cohabitation Agreement</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Case 5: Unsure -> Guided */}
          {relationshipStatus === 'unsure' && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-[#C5A880] rounded-xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[0.62rem] font-extrabold tracking-wider px-2 py-0.5 rounded uppercase bg-[#C5A880] text-[#0F172A]">
                    GUIDED ASSISTANCE
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-[#8B3A3A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Change Answers
                  </button>
                </div>
                <h3 className="text-lg font-serif-legal font-bold text-[#0F172A]">
                  Guided Agreement Selection
                </h3>
                <p className="text-xs text-[#5A6578] leading-relaxed">
                  Our interactive guide and legal specialists will help walk through your timeline and relationship setup before proceeding.
                </p>
                <div className="pt-2 border-t border-[#E6E3DC]">
                  <button
                    type="button"
                    onClick={() => handleChoose('help-choose')}
                    className="w-full py-3 px-4 rounded-lg bg-[#0F172A] text-white hover:bg-[#1E293B] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Select Guided Consultation</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


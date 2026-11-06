"use client";

import { useRouter } from "next/navigation";
import { ClipboardList, Gavel } from "lucide-react";

type Pre = Record<string, any> | undefined;

type IlaStep = {
  id: string;
  route: string;
  title: string;
  description: string;
  tile: string;
  icon: React.ReactNode;
  done: boolean;
  /** The partner's two steps are theirs to complete, not this user's. */
  mine: boolean;
  /** Mine, but not open yet (the lawyer list needs the questionnaire first) */
  blocked?: boolean;
  cta: string;
};

const rowButtonBase =
  "ml-4 flex-shrink-0 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-colors";
const rowButtonDone = `${rowButtonBase} bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0]`;
const rowButtonTodo = `${rowButtonBase} bg-primary text-white hover:bg-primary/90`;
const rowButtonMuted = `${rowButtonBase} bg-[#F1F1F6] text-[#9494AA] hover:bg-[#E8E8F0]`;

/**
 * What is left once the case manager has approved the case: each partner's
 * pre-lawyer questionnaire and their choice of independent lawyer. It takes
 * the place of "Your Prenup Journey" at this stage and follows the same
 * shape, so the dashboard reads the same way throughout.
 */
export default function LegalAdviceJourney({
  myPre,
  partnerPre,
}: {
  myPre: Pre;
  partnerPre: Pre;
}) {
  const router = useRouter();

  const myQuestionnaireDone = Boolean(myPre?.submitted);
  const myLawyerChosen = Boolean(myPre?.selectedLawyer);
  const partnerQuestionnaireDone = Boolean(partnerPre?.submitted);
  const partnerLawyerChosen = Boolean(partnerPre?.selectedLawyer);

  const steps: IlaStep[] = [
    {
      id: "my-questionnaire",
      route: "/dashboard/lawyer-questionaries",
      title: "My pre-lawyer questionnaire",
      description:
        "Tell us what matters to you so we can match you with the right lawyer.",
      tile: "from-[#A78BFA] to-[#7C3AED]",
      icon: <ClipboardList className="h-5 w-5" strokeWidth={1.8} />,
      done: myQuestionnaireDone,
      mine: true,
      cta: myQuestionnaireDone ? "Completed" : "Start",
    },
    {
      id: "my-lawyer",
      route: "/dashboard/lawyer-selection",
      title: "My lawyer selection",
      description:
        "Choose the independent lawyer who will review the agreement with you.",
      tile: "from-[#60A5FA] to-[#2563EB]",
      icon: <Gavel className="h-5 w-5" strokeWidth={1.8} />,
      done: myLawyerChosen,
      mine: true,
      blocked: !myQuestionnaireDone,
      cta: myLawyerChosen ? "Completed" : "Choose Lawyer",
    },
    {
      id: "partner-questionnaire",
      route: "/dashboard/partner-lawyer-questionaries",
      title: "Partner's pre-lawyer questionnaire",
      description: "Your partner answers the same questions for their lawyer.",
      tile: "from-[#FB7185] to-[#E11D48]",
      icon: <ClipboardList className="h-5 w-5" strokeWidth={1.8} />,
      done: partnerQuestionnaireDone,
      mine: false,
      cta: partnerQuestionnaireDone ? "Completed" : "View",
    },
    {
      id: "partner-lawyer",
      route: "/dashboard/partner-lawyer-selection",
      title: "Partner's lawyer selection",
      description: "Your partner picks their own independent lawyer.",
      tile: "from-[#34D399] to-[#059669]",
      icon: <Gavel className="h-5 w-5" strokeWidth={1.8} />,
      done: partnerLawyerChosen,
      mine: false,
      cta: partnerLawyerChosen ? "Completed" : "View",
    },
  ];

  const activeIndex = steps.findIndex((s) => !s.done);

  const statusLabel = (step: IlaStep, isActive: boolean) => {
    if (step.done) return "Completed";
    if (!step.mine) return "Awaiting partner";
    if (step.blocked) return "Not started";
    return isActive ? "In progress" : "Not started";
  };

  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold tracking-tight text-[#1E1B3C]">
        Independent Legal Advice
      </h2>
      <p className="mt-1 text-sm text-[#6B6B80]">
        Your case manager has approved your case. Each of you now needs your own
        independent lawyer before the agreement can be signed.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {steps.map((step, i) => {
          const isActive = i === activeIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition-colors ${
                isActive
                  ? "border-[#DDD6FE] bg-[#FAF9FF]"
                  : "border-[#EDEDF5] bg-white"
              }`}
            >
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${step.tile}`}
              >
                {step.icon}
              </div>

              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-sm font-bold text-[#6D28D9]">
                {i + 5}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-[#1E1B3C]">
                  {step.title}
                </div>
                <div className="mt-0.5 max-w-md text-xs text-[#8A8AA0]">
                  {step.description}
                </div>
              </div>

              <div className="hidden w-28 flex-shrink-0 text-right text-xs font-medium text-[#8A8AA0] lg:block">
                {statusLabel(step, isActive)}
              </div>

              {step.blocked && !step.done ? (
                <button
                  type="button"
                  disabled
                  title="Available once your questionnaire is submitted"
                  className={`${rowButtonBase} cursor-not-allowed bg-[#F1F1F6] text-[#9494AA] opacity-80`}
                >
                  {step.cta}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push(step.route)}
                  className={
                    step.done
                      ? rowButtonDone
                      : step.mine
                        ? rowButtonTodo
                        : rowButtonMuted
                  }
                >
                  {step.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

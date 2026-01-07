// "use client";

// import React, { useEffect, useState } from "react";

// // Questions array (each string is the content to display — do NOT prefix with the word "Question").
// const QUESTIONS: string[] = [
//   `Ahead of your meeting with your lawyer, wenup is providing you with this questionnaire on their behalf to help you use your time together most effectively. Before we start, can you confirm that you are alone and are answering these questions without input from anyone else?`,
//   `Great, This Questionnaire includes general guidance but does not constitute legal advice. Your answers will be provided to your lawyer to help them give you formal legal advice in relation to your agreement. Wenup does not provide legal advice, only the lawyers you are assigned are qualified to do this. Is that understood?`,
//   `This Questionnaire should take 20 minutes to complete. If you exit at any time you will have to start again, so please make sure you have the time to complete the questionnaire in full.`,
//   `Guidance on the legal standing of a nuptial agreement in England and Wales: the current law, your duty to give full financial disclosure worldwide, and circumstances where a court may vary or ignore the agreement.`,
//   `A nuptial agreement in UK law is not automatically legally binding but can be "persuasive". In plain English, if a court considers the agreement when deciding finances on divorce, it may make orders in line with the agreement if certain circumstances are present.`,
//   `Prior to 2010, nuptial agreements were often disregarded by courts. The law changed following the Supreme Court decision in Radmacher v Granatino (2010), which gives nuptial agreements greater weight.`,
//   `Please confirm you have read this summary of the Radmacher case and its effects on the law.`,
//   `Criteria to be met for a nuptial agreement to be upheld: you and your partner freely enter the agreement; you both fully appreciate the implications; and it would be fair to hold you to the terms at the time of divorce.`,
//   `The next set of questions are designed to ensure that you comply with the criteria above: freedom from coercion, understanding of terms, and fairness. Your lawyer relies on your truthful answers. Is that clear?`,
//   `Wenup and the lawyer Wenup refers you to do not accept responsibility if a judge later makes orders that differ from the terms of the agreement, especially if information provided was inaccurate. Given this, do you confirm you understand?`,
//   `Given this guidance, can you confirm that you understand the criteria described above that need to be fulfilled for your agreement to be upheld? (Options: read & understood; read & have questions; do not understand)`,
//   `The division of finances in a divorce without a nuptial agreement: starting point is equal sharing of capital and pensions subject to needs. Are you content that by signing this agreement you may be waiving rights to an equal share?`,
//   `The following questions assist your allocated lawyer to determine whether you need additional time or alternative advice before your 1-hour meeting. Please answer truthfully. Is that clear?`,
//   `Please do not feel under obligation — if you do not wish to answer, your lawyer may advise you to speak to another independent lawyer or barrister. Are you happy to continue?`,
//   `Can you confirm that no one has asked you to enter into this agreement against your will?`,
//   `Can you confirm that no one (partner or family) has told you the marriage will not go ahead unless you enter the agreement?`,
//   `If your marriage/relationship ended and a lawyer (or judge) asked you “did you voluntarily enter the agreement?”, would your answer be yes or no?`,
//   `Full frank and clear disclosure of all assets: Have you completed all asset sections (capital, income, pensions, business assets, crypto)?`,
//   `Can you confirm that you have included all assets in any country (for instance property or trust assets held abroad)?`,
//   `Can you confirm you have provided up-to-date information/values for all assets, pensions, income and business values in the agreement?`,
//   `Can you confirm that you have disclosed interests you are likely to have in the future that are relevant to your agreement?`,
//   `Pensions: are you content to proceed without further advice from a PODE (Pension on Divorce expert) or do you need more time/advice? (Options: content to proceed; have questions; do not understand)`,
//   `Are you satisfied the terms of the proposed agreement adequately provide for your income needs (day-to-day living) if the marriage breaks down and terms are implemented?`,
//   `Are you satisfied the terms adequately provide for your housing needs in that event?`,
//   `If you have children under 18, have you referred to them in the agreement? If not applicable, select 'Not Applicable'.`,
//   `Do either of you have children over 18 with special needs? If so, does the agreement make financial provision for them? If N/A, select 'Not Applicable'.`,
//   `Are you satisfied that the terms adequately provide for your pension needs on retirement if the marriage breaks down and terms are implemented?`,
//   `Can you confirm that you have considered your needs (home and income) and your partner's needs if the marriage breaks down and terms are implemented?`,
//   `How old are you and how old is your partner?`,
//   `Do either of you have any health or medical issues?`,
//   `How long have you and your partner lived together?`
// ];

// export default function QuestionsPage() {
//   const [index, setIndex] = useState(0);
//   // answers: 'yes' | 'no' | null
//   const [answers, setAnswers] = useState<("yes" | "no" | null)[]>(() => Array(QUESTIONS.length).fill(null));

//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, QUESTIONS.length - 1));
//       if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
//     }
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   const next = () => setIndex((i) => Math.min(i + 1, QUESTIONS.length - 1));
//   const prev = () => setIndex((i) => Math.max(i - 1, 0));

//   const setAnswer = (qIndex: number, val: "yes" | "no") => {
//     setAnswers((prev) => {
//       const copy = [...prev];
//       copy[qIndex] = val;
//       return copy;
//     });
//   };

//   return (
//     <div className="h-full">
//       <div className="w-full max-w-5xl mx-auto pl-16 py-2 pr-26">

//         <header className="mb-10">
//           <h1 className="text-3xl font-normal text-text-color">Pre-Meeting Questionnaire</h1>
//           <p className="mt-2 text-[15px] font-light text-text-color">Your answers will be shared with your assigned lawyer. Please answer honestly.</p>
//         </header>

//         <section className="space-y-10 bg-gradient-to-br from-secondary to-primary-foreground text-black py-10 px-10 rounded-lg ">
//           {/* Progress */}
//           <div className="mb-4">
//             <div className="flex items-center justify-between text-sm text-slate-500">
//               <div>{index + 1} of {QUESTIONS.length}</div>
//               <div className="text-xs">Tip: use ← → keys to navigate</div>
//             </div>

//             <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
//               <div
//                 className="h-full rounded-full transition-all"
//                 style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%`, background: "linear-gradient(90deg,#1E3A8A,#76E0FF)" }}
//               />
//             </div>
//           </div>

//           {/* Question content centered */}
//           <div className=" flex flex-col items-center justify-center gap-6">
//             <div className="prose prose-slate max-w-none text-center text-lg md:text-xl leading-relaxed mt-8">
//               <p>{QUESTIONS[index]}</p>
//             </div>

//             {/* Yes / No buttons */}
//             <div className="flex items-center gap-4 mt-6">
//               <button
//                 onClick={() => setAnswer(index, "yes")}
//                 className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${answers[index] === 'yes' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-700 border-slate-200 hover:shadow'}`}
//                 aria-pressed={answers[index] === 'yes'}
//                 aria-label="Answer Yes"
//               >
//                 Yes
//               </button>

//               <button
//                 onClick={() => setAnswer(index, "no")}
//                 className={`px-6 py-2 rounded-full font-medium shadow-sm border-2 ${answers[index] === 'no' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700 border-slate-200 hover:shadow'}`}
//                 aria-pressed={answers[index] === 'no'}
//                 aria-label="Answer No"
//               >
//                 No
//               </button>
//             </div>

//             {/* Selected answer text */}
//             <div className="text-sm text-slate-500">
//               {answers[index] ? `Selected: ${answers[index].toUpperCase()}` : 'No answer selected yet.'}
//             </div>
//           </div>

//           {/* Navigation buttons */}
//           <div className="flex items-center justify-between">
//             <button
//               onClick={prev}
//               disabled={index === 0}
//                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow"
//                 aria-label="Previous question"
//             >
//               Previous
//             </button>

//             <div className="flex items-center gap-3">

//               <button
//                 onClick={() => {
//                   if (index === QUESTIONS.length - 1) {
//                     // finished behaviour — simple summary for now
//                     const answered = answers.filter(Boolean).length;
//                     alert(`You have finished the questionnaire. Answers provided: ${answered} of ${QUESTIONS.length}`);
//                   } else next();
//                 }}
//                 className="px-6 py-2 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#76E0FF] text-white font-medium shadow"
//                 aria-label={index === QUESTIONS.length - 1 ? 'Finish questionnaire' : 'Next question'}
//               >
//                 {index === QUESTIONS.length - 1 ? 'Finish' : 'Next'}
//               </button>
//             </div>
//           </div>

//         </section>
//       </div>
//     </div>
//   );
// }



import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page
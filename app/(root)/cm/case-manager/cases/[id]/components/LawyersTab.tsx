"use client";

interface Props {
  caseData: any;
}

export default function LawyersTab({
  caseData,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="border rounded-xl p-5">
        <h3 className="font-semibold mb-3">
          User 1 Lawyer
        </h3>

        <div>
          {caseData.preQuestionnaireUser1
            ?.selectedLawyer || "Not Assigned"}
        </div>
      </div>

      <div className="border rounded-xl p-5">
        <h3 className="font-semibold mb-3">
          User 2 Lawyer
        </h3>

        <div>
          {caseData.preQuestionnaireUser2
            ?.selectedLawyer || "Not Assigned"}
        </div>
      </div>
    </div>
  );
}
"use client";

import { Mail } from "lucide-react";

interface Props {
  caseData: any;
}

export default function EmailsTab({
  caseData,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="border rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Mail size={18} />

          <span className="font-semibold">
            Owner Email
          </span>
        </div>

        <div className="mt-2">
          {caseData.owner?.email}
        </div>
      </div>

      {caseData.invitedEmail && (
        <div className="border rounded-xl p-4">
          {caseData.invitedEmail}
        </div>
      )}
    </div>
  );
}
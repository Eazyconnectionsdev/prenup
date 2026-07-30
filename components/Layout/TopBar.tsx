import React from 'react'

import { BellIcon } from 'lucide-react'

const TopBar = ({ caseId }: { caseId: string }) => {
  return (
        <div className="flex items-center justify-end gap-4 border-b border-[#E7E7F2] bg-white px-8 py-4">
      <span className="text-sm font-semibold text-[#1E1B3C]">
        Case ID: <span className="font-mono font-normal text-[#5B5B75]">{caseId}</span>
      </span>
      <button
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E7F2] text-[#5B5B75] hover:bg-[#F4F4FA]"
      >
        <BellIcon />
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-semibold text-white">
          1
        </span>
      </button>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDE9FE] text-xs font-semibold text-[#5B21B6]">
        KB
      </div>
    </div>
  )
}

export default TopBar


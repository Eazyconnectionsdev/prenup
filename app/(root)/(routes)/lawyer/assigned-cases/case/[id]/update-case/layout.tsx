import UpdateCaseSidebar from '@/components/caseManager/updateCaseSideBar'
import React, { ReactNode } from 'react'

const UpdateCaseLayout = ({children} : {children : ReactNode}) => {
  return (
    <div className="flex min-h-[calc(100vh-76px)]">
      <UpdateCaseSidebar />
      <div className="flex-1 min-w-0 p-8 bg-gray-50">{children}</div>
    </div>
  )
}

export default UpdateCaseLayout
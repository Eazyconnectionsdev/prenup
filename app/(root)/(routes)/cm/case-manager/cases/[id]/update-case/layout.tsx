import UpdateCaseSidebar from '@/components/caseManager/updateCaseSideBar'
import React, { ReactNode } from 'react'

const UpdateCaseLayout = ({children} : {children : ReactNode}) => {
  return (
    <div className="flex min-h-screen">
      <UpdateCaseSidebar />
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  )
}

export default UpdateCaseLayout
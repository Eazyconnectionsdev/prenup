import React from 'react'
import { AppSidebar } from './AppSidebar'

const Sidebar = ({children} : {children : React.ReactNode}) => {
  return (
    <div className="flex h-full">
      <AppSidebar />
      
      <main className="h-screen overflow-y-auto flex-1 p-8">
       {children}
      </main>
    </div>
  )
}

export default Sidebar
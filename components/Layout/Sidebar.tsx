import React from 'react'
import AppSidebar from './AppSidebar'

const Sidebar = ({children} : {children : React.ReactNode}) => {
  return (
    <div className="flex h-full">
      <AppSidebar />
      
      <main className="relative h-screen flex-1 overflow-y-auto">
       {children}
      </main>
    </div>
  )
}

export default Sidebar
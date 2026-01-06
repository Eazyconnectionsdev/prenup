"use client"

import { useEffect, useState } from 'react'
import InvitePartnerModal from '@/components/modals/invite-partner'

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[])

    if(!isMounted){
        return null;
    }

  return (
    <>
    <InvitePartnerModal />
    </>
  )
}

export default ModalProvider
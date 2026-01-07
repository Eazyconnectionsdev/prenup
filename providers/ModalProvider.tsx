"use client"

import { useEffect, useState } from 'react'
import InvitePartnerModal from '@/components/modals/invite-partner'
import { useIsMounted } from '@/hooks/useIsMounted';

const ModalProvider = () => {

  const isMounted = useIsMounted();

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
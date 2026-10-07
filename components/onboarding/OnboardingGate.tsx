"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getOnboarding } from "@/store/asyncThunk/casesThunk";

// Sends user 1 to onboarding if they haven't completed it yet. Partners
// (user 2) and staff are never sent there.
export default function OnboardingGate() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const isUser1 = user?.role === "end_user" && user?.endUserType === "user1";
  const caseId: string | undefined = user?.inviteCaseId;

  useEffect(() => {
    if (!isUser1 || !caseId) return;
    dispatch(getOnboarding(caseId))
      .unwrap()
      .then((res) => {
        if (!res.completed) router.replace("/onboarding");
      })
      .catch(() => {
        // Don't block the dashboard if the check itself fails.
      });
  }, [isUser1, caseId, dispatch, router]);

  return null;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getOnboarding } from "@/store/asyncThunk/casesThunk";
import {
  getFreshProfile,
  getPendingInvite,
} from "@/store/asyncThunk/authThunk";
import { SERVICE_SELECTOR_HREF } from "@/components/ServiceStatus";
import { isPendingInviteSnoozed } from "@/lib/inviteSnooze";

// Pages a client can use before they have chosen an agreement.
const EXEMPT_PATHS = [SERVICE_SELECTOR_HREF, "/dashboard/profile-settings"];

// Right after registering (and whenever a client has not finished choosing
// their agreement) the dashboard hands them to the service selector, which is
// where the legal matter, and so the Case ID, is started.
//
// A brand-new account has no case at all. If someone has already invited that
// email, the invitation comes first, so the person joins their partner's case
// instead of starting a second one. Partners (user 2) and staff are never sent
// to onboarding.
export default function OnboardingGate() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  // The persisted user can be out of date (a case was started elsewhere, or a
  // partner was removed), so decide only from a profile fetched this load.
  const [fresh, setFresh] = useState(false);
  useEffect(() => {
    let active = true;
    dispatch(getFreshProfile()).finally(() => {
      if (active) setFresh(true);
    });
    return () => {
      active = false;
    };
  }, [dispatch]);

  const isUser1 = user?.role === "end_user" && user?.endUserType === "user1";
  const caseId: string | undefined = user?.inviteCaseId || undefined;
  const exempt = EXEMPT_PATHS.some((p) => pathname?.startsWith(p));

  // Onboarding is asked about once per case, not on every page change.
  const completedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!fresh || !isUser1 || exempt) return;
    let active = true;

    if (!caseId) {
      (async () => {
        let inviteCaseId: string | null = null;
        if (!isPendingInviteSnoozed()) {
          try {
            const invite = await dispatch(getPendingInvite()).unwrap();
            inviteCaseId = invite?.caseId ?? null;
          } catch {
            // No invitation to show is the same as none existing.
          }
        }
        if (!active) return;
        router.replace(
          inviteCaseId
            ? `/accept-invite?caseId=${encodeURIComponent(inviteCaseId)}`
            : SERVICE_SELECTOR_HREF,
        );
      })();
      return () => {
        active = false;
      };
    }

    if (completedFor.current === caseId) return;
    dispatch(getOnboarding(caseId))
      .unwrap()
      .then((res) => {
        if (!active) return;
        if (res.completed) completedFor.current = caseId;
        else router.replace(SERVICE_SELECTOR_HREF);
      })
      .catch(() => {
        // Don't block the dashboard if the check itself fails.
      });
    return () => {
      active = false;
    };
  }, [fresh, isUser1, caseId, exempt, dispatch, router]);

  return null;
}

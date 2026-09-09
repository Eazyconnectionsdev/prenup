"use client";

import { Lock, Info } from "lucide-react";
import { formatVersionDate } from "@/lib/utils";
import type { LockStatus } from "@/types/types-agreement";

interface LockPanelProps {
  lockStatus: LockStatus | null;
  lockStatusError: string | null;
  onRetryLockStatus: () => void;
  isCheckingOut: boolean;
  checkOutError: string | null;
  onCheckOut: () => void;
  isCheckingIn: boolean;
  checkInError: string | null;
  onCheckIn: () => void;
}

export function LockPanel({
  lockStatus,
  lockStatusError,
  onRetryLockStatus,
  isCheckingOut,
  checkOutError,
  onCheckOut,
  isCheckingIn,
  checkInError,
  onCheckIn,
}: LockPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-card px-5 py-4">
      <h2 className="text-[15px] font-semibold">Check-In / Check-Out</h2>

      {lockStatus?.isLocked ? (
        <>
          <dl className="mt-3 space-y-2.5 text-[12.5px]">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <span className="rounded-md bg-[color-mix(in_oklab,var(--chart-4)_28%,white)] px-2 py-0.5 text-[11px] font-semibold text-[color-mix(in_oklab,var(--chart-1)_75%,black)]">
                  Checked Out
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Checked Out By</dt>
              <dd className="font-medium">
                {lockStatus.lockedByName} ({lockStatus.lockedByRole})
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Checked Out On</dt>
              <dd className="font-medium">
                {lockStatus.lockedAt
                  ? formatVersionDate(lockStatus.lockedAt)
                  : "—"}
              </dd>
            </div>
          </dl>

          {lockStatus.isLockedByCurrentUser ? (
            <>
              <button
                onClick={onCheckIn}
                disabled={isCheckingIn}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-destructive px-3 py-2.5 text-[13px] font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
              >
                <Lock className="h-3.5 w-3.5" />
                {isCheckingIn ? "Checking in…" : "Check In"}
              </button>
              <div className="mt-3 flex gap-2.5 rounded-lg bg-accent/60 px-3 py-3">
                <Info className="h-4 w-4 shrink-0 text-primary" />
                <p className="text-[11.5px] text-accent-foreground">
                  Please check in the document after you finish reviewing to
                  avoid conflicts.
                </p>
              </div>
            </>
          ) : (
            <div className="mt-4 flex gap-2.5 rounded-lg bg-accent/60 px-3 py-3">
              <Info className="h-4 w-4 shrink-0 text-primary" />
              <p className="text-[11.5px] text-accent-foreground">
                This document is currently checked out by{" "}
                {lockStatus.lockedByName}. You can check it out once they check
                it back in.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mt-3 flex items-center justify-between gap-4 text-[12.5px]">
            <span className="text-muted-foreground">Status</span>
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
              Available
            </span>
          </div>
          <button
            onClick={onCheckOut}
            disabled={isCheckingOut}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Lock className="h-3.5 w-3.5" />
            {isCheckingOut ? "Checking out…" : "Check Out"}
          </button>
        </>
      )}
    </section>
  );
}

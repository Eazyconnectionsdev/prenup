"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "./Modal";
import type { ConfirmModalProps, ConfirmTone } from "@/types/ui/modal";

/**
 * A yes/no question. The outer structure comes from {@link Modal}; this adds
 * the icon, the question and the cancel/confirm pair, and holds the buttons
 * disabled while the action is running so it cannot be fired twice.
 */

const TONES: Record<
  ConfirmTone,
  { bubble: string; confirm: string; icon: React.ReactNode }
> = {
  danger: {
    bubble: "bg-red-100 text-red-600",
    confirm: "bg-red-600 hover:bg-red-700 text-white",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  warning: {
    bubble: "bg-amber-100 text-amber-700",
    confirm: "bg-amber-600 hover:bg-amber-700 text-white",
    icon: <ShieldAlert className="h-5 w-5" />,
  },
  info: {
    bubble: "bg-sky-100 text-sky-700",
    confirm: "bg-sky-600 hover:bg-sky-700 text-white",
    icon: <Info className="h-5 w-5" />,
  },
  success: {
    bubble: "bg-emerald-100 text-emerald-700",
    confirm: "bg-emerald-600 hover:bg-emerald-700 text-white",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  primary: {
    bubble: "bg-primary/10 text-primary",
    confirm: "bg-primary hover:bg-primary/90 text-white",
    icon: <Info className="h-5 w-5" />,
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  children,
  confirmLabel = "Confirm",
  loadingLabel,
  cancelLabel = "Cancel",
  tone = "primary",
  icon,
  hideIcon = false,
  isLoading,
  confirmDisabled = false,
  size = "sm",
}: ConfirmModalProps) {
  // `onConfirm` may be async. Unless the caller drives the state itself with
  // `isLoading`, the modal tracks it so the spinner needs no extra wiring.
  const [isRunning, setIsRunning] = useState(false);
  const busy = isLoading ?? isRunning;
  const palette = TONES[tone];

  const handleConfirm = async () => {
    if (busy) return;
    try {
      setIsRunning(true);
      await onConfirm();
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={busy ? () => {} : onClose}
      title={title}
      size={size}
      // While the action runs, closing would leave it half-done with no sign
      // of what happened, so every exit is held shut until it settles.
      closeOnBackdrop={!busy}
      closeOnEscape={!busy}
      showCloseButton={!busy}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy || confirmDisabled}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              palette.confirm,
            )}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? (loadingLabel ?? `${confirmLabel}…`) : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        {!hideIcon && (
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              palette.bubble,
            )}
          >
            {icon ?? palette.icon}
          </div>
        )}

        <div className="min-w-0 flex-1 text-sm text-muted-foreground">
          {description && <p>{description}</p>}
          {children}
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;

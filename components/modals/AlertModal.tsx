"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "./Modal";
import type { AlertModalProps, AlertTone } from "@/types/ui/modal";

/**
 * An information or warning dialog: something to read and dismiss, optionally
 * with one action to follow it up. The outer structure comes from
 * {@link Modal}; nothing here draws an overlay of its own.
 */

const TONES: Record<
  AlertTone,
  { bubble: string; button: string; icon: React.ReactNode }
> = {
  info: {
    bubble: "bg-[#EDE9FE] text-[#6D28D9]",
    button: "bg-primary hover:bg-primary/90 text-white",
    icon: <Info className="h-5 w-5" />,
  },
  warning: {
    bubble: "bg-amber-100 text-amber-700",
    button: "bg-amber-600 hover:bg-amber-700 text-white",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  success: {
    bubble: "bg-emerald-100 text-emerald-700",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  error: {
    bubble: "bg-red-100 text-red-600",
    button: "bg-red-600 hover:bg-red-700 text-white",
    icon: <XCircle className="h-5 w-5" />,
  },
};

const quietButton =
  "cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary";

export function AlertModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  tone = "info",
  icon,
  hideIcon = false,
  closeLabel = "Close",
  action,
  size = "sm",
}: AlertModalProps) {
  const palette = TONES[tone];

  // With a follow-up action, that action is the loud button and the dismiss is
  // the quiet one -- unless the caller asks for the reverse.
  const actionIsPrimary = Boolean(action) && !action?.secondary;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <>
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className={cn(
                actionIsPrimary
                  ? `rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-colors cursor-pointer ${palette.button}`
                  : quietButton,
                actionIsPrimary && "order-2",
              )}
            >
              {action.label}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className={cn(
              actionIsPrimary
                ? quietButton
                : `rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-colors cursor-pointer ${palette.button}`,
              actionIsPrimary && "order-1",
            )}
          >
            {closeLabel}
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

export default AlertModal;

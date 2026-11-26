"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModalProps, ModalSize } from "@/types/ui/modal";

/**
 * The one modal layout in the application.
 *
 * Every dialog, popup and confirmation renders through this component: it owns
 * the backdrop, the panel, the header and its close button, the scrolling body
 * and the footer. Specialised modals (DeleteModal, ConfirmModal, AlertModal and
 * the feature modals beside them) supply content and buttons only -- none of
 * them draw their own overlay, so there is a single place to change how a modal
 * looks or behaves.
 */

const SIZE_CLASSES: Record<ModalSize, string> = {
  xs: "max-w-sm",
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  "2xl": "max-w-5xl",
  full: "max-w-7xl",
};

// Stacked modals share one scroll lock: the page only gets scrolling back when
// the last one has closed, so an inner modal cannot unlock the page under an
// outer one that is still open. The value to restore is read once, as the first
// modal opens -- reading it per modal would capture the `hidden` an outer modal
// had already set and leave the page unscrollable for good.
let openModalCount = 0;
let overflowBeforeFirstModal = "";

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  headerAccessory,
  headerVariant = "default",
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  bodyClassName,
  footerClassName,
  ariaLabel,
}: ModalProps) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Escape to close, plus the body scroll lock.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    if (openModalCount === 0) {
      overflowBeforeFirstModal = document.body.style.overflow;
    }
    openModalCount += 1;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      openModalCount -= 1;
      if (openModalCount === 0) {
        document.body.style.overflow = overflowBeforeFirstModal;
      }
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Move focus into the panel so the keyboard follows the dialog, and hand it
  // back to whatever opened it on the way out.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  const isDark = headerVariant === "dark";
  const titleId = title ? `${id}-title` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;
  const hasHeader = Boolean(title || description || icon || showCloseButton);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 backdrop-blur-[2px] duration-150 animate-in fade-in sm:items-center sm:px-6"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={titleId ? undefined : (ariaLabel ?? "Dialog")}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(
          "my-auto flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl outline-none duration-200 animate-in fade-in zoom-in-95",
          SIZE_CLASSES[size],
          className,
        )}
      >
        {hasHeader && (
          <div
            className={cn(
              "flex shrink-0 items-start justify-between gap-3 border-b px-5 py-4 sm:px-6",
              isDark
                ? "border-slate-800 bg-slate-900 text-white"
                : "border-border bg-card",
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              {icon && <div className="shrink-0">{icon}</div>}

              {(title || description) && (
                <div className="min-w-0">
                  {title && (
                    <div className="flex flex-wrap items-center gap-2">
                      <h2
                        id={titleId}
                        className={cn(
                          "truncate text-base font-bold tracking-tight",
                          isDark ? "text-white" : "text-foreground",
                        )}
                      >
                        {title}
                      </h2>
                      {headerAccessory}
                    </div>
                  )}

                  {description && (
                    <p
                      id={descriptionId}
                      className={cn(
                        "mt-0.5 text-xs",
                        isDark ? "text-slate-400" : "text-muted-foreground",
                      )}
                    >
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className={cn(
                  "-mr-1.5 shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors",
                  isDark
                    ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto p-5 sm:p-6",
            bodyClassName,
          )}
        >
          {children}
        </div>

        {footer && (
          <div
            className={cn(
              "flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-border bg-card px-5 py-4 sm:px-6",
              footerClassName,
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;

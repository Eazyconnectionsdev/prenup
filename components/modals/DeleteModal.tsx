"use client";

import { Trash2 } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";
import type { DeleteModalProps } from "@/types/ui/modal";

/**
 * The one delete confirmation. It is a {@link ConfirmModal} fixed to the danger
 * tone with delete wording, so every "this cannot be undone" in the
 * application reads and behaves identically.
 */
export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  title,
  description,
  children,
  confirmLabel = "Delete",
  loadingLabel = "Deleting…",
  cancelLabel = "Cancel",
  icon,
  hideIcon,
  isLoading,
  isDeleting,
  confirmDisabled,
  size = "sm",
}: DeleteModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      tone="danger"
      icon={icon ?? <Trash2 className="h-5 w-5" />}
      hideIcon={hideIcon}
      title={title ?? (itemName ? `Delete ${itemName}?` : "Delete item?")}
      description={
        description ??
        (children
          ? undefined
          : `Are you sure you want to delete ${
              itemName ? `“${itemName}”` : "this item"
            }? This action cannot be undone.`)
      }
      confirmLabel={confirmLabel}
      loadingLabel={loadingLabel}
      cancelLabel={cancelLabel}
      isLoading={isDeleting ?? isLoading}
      confirmDisabled={confirmDisabled}
      size={size}
    >
      {children}
    </ConfirmModal>
  );
}

export default DeleteModal;

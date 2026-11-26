import type { ReactNode } from "react";

/**
 * Panel widths. One scale for the whole application so two modals that hold
 * roughly the same amount never end up different widths.
 */
export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

/**
 * The two header skins. `default` is the light header almost everything uses;
 * `dark` is for the handful of screens whose modal deliberately reads as a
 * record/inspection window.
 */
export type ModalHeaderVariant = "default" | "dark";

export interface ModalProps {
  isOpen: boolean;
  /** Called by the close button, the Escape key and the backdrop. */
  onClose: () => void;

  /** Rendered as the header heading, and used as the dialog's accessible name. */
  title?: ReactNode;
  /** Optional second line under the title. */
  description?: ReactNode;
  /** Optional badge/avatar to the left of the title. */
  icon?: ReactNode;
  /** Optional extra node beside the title, e.g. a status pill. */
  headerAccessory?: ReactNode;
  headerVariant?: ModalHeaderVariant;

  children: ReactNode;
  /** Pinned action row along the bottom of the panel. */
  footer?: ReactNode;

  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;

  /** Extra classes for the panel. */
  className?: string;
  /** Extra classes for the scrolling body, e.g. to lay its content out as a grid. */
  bodyClassName?: string;
  /** Extra classes for the footer row. */
  footerClassName?: string;
  /** Accessible name when there is no visible title. */
  ariaLabel?: string;
}

/** How a confirmation reads: which colour the confirm button and icon take. */
export type ConfirmTone = "danger" | "warning" | "info" | "success" | "primary";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** May return a promise; the modal shows its loading state until it settles. */
  onConfirm: () => void | Promise<void>;

  title?: ReactNode;
  description?: ReactNode;
  /** Replaces `description` when the question needs more than a sentence. */
  children?: ReactNode;

  confirmLabel?: string;
  /** Shown on the confirm button while the action runs. */
  loadingLabel?: string;
  cancelLabel?: string;

  tone?: ConfirmTone;
  icon?: ReactNode;
  /** Hides the icon bubble entirely. */
  hideIcon?: boolean;

  /** Drive the loading state from the caller instead of from `onConfirm`. */
  isLoading?: boolean;
  /** Blocks the confirm button, e.g. until a required box is ticked. */
  confirmDisabled?: boolean;

  size?: ModalSize;
}

export interface DeleteModalProps
  extends Omit<ConfirmModalProps, "tone" | "confirmLabel" | "loadingLabel"> {
  /** Named in the default title and description, e.g. "Deed of Variation". */
  itemName?: string;
  confirmLabel?: string;
  loadingLabel?: string;
  /** Alias of `isLoading`, kept because "deleting" reads better at the call site. */
  isDeleting?: boolean;
}

export type AlertTone = "info" | "warning" | "success" | "error";

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;

  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;

  tone?: AlertTone;
  icon?: ReactNode;
  hideIcon?: boolean;

  /** Label of the single dismiss button. */
  closeLabel?: string;
  /** Optional second button, e.g. "Go to My Questionnaire". */
  action?: {
    label: string;
    onClick: () => void;
    /** Renders the action as the quiet button and the dismiss as the loud one. */
    secondary?: boolean;
  };

  size?: ModalSize;
}

/**
 * Every modal in the application, importable from `@/components/modals`.
 *
 * `Modal` is the one base layout -- the overlay, panel, header, close button,
 * body and footer all live there. The specialised modals below supply content
 * and buttons only; none of them draws an overlay of its own, so a change to
 * how modals look or behave is a change to a single file.
 */

// Base + the general-purpose dialogs.
export { Modal } from "./Modal";
export { ConfirmModal } from "./ConfirmModal";
export { DeleteModal } from "./DeleteModal";
export { AlertModal } from "./AlertModal";

// Feature modals, each built on the base.
export { CaseManagerAccountModal } from "./CaseManagerAccountModal";
export { HelpMeChooseModal } from "./HelpMeChooseModal";
export { ReportDetailModal } from "./ReportDetailModal";
export { ScorecardModal } from "./ScorecardModal";

export type {
  AlertModalProps,
  AlertTone,
  ConfirmModalProps,
  ConfirmTone,
  DeleteModalProps,
  ModalHeaderVariant,
  ModalProps,
  ModalSize,
} from "@/types/ui/modal";

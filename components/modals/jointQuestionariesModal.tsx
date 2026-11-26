/**
 * @deprecated Import `DeleteModal` from `@/components/modals` instead.
 *
 * This file held an earlier delete confirmation. The real one now lives in
 * `DeleteModal.tsx` -- built on the base `Modal`, with loading state, dynamic
 * title/description and a confirm callback -- so this is only a re-export to
 * keep the old path working. Nothing imports it; it can be deleted.
 */
export { DeleteModal } from "./DeleteModal";

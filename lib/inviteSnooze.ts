// "Not now" on a partner invitation. For the rest of this browser session the
// dashboard stops steering the user to the invitation, so declining it lets
// them carry on with their own matter instead of bouncing back.
const KEY = "prenup_invite_snoozed";

export function snoozePendingInvite() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // Storage can be unavailable (private mode); the user is just asked again.
  }
}

export function isPendingInviteSnoozed(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

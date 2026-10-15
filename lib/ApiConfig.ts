import axios from "axios";

const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api").trim();

const clientConfig = {
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 20000,
};

const Axios = axios.create(clientConfig);

const plain = axios.create(clientConfig);

const PUBLIC_AUTH_PATHS = [
  "auth/login",
  "auth/register",
  "auth/verify-otp",
  "auth/resend-otp",
  "auth/request-reset",
  "auth/validate-reset-token",
  "auth/reset-password",
  "auth/invite-info",
  "auth/accept-invite",
  "auth/logout",
];

const PUBLIC_PAGES = [
  "/login",
  "/register",
  "/register-partner",
  "/email-verification",
  "/forgot-password",
  "/reset-password",
];

const SESSION_CHECK_PATH = "auth/me";

const requestPath = (url = "") => url.replace(/^\/+/, "").split("?")[0];

const onPublicPage = () =>
  PUBLIC_PAGES.some((page) => window.location.pathname.startsWith(page));

function loginUrl() {
  const here = window.location.pathname + window.location.search;
  const params = new URLSearchParams({ sessionExpired: "1" });
  if (here && here !== "/" && !here.startsWith("/login")) {
    params.set("callbackUrl", here);
  }
  return `/login?${params.toString()}`;
}

let signingOut = false;

export async function forceSignOut() {
  if (typeof window === "undefined" || signingOut) return;
  signingOut = true;

  const target = loginUrl();

  try {
    await plain.post("auth/logout");
  } catch {
    // The middleware drops the cookie on the way in instead.
  }

  try {
    const { persistor } = await import("@/store/store");
    // Paused first: a thunk rejected by the same 401 would otherwise write
    // its error straight back over the cleared state.
    persistor.pause();
    await persistor.purge();
  } catch {
    // Nothing kept is worth failing the sign-out over.
  }

  window.location.replace(target);
}

let sessionCheck: Promise<boolean> | null = null;

function sessionIsGone() {
  if (!sessionCheck) {
    sessionCheck = plain
      .get(SESSION_CHECK_PATH)
      .then(() => false)
      .catch((error) => error?.response?.status === 401)
      .finally(() => {
        sessionCheck = null;
      });
  }
  return sessionCheck;
}

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const path = requestPath(error?.config?.url);

    if (
      status === 401 &&
      typeof window !== "undefined" &&
      !PUBLIC_AUTH_PATHS.includes(path) &&
      !onPublicPage()
    ) {
      const gone =
        path === SESSION_CHECK_PATH || (await sessionIsGone());

      if (gone) await forceSignOut();
    }

    return Promise.reject(error);
  },
);

export default Axios;

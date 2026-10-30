import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const DEFAULT_LOGIN_REDIRECT = "/login";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/register-partner",
  "/email-verification",
  "/forgot-password",
  "/reset-password",
];

const PUBLIC_ROUTES = [...AUTH_ROUTES];

const ALWAYS_ACCESSIBLE_ROUTES = ["/reset-password"];

const ROLE_HOME: Record<string, string> = {
  admin: "/admin",
  case_manager: "/cm",
  lawyer: "/lawyer",
  end_user: "/dashboard",
};

const ROLE_EXTRA_PATHS: Record<string, string[]> = {
  // Signed-in invitees accept a partner invitation here.
  end_user: ["/accept-invite"],
};

async function getRoleFromToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  if (nextUrl.pathname === "/backend" || nextUrl.pathname.startsWith("/backend/")) {
    return NextResponse.next();
  }

  if (
    nextUrl.pathname === DEFAULT_LOGIN_REDIRECT &&
    nextUrl.searchParams.has("sessionExpired")
  ) {
    const response = NextResponse.next();
    response.cookies.set("access_token", "", { path: "/", maxAge: 0 });
    return response;
  }

  const token = req.cookies.get("access_token")?.value;
  const role = await getRoleFromToken(token);

  const isLoggedIn = role !== null;
  const isAlwaysAccessible = ALWAYS_ACCESSIBLE_ROUTES.includes(
    nextUrl.pathname,
  );
  const isAuthRoute =
    AUTH_ROUTES.includes(nextUrl.pathname) && !isAlwaysAccessible;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL(DEFAULT_LOGIN_REDIRECT, nextUrl);
    // Keep the query: an invitation link carries its case and token there.
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // A signed-in client who opens an emailed invitation link (which points at
  // the registration page) already has an account: take them to accept it
  // instead of bouncing them to the dashboard and losing the invitation.
  if (
    isLoggedIn &&
    role === "end_user" &&
    nextUrl.pathname === "/register-partner" &&
    nextUrl.searchParams.get("caseId") &&
    nextUrl.searchParams.get("token")
  ) {
    const accept = new URL("/accept-invite", nextUrl);
    accept.searchParams.set("caseId", nextUrl.searchParams.get("caseId")!);
    accept.searchParams.set("token", nextUrl.searchParams.get("token")!);
    return NextResponse.redirect(accept);
  }

  const homePath = role ? ROLE_HOME[role] : null;

  if (isLoggedIn && homePath && (isAuthRoute || nextUrl.pathname === "/")) {
    return NextResponse.redirect(new URL(homePath, nextUrl));
  }

  const extraPaths = role ? (ROLE_EXTRA_PATHS[role] ?? []) : [];
  const isExtraPath =
    isAlwaysAccessible ||
    extraPaths.some((p) => nextUrl.pathname.startsWith(p));

  if (
    isLoggedIn &&
    homePath &&
    !isExtraPath &&
    !nextUrl.pathname.startsWith(homePath)
  ) {
    return NextResponse.redirect(new URL(homePath, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|backend(?:/|$)|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|jpg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
  ],
};
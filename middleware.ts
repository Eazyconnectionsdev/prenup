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

const ROLE_HOME: Record<string, string> = {
  admin: "/admin",
  case_manager: "/cm",
  lawyer: "/lawyer",
  end_user: "/dashboard",
};

async function getRoleFromToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return typeof payload.role === "string" ? payload.role : null;
  } catch(error : any) {
    console.log("getRoleFromToken error", error)
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = req.cookies.get("access_token")?.value;

  const role = await getRoleFromToken(token);

  const isLoggedIn = role !== null;
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL(DEFAULT_LOGIN_REDIRECT, nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && !role) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  const homePath = role ? ROLE_HOME[role] : null;

  if (isLoggedIn && homePath && (isAuthRoute || nextUrl.pathname === "/")) {
    return NextResponse.redirect(new URL(homePath, nextUrl));
  }

  if (isLoggedIn && homePath && !nextUrl.pathname.startsWith(homePath)) {
    return NextResponse.redirect(new URL(homePath, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|jpg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
  ],
};
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

export const DEFAULT_LOGIN_REDIRECT = "/login";

const AUTHROUTES = [
  "/login",
  "/register",
  "/email-verification",
  "/forgot-password",
  "/reset-password",
];

// 👇 Central role → route mapping
const ROLE_REDIRECT_MAP: Record<string, string> = {
  admin: "/admin",
  case_manager: "/cm",
  end_user: "/",
};

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = req.cookies.get("access_token")?.value;

  const isLoggedIn = Boolean(token);
  const isAuthRoute = AUTHROUTES.includes(nextUrl.pathname);

  let role: string | null = null;

  if (token) {
    try {
      const payload = decodeJwt(token);
      console.log(payload)
      role = payload?.role as string;
    } catch {
      role = null;
    }
  }

  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(
      new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)
    );
  }

  if (isLoggedIn && isAuthRoute && role) {
    const redirectPath = ROLE_REDIRECT_MAP[role];

    if (redirectPath) {
      return NextResponse.redirect(
        new URL(redirectPath, nextUrl)
      );
    }
  }

  if (isLoggedIn && role) {
    const allowedBasePath = ROLE_REDIRECT_MAP[role];

    if (
      allowedBasePath &&
      !nextUrl.pathname.startsWith(allowedBasePath)
    ) {
      return NextResponse.redirect(
        new URL(allowedBasePath, nextUrl)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|jpg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
  ],
};

import { NextRequest } from "next/server";

export const DEFAULT_LOGIN_REDIRECT = "/login";
export const DEFAULT_PROTECTED_ROUTE = "/dashboard";
const AUTHROUTES = [
  "/login",
  "/register",
  "/email-verification",
  "/forgot-password",
  "/reset-password"
]

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = req.cookies.get("access_token")?.value;

  const isLoggedIn = !!token;
  const isAuthRoute =  AUTHROUTES.includes(nextUrl.pathname)


   if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_PROTECTED_ROUTE, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isAuthRoute) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }
  
  return;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|jpg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};

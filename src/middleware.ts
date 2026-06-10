import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Ensure every page route is under a locale prefix. Requests without a known locale are
 * redirected to the default locale, so the app always has a language in the URL for
 * search indexing and correct formatting. API routes and assets are excluded.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, and files with an extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

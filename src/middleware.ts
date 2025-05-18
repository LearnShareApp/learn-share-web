import { i18nRouter } from "next-i18n-router";
import { NextRequest } from "next/server";
import i18nConfig from "./lib/i18n/config";

export function middleware(request: NextRequest) {
  // Call i18nRouter to automatically handle locale-based routing
  return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
  // This matcher excludes:
  // - /api         → API routes
  // - /static      → static assets folder
  // - .*\\..*      → files with extensions (e.g., .png, .css)
  // - /_next       → internal Next.js paths (_next/static etc.)
  // The middleware will run on all other paths
};

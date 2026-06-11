// ============================================================
//  Route-protection middleware.
//  Uses the edge-safe authConfig (no DB/bcrypt) to read the
//  JWT session cookie and enforce the `authorized` callback.
// ============================================================
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Protect /dashboard (and its sub-paths). Static assets, API routes,
  // and Next internals are excluded.
  matcher: ["/dashboard/:path*"],
};

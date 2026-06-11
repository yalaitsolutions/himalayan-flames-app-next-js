// NextAuth.js catch-all route handler.
// Exposes /api/auth/* endpoints (signin, signout, session, csrf, callback…).
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

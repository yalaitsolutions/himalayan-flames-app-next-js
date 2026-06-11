"use client";
// Wraps the app in the NextAuth session context so client
// components can call useSession() / signIn() / signOut().
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

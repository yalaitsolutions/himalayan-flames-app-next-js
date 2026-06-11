// ============================================================
//  Full NextAuth (Auth.js v5) setup — Node runtime.
//  Adds the Credentials provider with bcrypt password checks
//  on top of the edge-safe authConfig.
// ============================================================
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import authConfig from "@/lib/auth.config";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").toLowerCase().trim();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        await connectToDatabase();
        // password has `select: false`, so request it explicitly.
        const user = await User.findOne({ email }).select("+password").lean();
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        // The object returned here becomes the `user` in the jwt callback.
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});

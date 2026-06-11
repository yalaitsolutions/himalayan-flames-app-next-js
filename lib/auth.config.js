// ============================================================
//  Edge-safe NextAuth config.
//  Contains NO database / bcrypt imports so it can run inside
//  the Edge middleware. The Credentials provider (which needs
//  Mongoose + bcrypt) is added in lib/auth.js for the Node
//  runtime only.
// ============================================================

/** @type {import("next-auth").NextAuthConfig} */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [], // real providers are attached in lib/auth.js
  callbacks: {
    // Persist the user id + role onto the JWT at sign-in.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Expose id + role to the client session object.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    // Route protection used by the middleware matcher below.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const { pathname } = nextUrl;

      // /dashboard is admin-only.
      if (pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) return false; // -> redirected to /login
        if (role !== "admin") {
          // Logged in but not an admin: send home.
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
};

export default authConfig;

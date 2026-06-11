/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Mongoose ships server-only code; keep it external to the server bundle so
  // it is required at runtime in the Node.js runtime instead of being bundled.
  serverExternalPackages: ["mongoose", "bcryptjs"],
};

export default nextConfig;

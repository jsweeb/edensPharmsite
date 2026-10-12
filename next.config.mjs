/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server in .next/standalone (with only the
  // node_modules it needs) so the host never has to run `npm install`.
  output: 'standalone',
};

export default nextConfig;

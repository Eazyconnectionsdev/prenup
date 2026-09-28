// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   devIndicators: false
// };

// export default nextConfig;



import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://api.letsprenup.co.uk/api";

const nextConfig: NextConfig = {
  devIndicators: false,

  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
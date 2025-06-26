import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apod.nasa.gov",
        port: "",
        pathname: "/apod/image/**",
      },
      {
        protocol: "https",
        hostname: "mars.nasa.gov",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "mars.nasa.gov",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mars.jpl.nasa.gov",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "mars.jpl.nasa.gov",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "photojournal.jpl.nasa.gov",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "photojournal.jpl.nasa.gov",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images-assets.nasa.gov",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "images-assets.nasa.gov",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "mars.nasa.gov",
        port: "",
        pathname: "/mer/gallery/**",
      },
      {
        protocol: "https",
        hostname: "mars.nasa.gov",
        port: "",
        pathname: "/mer/gallery/**",
      }
    ]
  },
};

export default nextConfig;

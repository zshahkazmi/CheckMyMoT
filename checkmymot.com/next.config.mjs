import { defineConfig } from 'next';

export default defineConfig({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'], // Replace with your image domains
  },
  env: {
    API_URL: process.env.API_URL, // Example of using environment variables
  },
});
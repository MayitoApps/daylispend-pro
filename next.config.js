/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        // Disable ESLint during builds (version incompatibility fix)
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig

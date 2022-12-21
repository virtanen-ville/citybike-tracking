/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		appDir: true,
	},
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "https://localhost:3100/api/:path*", // Matched parameters can be used in the destination
			},
		];
	},
};

module.exports = nextConfig;

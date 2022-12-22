/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		appDir: true,
	},
	async rewrites() {
		return [
			{
				source: "/api/:slug*",
				destination: "http://localhost:3100/api/:slug*", // Matched parameters can be used in the destination
			},
		];
	},
};

module.exports = nextConfig;

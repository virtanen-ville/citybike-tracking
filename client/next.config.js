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
				destination: process.env.SERVER_URL + "/api/:slug*",
				// Matched parameters can be used in the destination
			},
		];
	},
};

module.exports = nextConfig;

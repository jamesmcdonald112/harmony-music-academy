// @ts-check

import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sentry from "@sentry/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: vercel(),
	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [
		react(),
		sentry({
			sourceMapsUploadOptions: {
				org: "james-mcdonald",
				project: "javascript-astro-7j",
				authToken: process.env.SENTRY_AUTH_TOKEN,
			},
			telemetry: false,
		}),
	],
});

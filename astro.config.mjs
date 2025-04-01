import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	site: "https://humsub.org",
	prefetch: {
		defaultStrategy: "viewport",
	},
	integrations: [
		mdx(),
		icon({
			include: {
				logos: ["apple-app-store", "google-play"],
				lucide: [
					"award",
					"book-open",
					"calendar",
					"external-link",
					"handshake",
					"heart-handshake",
					"help-circle",
					"home",
					"image",
					"info",
					"mail",
					"menu",
					"phone",
					"trophy",
					"users",
				],
				mdi: [
					"calendar",
					"heart",
					"information",
					"lightning-bolt",
					"map-marker",
					"store",
				],
			},
		}),
		sitemap(),
	],

	adapter: cloudflare({
		imageService: "compile",
		platformProxy: {
			enabled: true,
		},
	}),

	vite: {
		plugins: [tailwindcss()],
	},
});

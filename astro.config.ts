import { defineConfig } from "astro/config"

import node from "@astrojs/node"

import svelte from "@astrojs/svelte"

import react from "@astrojs/react"

import UnoCSS from "unocss/astro"

import Icons from "unplugin-icons/vite"

import browserslist from "browserslist"

import { browserslistToTargets } from "lightningcss"

import { customCollections } from "#@/feature/primitive/icon-unocss.js"

export default defineConfig({
	output: "server",

	// TODO: change cloudflare
	adapter: node({
		mode: "standalone",
	}),

	integrations: [svelte(), react(), UnoCSS({ injectReset: true })],

	vite: {
		css: {
			transformer: "lightningcss",
			lightningcss: {
				targets: browserslistToTargets(browserslist(">= 0.25%")),
			},
		},
		build: {
			cssMinify: "lightningcss",
		},
		resolve: {
			alias: [
				{ find: "icon:svelte", replacement: "~icons" },
				{ find: "icon:astro", replacement: "~icons" },
				{ find: "icon:react", replacement: "~icons" },
			],
		},
		plugins: [
			Icons({
				compiler: "astro",
				customCollections,
				// TODO: link unocss -> extraProperties
				// https://github.com/unocss/unocss/issues/4084
				// defaultStyle
			}),
			Icons({
				compiler: "svelte",
				customCollections,
				// defaultStyle
			}),
			Icons({
				compiler: "jsx",
				jsx: "react",
				customCollections,
				// defaultStyle
			}),
		],
	},
})

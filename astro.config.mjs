// @ts-check
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

import svelte from "@astrojs/svelte";

import react from "@astrojs/react";

import UnoCSS from "unocss/astro";

import Icons from "unplugin-icons/vite";

import { customCollections } from "./icon";

export default defineConfig({
  output: "server",

  adapter: node({
    mode: "standalone",
  }),

  integrations: [svelte(), react(), UnoCSS({ injectReset: true })],

  vite: {
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
});

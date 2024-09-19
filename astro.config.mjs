// @ts-check
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

import svelte from "@astrojs/svelte";

import react from "@astrojs/react";

import UnoCSS from "unocss/astro";

import Icons from "unplugin-icons/vite";

import { FileSystemIconLoader } from "unplugin-icons/loaders";

const customCollections = {
  my: FileSystemIconLoader("./public/icon", (svg) =>
    svg.replace(/^<svg /, '<svg fill="currentColor" ')
  ),
};

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
      }),
      Icons({
        compiler: "svelte",
        customCollections,
      }),
      Icons({ compiler: "jsx", jsx: "react", customCollections }),
    ],
  },
});

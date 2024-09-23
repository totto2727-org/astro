import type { Options } from "./types";

import unplugin from ".";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default (options?: Options): any => ({
  name: "unplugin-mistcss",
  hooks: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    "astro:config:setup": async (astro: any) => {
      astro.config.vite.plugins ||= [];
      astro.config.vite.plugins.push(unplugin.vite(options));
    },
  },
});

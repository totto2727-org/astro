import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import type { Options } from "./types";

import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";

import { createFile, getExtension, parse } from "mistcss/core";

type Extension = ".tsx" | ".astro" | ".svelte";
type Target = "react" | "hono" | "astro" | "vue" | "svelte";

const defaultTargets: Target[] = ["react"];
function parseTargets(targets: Target[]): [Target, Extension][] {
  let parsedTargets: Target[];

  if (targets.length === 0) {
    parsedTargets = defaultTargets;
  } else {
    parsedTargets = targets;
  }

  return parsedTargets.map((target) => [target, getExtension(target)] as const);
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options
) => ({
  name: "unplugin-mistcss",
  enforce: "pre",
  async watchChange(id, { event }) {
    if (event === "create" || event === "update") {
      const targets: [Target, Extension][] = parseTargets(
        options?.targets ?? []
      );

      for (const [target, extension] of targets) {
        const data = parse(fs.readFileSync(id, "utf8"));
        createFile(data, id, target, extension);
      }
    } else {
      // TODO delete files
    }
  },
});

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;

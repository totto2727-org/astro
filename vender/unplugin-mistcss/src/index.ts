import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import type { Options } from "./types";

import fs from "node:fs";

import path from "node:path";
import { createFile, createFiles, getExtension, parse } from "mistcss/core";

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
) => {
  const targets: [Target, Extension][] = parseTargets(options?.targets ?? []);

  let isBuild = false;

  return {
    name: "unplugin-mistcss",
    enforce: "pre",
    async buildStart() {
      if (isBuild) return;

      const files = fs.promises.glob(path.join("**/*.mist.css"));

      const promises: Promise<unknown>[] = [];

      for await (const file of files) {
        const content = await fs.promises.readFile(file, "utf8");
        const data = parse(content);
        console.log(
          "mistcss:",
          "create",
          path.relative(process.cwd(), file),
          options?.targets ?? []
        );
        promises.push(createFiles(data, file, targets));
      }

      await Promise.all(promises);
      isBuild = true;
    },
    async watchChange(id, { event }) {
      if (!id.endsWith(".mist.css")) return;

      if (event === "create" || event === "update") {
        console.log(
          "mistcss:",
          "update",
          path.relative(process.cwd(), id),
          options?.targets ?? []
        );

        fs.promises
          .readFile(id, "utf8")
          .then((str) => {
            return parse(str);
          })
          .then((data) => {
            for (const [target, extension] of targets) {
              createFile(data, id, target, extension);
            }
          });
      } else {
        // TODO delete files
      }
    },
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;

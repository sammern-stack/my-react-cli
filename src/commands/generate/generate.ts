import path from "path";
import fs from "fs";
import { Command } from "commander";

import { DEFAULT_DIRS } from "./generate.constants.js";

import { error } from "../../utils/console.js";
import { registerPage } from "./utils/registerPage.js";
import { buildPreActionChecks, generate } from "./utils/general.js";
import { getComponentFiles } from "./utils/getComponentFiles.js";
import { getHookFiles } from "./utils/getHookFiles.js";

import type { Options, Type } from "./generate.types.js";

export const registerGenerateCommand = (program: Command) => {
  program
    .command("generate <type> <name>")
    .alias("g")
    .description("generate the given <type> content")
    .option("-d, --dir <dir>", "target folder for the <type> folder", (value) =>
      value.replace(/=/, ""),
    )
    .option(
      "-f, --feature <feature>",
      "generate the given <type> inside a feature",
      (value) => value.replace(/=/, ""),
    )
    .option(
      "-s, --style <style>",
      "use the specified stylesheet style",
      (value) => value.replace(/=/, ""),
    )
    .option("--ts", "Use typescript")
    .option("--force", "skip safety checks and overwrite")
    .action(async (type: Type, name: string, options: Options) => {
      const checks = buildPreActionChecks(type, name, options);
      for (const { condition, message } of checks) {
        if (condition) {
          error(message);
          process.exitCode = 1;
          return;
        }
      }

      const root = options.feature ? `src/features/${options.feature}` : `src`;
      const folder = `${options.dir ?? DEFAULT_DIRS[type]}/${name}`;
      const dir = path.join(process.cwd(), `${root}/${folder}`);

      if (fs.existsSync(dir) && !options.force) {
        error(`Directory '${dir}' already exists\nUse --force to overwrite it`);
        process.exitCode = 1;
        return;
      }

      if (type === "component") {
        const componentFiles = await getComponentFiles(dir, name, options);
        generate(dir, name, componentFiles);
      }

      if (type === "hook") {
        const hookFiles = await getHookFiles(dir, name, options);
        generate(dir, name, hookFiles);
      }

      if (type === "page") {
        const pageDir = path.join(
          process.cwd(),
          `src/${DEFAULT_DIRS.page}/${name}`,
        );
        const pageFiles = await getComponentFiles(pageDir, name, options);
        generate(pageDir, name, pageFiles);
        registerPage(name, `../pages/${name}`);
      }
    });
};

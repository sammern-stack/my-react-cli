import fs from "fs";
import { Command } from "commander";

import { error } from "../../utils/console.js";
import { registerPage } from "./utils/registerPage.js";
import { buildPreActionChecks, generate } from "./utils/general.js";
import { getComponentFiles } from "./utils/getComponentFiles.js";
import { getHookFiles } from "./utils/getHookFiles.js";

import type { Options, Type } from "./generate.types.js";
import { getDirPath } from "../../utils/general.js";

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

      const dir = getDirPath(type, name, options);

      if (fs.existsSync(dir) && !options.force) {
        error(`Directory '${dir}' already exists\nUse --force to overwrite it`);
        process.exitCode = 1;
        return;
      }

      switch (type) {
        case "component":
          const componentFiles = await getComponentFiles(dir, name, options);
          generate(dir, name, componentFiles);
          break;
        case "hook":
          const hookFiles = await getHookFiles(dir, name, options);
          generate(dir, name, hookFiles);
          break;
        case "page":
          const pageFiles = await getComponentFiles(dir, name, options);
          generate(dir, name, pageFiles);
          registerPage(name, `../pages/${name}`);
          break;
        default:
          error(`Invalid type: ${type}`);
          process.exitCode = 1;
          return;
      }
    });
};

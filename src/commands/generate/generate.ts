import { Command } from "commander";
import { error } from "../../utils/console.js";
import { buildPreActionChecks } from "./utils/general.js";
import { runGenerateComponent } from "./utils/runGenerateComponent.js";
import { runGenerateHook } from "./utils/runGenerateHook.js";
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
      const checks = buildPreActionChecks(type, options);
      for (const check of checks) {
        if (check.condition) {
          error(check.message);
          process.exitCode = 1;
          return;
        }
      }

      const rootDir = options.feature
        ? `src/features/${options.feature}/${options.dir ?? ""}`
        : `src/${options.dir ?? ""}`;

      if (type === "component") runGenerateComponent(rootDir, name, options);
      if (type === "hook") runGenerateHook(rootDir, name, options);
    });
};

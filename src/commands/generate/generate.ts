import { Argument, Command, Option } from "commander";

import { PATTERNS, STYLES, TYPES } from "./generate.constants.js";

import { isReactProject } from "../../utils/validators.js";
import {
  applyTemplate,
  projectStyleExt,
  projectUsesTs,
  runChecks,
} from "../../utils/general.js";
import { registerPage } from "./utils/registerPage.js";
import { writeGeneratedFiles } from "./utils/writeGeneratedFiles.js";
import { getComponentFiles } from "./utils/getComponentFiles.js";
import { getHookFiles } from "./utils/getHookFiles.js";
import { resolveDestination } from "./utils/resolveDestination.js";

import type { File, Options, Type } from "./types/generate.types.js";

export const registerGenerateCommand = (program: Command) => {
  program
    .command("generate")
    .addArgument(new Argument("<type>").choices(TYPES))
    .argument("<name>")
    .alias("g")
    .description("generate the given <type> content")
    .option("-d, --dir <dir>", "target folder for the <type> folder")
    .option(
      "-f, --feature <feature>",
      "generate the given <type> inside a feature",
    )
    .addOption(
      new Option(
        "-s, --style <style>",
        "use the specified stylesheet style",
      ).choices(STYLES),
    )
    .option("--ts", "Use typescript")
    .option("--force", "skip safety checks and overwrite")
    .action(async (type: Type, name: string, options: Options) => {
      runChecks([
        {
          condition: !isReactProject() && !options.force,
          message:
            "This is not a React project\ncreate one with 'ct new <name>' or use --force",
        },
        {
          condition: !PATTERNS[type].test(name),
          message: `"${name}" is not a valid ${type} name`,
        },
      ]);

      const dir = resolveDestination(type, name, options);
      const useTs = projectUsesTs(options.ts);
      const style = await projectStyleExt(options.style);

      let files: File[] = [];
      switch (type) {
        case "component":
        case "page":
          files = getComponentFiles(dir, name, useTs, style);
          break;
        case "hook":
          files = getHookFiles(dir, name, useTs);
          break;
        case "feature":
          applyTemplate(useTs ? "feature-ts" : "feature", dir);
          break;
      }
      writeGeneratedFiles(dir, name, files);

      if (type === "page") registerPage(name, `../pages/${name}`);
    });
};

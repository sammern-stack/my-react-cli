import { Argument, Command, Option } from "commander";

import { PATTERNS, STYLES, TYPES } from "./generate.constants.js";

import { isReactProject } from "../../utils/validators.js";
import { getDirPath, runChecks } from "../../utils/general.js";
import { registerPage } from "./utils/registerPage.js";
import { generate } from "./utils/general.js";
import { getComponentFiles } from "./utils/getComponentFiles.js";
import { getHookFiles } from "./utils/getHookFiles.js";

import type { Options, Type } from "./generate.types.js";

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

      const dir = getDirPath(type, name, options);

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
      }
    });
};

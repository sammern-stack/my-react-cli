import fs from "fs";
import { Argument, Command, Option } from "commander";

import { PATTERNS, STYLES, TYPES } from "./generate.constants.js";

import { isReactProject, isTypescriptUsed } from "../../utils/validators.js";
import { getTemplateUrl, runChecks } from "../../utils/general.js";
import { loadConfig } from "../../utils/loadConfig.js";
import { registerPage } from "./utils/registerPage.js";
import { generate, getDirPath } from "./utils/general.js";
import { getComponentFiles } from "./utils/getComponentFiles.js";
import { getHookFiles } from "./utils/getHookFiles.js";

import type { File, Options, Type } from "./generate.types.js";

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

      let files: File[] = [];
      switch (type) {
        case "component":
        case "page":
          files = await getComponentFiles(dir, name, options);
          break;
        case "hook":
          files = await getHookFiles(dir, name, options);
          break;
        case "feature":
          const config = loadConfig() ?? {};
          const useTs = options.ts ?? config.typescript ?? isTypescriptUsed();
          const variant = useTs ? "feature-ts" : "feature";
          fs.cpSync(getTemplateUrl(variant), dir, {
            recursive: true,
            force: true,
          });
          break;
      }
      generate(dir, name, files);

      if (type === "page") registerPage(name, `../pages/${name}`);
    });
};

import { Argument, Command, Option } from "commander";

import { STYLES, TYPES } from "./generate.constants.js";
import { generateHandler } from "./generateHandler.js";

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
    .action(generateHandler);
};

import type { Command } from "commander";
import { newHandler } from "./newHandler.js";

export const registerNewCommand = (program: Command) => {
  program
    .command("new <name>")
    .description("Create a new React project with Vite")
    .option(
      "-t, --template <template>",
      "apply a react Vite template. Use (custom-ts or custom-js) for a custom src layout",
    )
    .option("--force", "skip safety checks and overwrite")
    .action(newHandler);
};

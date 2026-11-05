import path from "path";
import fs from "fs";
import { error, info, warning } from "../../utils/console.js";
import {
  CUSTOM_TEMPLATES,
  TEMPLATES,
  VALID_REACT_NAME,
} from "./new.constants.js";
import { runCustomTemplate } from "./utils/runCustomTemplate.js";
import { runCreateVite } from "./utils/runCreateVite.js";
import { isCustomTemplate, isInvalidTemplate } from "./utils/general.js";
import type { Command } from "commander";
import type { Options } from "./new.types.js";

export const registerNewCommand = (program: Command) => {
  program
    .command("new <name>")
    .description("Create a new React project with Vite")
    .option(
      "-t, --template <template>",
      "apply a react Vite template. Use (custom-ts or custom-js) for a custom src layout",
    )
    .action((name: string, options: Options) => {
      if (!VALID_REACT_NAME.test(name)) {
        error(`Invalid name ${name}`);
        process.exitCode = 1;
        return;
      }

      if (isInvalidTemplate(options.template)) {
        const templates = [...TEMPLATES, ...CUSTOM_TEMPLATES].join(", ");
        error(`Invalid template ${options.template}`);
        info(`You can choose between: ${templates}`);
        process.exitCode = 1;
        return;
      }

      const target = path.join(process.cwd(), name);
      if (fs.existsSync(target)) {
        warning(`Folder ${name} already exists!`);
        process.exitCode = 1;
        return;
      }

      runCreateVite(name, target, options.template);

      fs.writeFileSync(path.join(target, "ct.config.json"), "{}");
      if (isCustomTemplate(options.template)) {
        runCustomTemplate(target, options);
      }
    });
};

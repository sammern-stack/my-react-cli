import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";
import { error, info, warning } from "../../utils/console.js";
import {
  CUSTOM_TEMPLATES,
  TEMPLATES,
  VALID_REACT_NAME,
} from "./new.constants.js";
import type { Command } from "commander";
import type { CustomTemplate, Options, Template } from "./new.types.js";

// Utility
const runCommand = (command: string, target?: string) =>
  spawnSync(command, {
    ...(target && { cwd: target }),
    stdio: "inherit",
    shell: true,
  });

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

      if (
        options.template &&
        !CUSTOM_TEMPLATES.includes(options.template as CustomTemplate) &&
        !TEMPLATES.includes(options.template as Template)
      ) {
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

      const createViteCommand = options.template
        ? TEMPLATES.includes(options.template as Template)
          ? `npm create vite@latest ${name} -- --template ${options.template} --no-interactive`
          : `npm create vite@latest ${name} -- --template ${options.template.endsWith("-ts") ? "react-ts" : "react"} --no-interactive`
        : `npm create vite@latest ${name}`;
      const result = runCommand(createViteCommand);

      const vitePassed = result.status === 0;

      if (!vitePassed && !fs.existsSync(target)) {
        error("Vite failed before creating the project.");
        process.exitCode = 1;
        return;
      }

      fs.writeFileSync(path.join(target, "ct.config.json"), "{}");

      if (!vitePassed) {
        warning(
          "Install failed (dependency conflict). Retrying with --legacy-peer-deps...",
        );

        const retry = runCommand("npm install --legacy-peer-deps", target);

        if (retry.status !== 0) {
          error("Install failed again. Finish it manually:");
          info(`cd ${name}\nnpm install --legacy-peer-deps`);
          process.exitCode = 1;
          return;
        }
      }

      if (
        options.template &&
        CUSTOM_TEMPLATES.includes(options.template as CustomTemplate)
      ) {
        const variant = options.template.endsWith("-ts") ? "react-ts" : "react";
        const overlay = new URL(
          `../../../templates/${variant}`,
          import.meta.url,
        );

        const ext = options.template.endsWith("-ts") ? "tsx" : "jsx";

        for (const file of [
          `src/App.${ext}`,
          "src/App.css",
          "src/index.css",
          ".oxlintrc.json",
        ]) {
          fs.rmSync(path.join(target, file), { force: true });
        }

        fs.cpSync(overlay, target, { recursive: true });
      }
    });
};

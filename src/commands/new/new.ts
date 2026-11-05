import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";
import { error, info, warning } from "../../utils/console.js";
import { VALID_REACT_NAME } from "./new.constants.js";
import type { Command } from "commander";
import type { Options } from "./new.types.js";
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
      "apply a Vite template (default is react-ts",
      "react-ts",
    )
    .action((name: string, options: Options) => {
      if (!VALID_REACT_NAME.test(name)) {
        error(`Invalid name ${name}`);
        process.exitCode = 1;
        return;
      }

      const target = path.join(process.cwd(), name);
      if (fs.existsSync(target)) {
        warning(`Folder ${name} already exists!`);
        process.exitCode = 1;
        return;
      }

      const result = runCommand(
        `npm create vite@latest ${name} -- --template ${options.template}`,
      );

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

      const mainTemplate = fs.readFileSync(
        new URL("../../../templates/main.tpl", import.meta.url),
        "utf-8",
      );
      const fileExt = options.template.endsWith("-ts") ? "tsx" : "jsx";
      fs.writeFileSync(
        path.join(target, "src", `main.${fileExt}`),
        mainTemplate.replace("App.tsx", `App.${fileExt}`),
      );

      info(`\nDone! Next steps:\n\ncd ${name}\nnpm run dev`);
    });
};

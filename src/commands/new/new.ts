import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";
import { DEFAULT_CONFIG } from "../../constants/ct.config.js";
import { error, info, warning } from "../../utils/console.js";
import { VALID_REACT_NAME } from "./new.constants.js";
import type { Command } from "commander";

export const registerNewCommand = (program: Command) => {
  program
    .command("new <name>")
    .description("Create a new React project with Vite")
    .action((name: string) => {
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

      const result = spawnSync(`npm create vite@latest ${name}`, {
        stdio: "inherit",
        shell: true,
      });

      const vitePassed = result.status === 0;

      if (!vitePassed && !fs.existsSync(target)) {
        error("Vite failed before creating the project.");
        process.exitCode = 1;
        return;
      }

      fs.writeFileSync(
        path.join(target, "ct.config.json"),
        JSON.stringify(DEFAULT_CONFIG, null, 2),
      );

      if (!vitePassed) {
        warning(
          "Install failed (dependency conflict). Retrying with --legacy-peer-deps...",
        );

        const retry = spawnSync("npm install --legacy-peer-deps", {
          cwd: target,
          stdio: "inherit",
          shell: true,
        });

        if (retry.status !== 0) {
          error("Install failed again. Finish it manually:");
          info(`cd ${name}\nnpm install --legacy-peer-deps`);
          process.exitCode = 1;
          return;
        }
      }

      info(`\nDone! Next steps:\n\ncd ${name}\nnpm run dev`);
    });
};

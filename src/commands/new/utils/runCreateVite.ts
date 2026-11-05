import fs from "fs";
import { warning, error, info } from "../../../utils/console.js";
import { TEMPLATES } from "../new.constants.js";
import type { Template } from "../new.types.js";
import { runCommand } from "./runCommand.js";

// Utility
const retryInstallDependencies = (name: string, target: string) => {
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
};

export const runCreateVite = (
  name: string,
  target: string,
  template?: string,
) => {
  const createViteCommand = template
    ? TEMPLATES.includes(template as Template)
      ? `npm create vite@latest ${name} -- --template ${template} --no-interactive`
      : `npm create vite@latest ${name} -- --template ${template.endsWith("-ts") ? "react-ts" : "react"} --no-interactive`
    : `npm create vite@latest ${name}`;

  const result = runCommand(createViteCommand);

  const vitePassed = result.status === 0;

  if (!vitePassed && !fs.existsSync(target)) {
    error("Vite failed before creating the project.");
    process.exitCode = 1;
    return;
  }

  if (!vitePassed) retryInstallDependencies(name, target);
};

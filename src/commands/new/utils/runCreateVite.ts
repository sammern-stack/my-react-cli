import fs from "fs";
import { warning, error, info } from "../../../utils/console.js";
import { runCommand } from "./runCommand.js";
import { isViteTemplate } from "./templateValidation.js";

const retryInstallDependencies = (name: string, target: string): boolean => {
  warning(
    "Install failed (dependency conflict). Retrying with --legacy-peer-deps...",
  );

  const retry = runCommand("npm install --legacy-peer-deps", target);

  if (retry.status !== 0) {
    error("Install failed again. Finish it manually:");
    info(`cd ${name}\nnpm install --legacy-peer-deps`);
    process.exitCode = 1;
    return false;
  }

  return true;
};

const getCreateViteCommand = (name: string, template?: string): string => {
  if (!template) return `npm create vite@latest ${name}`;

  const viteTemplate = isViteTemplate(template)
    ? template
    : template.endsWith("-ts")
      ? "react-ts"
      : "react";

  return `npm create vite@latest ${name} -- --template ${viteTemplate} --no-interactive`;
};

export const runCreateVite = (
  name: string,
  target: string,
  template?: string,
): boolean => {
  const result = runCommand(getCreateViteCommand(name, template));

  if (!fs.existsSync(target)) {
    error("Vite failed before creating the project.");
    process.exitCode = 1;
    return false;
  }

  if (result.status !== 0) return retryInstallDependencies(name, target);

  return true;
};

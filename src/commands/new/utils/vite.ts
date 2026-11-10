import { isViteTemplate } from "../validators/template.js";
import { executeCommand } from "@/utils/command.js";
import { fail, warning } from "@/utils/console.js";

export const buildViteCommand = (name: string, template?: string) => {
  const base = `npm create vite@latest ${name}`;

  if (!template) return base;

  const viteTemplate = isViteTemplate(template)
    ? template
    : template.endsWith("-ts")
      ? "react-ts"
      : "react";

  return `${base} -- --template ${viteTemplate} --no-interactive`;
};

export const retryInstallDependencies = (name: string, target: string) => {
  warning(
    "Install failed (dependency conflict)",
    ". Retrying with --legacy-peer-deps...",
  );

  const retry = executeCommand("npm install --legacy-peer-deps", target);
  if (retry.status !== 0) {
    fail(
      "Install failed again. Finish it manually:",
      `cd ${name}\nnpm install --legacy-peer-deps`,
    );
  }
};

import fs from "fs";
import prompts from "prompts";

import { error } from "./console.js";

import { loadConfig } from "./loadConfig.js";
import { isTypescriptUsed } from "./validators.js";

import type { Check } from "../commands/generate/types/generate.types.js";
import type { CustomTemplate } from "../commands/new/new.types.js";

type Template = "component" | "hook" | "stylesheet" | "main" | "page";

export const getTemplate = (template: Template) =>
  fs.readFileSync(
    new URL(`../../templates/${template}.tpl`, import.meta.url),
    "utf-8",
  );

export const getTemplateUrl = (template: CustomTemplate) =>
  new URL(`../../templates/${template}`, import.meta.url);

export const applyTemplate = (template: CustomTemplate, target: string) => {
  const templateUrl = new URL(`../../templates/${template}`, import.meta.url);
  fs.cpSync(templateUrl, target, { recursive: true, force: true });
};

export const exit = (message: string) => {
  error(message);
  process.exit(1);
};

export const runChecks = (checks: Check[]) => {
  for (const { condition, message } of checks) if (condition) exit(message);
};

/**
 * Checks if the project uses typescript or not
 * @param tsOption ts flag
 * @returns boolean
 */
export const projectUsesTs = (tsOption: boolean | undefined) => {
  const config = loadConfig() ?? {};
  return tsOption ?? config.typescript ?? isTypescriptUsed();
};

export const projectStyleExt = async (styleOption: string | undefined) => {
  const config = loadConfig() ?? {};

  const askForStyle = async (): Promise<string> => {
    const answer = await prompts({
      type: "select",
      name: "style",
      message: "What stylesheet to use?",
      choices: [
        { title: "CSS", value: "css" },
        { title: "SCSS", value: "scss" },
      ],
      initial: 1,
    });
    return answer.style ?? "css";
  };

  return styleOption ?? config.stylesheet ?? (await askForStyle());
};

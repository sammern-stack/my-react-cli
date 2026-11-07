import fs from "fs";

import { error } from "./console.js";

import type { Check } from "../commands/generate/generate.types.js";

type Template = "component" | "hook" | "stylesheet" | "main" | "page";

export const getTemplate = (template: Template) =>
  fs.readFileSync(
    new URL(`../../templates/${template}.tpl`, import.meta.url),
    "utf-8",
  );

export const exit = (message: string) => {
  error(message);
  process.exit(1);
};

export const runChecks = (checks: Check[]) => {
  for (const { condition, message } of checks) if (condition) exit(message);
};

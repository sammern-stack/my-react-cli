import path from "path";
import fs from "fs";

import { error } from "./console.js";

import { DEFAULT_DIRS } from "../commands/generate/generate.constants.js";

import type {
  Check,
  Options,
  Type,
} from "../commands/generate/generate.types.js";

type Template = "component" | "hook" | "stylesheet" | "main" | "page";

export const getTemplate = (template: Template) =>
  fs.readFileSync(
    new URL(`../../templates/${template}.tpl`, import.meta.url),
    "utf-8",
  );

export const getDirPath = (type: Type, name: string, options: Options) => {
  const srcDir = path.join(process.cwd(), "src");

  const rootDir = options.feature
    ? path.join(srcDir, `/features/${options.feature}`)
    : srcDir;

  const destination =
    type !== "page"
      ? `${options.dir ?? DEFAULT_DIRS[type]}/${name}`
      : `${DEFAULT_DIRS["page"]}/${name}`;

  const dir = path.join(rootDir, destination);

  if (fs.existsSync(dir) && !options.force)
    exit(`Directory '${dir}' already exists\nUse --force to overwrite it`);

  return path.join(rootDir, destination);
};

export const exit = (message: string) => {
  error(message);
  process.exit(1);
};

export const runChecks = (checks: Check[]) => {
  for (const { condition, message } of checks) if (condition) exit(message);
};

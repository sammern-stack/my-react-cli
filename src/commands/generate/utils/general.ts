import fs from "fs";
import chalk from "chalk";

import {
  STYLES,
  TYPES,
  VALID_COMPONENT_NAME,
  VALID_HOOK_NAME,
} from "../generate.constants.js";

import { isReactProject } from "../../../utils/validators.js";
import { info } from "../../../utils/console.js";

import type { Check, File, Options, Type } from "../generate.types.js";

export const generate = (dir: string, name: string, files: File[]) => {
  fs.mkdirSync(dir, { recursive: true });
  for (const { path, content } of files) fs.writeFileSync(path, content);
  info(`${name} created at ${chalk.gray(dir)}`);
};

export const buildPreActionChecks = (
  type: Type,
  name: string,
  options: Options,
): Check[] => [
  {
    condition: !isReactProject() && !options.force,
    message:
      "This is not a React project\ncreate one with 'ct new <name>' or use --force",
  },
  {
    condition:
      (type === "component" || type === "page") &&
      !VALID_COMPONENT_NAME.test(name),
    message: `Invalid component name: ${name}`,
  },
  {
    condition: type === "hook" && !VALID_HOOK_NAME.test(name),
    message: `Invalid hook name: ${name}`,
  },
];

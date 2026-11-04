import path from "path";
import fs from "fs";
import type { Check, Options, Type } from "../generate.types.js";
import { isReactProject } from "../../../utils/validators.js";
import { STYLES, TYPES } from "../generate.constants.js";

export const createDir = (pathToFolder: string) => {
  const folder = path.join(process.cwd(), pathToFolder);
  if (fs.existsSync(folder)) return;
  fs.mkdirSync(folder, { recursive: true });
  return folder;
};

export const buildPreActionChecks = (type: Type, options: Options): Check[] => [
  {
    condition: !isReactProject() && !options.force,
    message:
      "This is not a React project\ncreate one with 'ct new <name>' or use --force",
  },
  { condition: !TYPES.includes(type), message: `Invalid type: ${type}` },
  {
    condition: options.style && !STYLES.includes(options.style),
    message: `Invalid style: ${options.style}`,
  },
];

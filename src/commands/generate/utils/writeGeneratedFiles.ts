import fs from "fs";
import chalk from "chalk";

import { info } from "../../../utils/console.js";

import type { File } from "../types/generate.types.js";

export const writeGeneratedFiles = (
  dir: string,
  name: string,
  files: File[],
) => {
  fs.mkdirSync(dir, { recursive: true });
  for (const { path, content } of files) fs.writeFileSync(path, content);
  info(`${name} created at ${chalk.gray(dir)}`);
};

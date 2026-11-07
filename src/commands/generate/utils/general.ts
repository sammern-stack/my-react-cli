import fs from "fs";
import path from "path";
import chalk from "chalk";

import { info } from "../../../utils/console.js";

import { DEFAULT_DIRS } from "../generate.constants.js";
import { exit } from "../../../utils/general.js";

import type { File, Options, Type } from "../generate.types.js";

export const generate = (dir: string, name: string, files: File[]) => {
  fs.mkdirSync(dir, { recursive: true });
  for (const { path, content } of files) fs.writeFileSync(path, content);
  info(`${name} created at ${chalk.gray(dir)}`);
};

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

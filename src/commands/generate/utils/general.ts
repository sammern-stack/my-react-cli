import fs from "fs";
import path from "path";
import chalk from "chalk";

import { info } from "../../../utils/console.js";

import { DEFAULT_DIRS } from "../generate.constants.js";
import { exit } from "../../../utils/general.js";

import type { DefaultDirs, File, Options, Type } from "../generate.types.js";

export const generate = (dir: string, name: string, files: File[]) => {
  fs.mkdirSync(dir, { recursive: true });
  for (const { path, content } of files) fs.writeFileSync(path, content);
  info(`${name} created at ${chalk.gray(dir)}`);
};

export const getDirPath = (type: Type, name: string, options: Options) => {
  const srcDir = path.join(process.cwd(), "src");
  const featureDir =
    options.feature !== undefined
      ? path.join(srcDir, "features", options.feature)
      : undefined;

  if (
    featureDir !== undefined &&
    (!options.feature ||
      !fs.statSync(featureDir, { throwIfNoEntry: false })?.isDirectory())
  ) {
    exit(
      `Feature '${options.feature}' does not exist\nCreate it first with 'ct generate feature <Name>'`,
    );
  }

  if (type === "feature") return path.join(srcDir, `features/${name}`);

  const rootDir = featureDir ?? srcDir;

  const destination =
    type !== "page"
      ? `${options.dir ?? DEFAULT_DIRS[type as DefaultDirs]}/${name}`
      : `${DEFAULT_DIRS["page"]}/${name}`;

  const dir = path.join(rootDir, destination);

  if (fs.existsSync(dir) && !options.force)
    exit(`Directory '${dir}' already exists\nUse --force to overwrite it`);

  return path.join(rootDir, destination);
};

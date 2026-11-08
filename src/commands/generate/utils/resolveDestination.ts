import path from "path";
import fs from "fs";

import { DEFAULT_DIRS } from "../generate.constants.js";

import { exit } from "../../../utils/general.js";

import type { Type, Options, DefaultDirs } from "../types/generate.types.js";

export const resolveDestination = (
  type: Type,
  name: string,
  options: Options,
) => {
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

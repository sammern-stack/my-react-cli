import path from "path";
import fs from "fs";

import { DEFAULT_DIRS } from "../generate.constants.js";

import type { Type, Options, DefaultDirs } from "../types/generate.types.js";
import { error, info } from "../../../utils/console.js";

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
    error(`Feature '${options.feature}' does not exist`);
    info("Create it first with 'ct generate feature <Name>'");
    process.exit(1);
  }

  if (type === "feature") return path.join(srcDir, `features/${name}`);

  const rootDir = featureDir ?? srcDir;

  const destination =
    type !== "page"
      ? `${options.dir ?? DEFAULT_DIRS[type as DefaultDirs]}/${name}`
      : `${DEFAULT_DIRS["page"]}/${name}`;

  const dir = path.join(rootDir, destination);

  if (fs.existsSync(dir) && !options.force) {
    error(`Directory '${dir}' already exists`);
    info("Use --force to overwrite it");
    process.exit(1);
  }

  return path.join(rootDir, destination);
};

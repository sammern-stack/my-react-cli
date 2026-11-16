import path from "path";

import { DEFAULT_DIRS } from "../generate.constants.js";

import type {
  DefaultDirs,
  GenerateOptions,
  Type,
} from "../types/generate.types.js";

export const buildTargetPath = (
  type: Type,
  name: string,
  options: GenerateOptions,
) => {
  let target: string;
  const srcDir = path.join(process.cwd(), "src");

  if (type === "feature") target = path.join(srcDir, "features", name);
  if (type === "page") target = path.join(srcDir, "pages", name);

  const rootDir =
    options.feature !== undefined
      ? path.join(srcDir, "features", options.feature)
      : srcDir;

  const subDir = options.dir ?? DEFAULT_DIRS[type as DefaultDirs];

  target = path.join(rootDir, subDir, name);

  return { target, rootDir, subDir };
};

import path from "path";
import fs from "fs";
import type { Options, Type } from "../commands/generate/generate.types.js";
import { DEFAULT_DIRS } from "../commands/generate/generate.constants.js";
import { getComponentFiles } from "../commands/generate/utils/getComponentFiles.js";
import { getHookFiles } from "../commands/generate/utils/getHookFiles.js";

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

  return path.join(rootDir, destination);
};

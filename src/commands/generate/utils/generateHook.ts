import path from "path";
import fs from "fs";
import { loadConfig } from "../../../utils/loadConfig.js";
import { isTypescriptUsed } from "../../../utils/validators.js";
import type { Options } from "../generate.types.js";
import { getTemplate } from "../../../utils/general.js";

export const generateHook = async (
  folder: string,
  name: string,
  options: Options,
) => {
  const config = loadConfig() ?? {};
  const useTs = options.ts ?? config.typescript ?? isTypescriptUsed();
  const langExt = useTs ? "ts" : "js";

  return {
    path: path.join(folder, `${name}.${langExt}`),
    content: getTemplate("hook").replace(/__NAME__/g, name),
  };
};

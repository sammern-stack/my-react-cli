import path from "path";
import { isTypescriptUsed } from "../validators.js";
import buildHookTemplate from "../../templates/hook.js";
import type { Options } from "../../commands/generate.js";
import { loadConfig } from "../loadConfig.js";

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
    content: buildHookTemplate(name),
  };
};

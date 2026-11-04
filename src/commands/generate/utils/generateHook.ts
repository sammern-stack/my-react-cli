import path from "path";
import { loadConfig } from "../../../utils/loadConfig.js";
import { isTypescriptUsed } from "../../../utils/validators.js";
import buildHookTemplate from "../../../templates/hook.js";
import type { Options } from "../generate.types.js";

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

import path from "path";
import { isTypescriptUsed } from "../validators.js";
import buildHookTemplate from "../../templates/hook.js";
import type { Options } from "../../commands/generate.js";

export const generateHook = async (
  folder: string,
  name: string,
  options: Options,
) => {
  const useTs = options.ts ?? isTypescriptUsed();
  const langExt = useTs ? "ts" : "js";

  return {
    path: path.join(folder, `${name}.${langExt}`),
    content: buildHookTemplate(name),
  };
};

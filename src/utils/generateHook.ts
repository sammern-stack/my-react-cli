import path from "path";
import type { GeneratorOptions } from "../types/generator.js";
import buildHookTemplate from "../templates/hook.js";
import { isTypescriptUsed } from "./validators.js";

export const generateHook = async (
  folder: string,
  name: string,
  options: GeneratorOptions,
) => {
  const useTs = options.ts ?? isTypescriptUsed();
  const languageExt = useTs ? "ts" : "js";

  return {
    pathToFile: path.join(folder, `${name}.${languageExt}`),
    content: buildHookTemplate(name),
  };
};

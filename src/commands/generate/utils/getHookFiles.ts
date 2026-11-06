import path from "path";

import { loadConfig } from "../../../utils/loadConfig.js";
import { isTypescriptUsed } from "../../../utils/validators.js";
import { getTemplate } from "../../../utils/general.js";

import type { File, Options } from "../generate.types.js";

export const getHookFiles = async (
  folder: string,
  name: string,
  options: Options,
): Promise<File[]> => {
  const config = loadConfig() ?? {};
  const useTs = options.ts ?? config.typescript ?? isTypescriptUsed();
  const langExt = useTs ? "ts" : "js";

  return [
    {
      path: path.join(folder, `${name}.${langExt}`),
      content: getTemplate("hook").replace(/__NAME__/g, name),
    },
  ];
};

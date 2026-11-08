import path from "path";

import { getTemplate } from "../../../utils/templates.js";

import type { File } from "../types/generate.types.js";

export const getHookFiles = (
  folder: string,
  name: string,
  useTs: boolean,
): File[] => {
  const langExt = useTs ? "ts" : "js";

  return [
    {
      path: path.join(folder, `${name}.${langExt}`),
      content: getTemplate("hook").replace(/__NAME__/g, name),
    },
  ];
};

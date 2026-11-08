import path from "path";

import { getTemplate } from "../../../utils/general.js";

import type { File } from "../generate.types.js";

export const getHookFiles = async (
  folder: string,
  name: string,
  useTs: boolean,
): Promise<File[]> => {
  const langExt = useTs ? "ts" : "js";

  return [
    {
      path: path.join(folder, `${name}.${langExt}`),
      content: getTemplate("hook").replace(/__NAME__/g, name),
    },
  ];
};

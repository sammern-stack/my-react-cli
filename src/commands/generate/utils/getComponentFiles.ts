import path from "path";

import { getTemplate } from "../../../utils/general.js";

import type { File } from "../generate.types.js";

export const getComponentFiles = async (
  folder: string,
  name: string,
  useTs: boolean,
  style: string,
): Promise<File[]> => {
  const langExt = useTs ? "ts" : "js";
  const isPage = folder.includes("page");

  return [
    {
      path: path.join(folder, `${name}.${langExt}x`),
      content: getTemplate(isPage ? "page" : "component")
        .replace(/__NAME__/g, name)
        .replace(/__CLASSNAME__/, name.toLowerCase())
        .replace(/.scss/g, `.${style}`),
    },
    {
      path: path.join(folder, `${name}.module.${style}`),
      content: getTemplate("stylesheet").replace(
        /__CLASSNAME__/,
        name.toLowerCase(),
      ),
    },
    {
      path: path.join(folder, `use${name}.${langExt}`),
      content: getTemplate("hook").replace(/__NAME__/g, name),
    },
    {
      path: path.join(folder, `${name}.test.${langExt}`),
      content: "",
    },
  ];
};

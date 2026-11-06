import path from "path";
import prompts from "prompts";

import { loadConfig } from "../../../utils/loadConfig.js";
import { isTypescriptUsed } from "../../../utils/validators.js";
import { getTemplate } from "../../../utils/general.js";

import type { File, Options } from "../generate.types.js";

// Utilities
const askForStyle = async (): Promise<string> => {
  const answer = await prompts({
    type: "select",
    name: "style",
    message: "What stylesheet to use?",
    choices: [
      { title: "CSS", value: "css" },
      { title: "SCSS", value: "scss" },
    ],
    initial: 1,
  });
  return answer.style ?? "css";
};

export const getComponentFiles = async (
  folder: string,
  name: string,
  options: Options,
): Promise<File[]> => {
  const config = loadConfig() ?? {};
  const stylesheetExt =
    options.style ?? config.stylesheet ?? (await askForStyle());
  const useTs = options.ts ?? config.typescript ?? isTypescriptUsed();
  const langExt = useTs ? "ts" : "js";
  const isPage = folder.includes("page");

  return [
    {
      path: path.join(folder, `${name}.${langExt}x`),
      content: (isPage ? getTemplate("page") : getTemplate("component"))
        .replace(/__NAME__/g, name)
        .replace(/__CLASSNAME__/, name.toLowerCase())
        .replace(/.scss/g, `.${stylesheetExt}`),
    },
    {
      path: path.join(folder, `${name}.module.${stylesheetExt}`),
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

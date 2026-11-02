import path from "path";
import prompts from "prompts";
import buildComponentTemplate from "../templates/component.js";
import buildStylesheetTemplate from "../templates/stylesheet.js";
import buildHookTemplate from "../templates/hook.js";
import { isTypescriptUsed } from "./validators.js";
import type { GeneratorOptions } from "../types/generator.js";

const DEFAULTS = { componentExt: "tsx", style: "scss" };

export const generateComponent = async (
  folder: string,
  name: string,
  options: GeneratorOptions,
) => {
  const stylesheetExt = options.yes
    ? { style: DEFAULTS.style }
    : await prompts({
        type: "select",
        name: "style",
        message: "What stylesheet to use",
        choices: [
          { title: "CSS", value: "css" },
          { title: "SCSS", value: "scss" },
        ],
        initial: 1,
      });

  const useTs = options.ts ?? isTypescriptUsed();
  const JsxExt = useTs ? "tsx" : "jsx";
  const languageExt = useTs ? "ts" : "js";

  return {
    JSX: {
      pathToFile: path.join(folder, `${name}.${JsxExt}`),
      content: buildComponentTemplate(name, stylesheetExt.style, languageExt),
    },
    stylesheet: {
      pathToFile: path.join(folder, `${name}.module.${stylesheetExt.style}`),
      content: buildStylesheetTemplate(name),
    },
    hook: {
      pathToFile: path.join(folder, `use${name}.${languageExt}`),
      content: buildHookTemplate(name),
    },
    test: {
      pathToFile: path.join(folder, `${name}.test.${languageExt}`),
      content: "",
    },
  };
};

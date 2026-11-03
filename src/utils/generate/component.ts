import path from "path";
import prompts from "prompts";
import buildComponentTemplate from "../../templates/component.js";
import buildStylesheetTemplate from "../../templates/stylesheet.js";
import buildHookTemplate from "../../templates/hook.js";
import { isTypescriptUsed } from "../validators.js";
import type { Options } from "../../commands/generate.js";

type ComponentFile = "JSX" | "stylesheet" | "hook" | "test";

export type Component = {
  [K in ComponentFile]: { path: string; content: string };
};

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

export const generateComponent = async (
  folder: string,
  name: string,
  options: Options,
): Promise<Component> => {
  const stylesheetExt = options.style ?? (await askForStyle());
  const useTs = options.ts ?? isTypescriptUsed();
  const langExt = useTs ? "ts" : "js";

  return {
    JSX: {
      path: path.join(folder, `${name}.${langExt}x`),
      content: buildComponentTemplate(name, stylesheetExt, langExt),
    },
    stylesheet: {
      path: path.join(folder, `${name}.module.${stylesheetExt}`),
      content: buildStylesheetTemplate(name),
    },
    hook: {
      path: path.join(folder, `use${name}.${langExt}`),
      content: buildHookTemplate(name),
    },
    test: {
      path: path.join(folder, `${name}.test.${langExt}`),
      content: "",
    },
  };
};
